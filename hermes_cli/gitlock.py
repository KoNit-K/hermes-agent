"""Stale git lock-file and aborted-fetch pack-debris recovery for update/check paths.

A killed ``git fetch`` can leave ``.git/shallow.lock`` behind (every later fetch fails with "Unable to
create '.../shallow.lock': File exists") and ``tmp_pack_*`` files git itself never cleans up."""

from __future__ import annotations

import logging
import os
import subprocess
import time
from pathlib import Path
from typing import Callable, Iterable, List, Optional

logger = logging.getLogger(__name__)

# Files younger than this are presumed live (a fetch may be in flight) and are never removed. Lock
# files live for seconds and a healthy fetch completes in minutes; 10 minutes is abandoned.
STALE_LOCK_MIN_AGE_SECONDS = 10 * 60
STALE_TMP_PACK_MIN_AGE_SECONDS = STALE_LOCK_MIN_AGE_SECONDS
# ``shallow.lock`` is the one observed in the wild; the others are the same class of failure
# (interrupted git operation). Locks held by a live git process are protected by the process guard.
LOCK_NAMES = ("shallow.lock", "index.lock", "HEAD.lock", "MERGE_HEAD.lock")
# Temp-file prefixes git writes into .git/objects/pack during a transfer and renames away on
# success; anything left with these names after a fetch died is garbage by definition.
_TMP_PACK_PREFIXES = ("tmp_pack_", "tmp_idx_", "tmp_rev_", "tmp_mtimes_")


def _git_proc_running() -> bool:
    """True when a ``git`` process is running — the check that stops us yanking a lock a live fetch holds.

    A failed probe logs and returns False; the age floor in the sweep still applies.
    """
    try:
        if os.name == "nt":
            proc = subprocess.run(["tasklist", "/FI", "IMAGENAME eq git.exe", "/FO", "CSV"],
                                  capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10)
            return "git.exe" in proc.stdout.lower()
        proc = subprocess.run(["pgrep", "-x", "git"], capture_output=True, text=True, encoding="utf-8", errors="replace",
                              timeout=10)
        return proc.returncode == 0
    except Exception:
        logger.debug("git process probe failed; assuming no git running", exc_info=True)
        return False


def _sweep_stale(directory: Path, candidates: Callable[[], Iterable[Path]], *, min_age_seconds: Optional[int],
                 default_age: int, skip_msg: str, log_removed: Callable[[Path, int], None]) -> List[str]:
    """Shared guard + age-floor sweep. Never raises; skips anything it cannot stat/unlink."""
    if not directory.is_dir():
        return []
    if _git_proc_running():
        logger.debug(skip_msg)
        return []
    cutoff = time.time() - (min_age_seconds if min_age_seconds is not None else default_age)
    removed: List[str] = []
    for entry in candidates():
        try:
            if entry.is_file() and (st := entry.stat()).st_mtime < cutoff:
                entry.unlink()
                removed.append(str(entry))
                log_removed(entry, st.st_size)
        except OSError:
            logger.debug("Could not clear %s (skipping)", entry, exc_info=True)
    return removed


def clear_stale_git_locks(repo_root: Path, *, min_age_seconds: Optional[int] = None) -> List[str]:
    """Remove abandoned ``.git`` lock files under ``repo_root``; returns the removed paths.

    Removes only when older than the age floor AND no git process is running. Never raises: a lock we cannot
    stat/unlink is skipped (it may have been re-created between the age check and the unlink; skipping is safe).
    """
    git_dir = Path(repo_root) / ".git"
    return _sweep_stale(
        git_dir, lambda: [git_dir / name for name in LOCK_NAMES],
        min_age_seconds=min_age_seconds, default_age=STALE_LOCK_MIN_AGE_SECONDS,
        skip_msg="git process running; skipping stale-lock sweep",
        log_removed=lambda p, _size: logger.info("Removed stale git lock %s", p),
    )


def clear_stale_tmp_packs(repo_root: Path, *, min_age_seconds: Optional[int] = None) -> List[str]:
    """Remove aborted-fetch temp pack files under ``.git/objects/pack``; same contract as clear_stale_git_locks."""
    pack_dir = Path(repo_root) / ".git" / "objects" / "pack"

    def _candidates():
        try:
            return [e for e in pack_dir.iterdir() if e.name.startswith(_TMP_PACK_PREFIXES)]
        except OSError:
            return []

    return _sweep_stale(
        pack_dir, _candidates,
        min_age_seconds=min_age_seconds, default_age=STALE_TMP_PACK_MIN_AGE_SECONDS,
        skip_msg="git process running; skipping tmp-pack sweep",
        log_removed=lambda p, size: logger.info("Removed aborted-fetch pack debris %s (%d bytes)", p, size),
    )


