"""Configuration AuthError codes must not walk fallback_model / fallback_providers.

Resolve-time missing-credential errors (``missing_api_key``,
``no_provider_configured``, ``invalid_provider``) are operator misconfig, not
transient auth. Falling through to another paid provider silently spends the
wrong account. Rate-limit / uncoded / non-AuthError paths stay fail-open.
"""

from unittest.mock import patch

import pytest

from hermes_cli.auth import (
    AUTH_ERROR_CATEGORY_MISSING_CREDENTIAL,
    AuthError,
    CODEX_RATE_LIMITED_CODE,
)
from hermes_cli.cli_agent_setup_mixin import CLIAgentSetupMixin


FALLBACK_RUNTIME = {
    "provider": "gemini",
    "api_key": "fallback-key",
    "base_url": "https://generativelanguage.googleapis.com/v1beta",
}


def _fallback_resolve(**kwargs):
    """Succeed for any resolve so a leaked fallback walk is observable."""
    return dict(FALLBACK_RUNTIME, requested=kwargs.get("requested"))


@pytest.mark.parametrize(
    "error,expected",
    [
        (
            AuthError(
                "No Codex credentials",
                code="codex_auth_missing",
                category=AUTH_ERROR_CATEGORY_MISSING_CREDENTIAL,
            ),
            False,
        ),
        # Compatibility for producers not yet migrated to the semantic category.
        (AuthError("No usable credentials", code="missing_api_key"), False),
        (AuthError("No inference provider configured.", code="no_provider_configured"), False),
        (AuthError("Unknown provider 'nope'.", code="invalid_provider"), False),
        (AuthError("quota", code=CODEX_RATE_LIMITED_CODE), True),
        (AuthError("runtime 401", code="invalid_token", relogin_required=True), True),
        (AuthError("runtime 403", code="forbidden"), True),
        (AuthError("x"), True),
        (AuthError("x", code=None), True),
        (ValueError("nope"), True),
    ],
)
def test_should_try_fallback_on_auth_error_table(error, expected):
    from hermes_cli.auth import should_try_fallback_on_auth_error

    assert should_try_fallback_on_auth_error(error) is expected


class _FallbackCLI(CLIAgentSetupMixin):
    def __init__(self):
        self._fallback_model = [{"provider": "gemini", "model": "gemini-2.5-flash"}]
        self.requested_provider = "openai"
        self.model = "gpt-4"


def test_cli_missing_api_key_does_not_resolve_fallback():
    """CLI must not consult the fallback chain on missing_api_key."""
    cli = _FallbackCLI()
    requested = []

    def fake_resolve(**kwargs):
        requested.append(kwargs.get("requested"))
        return _fallback_resolve(**kwargs)

    with patch("hermes_cli.runtime_provider.resolve_runtime_provider", side_effect=fake_resolve), \
         patch("cli._cprint", lambda *a, **k: None):
        result = cli._resolve_fallback_runtime(
            AuthError("No usable credentials", code="missing_api_key")
        )

    assert result is None
    assert requested == []
    assert cli.requested_provider == "openai"
    assert cli.model == "gpt-4"


def test_cli_uncoded_auth_error_still_tries_fallback():
    """Fail-open CONTROL: AuthError without a code still walks fallback."""
    cli = _FallbackCLI()
    requested = []

    def fake_resolve(**kwargs):
        requested.append(kwargs.get("requested"))
        return _fallback_resolve(**kwargs)

    with patch("hermes_cli.runtime_provider.resolve_runtime_provider", side_effect=fake_resolve), \
         patch("cli._cprint", lambda *a, **k: None):
        result = cli._resolve_fallback_runtime(
            AuthError("Codex token refresh failed with status 401")
        )

    assert result is not None
    assert result["provider"] == "gemini"
    assert requested == ["gemini"]
    assert cli.requested_provider == "gemini"
    assert cli.model == "gemini-2.5-flash"


def test_tui_empty_codex_oauth_resolver_does_not_walk_fallback(monkeypatch):
    """The real empty-store Codex resolver emits semantic missing-credential and stops fallback."""
    from hermes_cli import auth_codex, runtime_provider
    from tui_gateway import server

    requested = []
    fallback_loads = []

    monkeypatch.setattr(runtime_provider, "_get_model_config", lambda: {"provider": "openai-codex"})
    monkeypatch.setattr(runtime_provider, "load_pool", lambda _provider: None)
    monkeypatch.setattr(auth_codex, "_load_auth_store_maybe_locked", lambda _lock=True: {})
    monkeypatch.setattr(auth_codex, "_pool_codex_access_token", lambda: "")
    monkeypatch.setattr(auth_codex, "_codex_pool_rate_limit_status", lambda: None)

    def fake_resolve_provider(requested_provider, **_kwargs):
        requested.append(requested_provider)
        if requested_provider == "openai-codex":
            return "openai-codex"
        pytest.fail(f"fallback resolver called for {requested_provider}")

    monkeypatch.setattr(runtime_provider, "resolve_provider", fake_resolve_provider)

    def fallback_model():
        fallback_loads.append(True)
        return [{"provider": "gemini", "model": "gemini-2.5-flash"}]

    monkeypatch.setattr(server, "_load_fallback_model", fallback_model)

    with pytest.raises(AuthError) as exc_info:
        server._resolve_runtime_with_fallback({"requested": "openai-codex"})

    assert exc_info.value.category == AUTH_ERROR_CATEGORY_MISSING_CREDENTIAL
    assert exc_info.value.code == "codex_auth_missing"
    assert requested == ["openai-codex"]
    assert fallback_loads == []


