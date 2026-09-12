"""The current-checkout repair path must rebuild the Desktop app (#97343).

A Windows git install runs `hermes update` from `hermes.exe`, which reexecs a
venv-Python child to finish the dependency sync. That child completes through
``_repair_node_deps_on_current_checkout`` / the hand-off repair branch, never
through the commits-pulled path that owns the Desktop rebuild — so a
successful-looking update left the packaged desktop app on the previous build.
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from hermes_cli import update_cmd


def test_current_checkout_repair_rebuilds_desktop_under_project_root():
    """The repair passes PROJECT_ROOT/apps/desktop and the pre-update flag."""
    completion = MagicMock(return_value=True)
    with (
        patch.object(update_cmd, "_update_node_dependencies", return_value=[]),
        patch.object(update_cmd, "_m") as m,
        patch.object(update_cmd, "_check_and_apply_config_migration"),
        patch.object(
            update_cmd, "_rebuild_desktop_after_update", return_value=True
        ) as rebuild,
    ):
        m.return_value.PROJECT_ROOT = update_cmd.Path("/fake/hermes")
        complete = update_cmd._repair_node_deps_on_current_checkout(
            completion, had_desktop_app_before_update=True
        )

    assert complete is True
    rebuild.assert_called_once()
    assert rebuild.call_args[0][0] == update_cmd.Path("/fake/hermes/apps/desktop")
    assert rebuild.call_args[1]["had_desktop_app_before_update"] is True
    completion.assert_called_once_with("✓ Already up to date!")


def test_failed_desktop_rebuild_withholds_success_completion():
    """A failed rebuild must not report success and must return False."""
    completion = MagicMock(return_value=True)
    with (
        patch.object(update_cmd, "_update_node_dependencies", return_value=[]),
        patch.object(update_cmd, "_m") as m,
        patch.object(update_cmd, "_check_and_apply_config_migration"),
        patch.object(update_cmd, "_rebuild_desktop_after_update", return_value=False),
    ):
        m.return_value.PROJECT_ROOT = update_cmd.Path("/fake/hermes")
        complete = update_cmd._repair_node_deps_on_current_checkout(completion)

    assert complete is False
    for call in completion.call_args_list:
        assert not call[0][0].startswith("✓")


def test_handoff_python_repair_delegates_completion_to_node_repair():
    with (
        patch.dict("os.environ", {"HERMES_UPDATE_REEXEC": "1"}),
        patch("hermes_cli.managed_uv.ensure_uv", return_value=None),
        patch.object(
            update_cmd,
            "_pip_install_prefix",
            return_value=(["python", "-m", "pip"], None),
        ),
        patch.object(update_cmd, "_venv_core_imports_healthy", return_value=(True, "")),
        patch.object(update_cmd, "_m") as m,
        patch.object(
            update_cmd, "_repair_node_deps_on_current_checkout", return_value=True
        ) as repair_node,
    ):
        m.return_value.PROJECT_ROOT = update_cmd.Path("/fake/hermes")
        m.return_value._UPDATE_REEXEC_ENV = "HERMES_UPDATE_REEXEC"
        complete = update_cmd._repair_venv_on_current_checkout(
            assume_yes=True,
            gateway_mode=False,
            pre_update_snapshot_id="snapshot-1",
            desktop_dir=update_cmd.Path("/fake/hermes/apps/desktop"),
            had_desktop_app_before_update=True,
            active_lazy_features=[],
            active_tool_dependencies=[],
            _windows_gateway_resume=None,
        )

    assert complete is True
    repair_node.assert_called_once_with(
        update_cmd._print_verified_update_completion,
        assume_yes=True,
        gateway_mode=False,
        pre_update_snapshot_id="snapshot-1",
        completion_message="✓ Update complete!",
        had_desktop_app_before_update=True,
    )


def test_node_failure_withholds_success_and_skips_web():
    completion = MagicMock(return_value=True)
    with (
        patch.object(
            update_cmd,
            "_update_node_dependencies",
            return_value=["ui-tui, web workspaces"],
        ),
        patch.object(update_cmd, "_m") as m,
    ):
        complete = update_cmd._repair_node_deps_on_current_checkout(completion)

    assert complete is False
    m.return_value._build_web_ui.assert_not_called()
    completion.assert_called_once_with(
        "⚠ Checkout is current, but Node.js dependencies could not be repaired."
    )
    assert not completion.call_args.args[0].startswith("✓")
