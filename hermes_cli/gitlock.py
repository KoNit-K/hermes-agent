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
    """Test seam after publication, before the post-publish object-presence check."""


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
    existing: List[str] = []
    for token in tokens:
        exists = _object_exists(repo_root, token, query_env)
        if exists is None:
            return None
        if exists:
            existing.append(token)
    if not existing:
        return []
    try:
        result = subprocess.run(
            ["git", "rev-list", "--no-walk", "--stdin"],
            input="\n".join(existing) + "\n",
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


_KEEP_REF_PREFIX = "refs/hermes-agent/shallow-keep/"


def _shallow_union_text(original: str, current: str) -> str:
    """Original grafts plus any lines added after publish."""
    original_lines = {line for line in original.splitlines() if line}
    current_lines = {line for line in current.splitlines() if line}
    if current_lines <= original_lines:
        return original
    return "\n".join(sorted(original_lines | current_lines)) + "\n"


def _object_exists(repo_root: Path, sha: str, query_env: dict) -> Optional[bool]:
    """Whether ``sha`` is in the object DB. ``None`` if Git cannot be asked."""
    try:
        result = subprocess.run(
            ["git", "cat-file", "-e", sha],
            cwd=str(repo_root),
            capture_output=True, timeout=10, env=query_env,
        )
        return result.returncode == 0
    except Exception:
        logger.debug("cat-file -e failed for %s", sha, exc_info=True)
        return None


def _present_original_grafts(
    repo_root: Path, lines: List[str], query_env: dict
) -> Optional[set]:
    """Original shallow lines whose objects still exist. ``None`` on probe failure."""
    present: set = set()
    for sha in lines:
        exists = _object_exists(repo_root, sha, query_env)
        if exists is None:
            return None
        if exists:
            present.add(sha)
    return present


def _unpin_keep_refs(repo_root: Path, refs: List[str], query_env: dict) -> None:
    for ref in refs:
        try:
            subprocess.run(
                ["git", "update-ref", "-d", ref],
                cwd=str(repo_root),
                capture_output=True, timeout=10, env=query_env,
            )
        except Exception:
            logger.debug("unpin %s failed", ref, exc_info=True)


def _pin_keep_refs(
    repo_root: Path, shas: Iterable[str], query_env: dict
) -> Optional[List[str]]:
    """Temporary refs so ``git gc`` cannot drop still-needed grafts."""
    stale = _git_stdout_lines(
        repo_root,
        ["for-each-ref", "--format=%(refname)", _KEEP_REF_PREFIX],
        env=query_env,
    )
    _unpin_keep_refs(repo_root, stale, query_env)
    created: List[str] = []
    for sha in shas:
        ref = f"{_KEEP_REF_PREFIX}{sha}"
        try:
            result = subprocess.run(
                ["git", "update-ref", ref, sha],
                cwd=str(repo_root),
                capture_output=True, timeout=10, env=query_env,
            )
        except Exception:
            logger.debug("pin %s failed", sha, exc_info=True)
            _unpin_keep_refs(repo_root, created, query_env)
            return None
        if result.returncode != 0:
            _unpin_keep_refs(repo_root, created, query_env)
            return None
        created.append(ref)
    return created


def _gc_unreachable(repo_root: Path, query_env: dict) -> bool:
    """Delete unreachable objects. ``False`` if gc cannot run."""
    try:
        result = subprocess.run(
            ["git", "gc", "--prune=now", "-q"],
            cwd=str(repo_root),
            capture_output=True, timeout=120, env=query_env,
        )
        return result.returncode == 0
    except Exception:
        logger.debug("gc --prune=now failed for %s", repo_root, exc_info=True)
        return False


def _force_write_shallow(shallow_path: Path, text: str, mode: int) -> bool:
    """Replace ``shallow`` without ``shallow.lock`` after a contended rollback."""
    tmp_path = shallow_path.with_name(shallow_path.name + ".hermes-restore")
    try:
        tmp_path.write_text(text, encoding="utf-8")
        os.chmod(tmp_path, mode)
        os.replace(tmp_path, shallow_path)
        return True
    except Exception:
        logger.debug("forced shallow write failed for %s", shallow_path, exc_info=True)
        try:
            tmp_path.unlink()
        except OSError:
            pass
        return False


def _restore_shallow_union(
    shallow_path: Path, original: str, lock_path: Path, mode: int
) -> bool:
    """Restore every original graft, keeping any lines added after publish."""
    try:
        current = shallow_path.read_text(encoding="utf-8")
    except OSError:
        current = ""
    text = _shallow_union_text(original, current)
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


def _restore_shallow_complete(
    shallow_path: Path, original: str, lock_path: Path, mode: int
) -> bool:
    """Restore the original union even when another writer holds ``shallow.lock``."""
    if _restore_shallow_union(shallow_path, original, lock_path, mode):
        return True
    try:
        current = shallow_path.read_text(encoding="utf-8")
    except OSError:
        current = ""
    return _force_write_shallow(shallow_path, _shallow_union_text(original, current), mode)


def prune_stale_shallow_grafts(repo_root: Path) -> int:
    """Drop ``.git/shallow`` graft lines no live ref, reflog, or recovery tip reaches (#105951).

    Every ``git fetch --depth 1`` appends the fetched tip to ``.git/shallow`` as a new
    graft and never removes the previous one, so a long-lived shallow installer checkout
    accumulates one graft per update check (57 observed in the wild). The stale grafts
    break ``merge-base`` and push ``hermes update`` into the orphan-divergence reset path
    on every run. Keep boundaries that protect commits reachable from refs, reflogs,
    any worktree ``FETCH_HEAD``, or ``ORIG_HEAD``. Dropping a graft for a still-reachable
    commit exposes its unfetched parent and breaks git maintenance. Dropped commits are
    deleted with ``git gc --prune=now`` before their graft lines are removed, so a later
    ``update-ref`` cannot revive a missing parent. Returns the number of graft
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

            _before_replace_shallow(repo_root)
            fresh = _reachable_grafts(repo_root, lines, query_env)
            if fresh is None or (fresh - keep):
                logger.debug("shallow prune aborted; reachability changed before publish")
                return 0

            # git gc needs shallow.lock. Drop ours first; the original file is
            # still live. Pin keep so FETCH_HEAD / ORIG_HEAD objects survive.
            try:
                lock_path.unlink()
            except OSError:
                return 0
            lock_owned = False
            tips = _extra_reachability_tips(repo_root, query_env)
            if tips is None:
                return 0
            pinned = _pin_keep_refs(repo_root, set(keep) | set(tips), query_env)
            if pinned is None:
                return 0
            try:
                if not _gc_unreachable(repo_root, query_env):
                    return 0
            finally:
                _unpin_keep_refs(repo_root, pinned, query_env)

            present = _present_original_grafts(repo_root, lines, query_env)
            if present is None or not present or present == set(lines):
                return 0

            # ``git gc --prune=now`` often rewrites shallow itself once the
            # dropped objects are gone. That rewrite is the publication.
            on_disk = {
                line
                for line in shallow_path.read_text(encoding="utf-8").splitlines()
                if line
            }
            if on_disk != present:
                present_text = "\n".join(sorted(present)) + "\n"
                try:
                    lock_fd = os.open(lock_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, mode)
                except FileExistsError:
                    if not _force_write_shallow(shallow_path, present_text, mode):
                        return 0
                else:
                    lock_owned = True
                    open_fd = lock_fd
                    handle = os.fdopen(lock_fd, "w", encoding="utf-8")
                    open_fd = None
                    with handle:
                        handle.write(present_text)
                        handle.flush()
                        os.fsync(handle.fileno())
                    os.chmod(lock_path, mode)
                    candidate_env["GIT_SHALLOW_FILE"] = str(lock_path)
                    still_walks = _git_stdout_lines(
                        repo_root,
                        ["rev-list", "--count", *roots],
                        env=candidate_env,
                    )
                    if not still_walks:
                        logger.debug("shallow prune self-check failed; original retained")
                        return 0
                    os.replace(lock_path, shallow_path)
                    lock_owned = False

            # Dropped objects are gone, so a later update-ref cannot revive a
            # removed boundary. A failed probe still force-restores the original
            # union even when another writer holds shallow.lock.
            _after_publish_reachability(repo_root)
            present = _present_original_grafts(repo_root, lines, query_env)
            live = _reachable_grafts(repo_root, lines, query_env)
            published = {
                line
                for line in shallow_path.read_text(encoding="utf-8").splitlines()
                if line
            }
            if present is None or live is None or (live - published) or (present - published):
                logger.debug("shallow prune restored; reachability changed during publish")
                for _ in range(3):
                    if _restore_shallow_complete(shallow_path, original, lock_path, mode):
                        break
                else:
                    logger.debug("shallow prune rollback incomplete for %s", shallow_path)
                return 0
            logger.info("Pruned %d stale shallow graft(s) in %s", len(lines) - len(present), repo_root)
            return len(lines) - len(present)
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
