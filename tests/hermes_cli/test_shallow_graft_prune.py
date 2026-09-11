"""Stale shallow-graft pruning after depth-1 update checks (#105951).

Every ``git fetch --depth 1`` appends the fetched tip to ``.git/shallow`` as a
new graft and never removes the previous one, so a long-lived shallow installer
checkout accumulates one line per update check (57 observed in the wild). The
stale grafts break ``merge-base`` and push ``hermes update`` into the
orphan-divergence reset path. ``prune_stale_shallow_grafts()`` drops grafts no
ref or reflog reaches; ``hermes update --check`` calls it after its successful
depth-1 fetch, clearing the grafts accumulated by past checks once their reflogs
expire (the passive banner check no longer git-fetches since #107648).
"""

from __future__ import annotations

import subprocess
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from hermes_cli import gitlock as gitlock_module
from hermes_cli.gitlock import prune_stale_shallow_grafts

SHA_A = "a" * 40
SHA_B = "b" * 40


@pytest.fixture(autouse=True)
def _isolate_git_config(tmp_path, monkeypatch):
    config = tmp_path / "empty-gitconfig"
    config.write_text("", encoding="utf-8")
    template = tmp_path / "empty-git-template"
    template.mkdir()
    monkeypatch.setenv("GIT_CONFIG_GLOBAL", str(config))
    monkeypatch.setenv("GIT_CONFIG_SYSTEM", str(config))
    monkeypatch.setenv("GIT_TEMPLATE_DIR", str(template))


def _git(repo: Path, *args: str) -> str:
    result = _run_git(repo, *args)
    assert result.returncode == 0, result.stderr
    return result.stdout.strip()


def _run_git(repo: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args], cwd=str(repo), capture_output=True, text=True
    )


def _shallow_lines(repo: Path) -> list:
    return [
        line for line in (repo / ".git" / "shallow").read_text(encoding="utf-8").splitlines() if line
    ]


def _assert_repo_healthy(repo: Path) -> None:
    results = {
        "walk": _run_git(repo, "rev-list", "--count", "--all", "--reflog"),
        "fsck": _run_git(repo, "fsck", "--connectivity-only"),
        "gc": _run_git(repo, "gc", "-q"),
    }
    failures = "\n".join(
        f"{name}: rc={result.returncode}\n{result.stdout}{result.stderr}"
        for name, result in results.items()
        if result.returncode != 0
    )
    assert not failures, failures


def _mk_shallow_scenario(tmp_path: Path) -> Path:
    """Depth-1 clone whose origin advanced twice: shallow carries 3 grafts."""
    origin = tmp_path / "origin"
    origin.mkdir()
    _git(origin, "init", "-q", "-b", "main")
    _git(origin, "config", "user.email", "t@example.com")
    _git(origin, "config", "user.name", "t")
    for i in range(3):
        _git(origin, "commit", "--allow-empty", "-q", "-m", f"c{i}")
    clone = tmp_path / "clone"
    subprocess.run(
        ["git", "clone", "-q", "--depth", "1", f"file://{origin}", str(clone)],
        check=True,
        capture_output=True,
        text=True,
    )
    for i in range(3, 5):
        _git(origin, "commit", "--allow-empty", "-q", "-m", f"c{i}")
        _git(clone, "fetch", "-q", "--depth", "1", "origin", "main")
    return clone


def test_prunes_orphaned_grafts_keeps_referenced_boundaries(tmp_path):
    clone = _mk_shallow_scenario(tmp_path)
    assert len(_shallow_lines(clone)) == 3  # HEAD graft + two fetched tips

    head_sha = _git(clone, "rev-parse", "HEAD")
    tip_sha = _git(clone, "rev-parse", "origin/main")
    _git(clone, "reflog", "expire", "--expire=now", "refs/remotes/origin/main")

    removed = prune_stale_shallow_grafts(clone)

    assert removed == 1  # the middle, now-unreferenced tip
    assert set(_shallow_lines(clone)) == {head_sha, tip_sha}
    assert not (clone / ".git" / "shallow.lock").exists()
    # Boundaries that survive must still walk cleanly.
    assert _git(clone, "rev-list", "--count", "HEAD") == "1"
    assert _git(clone, "rev-list", "--count", "origin/main") == "1"


