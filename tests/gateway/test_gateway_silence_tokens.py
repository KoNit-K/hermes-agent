"""Gateway intentional-silence token behavior."""

from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

import gateway.run as gateway_run
from gateway.config import GatewayConfig, Platform
from gateway.platforms.event import MessageEvent
from gateway.session import SessionEntry, SessionSource
from gateway.response_filters import (
    HUMAN_SILENCE_FALLBACK,
    is_intentional_silence_agent_result,
    is_intentional_silence_response,
    recover_human_silence_response,
    turn_consumed_human_steer,
    stamp_consumed_human_steer,
)


def _source():
    return SessionSource(
        platform=Platform.TELEGRAM,
        chat_id="-1001",
        chat_type="group",
        user_id="12345",
    )


def _event(*, internal: bool = False):
    return MessageEvent(
        text="side chatter",
        source=_source(),
        message_id="msg-42",
        internal=internal,
    )


def _runner(monkeypatch, tmp_path):
    runner = gateway_run.GatewayRunner(GatewayConfig())
    runner.adapters = {}
    runner._running_agents = {}
    runner._running_agents_ts = {}
    runner._pending_messages = {}
    runner._pending_approvals = {}
    runner._is_user_authorized = lambda _source: True
    runner._set_session_env = lambda _context: None
    runner._handle_active_session_busy_message = AsyncMock(return_value=False)
    runner._session_db = MagicMock()
    runner._recover_telegram_topic_thread_id = lambda _source: None
    runner._cache_session_source = lambda _key, _source: None
    runner._is_session_run_current = lambda _key, _gen: True
    runner._reply_anchor_for_event = lambda _event: None
    runner._get_guild_id = lambda _event: None
    runner._should_send_voice_reply = lambda *_a, **_kw: False
    runner.hooks = MagicMock()
    runner.hooks.emit = AsyncMock()

    runner.session_store = MagicMock()
    runner.session_store.get_or_create_session.return_value = SessionEntry(
        session_key="agent:main:telegram:group:-1001:12345",
        session_id="sess-silent",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        platform=Platform.TELEGRAM,
        chat_type="group",
    )
    runner.session_store.load_transcript.return_value = []
    runner.session_store.append_to_transcript = MagicMock()
    runner.session_store.update_session = MagicMock()

    monkeypatch.setattr(gateway_run, "_hermes_home", tmp_path)
    monkeypatch.setattr(
        gateway_run, "_resolve_runtime_agent_kwargs", lambda: {"api_key": "fake"}
    )
    monkeypatch.setattr(
        "agent.model_metadata.get_model_context_length",
        lambda *_args, **_kwargs: 100_000,
    )
    return runner


def test_exact_silence_tokens_are_intentional_silence():
    for token in ("[SILENT]", " SILENT ", "NO_REPLY", "no reply"):
        assert is_intentional_silence_response(token)


def test_blank_and_prose_mentions_are_not_silence():
    assert not is_intentional_silence_response("")
    assert not is_intentional_silence_response("Use NO_REPLY when no answer is needed.")
    assert not is_intentional_silence_response("The reply was [SILENT], intentionally.")


def test_failed_agent_result_never_counts_as_intentional_silence():
    assert is_intentional_silence_agent_result({"failed": False}, "NO_REPLY")
    assert not is_intentional_silence_agent_result({"failed": True}, "NO_REPLY")


def test_recover_human_silence_response_only_rewrites_successful_human_markers():
    ok = {"failed": False}
    assert recover_human_silence_response(ok, "NO_REPLY", is_human_initiated=True) == HUMAN_SILENCE_FALLBACK
    assert recover_human_silence_response(ok, "NO_REPLY", is_human_initiated=False) == "NO_REPLY"
    assert recover_human_silence_response({"failed": True}, "NO_REPLY", is_human_initiated=True) == "NO_REPLY"
    assert recover_human_silence_response(ok, "hello", is_human_initiated=True) == "hello"


@pytest.mark.asyncio
async def test_human_silence_token_delivers_empty_response_warning(monkeypatch, tmp_path):
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "[SILENT]",
        "messages": [
            {"role": "user", "content": "side chatter"},
            {"role": "assistant", "content": "[SILENT]"},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(), _source(), "agent:main:telegram:group:-1001:12345", 1
    )

    assert "no response was generated" in response
    appended = [call.args[1] for call in runner.session_store.append_to_transcript.call_args_list]
    assert {"role": "assistant", "content": "[SILENT]"}.items() <= appended[-1].items()
    assert [msg["role"] for msg in appended if msg.get("role") in {"user", "assistant"}] == ["user", "assistant"]


