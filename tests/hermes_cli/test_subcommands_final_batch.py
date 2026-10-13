"""Smoke tests for the final batch of subcommand builders extracted from main().

These groups either imported their handler from a sibling module inside the
parser block (moa, fallback, migrate, bundles, checkpoints, curator, pets,
journey, secrets, egress) or carried a closure handler that only closed over
its own parser (worktree, browser, computer-use, sessions, completion). The
closures moved verbatim into the builder; sessions/completion take the handler
by injection.
"""

from __future__ import annotations

import argparse


from hermes_cli.subcommands.computer_use import build_computer_use_parser
from hermes_cli.subcommands.moa import build_moa_parser
from hermes_cli.subcommands.worktree import build_worktree_parser


def _tree():
    parser = argparse.ArgumentParser(prog="hermes")
    return parser, parser.add_subparsers(dest="command")






def test_worktree_aliases_normalize_to_list(monkeypatch):
    parser, sub = _tree()
    build_worktree_parser(sub)
    seen = {}
    monkeypatch.setattr("hermes_cli.worktree_cmd.cmd_worktree", lambda a: seen.setdefault("action", a.worktree_action))
    ns = parser.parse_args(["worktree", "audit"])
    ns.func(ns)
    assert seen["action"] == "list"








def test_computer_use_no_action_prints_help(capsys):
    parser, sub = _tree()
    build_computer_use_parser(sub)
    ns = parser.parse_args(["computer-use"])
    ns.func(ns)
    assert "install" in capsys.readouterr().out


def test_moa_rm_alias_dispatches_to_delete(monkeypatch):
    """The advertised ``rm`` spelling must reach the delete handler (#137579)."""
    from hermes_cli import moa_cmd

    parser, sub = _tree()
    build_moa_parser(sub)
    config = {
        "moa": {
            "default_preset": "default",
            "presets": {
                "default": {"reference_models": [], "aggregator": {}},
                "review": {"reference_models": [], "aggregator": {}},
            },
        }
    }
    monkeypatch.setattr(moa_cmd, "load_config", lambda: config)
    monkeypatch.setattr(moa_cmd, "save_config", lambda saved: None)

    ns = parser.parse_args(["moa", "rm", "review"])
    ns.func(ns)

    assert "review" not in config["moa"]["presets"]
