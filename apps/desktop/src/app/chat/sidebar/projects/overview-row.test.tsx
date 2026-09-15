import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { SessionInfo } from '@/hermes'

import { ProjectOverviewRow } from './overview-row'
import type { SidebarProjectTree } from './workspace-groups'

afterEach(cleanup)

const workspaceOpen = vi.hoisted(() => ({ value: false }))

vi.mock('@/i18n', () => ({
  useI18n: () => ({
    t: {
      sidebar: {
        newSessionIn: (label: string) => `New session in ${label}`,
        showMoreIn: (count: number, label: string) => `Show ${count} more in ${label}`,
        projects: {
          enter: (label: string) => `Enter ${label}`,
          reorder: (label: string) => `Reorder ${label}`,
          toggle: (label: string, open: boolean) => `${open ? 'Show' : 'Hide'} ${label} sessions`,
          autoDiscovered: 'Auto-discovered'
        }
      }
    }
  })
}))

vi.mock('./model', () => ({
  PROJECT_PREVIEW_COUNT: 3,
  latestProjectSessions: () => [],
  useWorkspaceNodeOpen: () => [workspaceOpen.value, vi.fn()]
}))

// ProjectMenu (the kebab) has its own dedicated test file — stub it here so
// this file only exercises overview-row's own Tip usage (the disclosure
// toggle) plus the WorkspaceAddButton wiring. ProjectContextMenu (the row's
// right-click wrapper) is stubbed as a pass-through so the row still renders.
vi.mock('./project-menu', () => ({
  ProjectContextMenu: ({ children }: { children: ReactNode }) => children,
  ProjectMenu: () => null
}))

const project = { id: 'p1', label: 'Test D' } as unknown as SidebarProjectTree

const tipTrigger = (el: HTMLElement) => el.closest('[data-slot="tooltip-trigger"]')

describe('ProjectOverviewRow', () => {
  afterEach(() => {
    workspaceOpen.value = false
  })

  it('wraps the "new session" add button in a Tip with the project-scoped label', () => {
    render(<ProjectOverviewRow onNewSession={vi.fn()} project={project} />)

    const button = screen.getByRole('button', { name: 'New session in Test D' })
    expect(tipTrigger(button)).toBeTruthy()
  })

  it('wraps the disclosure toggle in a Tip when there are preview sessions', () => {
    render(
      <ProjectOverviewRow
        previewSessions={[{ id: 's1' } as unknown as SessionInfo]}
        project={project}
        renderRows={() => null}
      />
    )

    // Collapsed by default, so the disclosure offers to show the sessions.
    const button = screen.getByRole('button', { name: 'Show Test D sessions' })
    expect(tipTrigger(button)).toBeTruthy()
  })

  it('does not render the disclosure toggle when there is nothing to preview', () => {
    render(<ProjectOverviewRow project={project} />)

    expect(screen.queryByRole('button', { name: 'Show Test D sessions' })).toBeNull()
  })

  it('reveals the next page of a project preview without requiring Show all sessions', () => {
    workspaceOpen.value = true
    const sessions = Array.from({ length: 5 }, (_, index) => ({ id: `s${index + 1}` }) as SessionInfo)

    render(
      <ProjectOverviewRow
        previewSessions={sessions}
        project={project}
        renderRows={items => <div>{items.map(item => item.id).join(',')}</div>}
      />
    )

    expect(screen.getByText('s1,s2,s3')).toBeTruthy()
    expect(screen.queryByText('s1,s2,s3,s4,s5')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Show 2 more in Test D' }))

    expect(screen.getByText('s1,s2,s3,s4,s5')).toBeTruthy()
  })

  it('offers the "new session" add button on Home, which starts one with no folder', () => {
    const home = {
      id: '__no_project__',
      isNoProject: true,
      label: 'Home',
      path: null
    } as unknown as SidebarProjectTree

    const onNewSession = vi.fn()

    render(<ProjectOverviewRow onNewSession={onNewSession} project={home} />)
    fireEvent.click(screen.getByRole('button', { name: 'New session in Home' }))

    expect(onNewSession).toHaveBeenCalledWith(null)
  })

  it('tags the row with data-sessions-project so a skin can target one project', () => {
    const { container } = render(<ProjectOverviewRow project={project} />)

    expect(container.querySelector('[data-sessions-project="p1"]')).toBeTruthy()
  })

  it('explicit projects keep the folder-library glyph and a plain accessible name', () => {
    const explicit = { id: 'p1', label: 'Explicit' } as unknown as SidebarProjectTree

    const { container } = render(<ProjectOverviewRow project={explicit} />)

    expect(container.querySelector('.codicon-folder-library')).toBeTruthy()
    expect(container.querySelector('.codicon-repo')).toBeNull()
    expect(screen.getByRole('button', { name: 'Enter Explicit' })).toBeTruthy()
  })

  it('auto-discovered repos get the repo glyph, an "Auto-discovered" tooltip, and an accessible name that says so', () => {
    const auto = { id: '/Users/dev/my-repo', label: 'my-repo', isAuto: true } as unknown as SidebarProjectTree

    const { container } = render(<ProjectOverviewRow project={auto} />)

    expect(container.querySelector('.codicon-repo')).toBeTruthy()
    expect(container.querySelector('.codicon-folder-library')).toBeNull()

    const link = screen.getByRole('button', { name: 'Enter my-repo (Auto-discovered)' })
    expect(tipTrigger(link)).toBeTruthy()
  })
})
