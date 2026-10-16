"""Regression tests for #139687: stdio proxy installers must not stack.

Three installers wrap ``sys.stdout``/``sys.stderr``:

* ``agent.process_bootstrap._install_safe_stdio``   -> ``_SafeWriter``
* ``hermes_logging.redact_detached_stdio``           -> ``_RedactingStdio``
* ``agent.thread_scoped_output._ensure_installed``   -> ``_ThreadRoutingStream``

Each used to check only the *top* of the chain, so a gateway that calls them
alternately (per agent build / per background worker) appended a new layer every
cycle until ``getattr(sys.stdout, ...)`` in ``_line_buffer_piped_stdout`` raised
``RecursionError`` and every message failed.
"""

from __future__ import annotations

import contextlib
import io
import sys
import threading

import hermes_logging
from agent import process_bootstrap
from agent import thread_scoped_output as tso


def _depth(stream) -> int:
    return sum(1 for _ in tso.stdio_chain(stream)) - 1


def _piped_stdio(monkeypatch):
    """Swap in a fresh non-TTY stdout/stderr and clean installer state.

    Called from the test *body*, not a fixture: pytest's capture re-installs its
    own stream when the call phase starts, so a fixture-time swap would be
    replaced before the test runs (same pattern as
    ``tests/agent/test_thread_scoped_output.py::_run_with_real_stream``).
    """
    out = io.TextIOWrapper(io.BytesIO(), encoding="utf-8")
    err = io.TextIOWrapper(io.BytesIO(), encoding="utf-8")
    monkeypatch.setattr(sys, "stdout", out)
    monkeypatch.setattr(sys, "stderr", err)
    monkeypatch.setattr(tso, "_installed", {})
    monkeypatch.setattr(tso, "_routing_states", {})
    monkeypatch.setattr(hermes_logging, "_line_buffered_stdout", None, raising=False)
    return out, err


def _one_cycle() -> None:
    process_bootstrap._install_safe_stdio()
    hermes_logging.redact_detached_stdio()
    with tso.thread_scoped_silence():
        pass


def test_alternating_installers_keep_chain_bounded(monkeypatch):
    _piped_stdio(monkeypatch)
    _one_cycle()
    baseline = _depth(sys.stdout)
    for _ in range(500):
        _one_cycle()
    assert _depth(sys.stdout) == baseline
    assert _depth(sys.stderr) == baseline


def test_every_install_order_stays_bounded(monkeypatch):
    """Silence-first and redaction-first orders must not stack either."""
    def silence():
        with tso.thread_scoped_silence():
            pass

    steps = {
        "safe": process_bootstrap._install_safe_stdio,
        "redact": hermes_logging.redact_detached_stdio,
        "silence": silence,
    }
    for order in (
        ("silence", "safe", "redact"),
        ("redact", "silence", "safe"),
        ("safe", "silence", "redact"),
    ):
        _piped_stdio(monkeypatch)
        for name in order:
            steps[name]()
        baseline = _depth(sys.stdout)
        for _ in range(300):
            for name in order:
                steps[name]()
        assert _depth(sys.stdout) == baseline, order


def test_line_buffering_survives_many_agent_builds(monkeypatch):
    _piped_stdio(monkeypatch)
    for _ in range(500):
        _one_cycle()
        hermes_logging._line_buffer_piped_stdout()
    # Must not raise RecursionError.
    getattr(sys.stdout, "line_buffering", False)


def test_silencing_still_routes_per_thread(monkeypatch):
    out, _ = _piped_stdio(monkeypatch)
    for _ in range(50):
        _one_cycle()

    with tso.thread_scoped_silence():
        print("hidden-from-silenced-thread")
        other = threading.Thread(target=lambda: print("visible-from-other-thread"))
        other.start()
        other.join()
    print("visible-after-unsilence")
    sys.stdout.flush()

    written = out.buffer.getvalue().decode("utf-8")
    assert "hidden-from-silenced-thread" not in written
    assert "visible-from-other-thread" in written
    assert "visible-after-unsilence" in written


def test_redirect_restoring_an_older_proxy_is_adopted(monkeypatch):
    _piped_stdio(monkeypatch)
    _one_cycle()
    baseline = _depth(sys.stdout)
    for _ in range(20):
        with contextlib.redirect_stdout(io.StringIO()):
            _one_cycle()
        _one_cycle()
    assert _depth(sys.stdout) == baseline


def test_stdio_chain_is_bounded_on_cycles():
    class Loop:
        def __init__(self):
            self._inner = self

    assert sum(1 for _ in tso.stdio_chain(Loop())) == tso._MAX_CHAIN
