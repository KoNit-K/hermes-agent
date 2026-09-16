"""Credential-shaped model output stays redacted at every CLI response sink.

Regression for #112673.  A model can emit arbitrary text, so terminal rendering
must not bypass the credential redaction boundary even when ordinary response
text is otherwise preserved.
"""

from __future__ import annotations

from types import SimpleNamespace

import pytest

import cli
from hermes_cli.cli_stream_mixin import CLIStreamMixin


SECRET = "sk-proj-abc123def456ghi789jkl012"
RESPONSE = f"ordinary assistant response\nOPENAI_API_KEY={SECRET}"


def test_quiet_response_redacts_credential_shaped_model_output(capsys):
    agent = SimpleNamespace(
        run_conversation=lambda **_kwargs: {"final_response": RESPONSE},
        session_id="response-redaction",
    )

    with pytest.raises(SystemExit) as exc:
        cli._run_quiet_single_query(
            SimpleNamespace(agent=agent, conversation_history=[], session_id="response-redaction"),
            "hello",
        )

    assert exc.value.code == 0
    output = capsys.readouterr().out
    assert "ordinary assistant response" in output
    assert SECRET not in output


def test_streamed_response_redacts_complete_credential_line(monkeypatch):
    rendered = []
    stream = CLIStreamMixin()
    stream.show_reasoning = False
    stream._reasoning_box_opened = False
    stream._stream_box_opened = True
    stream._stream_box_live = True
    stream._stream_buf = ""
    stream._stream_table_buf = []
    stream._in_stream_table = False
    stream.final_response_markdown = "render"
    stream._stream_text_ansi = ""
    stream._close_reasoning_box = lambda: None
    monkeypatch.setattr(cli, "_cprint", rendered.append)

    stream._emit_stream_text(RESPONSE + "\n")

    output = "\n".join(rendered)
    assert "ordinary assistant response" in output
    assert SECRET not in output

    stream._emit_stream_text("x" * 80 + f" OPENAI_API_KEY={SECRET}")
    assert SECRET not in stream._spinner_text


def test_interactive_response_panel_redacts_model_output(monkeypatch):
    printed = []
    chat = cli.HermesCLI.__new__(cli.HermesCLI)
    chat._stream_started = False
    chat._stream_box_opened = False
    chat.final_response_markdown = "render"
    chat._scrollback_box_width = lambda: 80

    class Console:
        def print(self, panel):
            printed.append(str(panel.renderable))

    monkeypatch.setattr(cli, "ChatConsole", lambda: Console())
    monkeypatch.setattr(cli, "_render_final_assistant_content", lambda text, **_kwargs: text)

    from hermes_cli.cli_chat_turn_mixin import CLIChatTurnMixin

    CLIChatTurnMixin._chat_print_response_panel(
        chat, SimpleNamespace(result={}, use_streaming_tts=False, box_opened=False), RESPONSE)

    assert "ordinary assistant response" in printed[0]
    assert SECRET not in printed[0]
