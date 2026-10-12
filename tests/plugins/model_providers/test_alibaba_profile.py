"""DashScope provider profile reasoning-control contract."""

from __future__ import annotations

import pytest


@pytest.fixture
def alibaba_profile():
    """Resolve the registered DashScope profile through plugin discovery."""
    import model_tools
    import providers

    profile = providers.get_provider_profile("alibaba-cn")
    assert profile is not None, "alibaba-cn provider profile must be registered"
    return profile


class TestDashScopeReasoning:
    """DashScope needs matching thinking-toggle and effort fields."""

    @pytest.mark.parametrize("reasoning_config", [{"enabled": False}, {"enabled": True, "effort": "none"}])
    def test_disable_sends_both_dashscope_controls(self, alibaba_profile, reasoning_config):
        extra_body, top_level = alibaba_profile.build_api_kwargs_extras(
            reasoning_config=reasoning_config, model="qwen3.8-flash"
        )
        assert extra_body == {"preserve_thinking": True, "enable_thinking": False}
        assert top_level == {"reasoning_effort": "none"}

    @pytest.mark.parametrize(("requested", "expected"), [("low", "low"), ("medium", "medium"), ("xhigh", "high")])
    def test_enabled_effort_reaches_dashscope_with_supported_level(self, alibaba_profile, requested, expected):
        extra_body, top_level = alibaba_profile.build_api_kwargs_extras(
            reasoning_config={"enabled": True, "effort": requested}, model="qwen3.8-flash"
        )
        assert extra_body == {"preserve_thinking": True, "enable_thinking": True}
        assert top_level == {"reasoning_effort": expected}

    def test_missing_reasoning_config_leaves_server_default_unchanged(self, alibaba_profile):
        extra_body, top_level = alibaba_profile.build_api_kwargs_extras(
            reasoning_config=None, model="qwen3.8-flash"
        )
        assert extra_body == {"preserve_thinking": True}
        assert top_level == {}

    def test_controls_reach_chat_completions_request(self, alibaba_profile):
        from agent.transports.chat_completions import ChatCompletionsTransport

        kwargs = ChatCompletionsTransport().build_kwargs(
            model="qwen3.8-flash",
            messages=[{"role": "user", "content": "ping"}],
            tools=None,
            provider_profile=alibaba_profile,
            reasoning_config={"enabled": False},
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        )
        assert kwargs["extra_body"] == {"preserve_thinking": True, "enable_thinking": False}
        assert kwargs["reasoning_effort"] == "none"
