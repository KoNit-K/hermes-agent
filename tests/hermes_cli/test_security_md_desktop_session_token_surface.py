from pathlib import Path


def test_security_md_names_desktop_loopback_session_token_bootstrap() -> None:
    text = (Path("SECURITY.md")).read_text(encoding="utf-8")
    # §2.6 must name the desktop/dashboard loopback HTTP surface
    assert "2.6" in text or "### 2.6" in text
    lowered = text.lower()
    assert "desktop" in lowered or "hermes serve" in lowered or "dashboard" in lowered
    # must acknowledge ephemeral session token delivered via unauthenticated HTML/bootstrap on local/loopback
    assert "session token" in lowered
    assert any(s in lowered for s in ("html", "bootstrap", "inject", "unauthenticated", "document"))
    assert any(s in lowered for s in ("loopback", "local", "os-level", "user account", "same user"))
