"""Provider aliases preserve the native-vs-compatible client boundary."""
from types import SimpleNamespace

from openai import OpenAI

from agent.agent_runtime_helpers import create_openai_client
from agent.gemini_native_adapter import GeminiNativeClient
from providers import get_provider_profile


def test_gemini_aliases_preserve_native_endpoint_selection():
    profile = get_provider_profile("gemini")
    for provider in (profile.name, *profile.aliases):
        for base_url, expected in (
            ("https://generativelanguage.googleapis.com/v1beta", GeminiNativeClient),
            ("https://example.invalid/v1", OpenAI),
        ):
            agent = SimpleNamespace(
                provider=provider, model="gemini-flash-latest",
                _client_log_context=lambda: "test",
                _build_keepalive_http_client=lambda *a, **k: None,
            )
            client = create_openai_client(
                agent, {"api_key": "test-key", "base_url": base_url},
                reason="fallback", shared=False,
            )
            try:
                assert isinstance(client, expected), (provider, base_url, type(client))
            finally:
                client.close()


def test_opencode_go_argon_uses_its_native_gemini_surface():
    """#139526: Go's Argon model is not served on its OpenAI-compatible path."""
    agent = SimpleNamespace(
        provider="opencode-go", model="gemini-4-argon-contributor",
        _client_log_context=lambda: "test",
        _build_keepalive_http_client=lambda *a, **k: None,
    )

    client = create_openai_client(
        agent,
        {"api_key": "test-key", "base_url": "https://opencode.ai/zen/go/v1"},
        reason="primary", shared=False,
    )
    try:
        assert isinstance(client, GeminiNativeClient)
        assert client.base_url == "https://opencode.ai/inference/go/v1"
    finally:
        client.close()
