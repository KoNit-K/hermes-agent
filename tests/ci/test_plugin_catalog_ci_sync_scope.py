"""Regression coverage for #138499's upstream-sync scope exception."""

import os

import hermes_yaml as yaml

from tests.ci.test_plugin_catalog_ci_confinement import NEW, WORKFLOW, _commit, _git, _run, _step, _write


def test_labeled_upstream_sync_keeps_changed_entries_for_pinned_validation(tmp_path):
    """The label relaxes only the scope check, not the changed-entry output."""
    workflow = yaml.safe_load(WORKFLOW.read_text(encoding="utf-8"))
    assert workflow["jobs"]["pinned-source-validate"]["env"]["UPSTREAM_SYNC"] == (
        "${{ contains(github.event.pull_request.labels.*.name, 'upstream-sync') }}")

    repo = tmp_path / "pr"
    _write(repo, {"plugin-catalog/old.yaml": "name: old\n"})
    _git(repo, "init", "-qb", "main")
    base = _commit(repo, "base")
    _git(repo, "checkout", "-qb", "pr")
    _write(repo, {**NEW, "scripts/inherited.py": "x = 2\n"})
    _commit(repo, "upstream sync")
    _git(repo, "checkout", "-q", "main")
    _git(repo, "merge", "-q", "--no-ff", "-m", "merge", "pr")
    _git(repo, "checkout", "-q", "--detach")
    _git(repo, "update-ref", "refs/remotes/origin/main", base)
    output = tmp_path / "gh-output.txt"
    output.touch()

    result = _run(_step("Find changed catalog"), tmp_path, repo, {
        **os.environ, "GITHUB_OUTPUT": str(output), "UPSTREAM_SYNC": "true"})

    assert result.returncode == 0, result.stdout + result.stderr
    assert "plugin-catalog/new.yaml" in output.read_text(encoding="utf-8")
