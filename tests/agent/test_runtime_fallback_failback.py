"""Regression for #141025: a fallback cooldown must not strand a recovered primary."""

import functools
import time
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

from agent.nous_rate_guard import nous_rate_limit_remaining, record_nous_rate_limit
from agent.turn_api_call import nous_rate_limit_guard
from agent.turn_api_error import handle_api_error
from agent.turn_retry_state import TurnRetryState
from run_agent import AIAgent


class RateLimitError(Exception):
    status_code = 429

    def __init__(self):
        super().__init__("Error code: 429 - rate limit exceeded; retry_after: 3600")
        self.response = SimpleNamespace(headers={
            "x-ratelimit-remaining-requests-1h": "0",
            "x-ratelimit-reset-requests-1h": "3600",
        })
        self.body = {"error": {"message": str(self)}}


@pytest.fixture
def runtime():
    with (
        patch("model_tools.get_tool_definitions", return_value=[]),
        patch("model_tools.check_toolset_requirements", return_value={}),
        patch("agent.process_bootstrap.OpenAI", return_value=MagicMock()),
        patch("hermes_cli.auth.get_provider_auth_state", return_value={"access_token": "test-token"}),
        patch("agent.model_metadata.get_model_context_length", return_value=200000),
        patch("agent.context_compressor.get_model_context_length", return_value=200000),
        patch("hermes_cli.model_normalize.normalize_model_for_provider", side_effect=lambda m, p: m),
        patch("agent.auxiliary_client.resolve_provider_client") as resolve,
    ):
        def make(provider="nous", activate=True):
            client = MagicMock()
            client.base_url = "https://inference-api.nousresearch.com/v1" if provider == "nous" else "https://fallback.example/v1"
            client.api_key = "fallback-key"
            client.default_headers = None
            client._custom_headers = None
            resolve.return_value = (client, "fallback-model")
            agent = AIAgent(
                api_key="primary-key", provider="custom", model="primary-model",
                base_url="http://localhost:8080/v1", quiet_mode=True,
                skip_context_files=True, skip_memory=True,
                fallback_model=[{"provider": provider, "model": "fallback-model"}],
            )
            agent._cached_system_prompt = "Model: primary-model\nProvider: custom"
            if activate:
                assert agent._try_activate_fallback() is True
            return agent
        yield make


def _handle(agent, retry, api_messages):
    return handle_api_error(
        agent, api_error=RateLimitError(), _retry=retry, thinking_spinner=None,
        messages=[{"role": "user", "content": "hello"}], api_messages=api_messages,
        api_kwargs={}, system_message=None, active_system_prompt=agent._cached_system_prompt,
        conversation_history=None, approx_tokens=10, retry_count=0, max_retries=3,
        compression_attempts=1, max_compression_attempts=3, api_call_count=1,
        api_request_id="test", api_start_time=time.time(), effective_task_id="test", turn_id="test",
    )


@pytest.mark.parametrize("provider", ["nous", "custom"])
def test_handler_restores_real_primary_and_rebuilds_request_before_cooldown(runtime, provider):
    agent = runtime(provider)
    retry = TurnRetryState(has_retried_429=True)
    api_messages = [{"role": "system", "content": agent._cached_system_prompt}]
    with patch("agent.turn_api_error.interruptible_backoff_sleep", side_effect=AssertionError("must not sleep")):
        verdict = _handle(agent, retry, api_messages)

    assert verdict.action == "break"
    assert verdict.retry_count == verdict.compression_attempts == 0
    assert retry.restart_with_rebuilt_messages is True
    assert retry.has_retried_429 is False
    assert (agent.provider, agent.model) == ("custom", "primary-model")
    assert agent._fallback_activated is False
    assert agent._fallback_index == 0
    assert verdict.active_system_prompt == "Model: primary-model\nProvider: custom"
    assert api_messages[0]["content"] == verdict.active_system_prompt
    if provider == "nous":
        assert nous_rate_limit_remaining() > 3500


