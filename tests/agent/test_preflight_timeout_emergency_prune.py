"""Timeout-only emergency pruning at the turn-start compression boundary."""

from types import SimpleNamespace
from unittest.mock import patch

import pytest

from agent.conversation_compression import mark_context_compression_timed_out
from agent.turn_context import PreflightCompressionDeferred
from agent.turn_context_compaction import CompactionOutcome, _run_preflight_passes


def _agent(prune):
    compressor = SimpleNamespace(
        threshold_tokens=80,
        context_length=100,
        should_compress=lambda tokens: tokens >= 80,
        prune_tool_results_only=prune,
    )
    agent = SimpleNamespace(
        context_compressor=compressor,
        max_compression_attempts=1,
        model="test/model",
        session_id="session-114594",
        _emit_status=lambda _message: None,
    )

    def _timeout(messages, _system_message, **_kwargs):
        mark_context_compression_timed_out(agent)
        return messages, "system"

    agent._compress_context = _timeout
    return agent


def _outcome(messages):
    return CompactionOutcome(
        messages=messages, active_system_prompt="system", conversation_history=[], current_turn_user_idx=1
    )


def test_timeout_emergency_prune_reanchors_and_allows_safe_retry():
    messages = [{"role": "tool", "content": "old"}, {"role": "user", "content": "continue"}]
    pruned = [{"role": "tool", "content": "[pruned]"}, messages[1]]
    agent = _agent(lambda _messages, current_tokens=None: (pruned, 1))
    out = _outcome(messages)

    with (
        patch("agent.turn_context._preflight_request_tokens", side_effect=[100, 40, 40]),
        patch("agent.turn_context_compaction.conversation_history_after_compression", return_value=[]),
    ):
        _run_preflight_passes(agent, out, agent.context_compressor, 100, "system", "task")

    assert out.messages is pruned
    assert out.current_turn_user_idx == 1
    assert agent._persist_user_message_idx == 1


def test_timeout_with_no_prunable_progress_defers_without_exhaustion():
    messages = [{"role": "tool", "content": "old"}, {"role": "user", "content": "continue"}]
    agent = _agent(lambda original, current_tokens=None: (original, 0))

    with patch("agent.turn_context._preflight_request_tokens", return_value=100):
        with pytest.raises(PreflightCompressionDeferred) as exc:
            _run_preflight_passes(agent, _outcome(messages), agent.context_compressor, 100, "system", "task")

    assert exc.value.messages is messages
