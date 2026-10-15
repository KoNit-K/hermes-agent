"""Regression for #139085: hosted-room startup ignores a stale checkout Windows venv."""

import sys
from pathlib import Path

from gateway import run_startup


def test_hosted_room_worker_removes_legacy_checkout_venv_site_packages(monkeypatch):
    legacy_site_packages = Path(run_startup.__file__).resolve().parents[1] / "venv" / "Lib" / "site-packages"
    inherited_extension = str(legacy_site_packages / "pydantic_core" / "_pydantic_core.pyd")
    active_site_packages = "/runtime/site-packages"
    monkeypatch.setattr(sys, "path", [active_site_packages, inherited_extension])

    run_startup._remove_legacy_checkout_venv_site_packages()

    assert sys.path == [active_site_packages]