def test_prune_is_idempotent_and_noop_without_grafts(tmp_path):
    clone = _mk_shallow_scenario(tmp_path)
    _git(clone, "reflog", "expire", "--expire=now", "refs/remotes/origin/main")
    assert prune_stale_shallow_grafts(clone) == 1
    assert prune_stale_shallow_grafts(clone) == 0  # nothing left to drop

    empty_dir = tmp_path / "not-a-repo"
    empty_dir.mkdir()
    assert prune_stale_shallow_grafts(empty_dir) == 0  # not a git repo: no-op

    git_no_shallow = tmp_path / "full-clone"
    git_no_shallow.mkdir()
    (git_no_shallow / ".git").mkdir()
    assert prune_stale_shallow_grafts(git_no_shallow) == 0  # no shallow file: no-op


def test_update_check_prunes_and_reports_count(tmp_path, monkeypatch, capsys):
    """`hermes update --check` prunes grafts after its depth-1 fetch and reports the prune."""
    import hermes_cli.update_cmd as update_cmd

    fake_root = SimpleNamespace(PROJECT_ROOT=tmp_path)
    monkeypatch.setattr(update_cmd, "_m", lambda: fake_root)
    (tmp_path / ".git").mkdir()
    monkeypatch.setattr(
        "hermes_cli.update_contract.evaluate_update_admission", lambda root: None
    )
    monkeypatch.setattr(update_cmd, "_is_shallow_checkout", lambda git_cmd: True)
    monkeypatch.setattr(update_cmd, "_tip_shas", lambda git_cmd, branch: (SHA_A, SHA_B))

    def fake_git_run(git_cmd, args, **kwargs):
        joined = " ".join(args)
        if "get-url" in joined and "upstream" in joined:
            return MagicMock(returncode=1, stdout="", stderr="")  # no upstream remote
        if "fetch" in joined:
            return MagicMock(returncode=0, stdout="", stderr="")  # depth-1 fetch lands
        return MagicMock(returncode=0, stdout="", stderr="")

    monkeypatch.setattr(update_cmd, "_git_run", fake_git_run)
    monkeypatch.setattr(update_cmd, "_base_git_cmd", lambda: ["git"])
    monkeypatch.setattr("hermes_cli.banner._github_compare_behind", lambda *a, **k: 0)
    prune_calls = []
    monkeypatch.setattr(
        "hermes_cli.gitlock.prune_stale_shallow_grafts",
        lambda repo: prune_calls.append(repo) or 2,
    )

    update_cmd._cmd_update_check("main")

    out = capsys.readouterr().out
    assert prune_calls == [tmp_path]
    assert "pruned 2 stale shallow graft(s)" in out


