"""Compression must keep one actionable copy of a large unfinished request.

Related to #100818: preserving the task after the handoff must not duplicate
the entire protected user input. Summary generation is stubbed; assembly is real.
"""

import socket
from unittest.mock import patch

import pytest


@pytest.fixture
def compress_task(monkeypatch):
    def deny_network(*args, **kwargs):
        raise AssertionError("This synthetic reproduction must not use the network")

    monkeypatch.setattr(socket.socket, "connect", deny_network)
    monkeypatch.setattr(socket.socket, "connect_ex", deny_network)
    monkeypatch.setattr(socket, "getaddrinfo", deny_network)

    from agent.context_compressor import ContextCompressor, SUMMARY_PREFIX

    def run(protect_first_n=3, completed=False):
        task = ("Audit this synthetic document.\n" + "Synthetic policy material. " * 30000).rstrip()
        messages = [{"role": "user", "content": task}]
        for index in range(10):
            call_id = f"call_{index}"
            messages.extend([
                {"role": "assistant", "content": "", "tool_calls": [{
                    "id": call_id, "type": "function",
                    "function": {"name": "synthetic_submit", "arguments": "{}"},
                }]},
                {"role": "tool", "tool_call_id": call_id, "content": "accepted"},
            ])
        if completed:
            messages.append({"role": "assistant", "content": "Finished."})
        compressor = ContextCompressor(
            "synthetic-model", threshold_percent=0.8,
            protect_first_n=protect_first_n, protect_last_n=20,
            config_context_length=229376, max_tokens=8192, quiet_mode=True,
        )
        with patch.object(
            compressor, "_generate_summary",
            return_value=SUMMARY_PREFIX + "\nSynthetic handoff.",
        ) as summary:
            result = compressor.compress(messages, current_tokens=180000, force=True)
        assert summary.call_count == 1, "The fixture must cross a summary boundary"
        return task, result

    return run


@pytest.mark.parametrize("repeat", [1, 2])
def test_first_compaction_keeps_one_actionable_task_copy(compress_task, repeat):
    from agent.context_compressor import _SUMMARY_END_MARKER

    task, messages = compress_task()
    texts = [message.get("content", "") for message in messages]
    boundary = next(index for index, text in enumerate(texts) if _SUMMARY_END_MARKER in text)
    after_handoff = [texts[boundary].split(_SUMMARY_END_MARKER, 1)[1], *texts[boundary + 1:]]
    assert any(task in text for text in after_handoff), "Unfinished task must remain actionable"
    copies = sum(text.count(task) for text in texts)
    assert copies == 1, f"repeat={repeat}: full task copies after compression={copies}"


@pytest.mark.parametrize("repeat", [1, 2])
@pytest.mark.parametrize("protect_first_n,completed", [(0, False), (3, True)])
def test_task_copy_controls(compress_task, protect_first_n, completed, repeat):
    task, messages = compress_task(protect_first_n=protect_first_n, completed=completed)
    copies = sum(message.get("content", "").count(task) for message in messages)
    assert copies == 1, f"repeat={repeat}: control full task copies={copies}"