@pytest.mark.asyncio
async def test_queued_human_after_internal_recovers_silence_marker(monkeypatch, tmp_path):
    """Outer shaping must use the terminal queued turn, not the internal opener."""
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "NO_REPLY",
        "queued_terminal_is_human": True,
        "messages": [
            {"role": "user", "content": "side chatter"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(internal=True), _source(), "agent:main:telegram:group:-1001:12345", 1,
    )

    assert "no response was generated" in response


@pytest.mark.asyncio
async def test_queued_internal_after_human_still_suppresses_silence(monkeypatch, tmp_path):
    """A human opener plus internal NO_REPLY follow-up must stay silent."""
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "NO_REPLY",
        "queued_terminal_is_human": False,
        "messages": [],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(), _source(), "agent:main:telegram:group:-1001:12345", 1,
    )

    assert response == ""


@pytest.mark.asyncio
@pytest.mark.parametrize("internal,expect_human", [(False, True), (True, False)])
async def test_queued_followup_passes_pending_origin(internal, expect_human):
    """Recursive _run_agent and the merged result both see the pending event origin."""
    from gateway.turn_context import TurnContext

    runner = object.__new__(gateway_run.GatewayRunner)
    runner._MAX_INTERRUPT_DEPTH = 5
    runner._adapter_for_source = MagicMock(return_value=None)
    runner._is_goal_continuation_event = lambda _event: False
    runner._session_key_for_source = lambda _source: "queued-key"
    runner._prepare_profile_scoped_inbound_message_text = AsyncMock(return_value="queued")
    runner._reply_anchor_for_event = lambda _event: None
    runner._refresh_agent_cache_message_count = AsyncMock()
    captured = {}

    async def _capture_run_agent(**kwargs):
        captured.update(kwargs)
        return {"final_response": "NO_REPLY"}

    runner._run_agent = _capture_run_agent
    turn_ctx = TurnContext(
        source=_source(),
        session_id="sess-queued-origin",
        session_key="opener-key",
        run_generation=1,
        history=[],
        context_prompt="",
        result_holder=[{}],
        _interrupt_depth=0,
        _status_thread_metadata={},
    )
    merged = await runner._run_agent_queued_followup(
        turn_ctx,
        None,
        "queued",
        _event(internal=internal),
        {"final_response": "first"},
        {"interrupted": True, "messages": []},
        None,
    )

    assert captured["is_human_initiated"] is expect_human
    assert merged["queued_terminal_is_human"] is expect_human


