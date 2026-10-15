"""Plugin registration coverage for per-tool gateway progress visibility."""

from hermes_cli.plugins import PluginContext, PluginManager, PluginManifest


def test_register_tool_passes_show_progress_to_registry(monkeypatch):
    from tools.registry import registry

    context = PluginContext(PluginManifest(name="test-plugin", source="user"), PluginManager())
    calls = []
    monkeypatch.setattr(registry, "register", lambda **kwargs: calls.append(kwargs))
    monkeypatch.setattr(registry, "snapshot_registration", lambda *args, **kwargs: None)
    monkeypatch.setattr(registry, "get_entry", lambda *args, **kwargs: None)

    context.register_tool(
        name="hidden_tool", toolset="test", schema={"name": "hidden_tool"},
        handler=lambda _args: "{}", show_progress=False,
    )

    assert calls[0]["show_progress"] is False
