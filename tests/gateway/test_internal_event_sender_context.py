from types import SimpleNamespace

import pytest

from gateway.config import Platform
from gateway.platforms.event import MessageEvent
from gateway.run_inbound import GatewayInboundMixin
from gateway.session import SessionSource


@pytest.mark.parametrize(
    ("thread_id", "group_sessions_per_user", "thread_sessions_per_user"),
    [
        (None, False, False),
        ("42", True, False),
    ],
    ids=["shared-group", "shared-topic"],
)
def test_internal_event_in_shared_session_has_no_sender_prefix(
    thread_id, group_sessions_per_user, thread_sessions_per_user,
):
    runner = SimpleNamespace(config=SimpleNamespace(
        group_sessions_per_user=group_sessions_per_user,
        thread_sessions_per_user=thread_sessions_per_user,
    ))
    source = SessionSource(
        platform=Platform.TELEGRAM, chat_id="-100123", chat_type="group",
        thread_id=thread_id, user_id="111", user_name="Owner Name",
    )
    event = MessageEvent(text="PLUGIN TEXT", source=source, internal=True,
                         channel_context="Earlier channel context")

    result = GatewayInboundMixin._prefix_inbound_sender_context(runner, event, source, event.text)

    assert result == "Earlier channel context\n\n[New message]\nPLUGIN TEXT"


def test_human_event_in_shared_session_keeps_sender_prefix():
    runner = SimpleNamespace(config=SimpleNamespace(
        group_sessions_per_user=False, thread_sessions_per_user=False,
    ))
    source = SessionSource(
        platform=Platform.TELEGRAM, chat_id="-100123", chat_type="group",
        user_id="111", user_name="Owner Name",
    )

    result = GatewayInboundMixin._prefix_inbound_sender_context(
        runner, MessageEvent(text="human", source=source), source, "human",
    )

    assert result == "[Owner Name] human"
