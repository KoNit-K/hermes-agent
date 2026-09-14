"""Gateway response filtering helpers.

These decide whether a completed agent turn should be delivered to the chat,
not what should be persisted in conversation history.
"""

from __future__ import annotations

import unicodedata
from typing import Any

# Exact whole-response markers meaning "the agent intentionally chose not to
# reply". Keep small and explicit; arbitrary empty output remains an
# error/empty-response path, not silence.
LIVE_GATEWAY_SILENT_MARKERS = frozenset({"[SILENT]", "SILENT", "NO_REPLY", "NO REPLY"})

# A bare marker in response to a human message is not a user-visible answer.
# Keep this shared by final-response shaping and streaming so the two delivery
# paths cannot disagree about the recovery message.
HUMAN_SILENCE_FALLBACK = (
    "⚠️ Processing completed but no response was generated. "
    "This may be a transient error — try sending your message again."
)

# Longer than any marker could plausibly be, even with stray punctuation.
_MARKER_LENGTH_CAP = 64


def _canonical_silence_candidate(text: str) -> str:
    return " ".join(text.strip().upper().split())


def _is_edge_punctuation(ch: str) -> bool:
    # Square brackets stay structural so malformed ``[SILENT`` cannot become ``SILENT``.
    return ch not in "[]" and unicodedata.category(ch).startswith("P")


def _strip_edge_silence_punctuation(text: str) -> str:
    """Strip stray edge punctuation (``.NO_REPLY``, ``*NO_REPLY*``) without erasing marker structure."""
    start, end = 0, len(text)
    while start < end and _is_edge_punctuation(text[start]):
        start += 1
    while end > start and _is_edge_punctuation(text[end - 1]):
        end -= 1
    return text[start:end].strip()


def _canonical_silence_candidates(text: Any) -> tuple[str, ...]:
    """Canonical forms of a short marker-sized response; ``()`` when not a candidate at all."""
    stripped = text.strip() if isinstance(text, str) else ""
    if not 0 < len(stripped) <= _MARKER_LENGTH_CAP:
        return ()
    depunctuated = _strip_edge_silence_punctuation(stripped)
    forms = (stripped,) if depunctuated == stripped else (stripped, depunctuated)
    return tuple(_canonical_silence_candidate(f) for f in forms)


def is_intentional_silence_response(response: Any) -> bool:
    """True only when ``response`` is exactly a silence marker.

    Prose that merely mentions ``NO_REPLY`` must be delivered normally. A blank
    response is not silence either — that is the empty-response failure path.
    """
    return any(c in LIVE_GATEWAY_SILENT_MARKERS for c in _canonical_silence_candidates(response))


def is_autonomous_silence_response(response: Any) -> bool:
    """Loose silence matcher for autonomous lanes (cron, webhook).

    Models reliably bracket ``[SILENT]`` with a short note, so unlike the
    interactive EXACT rule this also suppresses when a marker sits on its own
    first/last line or the bracketed sentinel opens the response (``[SILENT] No
    changes detected``).  A token buried mid-sentence is still delivered.
    Shares :data:`LIVE_GATEWAY_SILENT_MARKERS` so the two sets cannot drift.
    """
    stripped = response.strip() if isinstance(response, str) else ""
    if not stripped:
        return False
    lines = [ln for ln in stripped.splitlines() if ln.strip()]
    # Bracketed form only for the prefix rule, so a bare "Silent retry succeeded" is NOT swallowed.
    return stripped.upper().startswith("[SILENT]") or any(
        _canonical_silence_candidate(c) in LIVE_GATEWAY_SILENT_MARKERS for c in (stripped, lines[0], lines[-1])
    )


def is_intentional_silence_agent_result(agent_result: dict | None, response: Any) -> bool:
    """Silence markers suppress delivery only for successful agent turns."""
    return isinstance(agent_result, dict) and not agent_result.get("failed") and is_intentional_silence_response(response)


