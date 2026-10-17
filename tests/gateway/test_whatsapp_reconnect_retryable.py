"""WhatsApp bridge reconnect verdicts are safe for delivery-ledger redelivery."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from gateway.platforms.base import SendResult
from tests.gateway.test_whatsapp_formatting import _AsyncCM, _make_adapter


def _bridge_response(*, retryable: bool | None):
    payload = {"error": "Not connected to WhatsApp"}
    if retryable is not None:
        payload["retryable"] = retryable
    response = MagicMock(status=503)
    response.json = AsyncMock(return_value=payload)
    response.text = AsyncMock(return_value=payload["error"])
    return response


@pytest.mark.asyncio
async def test_reconnecting_bridge_failure_is_retryable():
    adapter = _make_adapter()
    adapter._bridge_req = lambda *_args, **_kwargs: _AsyncCM(_bridge_response(retryable=True))

    result = await adapter._post_bridge_message(
        "send", {"chatId": "15551234567@s.whatsapp.net", "message": "hello"}, timeout=30
    )

    assert result.success is False
    assert result.retryable is True


@pytest.mark.asyncio
async def test_disconnected_bridge_failure_stays_nonretryable():
    adapter = _make_adapter()
    adapter._bridge_req = lambda *_args, **_kwargs: _AsyncCM(_bridge_response(retryable=None))

    result = await adapter._post_bridge_message(
        "send", {"chatId": "15551234567@s.whatsapp.net", "message": "hello"}, timeout=30
    )

    assert result.success is False
    assert result.retryable is False


@pytest.mark.asyncio
async def test_send_preserves_the_bridge_reconnect_verdict():
    adapter = _make_adapter()
    adapter._post_bridge_message = AsyncMock(return_value=SendResult(
        success=False, error="Not connected to WhatsApp", retryable=True
    ))

    result = await adapter.send("15551234567", "hello")

    assert result.success is False
    assert result.retryable is True
