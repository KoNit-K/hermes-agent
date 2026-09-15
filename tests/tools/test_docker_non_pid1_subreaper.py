"""Contracts for the Linux reaper used when the image is not PID 1 (#111577)."""

from __future__ import annotations

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
DISPATCHER = REPO_ROOT / "docker" / "entrypoint-dispatch.sh"
WRAPPER = REPO_ROOT / "docker" / "main-wrapper.sh"
SUBREAPER = REPO_ROOT / "docker" / "subreaper.c"


def test_non_pid1_dispatch_runs_the_subreaper_before_main_wrapper() -> None:
    """The fallback must retain a parent that can adopt and reap orphans."""
    dispatcher = DISPATCHER.read_text(encoding="utf-8")

    assert "exec /opt/hermes/docker/subreaper" in dispatcher
    assert "main-wrapper.sh \"$@\"" in dispatcher


def test_direct_main_wrapper_override_reenters_through_subreaper() -> None:
    """Compose entrypoint overrides still get the reaper rather than bypassing it."""
    wrapper = WRAPPER.read_text(encoding="utf-8")

    assert 'HERMES_SUBREAPER_ACTIVE:-' in wrapper
    assert "exec /opt/hermes/docker/subreaper \"$0\" \"$@\"" in wrapper
    assert "[ ! -d /run/s6/container_environment ]" in wrapper


def test_subreaper_adopts_orphans_reaps_children_and_forwards_shutdown() -> None:
    """Keep the three runtime guarantees visible in the native implementation."""
    source = SUBREAPER.read_text(encoding="utf-8")

    assert "PR_SET_CHILD_SUBREAPER" in source
    assert "sigaction(SIGCHLD" in source
    assert "waitpid(-1" in source
    assert "kill(-child_pid" in source
    assert "WEXITSTATUS" in source
    assert "128 + WTERMSIG" in source
