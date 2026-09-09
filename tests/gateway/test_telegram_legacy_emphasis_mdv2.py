"""Legacy Telegram MarkdownV2 emphasis: nested/combined and multiline bold.

Pin the format_message converter (rich messages off) so valid nested
asterisk emphasis is not swallowed by the bold regex and escaped as
literals. Unmatched markers stay escaped/literal (fail-open).
"""

from gateway.config import PlatformConfig
from plugins.platforms.telegram.adapter import TelegramAdapter


def test_legacy_nested_and_multiline_emphasis_mdv2():
    adapter = TelegramAdapter(PlatformConfig(token="test-token"))
    assert adapter.format_message("***bold italic***") == "_*bold italic*_"
    assert adapter.format_message("**bold *italic* text**") == "*bold _italic_ text*"
    assert adapter.format_message("**bold\ntext**") == "*bold\ntext*"
    # fail-open: unmatched markers stay escaped/literal, not stripped
    unmatched = adapter.format_message("**unclosed bold")
    assert "**" in unmatched.replace("\\*", "*") or "\\*\\*" in unmatched
