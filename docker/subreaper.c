// Linux-only parent for the container's non-PID-1 execution path.
//
// s6-overlay owns PID 1 in the usual image configuration. When another init
// owns PID 1, this process asks Linux to adopt orphaned descendants, forwards
// shutdown signals to the command's process group, and reaps every child it
// adopts. It deliberately returns the command's original wait status.
#define _GNU_SOURCE

#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/prctl.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

static volatile sig_atomic_t child_pid = -1;

static void forward_signal(int signal_number) {
    if (child_pid > 0) {
        // The child owns a process group so its helpers receive the same
        // graceful-shutdown signal. Fall back to the child during setpgid's
        // short startup race.
        if (kill(-child_pid, signal_number) < 0 && errno == ESRCH) {
            (void)kill(child_pid, signal_number);
        }
    }
}

static void child_exited(int unused_signal_number) {
    (void)unused_signal_number;
}

static void install_forwarder(int signal_number) {
    struct sigaction action = {0};
    action.sa_handler = forward_signal;
    sigemptyset(&action.sa_mask);
    action.sa_flags = SA_RESTART;
    if (sigaction(signal_number, &action, NULL) < 0) {
        perror("[hermes] subreaper: sigaction");
        exit(125);
    }
}

static void install_reaper(void) {
    struct sigaction action = {0};
    action.sa_handler = child_exited;
    sigemptyset(&action.sa_mask);
    // Do not use SA_RESTART: SIGCHLD must wake waitpid so the loop can reap
    // adopted descendants while the main command remains alive.
    if (sigaction(SIGCHLD, &action, NULL) < 0) {
        perror("[hermes] subreaper: SIGCHLD handler");
        exit(125);
    }
}

static void reap_adopted_children(void) {
    int ignored_status;
    while (waitpid(-1, &ignored_status, WNOHANG) > 0) {
    }
}

int main(int argc, char **argv) {
    if (argc < 2) {
        fputs("usage: subreaper command [args...]\n", stderr);
        return 125;
    }

    // This is best effort: a restricted kernel must not prevent the requested
    // command from starting, even though it cannot adopt future orphans.
    if (prctl(PR_SET_CHILD_SUBREAPER, 1) < 0) {
        perror("[hermes] subreaper: PR_SET_CHILD_SUBREAPER unavailable");
    }

    pid_t pid = fork();
    if (pid < 0) {
        perror("[hermes] subreaper: fork");
        return 125;
    }
    if (pid == 0) {
        (void)setpgid(0, 0);
        execvp(argv[1], &argv[1]);
        perror("[hermes] subreaper: exec");
        _exit(127);
    }

    child_pid = pid;
    install_forwarder(SIGTERM);
    install_forwarder(SIGINT);
    install_forwarder(SIGHUP);
    install_forwarder(SIGQUIT);
    install_reaper();

    for (;;) {
        int status;
        pid_t reaped = waitpid(-1, &status, 0);
        if (reaped == pid) {
            reap_adopted_children();
            if (WIFEXITED(status)) {
                return WEXITSTATUS(status);
            }
            if (WIFSIGNALED(status)) {
                return 128 + WTERMSIG(status);
            }
            return 125;
        }
        if (reaped < 0 && errno == EINTR) {
            continue;
        }
        if (reaped < 0 && errno == ECHILD) {
            return 125;
        }
    }
}