# ---- BEGIN PLUGIN-COMPAT (revert-scheduled; see COMPAT_MANIFEST.md) ----
# Names external plugins imported from this module before the Sep 2026 decomposition.
# Internal code MUST NOT use these (scripts/check_compat_pointers.py fails CI if it does).
# The whole block is removed by reverting the commit that added it.

def is_ancestor_of_head(repo_root: Path, rev: str) -> bool:
    """True when ``rev`` is an ancestor of (or equal to) HEAD.

    Wraps ``git merge-base --is-ancestor <rev> HEAD``. This is the correct
    question for update checks: a local cherry-pick on top of the remote tip
    makes HEAD *different* from ``origin/main`` but still *contains* it, so
    the answer to "is there an update?" is no.

    Returns False on any probe failure (missing rev, shallow boundary, git
    error) — callers treat that as "can't prove contained", which is the
    conservative direction for an update check.
    """
    try:
        result = subprocess.run(
            ["git", "merge-base", "--is-ancestor", rev, "HEAD"],
            cwd=str(repo_root),
            capture_output=True, text=True, timeout=10,
        )
        return result.returncode == 0
    except Exception:
        logger.debug("merge-base --is-ancestor probe failed for %s", rev, exc_info=True)
        return False
# ---- END PLUGIN-COMPAT ----


def _git_stdout_lines(
    repo_root: Path, args: List[str], *, env: Optional[dict] = None
) -> List[str]:
    """Run a read-only git query in ``repo_root``; [] on any failure."""
    try:
        result = subprocess.run(
            ["git", *args], cwd=str(repo_root),
            capture_output=True, text=True, timeout=10, env=env,
        )
        if result.returncode != 0:
            return []
        return [line.strip() for line in result.stdout.splitlines() if line.strip()]
    except Exception:
        logger.debug("git query failed: %s", args, exc_info=True)
        return []


def _before_publish_candidate(repo_root: Path) -> None:
    """Test seam after candidate validation and before the publish guard."""


def _before_replace_shallow(repo_root: Path) -> None:
    """Test seam after the last pre-publish scan and before ``os.replace``."""


def _after_publish_reachability(repo_root: Path) -> None:
    """Test seam after the first post-replace scan; the committed write follows."""


# Worktree-local files that ``rev-list --all --reflog`` does not walk. Linked
# worktrees share ``.git/shallow`` but keep their own copies under the common
# Git directory (``.git/worktrees/<id>/``).
_EXTRA_REACHABILITY_FILES = ("FETCH_HEAD", "ORIG_HEAD")


def _resolve_git_path(repo_root: Path, spec: str, query_env: dict) -> Optional[Path]:
    """Absolute path for a ``rev-parse`` location. ``None`` if Git cannot name it."""
    rel = _git_stdout_lines(repo_root, ["rev-parse", "--git-path", spec], env=query_env)
    if not rel:
        return None
    path = Path(rel[0])
    if not path.is_absolute():
        path = Path(repo_root) / path
    return path


def _common_git_dir(repo_root: Path, query_env: dict) -> Optional[Path]:
    """Shared Git directory that owns ``shallow`` and every worktree git dir."""
    rel = _git_stdout_lines(repo_root, ["rev-parse", "--git-common-dir"], env=query_env)
    if not rel:
        return None
    path = Path(rel[0])
    if not path.is_absolute():
        path = Path(repo_root) / path
    try:
        path = path.resolve()
    except OSError:
        return None
    return path if path.is_dir() else None


def _worktree_git_dirs(common_dir: Path) -> Optional[List[Path]]:
    """The common dir plus each linked worktree's git dir. ``None`` on list failure."""
    dirs = [common_dir]
    worktrees = common_dir / "worktrees"
    if not worktrees.exists():
        return dirs
    if not worktrees.is_dir():
        return None
    try:
        extras = sorted(path for path in worktrees.iterdir() if path.is_dir())
    except OSError:
        return None
    dirs.extend(extras)
    return dirs


