/**
 * Pure helpers for the desktop preview/window reload + close-tab chords
 * (Ctrl/Cmd+R, Ctrl/Cmd+Shift+R, Ctrl/Cmd+W).
 *
 * Detection and event dispatch live here so the production listener can be
 * tested without booting a BrowserWindow. main.ts supplies preview/HUD IPC
 * callbacks; force-reload is a main-process
 * `webContents.reloadIgnoringCache()` call (no renderer IPC / location.reload).
 *
 * Addresses #106662 as an escape hatch: this does not claim to fix GPU/hit-test
 * root cause for intermittent dead clicks.
 */

export type PreviewShortcutAction =
  | 'force-reload-window'
  | 'reload-preview-or-window'
  | 'close-preview-tab'

export type PreviewShortcutInput = {
  alt?: boolean
  control?: boolean
  key?: string
  meta?: boolean
  shift?: boolean
  type?: string
  isAutoRepeat?: boolean
}

export type PreviewShortcutWindowLike = {
  isDestroyed?: () => boolean
  webContents?: {
    isDestroyed?: () => boolean
    reloadIgnoringCache?: () => void
  } | null
} | null

/**
 * Map a before-input-event payload to a preview shortcut action.
 *
 * Accelerator is Meta on macOS and Control elsewhere. Alt never claims the
 * chord (leave it to other handlers / the OS). Shift+R is force-reload;
 * non-shift R stays preview-aware.
 */
export function previewShortcutAction(
  input: PreviewShortcutInput | null | undefined,
  { isMac }: { isMac: boolean }
): PreviewShortcutAction | null {
  if (!input) {
    return null
  }

  const key = String(input.key || '').toLowerCase()
  const accel = Boolean(isMac ? input.meta : input.control) && !input.alt

  if (!accel) {
    return null
  }

  if (key === 'w' && !input.shift) {
    return 'close-preview-tab'
  }

  if (key !== 'r') {
    return null
  }

  if (input.shift) {
    return 'force-reload-window'
  }

  return 'reload-preview-or-window'
}

/**
 * Apply a resolved preview shortcut. Force-reload is the only action that
 * mutates the window from this helper; other actions stay on the existing
 * preview-nav / close-tab IPC paths in main.ts.
 *
 * Fail-open: null / destroyed window / destroyed webContents is a no-op.
 */
export function applyPreviewShortcut(
  action: PreviewShortcutAction | null | undefined,
  windowLike: PreviewShortcutWindowLike
): void {
  if (action !== 'force-reload-window') {
    return
  }

  if (!windowLike) {
    return
  }

  try {
    if (typeof windowLike.isDestroyed === 'function' && windowLike.isDestroyed()) {
      return
    }
  } catch {
    return
  }

  const webContents = windowLike.webContents

  if (!webContents) {
    return
  }

  try {
    if (typeof webContents.isDestroyed === 'function' && webContents.isDestroyed()) {
      return
    }
  } catch {
    return
  }

  if (typeof webContents.reloadIgnoringCache !== 'function') {
    return
  }

  try {
    webContents.reloadIgnoringCache()
  } catch {
    // Fail-open: a raced destroy between the checks and the call must not throw.
  }
}

interface PreviewShortcutEvent {
  preventDefault(): void
}

interface PreviewShortcutWindow {
  isDestroyed?: () => boolean
  webContents: NonNullable<NonNullable<PreviewShortcutWindowLike>['webContents']> & {
    on(event: 'before-input-event', listener: (event: PreviewShortcutEvent, input: PreviewShortcutInput) => void): void
  }
}

/** main.ts supplies the existing preview-aware IPC and HUD close paths. */
export function installPreviewShortcut(
  window: PreviewShortcutWindow,
  {
    isMac,
    closePreview,
    reloadPreview
  }: {
    isMac: boolean
    closePreview: () => void
    reloadPreview: () => void
  }
): void {
  window.webContents.on('before-input-event', (event, input) => {
    const action = previewShortcutAction(input, { isMac })

    if (!action) {
      return
    }

    event.preventDefault()

    // Claim releases and repeats too, so menu accelerators cannot handle them.
    if (input.type !== 'keyDown' || input.isAutoRepeat) {
      return
    }

    // Always claim Ctrl/Cmd+W; the renderer decides tab-vs-window.
    if (action === 'close-preview-tab') {
      closePreview()

      return
    }

    // Preview-aware reload also works without an application menu on Windows/Linux.
    if (action === 'reload-preview-or-window') {
      reloadPreview()

      return
    }

    // Keep the macOS forceReload menu role; claiming this chord covers all platforms.
    if (action === 'force-reload-window') {
      applyPreviewShortcut(action, window)
    }
  })
}
