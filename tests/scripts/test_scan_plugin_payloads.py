"""Unit tests for the catalog payload scanner (README rule 17, #137095)."""
from __future__ import annotations

import importlib.util
import io
import subprocess
import tarfile
import zipfile
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "scan_plugin_payloads.py"
SPEC = importlib.util.spec_from_file_location("scan_plugin_payloads", SCRIPT)
assert SPEC and SPEC.loader
scanner = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(scanner)


def _scan(tree: Path, monkeypatch, tracked: list[str] | None = None) -> list[str]:
    if tracked is None:
        tracked = [path.relative_to(tree).as_posix() for path in tree.rglob("*")
                   if path.is_file() and "__pycache__" not in path.parts]
    output = "\0".join(tracked).encode() + (b"\0" if tracked else b"")
    monkeypatch.setattr(
        scanner, "subprocess",
        SimpleNamespace(run=lambda args, **_kwargs: subprocess.CompletedProcess(args, 0, output, b"")),
    )
    return scanner.scan(tree)


def test_scan_uses_pinned_git_content_not_runner_generated_bytecode(tmp_path, monkeypatch):
    (tmp_path / "plugin.py").write_text("VALUE = 1\n", encoding="utf-8")
    cache = tmp_path / "__pycache__"
    cache.mkdir()
    (cache / "plugin.cpython-314.pyc").write_bytes(b"runner bytecode")

    assert _scan(tmp_path, monkeypatch, ["plugin.py"]) == []

    committed = tmp_path / "committed.pyc"
    committed.write_bytes(b"committed bytecode")
    assert _scan(tmp_path, monkeypatch, ["plugin.py", "committed.pyc"]) == [
        "committed.pyc: committed Python bytecode (ships instead of readable source)"
    ]


def test_plain_source_tree_is_clean(tmp_path, monkeypatch):
    (tmp_path / "__init__.py").write_text("x = 1\n", encoding="utf-8")
    (tmp_path / "README.md").write_text("# hi\n", encoding="utf-8")
    (tmp_path / "data.json").write_text("{}\n", encoding="utf-8")
    assert _scan(tmp_path, monkeypatch) == []


@pytest.mark.parametrize("name,head", [
    ("evil.exe", b"MZ\x90\x00"), ("renamed.js", b"MZ\x90\x00"),
    ("lib.so", b"\x7fELF\x02\x01\x01"), ("odd.dat", b"\x7fELF"),
    ("mod.wasm", b"\x00asm\x01\x00"), ("bin.dylib", b"\xcf\xfa\xed\xfe"),
])
def test_compiled_binary_is_flagged_by_header(tmp_path, monkeypatch, name, head):
    (tmp_path / name).write_bytes(head + b"\x00" * 32)
    findings = _scan(tmp_path, monkeypatch)
    assert any(name in finding and "compiled binary" in finding for finding in findings), findings


@pytest.mark.parametrize("name", ["cached.pyc", "sub/thing.pyo"])
def test_committed_bytecode_is_flagged(tmp_path, monkeypatch, name):
    path = tmp_path / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"\x00" * 16)
    findings = _scan(tmp_path, monkeypatch)
    assert any(name in finding and "bytecode" in finding for finding in findings), findings


def test_source_tarball_is_clean(tmp_path, monkeypatch):
    archive = tmp_path / "bundle.tar.gz"
    with tarfile.open(archive, "w:gz") as tar:
        for name, body in [("a.py", b"x=1\n"), ("docs/readme.md", b"# hi\n"),
                           ("Dockerfile", b"FROM scratch\n"), ("font.ttf", b"\x00\x01font")]:
            member = tarfile.TarInfo(name)
            member.size = len(body)
            tar.addfile(member, io.BytesIO(body))
    assert _scan(tmp_path, monkeypatch) == []


def test_tarball_hiding_a_binary_fails(tmp_path, monkeypatch):
    archive = tmp_path / "bundle.tar.gz"
    with tarfile.open(archive, "w:gz") as tar:
        body = b"\x7fELF" + b"\x00" * 40
        member = tarfile.TarInfo("mod.py")
        member.size = len(body)
        tar.addfile(member, io.BytesIO(body))
    assert any("compiled binary" in finding for finding in _scan(tmp_path, monkeypatch))


def test_tarball_with_unknown_blob_member_fails(tmp_path, monkeypatch):
    archive = tmp_path / "bundle.tgz"
    with tarfile.open(archive, "w:gz") as tar:
        body = b"\x00\x01\x02opaque"
        member = tarfile.TarInfo("payload.bin")
        member.size = len(body)
        tar.addfile(member, io.BytesIO(body))
    assert any("not reviewable source" in finding for finding in _scan(tmp_path, monkeypatch))


def test_zip_hiding_a_binary_fails(tmp_path, monkeypatch):
    with zipfile.ZipFile(tmp_path / "bundle.zip", "w") as archive:
        archive.writestr("inner.exe", b"MZ\x90\x00")
    assert any("not reviewable source" in finding for finding in _scan(tmp_path, monkeypatch))