def _tip_tokens_from_file(path: Path) -> Optional[List[str]]:
    """Object tokens from a Git tip file. ``None`` if the file exists but is unreadable."""
    if not path.is_file():
        return []
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError:
        return None
    return [line.split()[0] for line in raw.splitlines() if line.split()]


def _extra_reachability_tips(repo_root: Path, query_env: dict) -> Optional[List[str]]:
    """Every FETCH_HEAD and ORIG_HEAD tip across this repo's worktrees.

    ``rev-parse FETCH_HEAD`` / ``ORIG_HEAD`` only see the current worktree, and
    ``rev-list --all --reflog`` skips both. ``None`` means a path or object
    could not be established, so callers fail open. ``[]`` means none exist.
    """
    current_fetch = _resolve_git_path(repo_root, "FETCH_HEAD", query_env)
    if current_fetch is None:
        return None
    common_dir = _common_git_dir(repo_root, query_env)
    if common_dir is None:
        return None
    git_dirs = _worktree_git_dirs(common_dir)
    if git_dirs is None:
        return None

    paths = [current_fetch]
    current_orig = _resolve_git_path(repo_root, "ORIG_HEAD", query_env)
    if current_orig is not None:
        paths.append(current_orig)
    for git_dir in git_dirs:
        paths.extend(git_dir / name for name in _EXTRA_REACHABILITY_FILES)

    tokens: List[str] = []
    seen: set[str] = set()
    for path in paths:
        try:
            key = str(path.resolve())
        except OSError:
            return None
        if key in seen:
            continue
        seen.add(key)
        tips = _tip_tokens_from_file(path)
        if tips is None:
            return None
        tokens.extend(tips)
    if not tokens:
        return []
    try:
        result = subprocess.run(
            ["git", "rev-list", "--no-walk", "--stdin"],
            input="\n".join(tokens) + "\n",
            cwd=str(repo_root),
            capture_output=True, text=True, encoding="utf-8", timeout=10,
            env=query_env,
        )
    except Exception:
        logger.debug("extra reachability resolve failed for %s", repo_root, exc_info=True)
        return None
    if result.returncode != 0:
        return None
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def _rev_list_roots(repo_root: Path, query_env: dict) -> Optional[List[str]]:
    """Traversal roots: refs, reflogs, every worktree FETCH_HEAD, and ORIG_HEAD."""
    tips = _extra_reachability_tips(repo_root, query_env)
    if tips is None:
        return None
    return ["--all", "--reflog", *tips]


def _reachable_grafts(
    repo_root: Path,
    lines: List[str],
    query_env: dict,
    *,
    env: Optional[dict] = None,
) -> Optional[set]:
    roots = _rev_list_roots(repo_root, query_env)
    if roots is None:
        return None
    reachable = _git_stdout_lines(
        repo_root,
        ["rev-list", *roots],
        env=env or query_env,
    )
    if not reachable:
        return None
    return set(lines) & set(reachable)


def _restore_shallow_union(
    shallow_path: Path, original: str, lock_path: Path, mode: int
) -> bool:
    """Restore every original graft, keeping any lines added after publish."""
    try:
        current = shallow_path.read_text(encoding="utf-8")
    except OSError:
        current = ""
    original_lines = {line for line in original.splitlines() if line}
    current_lines = {line for line in current.splitlines() if line}
    text = (
        original
        if current_lines <= original_lines
        else "\n".join(sorted(original_lines | current_lines)) + "\n"
    )
    try:
        lock_fd = os.open(lock_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, mode)
    except FileExistsError:
        logger.debug("shallow restore skipped; git holds %s", lock_path)
        return False
    try:
        handle = os.fdopen(lock_fd, "w", encoding="utf-8")
        with handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(lock_path, mode)
        os.replace(lock_path, shallow_path)
        return True
    except Exception:
        logger.debug("shallow restore failed for %s", shallow_path, exc_info=True)
        try:
            lock_path.unlink()
        except OSError:
            pass
        return False


