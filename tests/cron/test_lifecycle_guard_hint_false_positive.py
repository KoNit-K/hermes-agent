"""Referenced-script comment/hint false positives (#106723).

A help comment such as ``# hint: Run `hermes gateway restart` from a
separate shell`` is documentation, not an executed command. The referenced-
script walk used to scan raw file text, so those hints hard-blocked every
later invocation of the same path. Comment stripping applies only to
referenced-script bodies; top-level prompt/command scanning stays intact.
"""

from __future__ import annotations

import pytest

from cron.lifecycle_guard import (
    GatewayLifecycleBlocked,
    check_gateway_lifecycle,
    contains_gateway_lifecycle_command,
    contains_gateway_lifecycle_command_or_referenced_script as guard,
)


def test_comment_hint_in_referenced_script_not_blocked(tmp_path):
    script = tmp_path / "papercuts"
    script.write_text(
        "#!/bin/bash\n"
        "# hint: Run `hermes gateway restart` from a separate shell\n"
        "echo ok\n",
        encoding="utf-8",
    )
    script.chmod(0o755)
    assert guard(f"{script} stats", cwd=str(tmp_path)) is False


def test_real_lifecycle_in_referenced_script_still_blocked(tmp_path):
    script = tmp_path / "bad.sh"
    script.write_text("#!/bin/bash\nhermes gateway restart\n", encoding="utf-8")
    assert guard(f"bash {script}", cwd=str(tmp_path)) is True


def test_trailing_comment_hint_on_benign_line_not_blocked(tmp_path):
    script = tmp_path / "help.sh"
    script.write_text(
        "#!/bin/bash\n"
        "echo ok  # recovery: hermes gateway restart\n",
        encoding="utf-8",
    )
    assert guard(f"bash {script}", cwd=str(tmp_path)) is False


def test_comment_does_not_hide_real_lifecycle_on_same_line(tmp_path):
    script = tmp_path / "mixed.sh"
    script.write_text(
        "#!/bin/bash\n"
        "hermes gateway stop  # also documented here\n",
        encoding="utf-8",
    )
    assert guard(f"bash {script}", cwd=str(tmp_path)) is True


def test_hash_in_parameter_expansion_does_not_hide_lifecycle(tmp_path):
    """``${#var}`` / ``$#`` must not be treated as comment starters."""
    script = tmp_path / "len.sh"
    script.write_text(
        "#!/bin/bash\n"
        'echo ${#HOME} $# ; hermes gateway restart\n',
        encoding="utf-8",
    )
    assert guard(f"bash {script}", cwd=str(tmp_path)) is True


def test_top_level_lifecycle_command_still_blocked():
    assert guard("hermes gateway restart") is True
    assert guard("hermes gateway stop") is True
    assert guard("hermes gateway uninstall") is True


def test_cron_prompt_prose_still_blocked():
    """Top-level prompt scanning must keep matching command-shaped prose."""
    assert contains_gateway_lifecycle_command(
        "then run hermes gateway restart"
    ) is True
    with pytest.raises(GatewayLifecycleBlocked):
        check_gateway_lifecycle("then run hermes gateway restart", None)


@pytest.mark.parametrize("invocation", ["bash", "direct"])
@pytest.mark.parametrize(
    "body",
    [
        "echo release\\ #1; hermes gateway restart\n",
        "echo release\\;#1; hermes gateway restart\n",
        "echo release\\\n#1; hermes gateway restart\n",
    ],
    ids=["escaped-space", "escaped-separator", "continued-word"],
)
def test_escaped_word_boundary_does_not_hide_lifecycle(tmp_path, invocation, body):
    script = tmp_path / "restart.sh"
    script.write_text("#!/bin/bash\n" + body, encoding="utf-8")
    script.chmod(0o755)
    command = f"bash {script}" if invocation == "bash" else str(script)
    assert guard(command, cwd=str(tmp_path)) is True


@pytest.mark.parametrize("invocation", ["bash", "direct"])
@pytest.mark.parametrize(
    "body, expected",
    [
        ('echo "#1"; hermes gateway restart\n', True),
        ("echo '#1'; hermes gateway restart\n", True),
        ("echo \\#1; hermes gateway restart\n", True),
        ("echo ${#HOME} $# foo#bar; hermes gateway restart\n", True),
        ("echo \\\n# hint: hermes gateway restart\n", False),
        ("echo ok;\\\n# hint: hermes gateway restart\n", False),
        ('echo ""#1; hermes gateway restart\n', True),
        ("# hint: hermes gateway restart\necho ok\n", False),
    ],
    ids=["double-quote", "single-quote", "escaped-hash", "parameters-and-word",
         "continued-boundary", "continued-separator", "quoted-word", "hint"],
)
def test_referenced_script_hash_boundaries(tmp_path, invocation, body, expected):
    script = tmp_path / "hash.sh"
    script.write_text("#!/bin/bash\n" + body, encoding="utf-8")
    script.chmod(0o755)
    command = f"bash {script}" if invocation == "bash" else str(script)
    assert guard(command, cwd=str(tmp_path)) is expected
