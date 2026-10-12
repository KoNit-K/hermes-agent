"""Host-policy regressions for the local proxy."""

from types import SimpleNamespace

from hermes_cli.proxy import cli as proxy_cli
from hermes_cli.proxy.server import _local_request_error


def test_explicit_host_allows_non_browser_clients_but_not_browser_origins():
    """#136961: an opted-in Docker hostname must not become a trusted browser origin."""
    allowed_hosts = frozenset({"127.0.0.1", "host.docker.internal"})
    trusted_origin_hosts = frozenset({"127.0.0.1"})

    assert _local_request_error(
        "host.docker.internal:8645",
        None,
        None,
        wildcard=False,
        allowed_hosts=allowed_hosts,
        trusted_origin_hosts=trusted_origin_hosts,
    ) is None
    assert _local_request_error(
        "host.docker.internal:8645",
        "http://host.docker.internal:8645",
        None,
        wildcard=False,
        allowed_hosts=allowed_hosts,
        trusted_origin_hosts=trusted_origin_hosts,
    ) == "origin_not_allowed"


def test_proxy_start_passes_each_allowed_host_to_the_server(monkeypatch):
    """#136961: the repeatable CLI option reaches the server's Host policy."""
    class Adapter:
        display_name = "Test Provider"

        def is_authenticated(self):
            return True

    captured = {}

    async def run_server(adapter, **kwargs):
        captured["adapter"] = adapter
        captured.update(kwargs)

    monkeypatch.setattr(proxy_cli, "get_adapter", lambda provider: Adapter())
    monkeypatch.setattr(proxy_cli, "run_server", run_server)
    monkeypatch.setattr(proxy_cli, "AIOHTTP_AVAILABLE", True)

    result = proxy_cli.cmd_proxy_start(
        SimpleNamespace(
            provider="nous",
            host="127.0.0.1",
            port=8645,
            allow_host=["host.docker.internal", "embedding.internal"],
        )
    )

    assert result == 0
    assert captured["allowed_hosts"] == ["host.docker.internal", "embedding.internal"]
