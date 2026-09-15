"""Live Windows coverage and requester lifetime contracts for #111509 / #111513."""

import asyncio
import json
import os
import sys
import threading
import time

import psutil
import pytest

from hermes_cli.web_routers import git


@pytest.fixture
def clean_probe_state(monkeypatch):
    monkeypatch.setattr(git, "_gh_auth_cache", None)
    monkeypatch.setattr(git, "_gh_auth_probe_task", None, raising=False)


@pytest.mark.windows_only
@pytest.mark.asyncio
@pytest.mark.parametrize("hang", [False, True])
async def test_windows_refreshes_share_probe_and_reap_descendants(
    tmp_path, monkeypatch, clean_probe_state, hang
):
    """Exercise the real route, PATH lookup, .cmd wrapper, pipes and tree cleanup."""
    helper = tmp_path / "probe.py"
    helper.write_text(
        "import json, os, pathlib, subprocess, sys, time\n"
        "root = pathlib.Path(__file__).parent\n"
        "if len(sys.argv) > 1 and sys.argv[1] == 'child':\n"
        "    (root / f'child-{os.getpid()}.json').write_text(json.dumps({'pid': os.getpid()}))\n"
        "    time.sleep(120)\n"
        "else:\n"
        "    with (root / 'starts').open('a') as f: f.write('start\\n')\n"
        "    child = subprocess.Popen([sys.executable, __file__, 'child'],\n"
        "        creationflags=subprocess.CREATE_NO_WINDOW)\n"
        "    (root / f'parent-{os.getpid()}.json').write_text(json.dumps({'pid': os.getpid()}))\n"
        "    while not (root / 'release').exists(): time.sleep(0.02)\n"
        "    child.terminate()\n"
        "    child.wait(timeout=5)\n",
        encoding="utf-8",
    )
    (tmp_path / "gh.cmd").write_text(
        f'@echo off\n"{sys.executable}" "{helper}" %*\n', encoding="utf-8"
    )
    monkeypatch.setenv("PATH", str(tmp_path) + os.pathsep + os.environ["PATH"])
    processes = []
    callers = [asyncio.create_task(git.gh_auth_status_route(refresh=True)) for _ in range(5)]
    start = time.monotonic()
    try:
        deadline = start + 8
        while not list(tmp_path.glob("child-*.json")):
            assert time.monotonic() < deadline, "wrapper did not start its descendant"
            await asyncio.sleep(0.02)
        for record in tmp_path.glob("*-*.json"):
            pid = json.loads(record.read_text())["pid"]
            processes.append(psutil.Process(pid))
        # Disconnect one requester while the others still need the shared result.
        callers[0].cancel()
        with pytest.raises(asyncio.CancelledError):
            await callers[0]
        if not hang:
            (tmp_path / "release").touch()
        results = await asyncio.wait_for(asyncio.gather(*callers[1:]), timeout=25)
        assert results == [{"available": True, "authenticated": not hang}] * 4
        assert (tmp_path / "starts").read_text().splitlines() == ["start"]
        _, alive = await asyncio.to_thread(psutil.wait_procs, processes, timeout=5)
        assert not alive, f"probe descendants survived: {[p.pid for p in alive]}"
        assert time.monotonic() - start < 30
    finally:
        # Always release/clean only our recorded processes, including on red runs.
        (tmp_path / "release").touch()
        for proc in reversed(processes):
            try:
                proc.kill()
            except psutil.NoSuchProcess:
                pass
        await asyncio.gather(*callers, return_exceptions=True)
        await asyncio.to_thread(psutil.wait_procs, processes, timeout=5)


@pytest.mark.asyncio
async def test_completed_probe_is_cached_after_all_requesters_disconnect(
    monkeypatch, clean_probe_state
):
    """Disconnecting UI clients must not discard a successful shared auth check."""
    started = threading.Event()
    release = threading.Event()
    calls = []
    payload = {"available": True, "authenticated": True}

    def probe():
        calls.append(1)
        started.set()
        assert release.wait(10)
        return payload

    monkeypatch.setattr(git, "_probe_gh_auth", probe)
    caller = asyncio.create_task(git.gh_auth_status_route(refresh=True))
    try:
        assert await asyncio.to_thread(started.wait, 5)
        shared = git._gh_auth_probe_task
        caller.cancel()
        with pytest.raises(asyncio.CancelledError):
            await caller
        release.set()
        await asyncio.wait_for(asyncio.shield(shared), timeout=5)
        assert await git.gh_auth_status_route() == payload
        assert calls == [1], "reopening the UI unnecessarily started another auth probe"
    finally:
        release.set()
        await asyncio.gather(caller, return_exceptions=True)