def test_prune_preserves_grafts_reachable_only_from_reflogs(tmp_path, monkeypatch):
    """A reflog-only depth-1 tip must remain a valid shallow boundary."""
    origin = tmp_path / "origin"
    origin.mkdir()
    _git(origin, "init", "-q", "-b", "main")
    _git(origin, "config", "user.email", "t@example.com")
    _git(origin, "config", "user.name", "t")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c0")

    clone = tmp_path / "clone"
    subprocess.run(
        ["git", "clone", "-q", "--depth", "1", f"file://{origin}", str(clone)],
        check=True,
        capture_output=True,
        text=True,
    )

    # Fetch c2 without its parent c1, then supersede it with c3. The c2 graft is
    # now required only by origin/main's reflog.
    for message in ("c1", "c2"):
        _git(origin, "commit", "--allow-empty", "-q", "-m", message)
    _git(clone, "fetch", "-q", "--depth", "1", "origin", "main")
    reflog_only_sha = _git(clone, "rev-parse", "origin/main")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c3")
    _git(clone, "fetch", "-q", "--depth", "1", "origin", "main")

    assert reflog_only_sha in _shallow_lines(clone)
    assert reflog_only_sha in _git(
        clone, "reflog", "show", "--all", "--format=%H"
    ).splitlines()

    removed = prune_stale_shallow_grafts(clone)
    fetch = _run_git(clone, "fetch", "-q", "--depth", "1", "origin", "main")
    gc = _run_git(clone, "gc", "-q")
    walk = _run_git(clone, "rev-list", "--count", "--all", "--reflog")
    fsck = _run_git(clone, "fsck", "--connectivity-only")
    failures = "\n".join(
        f"{name}: rc={result.returncode}\n{result.stdout}{result.stderr}"
        for name, result in (("fetch", fetch), ("gc", gc), ("walk", walk), ("fsck", fsck))
        if result.returncode != 0
    )

    assert not failures, failures
    assert removed == 0
    assert reflog_only_sha in _shallow_lines(clone)

    # Even if keep-set computation misses the live boundary, validation against
    # the candidate lock file must reject it without touching the original.
    real_query = gitlock_module._git_stdout_lines
    injected = []

    def omit_reflog_boundary(repo, args, **kwargs):
        lines = real_query(repo, args, **kwargs)
        if args[:3] == ["rev-list", "--all", "--reflog"]:
            injected.append(True)
            return [line for line in lines if line != reflog_only_sha]
        return lines

    with monkeypatch.context() as patch:
        patch.setattr(gitlock_module, "_git_stdout_lines", omit_reflog_boundary)
        before = (clone / ".git" / "shallow").read_bytes()
        assert prune_stale_shallow_grafts(clone) == 0
        assert (clone / ".git" / "shallow").read_bytes() == before
        assert not (clone / ".git" / "shallow.lock").exists()
    assert injected

    # Keep c2 reachable only as an ancestor of a reflog entry. Collecting just
    # reflog entry SHAs would miss this load-bearing boundary.
    _git(clone, "config", "user.email", "t@example.com")
    _git(clone, "config", "user.name", "t")
    tree = _git(clone, "rev-parse", f"{reflog_only_sha}^{{tree}}")
    descendant = _git(
        clone, "commit-tree", tree, "-p", reflog_only_sha, "-m", "local descendant"
    )
    head_sha = _git(clone, "rev-parse", "HEAD")
    _git(clone, "update-ref", "--create-reflog", "refs/heads/keeper", descendant)
    _git(clone, "update-ref", "refs/heads/keeper", head_sha)
    _git(clone, "reflog", "expire", "--expire=now", "refs/remotes/origin/main")
    assert reflog_only_sha not in _git(
        clone, "for-each-ref", "--format=%(objectname)"
    ).splitlines()
    assert reflog_only_sha not in _git(
        clone, "rev-list", "--no-walk", "--all", "--reflog"
    ).splitlines()
    assert reflog_only_sha in _git(
        clone, "rev-list", "--all", "--reflog"
    ).splitlines()
    candidate_validations = []

    def record_candidate_validation(repo, args, **kwargs):
        if (kwargs.get("env") or {}).get("GIT_SHALLOW_FILE"):
            candidate_validations.append(True)
        return real_query(repo, args, **kwargs)

    with monkeypatch.context() as patch:
        patch.setattr(
            gitlock_module, "_git_stdout_lines", record_candidate_validation
        )
        assert prune_stale_shallow_grafts(clone) == 0
    assert not candidate_validations
    assert reflog_only_sha in _shallow_lines(clone)

    # Once the descendant reflog expires, c2 is genuinely stale.
    _git(clone, "reflog", "expire", "--expire=now", "refs/heads/keeper")
    assert prune_stale_shallow_grafts(clone) == 1
    assert reflog_only_sha not in _shallow_lines(clone)
    _assert_repo_healthy(clone)


def test_prune_fails_open_when_reflog_walk_is_already_broken(tmp_path):
    """An earlier bad prune must not trigger another destructive rewrite."""
    origin = tmp_path / "origin"
    origin.mkdir()
    _git(origin, "init", "-q", "-b", "main")
    _git(origin, "config", "user.email", "t@example.com")
    _git(origin, "config", "user.name", "t")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c0")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c1")

    clone = tmp_path / "clone"
    subprocess.run(
        ["git", "clone", "-q", "--depth", "1", f"file://{origin}", str(clone)],
        check=True,
        capture_output=True,
        text=True,
    )
    broken_tip = _git(clone, "rev-parse", "HEAD")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c2")
    _git(clone, "fetch", "-q", "--depth", "1", "origin", "main")
    _git(clone, "reset", "-q", "--hard", "origin/main")

    shallow_path = clone / ".git" / "shallow"
    shallow_path.write_text(
        "\n".join(line for line in _shallow_lines(clone) if line != broken_tip) + "\n",
        encoding="utf-8",
    )
    assert _run_git(clone, "rev-list", "--all", "--reflog").returncode != 0
    before = shallow_path.read_bytes()

    assert prune_stale_shallow_grafts(clone) == 0
    assert shallow_path.read_bytes() == before
    assert not (clone / ".git" / "shallow.lock").exists()


def test_prune_skips_while_git_holds_shallow_lock(tmp_path):
    """Never race a git process that is updating shallow boundaries."""
    clone = _mk_shallow_scenario(tmp_path)
    _git(clone, "reflog", "expire", "--expire=now", "refs/remotes/origin/main")
    shallow_path = clone / ".git" / "shallow"
    lock_path = clone / ".git" / "shallow.lock"
    before = shallow_path.read_bytes()
    lock_path.write_text("", encoding="utf-8")

    assert prune_stale_shallow_grafts(clone) == 0
    assert shallow_path.read_bytes() == before
    assert lock_path.exists()


