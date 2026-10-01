/**
 * Unit tests for the preview/window reload shortcut helpers.
 *
 * Ctrl/Cmd+R stays preview-aware (`reload-preview-or-window`). Ctrl/Cmd+Shift+R
 * is the main-process force-reload escape hatch (`reloadIgnoringCache`) so
 * Windows/Linux still have a recovery chord when the application menu is null.
 */

import { describe, expect, it, vi } from 'vitest'

import type { PreviewShortcutInput } from './preview-shortcut'
import { applyPreviewShortcut, installPreviewShortcut, previewShortcutAction } from './preview-shortcut'

describe('previewShortcutAction', () => {
  it('Ctrl+Shift+R on win32 is force-reload-window, not preview-reload', () => {
    expect(previewShortcutAction({ key: 'r', control: true, shift: true, alt: false }, { isMac: false })).toBe(
      'force-reload-window'
    )
  })

  it('Ctrl+R on win32 is reload-preview-or-window', () => {
    expect(previewShortcutAction({ key: 'r', control: true, shift: false, alt: false }, { isMac: false })).toBe(
      'reload-preview-or-window'
    )
  })

  it('Cmd+Shift+R on macOS is force-reload-window', () => {
    expect(previewShortcutAction({ key: 'R', meta: true, shift: true, alt: false }, { isMac: true })).toBe(
      'force-reload-window'
    )
  })

  it('Cmd+R on macOS is reload-preview-or-window', () => {
    expect(previewShortcutAction({ key: 'r', meta: true, shift: false, alt: false }, { isMac: true })).toBe(
      'reload-preview-or-window'
    )
  })

  it('Ctrl+W on win32 is close-preview-tab', () => {
    expect(previewShortcutAction({ key: 'w', control: true, shift: false, alt: false }, { isMac: false })).toBe(
      'close-preview-tab'
    )
  })

  it('does not claim the chord when alt is held', () => {
    expect(
      previewShortcutAction({ key: 'r', control: true, shift: true, alt: true }, { isMac: false })
    ).toBeNull()
    expect(
      previewShortcutAction({ key: 'r', control: true, shift: false, alt: true }, { isMac: false })
    ).toBeNull()
  })

  it('does not treat Ctrl+Shift+R as preview-reload', () => {
    expect(previewShortcutAction({ key: 'r', control: true, shift: true, alt: false }, { isMac: false })).not.toBe(
      'reload-preview-or-window'
    )
  })
})

describe('applyPreviewShortcut', () => {
  it('force-reload calls webContents.reloadIgnoringCache on a live window', () => {
    const wc = { isDestroyed: () => false, reloadIgnoringCache: vi.fn() }
    applyPreviewShortcut('force-reload-window', { webContents: wc })
    expect(wc.reloadIgnoringCache).toHaveBeenCalledOnce()
  })

  it('force-reload is a no-op when the window is null', () => {
    expect(() => applyPreviewShortcut('force-reload-window', null)).not.toThrow()
  })

  it('force-reload is a no-op when the window is destroyed', () => {
    const wc = { isDestroyed: () => false, reloadIgnoringCache: vi.fn() }
    applyPreviewShortcut('force-reload-window', { isDestroyed: () => true, webContents: wc })
    expect(wc.reloadIgnoringCache).not.toHaveBeenCalled()
  })

  it('force-reload is a no-op when webContents is destroyed', () => {
    const wc = { isDestroyed: () => true, reloadIgnoringCache: vi.fn() }
    applyPreviewShortcut('force-reload-window', { isDestroyed: () => false, webContents: wc })
    expect(wc.reloadIgnoringCache).not.toHaveBeenCalled()
  })

  it('does not call reloadIgnoringCache for preview-aware reload', () => {
    const wc = { isDestroyed: () => false, reloadIgnoringCache: vi.fn() }
    applyPreviewShortcut('reload-preview-or-window', { webContents: wc })
    expect(wc.reloadIgnoringCache).not.toHaveBeenCalled()
  })
})

describe('installPreviewShortcut event sequences', () => {
  function setup(isMac: boolean) {
    let listener!: (event: { preventDefault: () => void }, input: PreviewShortcutInput) => void
    const reloadIgnoringCache = vi.fn()
    const closePreview = vi.fn()
    const reloadPreview = vi.fn()
    installPreviewShortcut(
      {
        webContents: {
          isDestroyed: () => false,
          reloadIgnoringCache,
          on: (_event, handler) => {
            listener = handler
          }
        }
      },
      { isMac, closePreview, reloadPreview }
    )

    return {
      reloadIgnoringCache,
      closePreview,
      reloadPreview,
      emit(input: PreviewShortcutInput) {
        const preventDefault = vi.fn()
        listener({ preventDefault }, input)

        return preventDefault
      }
    }
  }

  it('force reload runs once per press across release order and auto-repeat on both platforms', () => {
    const sequences: PreviewShortcutInput[][] = [
      [{ type: 'keyDown' }, { type: 'keyUp' }],
      [{ type: 'keyDown' }, { type: 'keyDown', isAutoRepeat: true }, { type: 'keyUp' }],
      [{ type: 'keyDown' }, { type: 'keyUp', key: 'Shift', shift: false }, { type: 'keyUp', shift: false }]
    ]

    for (const isMac of [false, true]) {
      for (const sequence of sequences) {
        const fixture = setup(isMac)

        // Two presses verify that the next press still works after release.
        for (let press = 1; press <= 2; press++) {
          for (const input of sequence) {
            const prevented = fixture.emit({
              key: 'R',
              control: !isMac,
              meta: isMac,
              shift: true,
              alt: false,
              isAutoRepeat: false,
              ...input
            })

            expect(prevented).toHaveBeenCalledTimes(input.key === 'Shift' ? 0 : 1)
          }

          expect(fixture.reloadIgnoringCache).toHaveBeenCalledTimes(press)
          expect(fixture.reloadPreview).not.toHaveBeenCalled()
          expect(fixture.closePreview).not.toHaveBeenCalled()
        }
      }
    }
  })

  it('ordinary R/W execute once and unmatched shortcuts are not swallowed', () => {
    for (const isMac of [false, true]) {
      for (const key of ['r', 'w']) {
        const fixture = setup(isMac)
        const chord = { key, control: !isMac, meta: isMac, shift: false, alt: false }

        for (const input of [{ type: 'keyDown' }, { type: 'keyDown', isAutoRepeat: true }, { type: 'keyUp' }]) {
          expect(fixture.emit({ ...chord, ...input })).toHaveBeenCalledOnce()
        }

        expect(fixture.reloadPreview).toHaveBeenCalledTimes(key === 'r' ? 1 : 0)
        expect(fixture.closePreview).toHaveBeenCalledTimes(key === 'w' ? 1 : 0)
        expect(fixture.reloadIgnoringCache).not.toHaveBeenCalled()

        for (const input of [
          { ...chord, alt: true },
          { ...chord, control: isMac, meta: !isMac },
          { ...chord, key: 'x' },
          { ...chord, key: 'w', shift: true }
        ]) {
          for (const type of ['keyDown', 'keyUp']) {
            expect(fixture.emit({ ...input, type })).not.toHaveBeenCalled()
          }
        }

        expect(fixture.reloadPreview).toHaveBeenCalledTimes(key === 'r' ? 1 : 0)
        expect(fixture.closePreview).toHaveBeenCalledTimes(key === 'w' ? 1 : 0)
      }
    }
  })
})