def prune_stale_shallow_grafts(repo_root: Path) -> int:
    """Drop ``.git/shallow`` graft lines no live ref, reflog, or recovery tip reaches (#105951).

    Every ``git fetch --depth 1`` appends the fetched tip to ``.git/shallow`` as a new
    graft and never removes the previous one, so a long-lived shallow installer checkout
    accumulates one graft per update check (57 observed in the wild). The stale grafts
    break ``merge-base`` and push ``hermes update`` into the orphan-divergence reset path
    on every run. Keep boundaries that protect commits reachable from refs, reflogs,
    any worktree ``FETCH_HEAD``, or ``ORIG_HEAD``. Dropping a graft for a still-reachable
    commit exposes its unfetched parent and breaks git maintenance. The dropped commits are genuinely
    unreachable and their objects are left for ``git gc``. Returns the number of graft
    lines removed; never raises, and validates the candidate through Git's lockfile
    before replacing the original.
    """
    try:
        query_env = os.environ.copy()
        query_env.pop("GIT_SHALLOW_FILE", None)
        shallow_rel = _git_stdout_lines(
            repo_root, ["rev-parse", "--git-path", "shallow"], env=query_env
        )
        if not shallow_rel:
            return 0
        shallow_path = Path(shallow_rel[0])
        if not shallow_path.is_absolute():
            shallow_path = Path(repo_root) / shallow_path
        if not shallow_path.is_file():
            return 0
        original = shallow_path.read_text(encoding="utf-8")
        lines = [line for line in original.splitlines() if line]
        if not lines:
            return 0
        keep = _reachable_grafts(repo_root, lines, query_env)
        if keep is None:
            # A failed reachability probe is indistinguishable from an empty result here.
            # This repository has shallow commits, so either way retaining them is safe.
            return 0
        if not keep or len(keep) == len(lines):
            return 0

        lock_path = shallow_path.with_name(shallow_path.name + ".lock")
        mode = shallow_path.stat().st_mode & 0o777
        try:
            lock_fd = os.open(lock_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, mode)
        except FileExistsError:
            # Git owns this lock while changing shallow boundaries. Skipping prevents
            # our read-modify-write from discarding a boundary added by a concurrent fetch.
            return 0
        lock_owned = True
        open_fd: Optional[int] = lock_fd
        try:
            # Reachability was computed without holding Git's lock. If another process
            # updated the file before we acquired it, discard this stale proposal.
            if shallow_path.read_text(encoding="utf-8") != original:
                return 0

            handle = os.fdopen(lock_fd, "w", encoding="utf-8")
            open_fd = None
            with handle:
                handle.write("\n".join(sorted(keep)) + "\n")
                handle.flush()
                os.fsync(handle.fileno())
            os.chmod(lock_path, mode)

            # Validate against the candidate shallow file before publishing it. The
            # original remains untouched if the proposed trim breaks any reachable walk.
            candidate_env = query_env.copy()
            candidate_env["GIT_SHALLOW_FILE"] = str(lock_path)
            roots = _rev_list_roots(repo_root, query_env)
            if roots is None:
                return 0
            still_walks = _git_stdout_lines(
                repo_root,
                ["rev-list", "--count", *roots],
                env=candidate_env,
            )
            if not still_walks:
                logger.debug("shallow prune self-check failed; original retained")
                return 0

            # Refs and reflogs can move while we hold only shallow.lock. Recheck
            # reachability immediately before publish so a newly live boundary is kept.
            _before_publish_candidate(repo_root)
            fresh = _reachable_grafts(repo_root, lines, query_env)
            if fresh is None or (fresh - keep):
                logger.debug("shallow prune aborted; reachability changed before publish")
                return 0

            # shallow.lock does not serialize update-ref, so replace is only
            # tentative. A scan after replace cannot bless the shrink: a ref
            # can appear after that scan. The committed write restores the
            # original union whenever any post-replace scan sees a dropped
            # graft, including one created after the first post scan.
            _before_replace_shallow(repo_root)
            os.replace(lock_path, shallow_path)
            lock_owned = False
            post = _reachable_grafts(repo_root, lines, query_env)
            _after_publish_reachability(repo_root)
            late = _reachable_grafts(repo_root, lines, query_env)
            if post is None or late is None or (late - keep) or (post - keep):
                logger.debug("shallow prune restored; reachability changed during publish")
                _restore_shallow_union(shallow_path, original, lock_path, mode)
                return 0
            logger.info("Pruned %d stale shallow graft(s) in %s", len(lines) - len(keep), repo_root)
            return len(lines) - len(keep)
        finally:
            if open_fd is not None:
                try:
                    os.close(open_fd)
                except OSError:
                    pass
            if lock_owned:
                try:
                    lock_path.unlink()
                except OSError:
                    logger.warning("Could not remove shallow prune lock %s", lock_path, exc_info=True)
    except Exception:
        logger.debug("shallow graft prune failed for %s", repo_root, exc_info=True)
        return 0
