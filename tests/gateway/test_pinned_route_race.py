"""Regression for #113692: async delegation cannot publish a route across a boundary."""

import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest


def _runner_with_suspended_lookup(tmp_path, entered, release, pinned_row=None):
    """A real routing store whose pinned-session lookup waits for the test boundary."""
    from gateway.config import GatewayConfig, Platform
    from gateway.run import GatewayRunner
    from gateway.session import AsyncSessionStore, SessionSource, SessionStore

    store = SessionStore(tmp_path / "sessions", GatewayConfig())
    source = SessionSource(
        platform=Platform.TELEGRAM,
        chat_id="test-chat",
        chat_type="dm",
        user_id="test-user",
    )
    entry = store.get_or_create_session(source)
    runner = object.__new__(GatewayRunner)
    runner.session_store = store
    runner._async_session_store = AsyncSessionStore(store)
    row = pinned_row if pinned_row is not None else {"ended_at": None}

    async def get_session(session_id):
        entered.set()
        await release.wait()
        return {"id": session_id, **row}

    runner._session_db = SimpleNamespace(get_session=AsyncMock(side_effect=get_session))
    return runner, store, entry


@pytest.mark.asyncio
@pytest.mark.parametrize("boundary", ["none", "revoke", "replace"])
async def test_pending_pin_respects_concurrent_boundary(tmp_path, boundary):
    """The caller's original (key, generation) must authorize the eventual commit."""
    entered, release = asyncio.Event(), asyncio.Event()
    runner, store, entry = _runner_with_suspended_lookup(tmp_path, entered, release)
    generation = runner._begin_session_run_generation(entry.session_key)
    task = asyncio.create_task(
        runner._resolve_async_delegation_session(
            entry,
            "test-pinned",
            run_session_key=entry.session_key,
            run_generation=generation,
        )
    )
    await asyncio.wait_for(entered.wait(), 3)

    expected = "test-pinned"
    if boundary != "none":
        runner._invalidate_session_run_generation(
            entry.session_key, reason="test boundary"
        )
        expected = entry.session_id
    if boundary == "replace":
        store.switch_session(entry.session_key, "test-replacement")
        expected = "test-replacement"

    release.set()
    result = await asyncio.wait_for(task, 3)

    assert store.lookup_by_session_key(entry.session_key).session_id == expected
    assert result is not None if boundary == "none" else result is None


@pytest.mark.asyncio
async def test_topic_rewrite_uses_the_original_run_key_for_authorization(tmp_path):
    """Topic recovery may change the route key, but not the run token's key."""
    from gateway.config import Platform
    from gateway.session import SessionSource

    entered, release = asyncio.Event(), asyncio.Event()
    runner, store, original = _runner_with_suspended_lookup(tmp_path, entered, release)
    rewritten = store.get_or_create_session(
        SessionSource(
            platform=Platform.TELEGRAM,
            chat_id="recovered-chat",
            chat_type="dm",
            user_id="test-user",
        )
    )
    generation = runner._begin_session_run_generation(original.session_key)
    task = asyncio.create_task(
        runner._resolve_async_delegation_session(
            rewritten,
            "test-pinned",
            run_session_key=original.session_key,
            run_generation=generation,
        )
    )
    await asyncio.wait_for(entered.wait(), 3)
    runner._invalidate_session_run_generation(
        original.session_key, reason="topic rewrite boundary"
    )
    release.set()

    assert await asyncio.wait_for(task, 3) is None
    assert (
        store.lookup_by_session_key(rewritten.session_key).session_id
        == rewritten.session_id
    )


@pytest.mark.asyncio
async def test_revocation_during_compression_lineage_await_drops_the_commit(tmp_path):
    """A /stop while compression lineage resolves cannot advance the route afterwards."""
    entered, release = asyncio.Event(), asyncio.Event()
    pinned_row = {"ended_at": "2026-07-08T00:00:00", "end_reason": "compression"}
    runner, store, entry = _runner_with_suspended_lookup(
        tmp_path, entered, release, pinned_row
    )
    lineage_entered, lineage_release = asyncio.Event(), asyncio.Event()

    async def resolve_lineage(*_args):
        lineage_entered.set()
        await lineage_release.wait()
        return "sess-tip"

    runner._resolve_compression_lineage_target = resolve_lineage
    generation = runner._begin_session_run_generation(entry.session_key)
    task = asyncio.create_task(
        runner._resolve_async_delegation_session(
            entry,
            "test-pinned",
            run_session_key=entry.session_key,
            run_generation=generation,
        )
    )
    await asyncio.wait_for(entered.wait(), 3)
    release.set()
    await asyncio.wait_for(lineage_entered.wait(), 3)
    runner._invalidate_session_run_generation(
        entry.session_key, reason="compression await boundary"
    )
    lineage_release.set()

    assert await asyncio.wait_for(task, 3) is None
    assert store.lookup_by_session_key(entry.session_key).session_id == entry.session_id


@pytest.mark.asyncio
@pytest.mark.parametrize("shape", ["identity", "compression"])
async def test_commit_samples_authorization_at_the_effect(tmp_path, shape):
    """A revocation at the effect is observed for identity and compression paths.

    This catches a production change that validates before an await or before handing control to
    the store, rather than under the routing authority that commits the route.
    """
    entered, release = asyncio.Event(), asyncio.Event()
    pinned_row = {"ended_at": "2026-07-08T00:00:00", "end_reason": "idle"}
    if shape == "compression":
        pinned_row["end_reason"] = "compression"
    runner, store, entry = _runner_with_suspended_lookup(
        tmp_path, entered, release, pinned_row
    )
    if shape == "compression":
        runner._resolve_compression_lineage_target = AsyncMock(return_value="sess-tip")
    generation = runner._begin_session_run_generation(entry.session_key)
    task = asyncio.create_task(
        runner._resolve_async_delegation_session(
            entry,
            "test-pinned",
            run_session_key=entry.session_key,
            run_generation=generation,
        )
    )
    await asyncio.wait_for(entered.wait(), 3)

    seen = []
    real_is_current = runner._is_session_run_current

    def revoke_when_commit_authorizes(key, token):
        if not seen:
            seen.append(True)
            runner._invalidate_session_run_generation(key, reason="commit barrier")
        return real_is_current(key, token)

    with patch.object(runner, "_is_session_run_current", revoke_when_commit_authorizes):
        release.set()
        result = await asyncio.wait_for(task, 3)

    assert seen, "the transition never sampled the run token"
    assert result is None
    assert store.lookup_by_session_key(entry.session_key).session_id == entry.session_id
    assert not runner._is_session_run_current(entry.session_key, generation)
