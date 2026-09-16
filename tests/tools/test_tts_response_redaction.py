"""Model-generated credentials are redacted before streaming TTS leaves the CLI."""

from __future__ import annotations

from pathlib import Path
import queue
import threading


def test_streaming_tts_redacts_credential_shaped_sentence(monkeypatch):
    from tools import tts_tool_speaker

    secret = "sk-proj-abc123def456ghi789jkl012"
    synthesized = []
    displayed = []

    class Origin:
        def _load_tts_config(self):
            return {}

        def text_to_speech_tool(self, *, text, output_path):
            synthesized.append(text)
            Path(output_path).write_bytes(b"audio")

    monkeypatch.setattr(tts_tool_speaker, "_origin", lambda: Origin())
    monkeypatch.setattr("tools.tts_streaming.resolve_streaming_provider", lambda *_args, **_kwargs: None)
    monkeypatch.setattr("tools.voice_mode.play_audio_file", lambda _path: None)

    text_queue = queue.Queue()
    text_queue.put(f"ordinary assistant response; OPENAI_API_KEY={secret}.")
    text_queue.put(None)
    tts_tool_speaker.stream_tts_to_speaker(
        text_queue, threading.Event(), threading.Event(), display_callback=displayed.append)

    assert synthesized and displayed
    assert all(secret not in text for text in [*synthesized, *displayed])
    assert "ordinary assistant response" in synthesized[0]