@pytest.mark.parametrize("provider", ["nous", "custom"])
@pytest.mark.parametrize("blocked", ["cooldown", "unavailable"])
def test_handler_keeps_existing_retry_path_when_primary_cannot_restore(runtime, blocked, provider):
    agent = runtime(provider)
    if blocked == "cooldown":
        agent._rate_limited_until = time.monotonic() + 600
    retry = TurnRetryState()
    with (
        patch.object(agent, "_create_openai_client", side_effect=RuntimeError("primary unavailable")),
        patch("agent.turn_api_error.interruptible_backoff_sleep", return_value=None),
    ):
        verdict = _handle(agent, retry, [])

    assert verdict.action == ("continue" if provider == "nous" else "fallthrough")
    assert retry.restart_with_rebuilt_messages is False
    assert agent._fallback_activated is True
    if provider == "nous":
        assert nous_rate_limit_remaining() > 3500


@pytest.mark.parametrize("blocked", [False, True])
def test_shared_nous_cooldown_retries_primary_or_preserves_existing_failure(runtime, blocked):
    agent = runtime()
    if blocked:
        agent._rate_limited_until = time.monotonic() + 600
    record_nous_rate_limit(default_cooldown=3600)
    retry = TurnRetryState(has_retried_429=True)
    api_messages = [{"role": "system", "content": agent._cached_system_prompt}]
    verdict = nous_rate_limit_guard(
        agent, _retry=retry, api_messages=api_messages, messages=[], conversation_history=None,
        active_system_prompt=agent._cached_system_prompt, retry_count=2, compression_attempts=1,
        api_call_count=1,
    )

    assert verdict.action == ("return" if blocked else "break")
    assert retry.restart_with_rebuilt_messages is (not blocked)
    if not blocked:
        assert (agent.provider, agent.model) == ("custom", "primary-model")
        assert verdict.active_system_prompt == "Model: primary-model\nProvider: custom"
        assert api_messages[0]["content"] == verdict.active_system_prompt
        assert verdict.retry_count == verdict.compression_attempts == 0
        assert retry.has_retried_429 is False
    else:
        assert verdict.result["failed"] is True


@pytest.mark.parametrize("recovered", [True, False])
def test_conversation_failback_rebuilds_context_with_bounded_restarts(runtime, recovered):
    from agent.turn_preflight_gate import run_preflight_gate

    agent = runtime(activate=False)
    calls = []
    preflight_routes = []

    class ReadTimeout(Exception):
        pass

    def api_call(kwargs):
        calls.append((agent.provider, agent.model, kwargs["messages"][0]["content"]))
        if agent.provider == "custom" and (len(calls) <= 2 or not recovered):
            raise ReadTimeout("primary temporarily unavailable")
        if agent.provider == "nous":
            raise RateLimitError()
        message = SimpleNamespace(content="Primary recovered", tool_calls=None)
        return SimpleNamespace(choices=[SimpleNamespace(message=message, finish_reason="stop")], model=agent.model, usage=None)

    def preflight(current_agent, **kwargs):
        preflight_routes.append((current_agent.provider, current_agent.model))
        return run_preflight_gate(current_agent, **kwargs)

    # Preserve the phase signature: the dispatcher binds explicit keyword names.
    preflight = functools.wraps(run_preflight_gate)(preflight)
    with (
        patch.object(agent, "_interruptible_api_call", side_effect=api_call),
        patch.object(agent, "_persist_session"), patch.object(agent, "_save_trajectory"),
        patch.object(agent, "_cleanup_task_resources"),
        patch("agent.turn_recovery.interruptible_backoff_sleep", return_value=None),
        patch("agent.turn_api_error.interruptible_backoff_sleep", return_value=None),
        patch("agent.conversation_loop.run_preflight_gate", new=preflight),
    ):
        result = agent.run_conversation("hello")

    if not recovered:
        assert result["completed"] is False
        assert [(provider, model) for provider, model, _ in calls] == [
            ("custom", "primary-model"), ("custom", "primary-model"),
            ("nous", "fallback-model"),
            ("custom", "primary-model"), ("custom", "primary-model"),
        ]
        return
    assert result["completed"] is True
    assert result["final_response"] == "Primary recovered"
    assert [(provider, model) for provider, model, _ in calls] == [
        ("custom", "primary-model"), ("custom", "primary-model"),
        ("nous", "fallback-model"), ("custom", "primary-model"),
    ]
    assert preflight_routes == [("custom", "primary-model"), ("nous", "fallback-model"), ("custom", "primary-model")]
    assert "Model: primary-model" in calls[-1][2]
    assert "Model: fallback-model" not in calls[-1][2]
