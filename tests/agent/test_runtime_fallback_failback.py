"""Runtime fallback should re-probe a recovered primary before a long 429 wait."""

from types import SimpleNamespace
from unittest.mock import patch

from agent.error_classifier import ClassifiedError, FailoverReason
from agent.turn_api_error import settle_unrecovered_error


class _FallbackAgent:
    log_prefix = ""
    _fallback_activated = True
    _provider_fallback_active = True

    def __init__(self, restores: bool):
        self.restores = restores
        self.restore_calls = 0

    def _restore_primary_runtime(self):
        self.restore_calls += 1
        return self.restores

    def __getattr__(self, _name):
        return lambda *args, **kwargs: None


def _settle(agent):
    retry = SimpleNamespace(
        image_shrink_retry_attempted=False,
        reasoning_mandatory_retry_attempted=False,
        copilot_stale_cred_retry_attempted=False,
        primary_recovery_attempted=False,
        restart_with_redirected_messages=False,
    )
    error = Exception("fallback rate limited")
    error.status_code = 429
    classified = ClassifiedError(reason=FailoverReason.rate_limit, retryable=True)
    return settle_unrecovered_error(
        agent,
        api_error=error,
        classified=classified,
        _retry=retry,
        status_code=429,
        error_msg=str(error),
        is_context_length_error=False,
        is_rate_limited=True,
        _is_zai_coding_overload=False,
        _provider="fallback",
        _base="https://fallback.example/v1",
        _model="fallback-model",
        messages=[],
        api_messages=[],
        api_kwargs={},
        active_system_prompt="",
        conversation_history=None,
        approx_tokens=1,
        retry_count=0,
        max_retries=3,
        compression_attempts=0,
        api_call_count=1,
    )


def test_fallback_rate_limit_retries_recovered_primary_before_backoff():
    agent = _FallbackAgent(restores=True)

    with (
        patch("agent.turn_api_error.free_tier_cooldown_ends_turn", return_value=False),
        patch("agent.turn_api_error.compute_error_backoff", side_effect=AssertionError("must not wait")),
        patch("agent.turn_api_error.interruptible_backoff_sleep", side_effect=AssertionError("must not sleep")),
    ):
        verdict = _settle(agent)

    assert verdict.action == "continue"
    assert verdict.retry_count == 0
    assert agent.restore_calls == 1


def test_fallback_rate_limit_keeps_backoff_when_primary_is_still_unavailable():
    agent = _FallbackAgent(restores=False)

    with (
        patch("agent.turn_api_error.free_tier_cooldown_ends_turn", return_value=False),
        patch("agent.turn_api_error.compute_error_backoff", return_value=1),
        patch("agent.turn_api_error.interruptible_backoff_sleep", return_value=None) as sleep,
    ):
        verdict = _settle(agent)

    assert verdict.action == "fallthrough"
    assert agent.restore_calls == 1
    sleep.assert_called_once()
