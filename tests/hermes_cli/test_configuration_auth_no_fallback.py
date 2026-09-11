"""Configuration AuthError codes must not walk fallback_model / fallback_providers.

Resolve-time missing-credential errors (``missing_api_key``,
``no_provider_configured``, ``invalid_provider``) are operator misconfig, not
transient auth. Falling through to another paid provider silently spends the
wrong account. Rate-limit / uncoded / non-AuthError paths stay fail-open.
"""

from unittest.mock import patch

import pytest

from hermes_cli.auth import AuthError, CODEX_RATE_LIMITED_CODE
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
        (AuthError("No usable credentials", code="missing_api_key"), False),
        (AuthError("No inference provider configured.", code="no_provider_configured"), False),
        (AuthError("Unknown provider 'nope'.", code="invalid_provider"), False),
        (AuthError("quota", code=CODEX_RATE_LIMITED_CODE), True),
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
