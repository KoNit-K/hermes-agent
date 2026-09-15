"""Regression coverage for native API-key provider clients in auxiliary routing."""

from __future__ import annotations

import pytest

import providers as _providers
from providers.base import ProviderProfile

import agent.auxiliary_client as aux


class _NativeClient:
    HERMES_SKIP_TRANSPORT_WRAP = True
    HERMES_SKIP_ASYNC_WRAP = True


class _ApiKeyProfile(ProviderProfile):
    def __init__(self, result):
        super().__init__(
            name="aux-native-seam",
            auth_type="api_key",
            base_url="https://aux-native.invalid/v1",
        )
        self.result = result
        self.calls = []

    def create_client(self, **kwargs):
        self.calls.append(kwargs)
        if self.result is _RAISE:
            raise RuntimeError("broken plugin")
        return self.result


_RAISE = object()


@pytest.fixture
def registered(monkeypatch):
    """Register one API-key profile and make auxiliary credential lookup hermetic."""
    _providers._discover_providers()
    snapshot = (dict(_providers._REGISTRY), dict(_providers._ALIASES), _providers._PROVIDER_LIST_CACHE)
    yield _providers.register_provider
    _providers._REGISTRY.clear()
    _providers._REGISTRY.update(snapshot[0])
    _providers._ALIASES.clear()
    _providers._ALIASES.update(snapshot[1])
    _providers._PROVIDER_LIST_CACHE = snapshot[2]


def _configure_api_key_provider(monkeypatch, profile):
    import hermes_cli.auth as auth

    registry = dict(auth.PROVIDER_REGISTRY)
    registry[profile.name] = auth.ProviderConfig(
        id=profile.name,
        name=profile.name,
        auth_type="api_key",
        inference_base_url=profile.base_url,
        api_key_env_vars=("AUX_NATIVE_SEAM_KEY",),
    )
    monkeypatch.setattr(auth, "PROVIDER_REGISTRY", registry)
    monkeypatch.setattr(
        auth,
        "resolve_api_key_provider_credentials",
        lambda _provider: {"api_key": "native-sentinel", "base_url": profile.base_url},
    )


def test_api_key_profile_native_client_is_used_for_sync_and_async_auxiliary_routes(monkeypatch, registered):
    native = _NativeClient()
    profile = _ApiKeyProfile(native)
    registered(profile)
    _configure_api_key_provider(monkeypatch, profile)
    monkeypatch.setattr(aux, "_create_openai_client", lambda **_kwargs: pytest.fail("OpenAI fallback used"))

    client, model = aux.resolve_provider_client(profile.name, "native-model", task="title_generation")
    async_client, async_model = aux.resolve_provider_client(
        profile.name, "native-model", async_mode=True, task="title_generation"
    )

    assert (client, model) == (native, "native-model")
    assert (async_client, async_model) == (native, "native-model")
    assert profile.calls == [
        {"api_key": "native-sentinel", "base_url": profile.base_url, "model": "native-model"},
        {"api_key": "native-sentinel", "base_url": profile.base_url, "model": "native-model"},
    ]


@pytest.mark.parametrize("result", [None, _RAISE], ids=["none", "raises"])
def test_api_key_profile_client_hook_falls_back_to_openai(monkeypatch, registered, result):
    profile = _ApiKeyProfile(result)
    registered(profile)
    _configure_api_key_provider(monkeypatch, profile)
    fallback = object()
    monkeypatch.setattr(aux, "_create_openai_client", lambda **_kwargs: fallback)

    client, model = aux.resolve_provider_client(profile.name, "native-model")

    assert (client, model) == (fallback, "native-model")
    assert profile.calls == [
        {"api_key": "native-sentinel", "base_url": profile.base_url, "model": "native-model"}
    ]
