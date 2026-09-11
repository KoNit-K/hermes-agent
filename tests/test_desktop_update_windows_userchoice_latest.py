"""Windows 11 25H2 writes the default browser to UserChoiceLatest, not UserChoice.

`Get-DefaultBrowserExe` in ``scripts/desktop-update/windows.ps1`` used to read
only the legacy ``UrlAssociations\\<scheme>\\UserChoice\\ProgId``. On Windows 11
25H2 / build 26200, Settings writes the real choice to ``UserChoiceLatest``
and no longer mirrors it into ``UserChoice``. A stale ``MSEdgeHTM`` UserChoice
then makes the updater miss Chrome, skip the HTML shim, and degrade to a blank
WinForms ghost window (#108051).

This test is source-level because Linux/macOS CI cannot execute the PowerShell
hand-off. It guards the ProgId SOURCE order (Latest → ASSOCSTR_PROGID →
legacy UserChoice), the existence-gated fallthrough for a missing Chromium
exe, and the forbidden naive heuristics that return stale Edge on the
reporter's machine.
"""

from __future__ import annotations

import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
WINDOWS_PS1 = REPO_ROOT / "scripts" / "desktop-update" / "windows.ps1"


def _read() -> str:
    # windows.ps1 is eol=crlf in .gitattributes; normalize so function-body
    # anchors match regardless of the working-copy line endings.
    return WINDOWS_PS1.read_text(encoding="utf-8").replace("\r\n", "\n")


def _extract_function(source: str, name: str) -> str:
    match = re.search(
        rf"function {re.escape(name)}[^{{]*\{{(?P<body>.*?)\n\}}\n",
        source,
        re.DOTALL,
    )
    assert match, f"Expected function {name} in scripts/desktop-update/windows.ps1"
    return match.group(0)


def _browser_detection_scope() -> str:
    """Get-DefaultBrowserExe plus same-file helpers it may call."""
    source = _read()
    parts = [_extract_function(source, "Get-DefaultBrowserExe")]
    for name in (
        "Get-AssocQueryStringProgId",
        "Get-SchemeProgIds",
        "Resolve-BrowserExeFromProgId",
    ):
        try:
            parts.append(_extract_function(source, name))
        except AssertionError:
            continue
    return "\n".join(parts)


def test_get_default_browser_exe_prefers_userchoice_latest_then_assoc_progid() -> None:
    scope = _browser_detection_scope()
    source = _read()

    latest_idx = scope.find("\\UserChoiceLatest")
    assert latest_idx != -1, (
        "Get-DefaultBrowserExe must look up UrlAssociations\\<scheme>\\UserChoiceLatest "
        "before the legacy UserChoice key. Windows 11 25H2 Settings writes the default "
        "browser there and no longer mirrors it into UserChoice (#108051)."
    )

    # Do not use a naive find("UserChoice") -- that also matches UserChoiceLatest.
    legacy_candidates = [
        idx
        for needle in ('\\UserChoice"', "\\UserChoice\\", "\\UserChoice'")
        if (idx := scope.find(needle, latest_idx + len("\\UserChoiceLatest"))) != -1
    ]
    assert legacy_candidates, (
        "Get-DefaultBrowserExe must keep the legacy UrlAssociations\\<scheme>\\UserChoice "
        "fallback after UserChoiceLatest (Win10 / older 11 still write it)."
    )
    assert min(legacy_candidates) > latest_idx, (
        "UserChoiceLatest must be consulted as a ProgId source before legacy UserChoice."
    )

    assoc_scope = scope + "\n" + source
    has_assoc_progid = (
        "ASSOCSTR_PROGID" in assoc_scope
        or re.search(r"AssocQueryString\w*\s*\([^)]*PROGID", assoc_scope, re.I)
        or ("AssocQueryString" in assoc_scope and "ProgId" in assoc_scope)
    )
    assert has_assoc_progid, (
        "Get-DefaultBrowserExe (or a helper in windows.ps1) must query "
        "AssocQueryStringW with ASSOCSTR_PROGID as the second ProgId source. "
        "Do not use ASSOCSTR_EXECUTABLE -- that returns 0x80070483 on the "
        "reporter's 25H2 machine."
    )

    assert "Test-Path" in scope, (
        "After resolving an exe path, Test-Path must gate the return so a "
        "stale uninstalled Edge ProgId falls through to the next ProgId source."
    )
    assert "ChromeHTML" in scope and "MSEdgeHTM" in scope, (
        "ChromeHTML → Chrome and MSEdgeHTM → Edge family mappings must remain."
    )


def test_get_default_browser_exe_rejects_forbidden_default_sources() -> None:
    scope = _browser_detection_scope()

    assert "ASSOCSTR_EXECUTABLE" not in scope, (
        "Do not use AssocQueryStringW(ASSOCSTR_EXECUTABLE) as a default-browser "
        "source; it fails with 0x80070483 on Windows 11 25H2."
    )
    assert not re.search(
        r"(HKCR:|HKEY_CLASSES_ROOT)\\https?\\shell\\open\\command",
        scope,
        re.IGNORECASE,
    ), (
        "Do not use HKCR\\https\\shell\\open\\command (or http) as a ProgId / "
        "default source; it returns stale msedge. HKCR\\$progId\\shell\\open\\command "
        "after a correctly resolved ProgId is the existing exe-path lookup and must stay."
    )
    assert re.search(
        r"HKEY_CLASSES_ROOT\\\$progId\\shell\\open\\command",
        scope,
    ), (
        "Keep the existing HKCR\\$progId\\shell\\open\\command exe-path lookup "
        "after a correctly resolved ProgId."
    )
