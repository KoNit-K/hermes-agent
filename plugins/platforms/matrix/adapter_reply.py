"""Best-effort recovery of Matrix reply targets through the configured client."""

import asyncio


async def fetch_reply_context(client, room_id: str, reply_to: str) -> tuple[str | None, str | None]:
    from plugins.platforms.matrix.adapter import EventID, RoomID

    reply_to_text = reply_to_author_id = None
    # A stalled context lookup must not hold up inbound delivery. Use the
    # same budget for fetching and decrypting (keys may be unavailable).
    async with asyncio.timeout(10):
        related_event = await client.get_event(RoomID(room_id), EventID(reply_to))
        related_type = (related_event.get("type") if isinstance(related_event, dict)
                        else getattr(related_event, "type", None))
        if str(related_type) == "m.room.encrypted":
            if not client.crypto:
                return None, None
            if isinstance(related_event, dict):
                from mautrix.types import EncryptedEvent
                related_event = EncryptedEvent.deserialize(related_event)
            related_event = await client.crypto.decrypt_megolm_event(related_event)
    related_content = (
        related_event.get("content") if isinstance(related_event, dict)
        else getattr(related_event, "content", None)
    )
    if not isinstance(related_content, dict) and hasattr(related_content, "serialize"):
        related_content = related_content.serialize()
    related_body = related_content.get("body") if isinstance(related_content, dict) else None
    if isinstance(related_body, str) and related_body.strip():
        reply_to_text = related_body
        related_sender = (
            related_event.get("sender") if isinstance(related_event, dict)
            else getattr(related_event, "sender", None)
        )
        if isinstance(related_sender, str):
            reply_to_author_id = related_sender
    return reply_to_text, reply_to_author_id
