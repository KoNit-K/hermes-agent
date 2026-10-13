"""Tests for cgroup resource-limit gating in the docker backend.

On hosts where the cgroup v2 cpu/memory/pids controllers are not delegated
(e.g. unprivileged Proxmox LXCs), passing ``--cpus``/``--memory``/``--pids-limit``
to ``docker run`` fails every container start with OCI runtime error / exit 126.
``_cgroup_limits_available`` probes once and the resource flags are gated on it,
so the sandbox degrades gracefully instead of failing.
"""
import subprocess

import pytest

import tools.environments.docker as docker_env


@pytest.fixture(autouse=True)
def _reset_cgroup_cache():
    """The probe results are cached in module-level globals; reset per test."""
    docker_env._cgroup_limits_ok = None
    docker_env._storage_opt_ok = None
    yield
    docker_env._cgroup_limits_ok = None
    docker_env._storage_opt_ok = None




def test_probe_returns_true_when_container_starts(monkeypatch):
    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    captured = {}

    def _run(cmd, *a, **k):
        captured["cmd"] = cmd
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(docker_env.subprocess, "run", _run)
    assert docker_env._cgroup_limits_available("hermes-agent:latest") is True
    # Probes all three controllers together against the real sandbox image.
    assert "--cpus" in captured["cmd"]
    assert "--memory" in captured["cmd"]
    assert "--pids-limit" in captured["cmd"]
    assert "hermes-agent:latest" in captured["cmd"]


def test_probe_result_is_cached(monkeypatch):
    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    calls = []

    def _run(cmd, *a, **k):
        calls.append(cmd)
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(docker_env.subprocess, "run", _run)
    docker_env._cgroup_limits_available("img")
    docker_env._cgroup_limits_available("img")
    docker_env._cgroup_limits_available("img")
    assert len(calls) == 1  # probe runs once, then cached


def test_probe_definitive_cgroup_failure_is_cached(monkeypatch):
    """A daemon rejection that names cgroups IS a host property; caching it is
    the point of the probe, so subsequent spawns do not pay it again (#116162
    only stops caching failures that say nothing about cgroups)."""
    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    calls = []

    def _run(cmd, *a, **k):
        calls.append(cmd)
        return subprocess.CompletedProcess(
            cmd, 126, stdout="", stderr="docker: Error response from daemon: failed to "
            "create task for container: OCI runtime create failed: error setting cgroup "
            "config for procHooks process: permission denied")

    monkeypatch.setattr(docker_env.subprocess, "run", _run)
    assert docker_env._cgroup_limits_available("img") is False
    assert docker_env._cgroup_limits_available("img") is False
    assert len(calls) == 1


@pytest.mark.parametrize("driver, backing", [("overlay2", "ext4"), ("btrfs", "xfs")])
def test_storage_opt_known_unsupported_daemon_skips_create(monkeypatch, driver, backing):
    """Regression for #137493: local daemon facts can reject quotas without a container."""
    calls = []

    def _capture(cmd, *args, **kwargs):
        calls.append(cmd)
        return subprocess.CompletedProcess(
            cmd, 0,
            stdout=f'{driver}|/var/lib/docker|[["Backing Filesystem", "{backing}"]]\n',
            stderr="")

    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    monkeypatch.setattr(docker_env, "run_capture", _capture)

    assert docker_env.DockerEnvironment._storage_opt_supported() is False
    assert docker_env._storage_opt_ok is False
    assert calls == [["/usr/bin/docker", "info", "--format", "{{.Driver}}|{{.DockerRootDir}}|{{json .DriverStatus}}"]]


