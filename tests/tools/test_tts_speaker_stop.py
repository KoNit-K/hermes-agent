"""Stop behavior for the synchronous sentence speaker pipeline."""

import os
import queue
import threading
from unittest.mock import patch

from tests.waiting import wait_until


def test_sync_pipeline_stop_finishes_while_synthesis_is_blocked(monkeypatch):
    """Regression for #139093: stopping must not wait for an in-flight sync provider."""
    from tools import tts_tool
    from tools import tts_tool_speaker
    from tools.tts_tool_speaker import stream_tts_to_speaker

    synthesis_started = threading.Event()
    release_synthesis = threading.Event()
    stop, done = threading.Event(), threading.Event()
    created_paths = []
    real_mkstemp = tts_tool_speaker.tempfile.mkstemp

    def tracking_mkstemp(*args, **kwargs):
        fd, path = real_mkstemp(*args, **kwargs)
        created_paths.append(path)
        return fd, path

    def blocked_synth(text, output_path):
        synthesis_started.set()
        release_synthesis.wait()
        with open(output_path, "wb") as fh:
            fh.write(b"audio")

    monkeypatch.setattr(tts_tool, "text_to_speech_tool", blocked_synth)
    monkeypatch.setattr(tts_tool_speaker.tempfile, "mkstemp", tracking_mkstemp)
    q = queue.Queue()
    q.put("A complete sentence. ")
    q.put(None)
    worker = threading.Thread(target=stream_tts_to_speaker, args=(q, stop, done))
    with patch("tools.tts_streaming.resolve_streaming_provider", return_value=None):
        worker.start()
        try:
            assert synthesis_started.wait(timeout=1.0)
            stop.set()
            assert done.wait(timeout=0.2), "stop waited for blocked synchronous synthesis"
        finally:
            release_synthesis.set()
            worker.join(timeout=2.0)
    assert not worker.is_alive()
    wait_until(
        lambda: not any(os.path.exists(path) for path in created_paths),
        what="late synthesis artifact cleanup",
    )