def test_codex_pool_cooldown_is_not_missing_credential(monkeypatch):
    """Existing but unavailable pool material must retain legal fallback semantics."""
    from hermes_cli import auth_codex
    from hermes_cli.auth import should_try_fallback_on_auth_error

    monkeypatch.setattr(auth_codex, "_load_auth_store_maybe_locked", lambda _lock=True: {})
    monkeypatch.setattr(auth_codex, "_pool_codex_access_token", lambda: "")
    monkeypatch.setattr(auth_codex, "_codex_pool_rate_limit_status", lambda: None)
    monkeypatch.setattr(auth_codex, "_read_codex_pool_entries", lambda: [{"access_token": "cooled-token"}])

    with pytest.raises(AuthError) as exc_info:
        auth_codex.resolve_codex_runtime_credentials()

    assert exc_info.value.category is None
    assert should_try_fallback_on_auth_error(exc_info.value) is True

    monkeypatch.setattr(auth_codex, "_read_codex_pool_entries", lambda: [{"label": "empty-shell"}])
    with pytest.raises(AuthError) as empty_exc:
        auth_codex.resolve_codex_runtime_credentials()

    assert empty_exc.value.category == AUTH_ERROR_CATEGORY_MISSING_CREDENTIAL
    assert should_try_fallback_on_auth_error(empty_exc.value) is False


def test_auto_codex_empty_store_keeps_internal_provider_ladder(monkeypatch):
    """Semantic missing credentials must not change the auto-provider ladder."""
    from hermes_cli import auth_codex, runtime_provider

    monkeypatch.setattr(runtime_provider, "_get_model_config", lambda: {})
    monkeypatch.setattr(runtime_provider, "_resolve_requested_shortcuts", lambda *_args: None)
    monkeypatch.setattr(runtime_provider, "_resolve_named_custom_runtime", lambda **_kwargs: None)
    monkeypatch.setattr(runtime_provider, "_local_endpoint_bypass", lambda *_args: None)
    monkeypatch.setattr(runtime_provider, "resolve_provider", lambda *_args, **_kwargs: "openai-codex")
    monkeypatch.setattr(runtime_provider, "load_pool", lambda _provider: None)
    monkeypatch.setattr(auth_codex, "_load_auth_store_maybe_locked", lambda _lock=True: {})
    monkeypatch.setattr(auth_codex, "_pool_codex_access_token", lambda: "")
    monkeypatch.setattr(auth_codex, "_codex_pool_rate_limit_status", lambda: None)
    monkeypatch.setattr(
        runtime_provider,
        "_openrouter_fallback",
        lambda *_args: {"provider": "openrouter", "api_key": "fallback-key"},
    )

    runtime = runtime_provider.resolve_runtime_provider(requested="auto")

    assert runtime["provider"] == "openrouter"


def test_tui_missing_api_key_reraises_without_walking_chain(monkeypatch):
    """TUI resolve-time missing_api_key must re-raise, not switch provider."""
    from tui_gateway import server

    requested = []

    def fake_resolve(**kwargs):
        requested.append(kwargs.get("requested"))
        if kwargs.get("requested") == "openai":
            raise AuthError("No usable credentials", code="missing_api_key")
        return _fallback_resolve(**kwargs)

    monkeypatch.setattr(
        "hermes_cli.runtime_provider.resolve_runtime_provider", fake_resolve
    )
    monkeypatch.setattr(
        server,
        "_load_fallback_model",
        lambda: [{"provider": "gemini", "model": "gemini-2.5-flash"}],
    )

    with pytest.raises(AuthError) as exc_info:
        server._resolve_runtime_with_fallback({"requested": "openai"})

    assert exc_info.value.code == "missing_api_key"
    assert requested == ["openai"]


def test_cron_missing_api_key_does_not_walk_fallback():
    """Cron must raise the formatted primary error, not swap to fallback."""
    from cron.scheduler import _CronJobConfig, _resolve_job_runtime

    jc = _CronJobConfig(
        cfg={"fallback_providers": [{"provider": "gemini", "model": "gemini-2.5-flash"}]},
        model="gpt-4",
        model_cfg={"provider": "openai"},
        cron_default_provider="",
    )
    requested = []

    def fake_resolve(**kwargs):
        requested.append(kwargs.get("requested"))
        if kwargs.get("requested") == "openai":
            raise AuthError("No usable credentials", code="missing_api_key")
        return _fallback_resolve(**kwargs)

    with patch("hermes_cli.runtime_provider.resolve_runtime_provider", side_effect=fake_resolve):
        with pytest.raises(RuntimeError) as exc_info:
            _resolve_job_runtime({"provider": "openai"}, "job-1", jc)

    assert isinstance(exc_info.value.__cause__, AuthError)
    assert exc_info.value.__cause__.code == "missing_api_key"
    assert requested == ["openai"]