@pytest.mark.parametrize("mount_options, expected", [("rw,pquota", True), ("rw,relatime", False)])
def test_storage_opt_xfs_mount_options_are_decided_without_create(monkeypatch, mount_options, expected):
    calls = []

    def _capture(cmd, *args, **kwargs):
        calls.append(cmd)
        return subprocess.CompletedProcess(
            cmd, 0,
            stdout='overlay2|/Users/docker|[["Backing Filesystem", "xfs"]]\n',
            stderr="")

    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    monkeypatch.setattr(docker_env, "run_capture", _capture)
    monkeypatch.setattr(
        docker_env.Path,
        "read_text",
        lambda *args, **kwargs: f"/dev/sda /Users xfs {mount_options} 0 0\n")

    assert docker_env.DockerEnvironment._storage_opt_supported() is expected
    assert docker_env._storage_opt_ok is expected
    assert len(calls) == 1
    assert calls[0][1] == "info"


@pytest.mark.parametrize(
    "create, cached",
    [
        # The daemon rejecting --storage-opt is a host property: cached False.
        ((125, "", "Error response from daemon: --storage-opt is supported only for overlay2 with pquota"), False),
        # A create failure that never reached the storage check (pull error) is transient.
        ((125, "", "Unable to find image 'hello-world:latest'"), None),
    ],
)
def test_storage_opt_create_fallback_caches_only_definitive_answers(monkeypatch, create, cached):
    """A remote or otherwise indeterminate XFS mount still uses the daemon as authority."""
    calls = []

    def _capture(cmd, *args, **kwargs):
        calls.append(cmd)
        if cmd[1] == "info":
            return subprocess.CompletedProcess(
                cmd, 0,
                stdout='overlay2|/remote/docker|[["Backing Filesystem", "xfs"]]\n', stderr="")
        rc, out, err = create
        return subprocess.CompletedProcess(cmd, rc, stdout=out, stderr=err)

    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    monkeypatch.setattr(docker_env, "run_capture", _capture)
    monkeypatch.setattr(docker_env, "_xfs_mount_has_pquota", lambda root: None)

    assert docker_env.DockerEnvironment._storage_opt_supported() is False
    assert docker_env._storage_opt_ok is cached
    assert [cmd[1] for cmd in calls] == ["info", "create"]


def test_transient_probe_failure_recovers_on_next_spawn(monkeypatch):
    """E2e through DockerEnvironment: the probe timing out on spawn one (auto-pull
    past the 60s timeout, daemon cold-start) leaves THAT container unlimited but
    must not disable limits process-wide. Spawn two re-probes, succeeds, and its
    docker run argv carries --cpus/--memory/--pids-limit."""
    monkeypatch.setattr(docker_env, "find_docker", lambda: "/usr/bin/docker")
    calls, probe_calls = [], []

    def _run(cmd, *a, **k):
        calls.append(cmd)
        if isinstance(cmd, list) and len(cmd) > 1 and cmd[1] == "run" and "--rm" in cmd:
            # the throwaway cgroup probe (`run --rm ... sleep 0`), not the real `run -d`
            probe_calls.append(cmd)
            if len(probe_calls) == 1:
                raise subprocess.TimeoutExpired(cmd, 60)
            return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")
        if isinstance(cmd, list) and len(cmd) > 1 and cmd[1] == "version":
            return subprocess.CompletedProcess(cmd, 0, stdout="Docker version", stderr="")
        if isinstance(cmd, list) and len(cmd) > 1 and cmd[1] == "run" and "-d" in cmd:
            return subprocess.CompletedProcess(cmd, 0, stdout="fake-container-id\n", stderr="")
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(docker_env.subprocess, "run", _run)
    docker_env.DockerEnvironment(image="img", cpu=1.0, memory=512, task_id="t1")
    docker_env.DockerEnvironment(image="img", cpu=1.0, memory=512, task_id="t2")

    run_argvs = [c for c in calls
                 if isinstance(c, list) and len(c) > 1 and c[1] == "run" and "-d" in c]
    assert len(run_argvs) == 2
    assert "--cpus" not in run_argvs[0] and "--memory" not in run_argvs[0]
    assert "--cpus" in run_argvs[1] and "1.0" in run_argvs[1]
    assert "--memory" in run_argvs[1] and "512m" in run_argvs[1]
    assert "--pids-limit" in run_argvs[1]
    assert len(probe_calls) == 2  # re-probed, not latched off the timeout