def _fetch_head_shas(repo: Path) -> list[str]:
    return [
        line.split()[0]
        for line in (repo / ".git" / "FETCH_HEAD").read_text(encoding="utf-8").splitlines()
        if line.split()
    ]


def test_prune_keeps_fetch_head_ancestor_boundary(tmp_path):
    """FETCH_HEAD is not in --all/--reflog; its ancestor graft must still survive."""
    origin = tmp_path / "origin"
    origin.mkdir()
    _git(origin, "init", "-q", "-b", "main")
    _git(origin, "config", "user.email", "t@example.com")
    _git(origin, "config", "user.name", "t")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "c0")

    clone = tmp_path / "clone"
    subprocess.run(
        ["git", "clone", "-q", "--depth", "1", f"file://{origin}", str(clone)],
        check=True,
        capture_output=True,
        text=True,
    )
    for message in ("c1", "c2", "c3"):
        _git(origin, "commit", "--allow-empty", "-q", "-m", message)
    tip = _git(origin, "rev-parse", "HEAD")
    ancestor = _git(origin, "rev-parse", "HEAD^")
    _git(clone, "fetch", "-q", "--depth", "2", "origin", tip)

    assert ancestor in _shallow_lines(clone)
    assert ancestor not in _git(clone, "rev-list", "--all", "--reflog").splitlines()
    assert _git(clone, "rev-parse", "FETCH_HEAD") == tip

    assert prune_stale_shallow_grafts(clone) == 0
    assert ancestor in _shallow_lines(clone)
    assert _run_git(clone, "rev-list", "FETCH_HEAD").returncode == 0


def test_prune_keeps_every_fetch_head_entry(tmp_path):
    """A multi-ref fetch must keep every FETCH_HEAD tip, not only the first."""
    origin = tmp_path / "origin"
    origin.mkdir()
    _git(origin, "init", "-q", "-b", "main")
    _git(origin, "config", "user.email", "t@example.com")
    _git(origin, "config", "user.name", "t")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "m0")

    clone = tmp_path / "clone"
    subprocess.run(
        ["git", "clone", "-q", "--depth", "1", f"file://{origin}", str(clone)],
        check=True,
        capture_output=True,
        text=True,
    )
    _git(origin, "commit", "--allow-empty", "-q", "-m", "m1")
    main_tip = _git(origin, "rev-parse", "HEAD")
    _git(origin, "checkout", "-q", "-b", "topic")
    _git(origin, "commit", "--allow-empty", "-q", "-m", "t1")
    topic_tip = _git(origin, "rev-parse", "HEAD")
    _git(clone, "fetch", "-q", "--depth", "1", "origin", "main", "topic")
    _git(clone, "update-ref", "-d", "refs/remotes/origin/main")
    _git(clone, "update-ref", "-d", "refs/remotes/origin/topic")
    _git(clone, "reflog", "expire", "--expire=now", "--all")

    fetch_heads = _fetch_head_shas(clone)
    assert main_tip in fetch_heads
    assert topic_tip in fetch_heads
    assert main_tip in _shallow_lines(clone)
    assert topic_tip in _shallow_lines(clone)

    assert prune_stale_shallow_grafts(clone) == 0
    assert main_tip in _shallow_lines(clone)
    assert topic_tip in _shallow_lines(clone)
    assert _run_git(clone, "rev-list", main_tip).returncode == 0
    assert _run_git(clone, "rev-list", topic_tip).returncode == 0


def test_prune_aborts_when_ref_becomes_live_before_publish(tmp_path, monkeypatch):
    """A ref created after validation must stop publication of its boundary."""
    clone = _mk_shallow_scenario(tmp_path)
    head_sha = _git(clone, "rev-parse", "HEAD")
    tip_sha = _git(clone, "rev-parse", "origin/main")
    _git(clone, "reflog", "expire", "--expire=now", "refs/remotes/origin/main")
    orphan = next(sha for sha in _shallow_lines(clone) if sha not in {head_sha, tip_sha})

    def revive_orphan(_repo: Path) -> None:
        _git(clone, "update-ref", "refs/heads/race", orphan)

    monkeypatch.setattr(gitlock_module, "_before_publish_candidate", revive_orphan)
    before = (clone / ".git" / "shallow").read_bytes()

    assert prune_stale_shallow_grafts(clone) == 0
    assert (clone / ".git" / "shallow").read_bytes() == before
    assert orphan in _shallow_lines(clone)
    assert _run_git(clone, "rev-list", "--all", "--reflog").returncode == 0
    assert not (clone / ".git" / "shallow.lock").exists()