def should_suppress_turn_silence(
    agent_result: dict | None, response: Any, *, is_human_initiated: bool,
) -> bool:
    """Whether a completed marker may be withheld from the recipient.

    Silence is valid for synthetic gateway notifications, but a human-triggered
    turn must surface the normal empty-response fallback instead of vanishing.
    """
    return not is_human_initiated and is_intentional_silence_agent_result(agent_result, response)


def recover_human_silence_response(
    agent_result: dict | None, response: Any, *, is_human_initiated: bool,
) -> str:
    """Normalize a completed silence marker before stream finalize and delivery.

    Human turns get :data:`HUMAN_SILENCE_FALLBACK` so the consumer buffer, the
    streamed-finalize payload, and the outer shaper agree. Internal markers stay
    unchanged for the suppress path.
    """
    text = response if isinstance(response, str) else ""
    if is_human_initiated and is_intentional_silence_agent_result(agent_result, text):
        return HUMAN_SILENCE_FALLBACK
    return text


def _steer_row_contents(messages: Any) -> list[str]:
    rows: list[str] = []
    if not isinstance(messages, list):
        return rows
    for msg in messages:
        if isinstance(msg, dict) and msg.get("role") == "user" and msg.get("display_kind") == "steer":
            rows.append(msg.get("content") if isinstance(msg.get("content"), str) else "")
    return rows


def turn_consumed_human_steer(
    agent_result: dict | None,
    *,
    prior_messages: list | None = None,
    history_offset: int | None = None,
) -> bool:
    """True when this turn consumed a live ``display_kind=steer`` user row.

    Prefer an explicit ``consumed_human_steer`` stamp or a comparison against
    the pre-turn transcript. Do not rely on ``history_offset`` alone: compression
    can move a retained steer before that index.
    """
    if not isinstance(agent_result, dict):
        return False
    if agent_result.get("consumed_human_steer") is True:
        return True
    messages = agent_result.get("messages")
    if not isinstance(messages, list):
        return False
    if prior_messages is not None:
        from collections import Counter
        return bool(Counter(_steer_row_contents(messages)) - Counter(_steer_row_contents(prior_messages)))
    offset = history_offset if history_offset is not None else agent_result.get("history_offset", 0)
    try:
        offset = max(int(offset or 0), 0)
    except (TypeError, ValueError):
        offset = 0
    return any(
        isinstance(msg, dict) and msg.get("role") == "user" and msg.get("display_kind") == "steer"
        for msg in messages[offset:]
    )


def stamp_consumed_human_steer(
    agent_result: dict | None,
    *,
    prior_messages: list | None = None,
    history_offset: int | None = None,
) -> bool:
    """Record consumed-steer independently of later transcript-index rewrites."""
    found = turn_consumed_human_steer(
        agent_result, prior_messages=prior_messages, history_offset=history_offset,
    )
    if found and isinstance(agent_result, dict):
        agent_result["consumed_human_steer"] = True
    return found


def is_partial_silence_marker(text: Any) -> bool:
    """True while streamed ``text`` could still resolve to a silence marker.

    A buffer whose canonical form is a non-empty *prefix* of a marker (``"NO"`` on
    the way to ``"NO_REPLY"``, or an exact marker not yet terminated by stream-end)
    is held back so a raw marker is never shown and then retracted.  Divergence
    from every marker, or exceeding the cap, resumes normal streaming.
    """
    return any(
        c and any(marker.startswith(c) for marker in LIVE_GATEWAY_SILENT_MARKERS)
        for c in _canonical_silence_candidates(text)
    )


# ---- BEGIN PLUGIN-COMPAT (revert-scheduled; see COMPAT_MANIFEST.md) ----
# Names external plugins imported from this module before the Sep 2026 decomposition.
# Internal code MUST NOT use these (scripts/check_compat_pointers.py fails CI if it does).
# The whole block is removed by reverting the commit that added it.

SILENT_REPLY_TOKEN = "NO_REPLY"
# ---- END PLUGIN-COMPAT ----