def test_turn_consumed_human_steer_ignores_replayed_history():
    replayed = {
        "history_offset": 2,
        "messages": [
            {"role": "user", "content": "old", "display_kind": "steer"},
            {"role": "assistant", "content": "ack"},
            {"role": "user", "content": "internal ping", "display_kind": "internal_notification"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
    }
    consumed = {
        "history_offset": 1,
        "messages": [
            {"role": "user", "content": "old", "display_kind": "steer"},
            {"role": "user", "content": "live steer", "display_kind": "steer"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
    }
    assert turn_consumed_human_steer(replayed) is False
    assert turn_consumed_human_steer(consumed) is True
    assert gateway_run.GatewayRunner._terminal_turn_is_human(replayed, _event(internal=True)) is False
    assert gateway_run.GatewayRunner._terminal_turn_is_human(consumed, _event(internal=True)) is True


def test_consumed_steer_survives_compressed_transcript_index():
    """Compression can move a retained steer before the pre-compression history length."""
    prior = [{"role": "user", "content": f"h{i}"} for i in range(5)]
    compressed = {
        "history_offset": 5,
        "final_response": "NO_REPLY",
        "failed": False,
        "messages": [
            {"role": "user", "content": "summary"},
            {"role": "user", "content": "live steer", "display_kind": "steer"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
    }
    assert turn_consumed_human_steer(compressed) is False
    assert turn_consumed_human_steer(compressed, prior_messages=prior) is True
    assert stamp_consumed_human_steer(compressed, prior_messages=prior) is True
    assert compressed["consumed_human_steer"] is True


def test_repeated_identical_steer_uses_consumed_event_not_text_counts():
    """Compression can leave one copy of the same wrapped steer; text subtraction is empty."""
    steer = {"role": "user", "content": "same request", "display_kind": "steer"}
    prior = [steer]
    result = {
        "history_offset": 1,
        "final_response": "NO_REPLY",
        "failed": False,
        "messages": [steer, {"role": "assistant", "content": "NO_REPLY"}],
    }
    assert turn_consumed_human_steer(result, prior_messages=prior) is False
    agent = SimpleNamespace(_consumed_human_steer_this_turn=True)
    assert stamp_consumed_human_steer(result, prior_messages=prior, agent=agent) is True
    assert result["consumed_human_steer"] is True


def test_answered_steer_does_not_override_terminal_queued_origin():
    merged = {
        "history_offset": 0,
        "queued_terminal_is_human": False,
        "messages": [
            {"role": "user", "content": "opener steer", "display_kind": "steer"},
            {"role": "assistant", "content": "answered"},
            {"role": "user", "content": "internal followup", "display_kind": "internal_notification"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
        "final_response": "NO_REPLY",
        "failed": False,
    }
    assert gateway_run.GatewayRunner._terminal_turn_is_human(merged, _event()) is False
    assert gateway_run.GatewayRunner._should_suppress_turn_silence(
        merged, "NO_REPLY", is_human_initiated=False,
    ) is True


@pytest.mark.asyncio
async def test_internal_turn_recovers_silence_after_consumed_steer(monkeypatch, tmp_path):
    """busy_input_mode=steer appends a current-turn steer row; that is a human follow-up."""
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "NO_REPLY",
        "messages": [
            {"role": "user", "content": "cron ping", "display_kind": "internal_notification"},
            {"role": "assistant", "content": "working"},
            {"role": "tool", "content": "ok"},
            {"role": "user", "content": "please answer", "display_kind": "steer"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(internal=True), _source(), "agent:main:telegram:group:-1001:12345", 1,
    )

    assert "no response was generated" in response


@pytest.mark.asyncio
async def test_replayed_steer_history_does_not_recover_internal_silence(monkeypatch, tmp_path):
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "NO_REPLY",
        "messages": [
            {"role": "user", "content": "old steer", "display_kind": "steer"},
            {"role": "assistant", "content": "ack"},
            {"role": "user", "content": "cron ping", "display_kind": "internal_notification"},
            {"role": "assistant", "content": "NO_REPLY"},
        ],
        "tools": [],
        "history_offset": 2,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(internal=True), _source(), "agent:main:telegram:group:-1001:12345", 1,
    )

    assert response == ""


def test_finish_stream_recovers_silence_for_consumed_steer_not_opener_flag():
    from gateway.run_turn_runner import TurnRunner
    from gateway.turn_context import TurnContext

    ctx = TurnContext(is_human_initiated=False, result_holder=[None])
    turn_runner = TurnRunner(MagicMock(), ctx)
    result = {
        "final_response": "NO_REPLY",
        "failed": False,
        "completed": True,
        "messages": [
            {"role": "user", "content": "old", "display_kind": "steer"},
            {"role": "user", "content": "live", "display_kind": "steer"},
        ],
    }

    class _Consumer:
        def __init__(self):
            self.payload = None

        def finish(self, text=None):
            self.payload = text

    consumer = _Consumer()
    turn_runner._finish_stream_consumer(
        result,
        [{"role": "user", "content": "old", "display_kind": "steer"}],
        consumer,
    )
    assert result["final_response"] == HUMAN_SILENCE_FALLBACK
    assert consumer.payload == HUMAN_SILENCE_FALLBACK


def test_finish_stream_recovers_silence_after_compressed_consumed_steer():
    from gateway.run_turn_runner import TurnRunner
    from gateway.turn_context import TurnContext

    prior = [{"role": "user", "content": f"h{i}"} for i in range(8)]
    ctx = TurnContext(is_human_initiated=False, result_holder=[None], history=prior)
    turn_runner = TurnRunner(MagicMock(), ctx)
    result = {
        "final_response": "NO_REPLY",
        "failed": False,
        "completed": True,
        "history_offset": 8,
        "messages": [
            {"role": "user", "content": "compressed"},
            {"role": "user", "content": "live", "display_kind": "steer"},
        ],
    }

    class _Consumer:
        def __init__(self):
            self.payload = None

        def finish(self, text=None):
            self.payload = text

    consumer = _Consumer()
    turn_runner._finish_stream_consumer(result, prior, consumer)
    assert result["consumed_human_steer"] is True
    assert result["final_response"] == HUMAN_SILENCE_FALLBACK
    assert consumer.payload == HUMAN_SILENCE_FALLBACK


@pytest.mark.asyncio
async def test_queued_first_delivery_recovers_compressed_consumed_steer():
    """Queued first-response delivery must use the stamp, not TurnContext.internal."""
    from gateway.turn_context import TurnContext

    prior = [{"role": "user", "content": f"h{i}"} for i in range(6)]
    runner = object.__new__(gateway_run.GatewayRunner)
    runner._run_agent_stream_confirmed_final_delivery = lambda *a, **k: False
    runner._should_suppress_turn_silence = gateway_run.GatewayRunner._should_suppress_turn_silence
    runner._is_intentional_silence = gateway_run.GatewayRunner._is_intentional_silence
    delivered = []

    async def _deliver(text, **_kwargs):
        delivered.append(text)

    runner._deliver_queued_first_response = _deliver
    turn_ctx = TurnContext(
        is_human_initiated=False,
        history=prior,
        session_key="k",
        stream_consumer_holder=[None],
        source=_source(),
        _status_thread_metadata={},
    )
    result = {
        "final_response": "NO_REPLY",
        "failed": False,
        "history_offset": 6,
        "messages": [
            {"role": "user", "content": "compressed"},
            {"role": "user", "content": "live", "display_kind": "steer"},
        ],
    }
    await runner._run_agent_deliver_first_response(turn_ctx, None, result, result, None)
    assert delivered and "no response was generated" in delivered[0]


@pytest.mark.asyncio
async def test_internal_silence_token_still_suppresses_delivery(monkeypatch, tmp_path):
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "[SILENT]", "messages": [], "tools": [],
        "history_offset": 0, "last_prompt_tokens": 0, "api_calls": 1, "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(internal=True), _source(), "agent:main:telegram:group:-1001:12345", 1,
    )

    assert response == ""


@pytest.mark.asyncio
async def test_empty_success_still_gets_empty_response_warning(monkeypatch, tmp_path):
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "",
        "messages": [
            {"role": "user", "content": "question"},
            {"role": "assistant", "content": ""},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(), _source(), "agent:main:telegram:group:-1001:12345", 1
    )

    assert "no response was generated" in response


@pytest.mark.asyncio
async def test_prose_mentioning_silence_token_is_delivered(monkeypatch, tmp_path):
    runner = _runner(monkeypatch, tmp_path)
    text = "Use [SILENT] when no answer is needed."
    runner._run_agent = AsyncMock(return_value={
        "final_response": text,
        "messages": [
            {"role": "user", "content": "question"},
            {"role": "assistant", "content": text},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
    })

    response = await runner._handle_message_with_agent(
        _event(), _source(), "agent:main:telegram:group:-1001:12345", 1
    )

    assert response == text


@pytest.mark.asyncio
async def test_agent_end_hook_includes_model_and_provider(monkeypatch, tmp_path):
    """Gateway hooks receive the actual model/provider for post-turn routing."""
    runner = _runner(monkeypatch, tmp_path)
    runner._run_agent = AsyncMock(return_value={
        "final_response": "done",
        "messages": [
            {"role": "user", "content": "question"},
            {"role": "assistant", "content": "done"},
        ],
        "tools": [],
        "history_offset": 0,
        "last_prompt_tokens": 0,
        "api_calls": 1,
        "failed": False,
        "model": "gpt-5.6-terra",
        "provider": "openai-codex",
    })

    await runner._handle_message_with_agent(
        _event(), _source(), "agent:main:telegram:group:-1001:12345", 1
    )

    end_context = next(
        call.args[1]
        for call in runner.hooks.emit.await_args_list
        if call.args[0] == "agent:end"
    )
    assert end_context["model"] == "gpt-5.6-terra"
    assert end_context["provider"] == "openai-codex"
