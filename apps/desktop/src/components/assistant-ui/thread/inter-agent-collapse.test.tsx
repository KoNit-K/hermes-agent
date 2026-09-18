// Two contracts guard assistant-message rendering:
//
// 1. A reply to an inter-agent delivery stays expanded after it settles, so
//    the operator can read the substantive answer without expanding a notice.
// 2. The streaming marker. `data-message-streaming` moved off the message root
//    onto a permanently-mounted hidden leaf, and
//    scripts/run-short-session-hang-repro.mjs derives its settled-row count by
//    subtracting `[data-message-streaming="true"]` markers from message roots.
//    Nothing in the app itself reads it, so without this test a delete would
//    look free and would silently regress that repro's response gate.
import { AssistantRuntimeProvider, type ThreadMessage, useExternalStoreRuntime } from '@assistant-ui/react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Thread } from '.'

const createdAt = new Date('2026-05-01T00:00:00.000Z')

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', TestResizeObserver)
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
  window.setTimeout(() => callback(performance.now()), 0)
)
vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
vi.stubGlobal('CSS', { escape: (str: string) => str })

Element.prototype.scrollTo = function scrollTo() {}

Element.prototype.animate = function animate() {
  return { cancel() {}, finished: Promise.resolve() } as unknown as Animation
}

afterEach(() => {
  cleanup()
})

const assistantMetadata = { unstable_state: null, unstable_annotations: [], unstable_data: [], steps: [], custom: {} }

function user(id: string, text: string): ThreadMessage {
  return {
    id,
    role: 'user',
    content: [{ type: 'text', text }],
    attachments: [],
    createdAt,
    metadata: { custom: {} }
  } as ThreadMessage
}

function assistant(id: string, text: string, running: boolean): ThreadMessage {
  return {
    id,
    role: 'assistant',
    content: text ? [{ type: 'text', text }] : [],
    status: running ? { type: 'running' } : { type: 'complete', reason: 'stop' },
    createdAt,
    metadata: assistantMetadata
  } as ThreadMessage
}

function Harness({ messages }: { messages: ThreadMessage[] }) {
  const runtime = useExternalStoreRuntime<ThreadMessage>({
    messages,
    isRunning: messages.at(-1)?.status?.type === 'running',
    onNew: async () => {}
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  )
}

const DELIVERY = 'Message from 🤖 Hermes (@hermes): please check the build'

describe('inter-agent replies', () => {
  it('keeps a settled reply to an inter-agent delivery expanded', async () => {
    render(<Harness messages={[user('u1', DELIVERY), assistant('a1', 'build is green', false)]} />)

    expect(await screen.findByText('build is green')).toBeTruthy()
    expect(screen.queryByText(/Replied to/)).toBeNull()
    expect(screen.queryByText('show reply')).toBeNull()
  })

  it('keeps an inter-agent reply visible while it is still streaming', async () => {
    const { container } = render(<Harness messages={[user('u1', DELIVERY), assistant('a1', 'working on it', true)]} />)

    await screen.findByText('working on it')
    expect(screen.queryByText('show reply')).toBeNull()
    // Expanded => the full body root, which carries the streaming marker.
    expect(container.querySelector('[data-message-streaming="true"]')).toBeTruthy()
  })

  it('leaves an ordinary reply expanded', async () => {
    render(<Harness messages={[user('u1', 'ordinary question'), assistant('a1', 'ordinary answer', false)]} />)

    await screen.findByText('ordinary answer')
    expect(screen.queryByText(/Replied to/)).toBeNull()
  })

  it('clears the streaming marker once the turn settles', async () => {
    const { container } = render(<Harness messages={[user('u1', 'q'), assistant('a1', 'done', false)]} />)

    await screen.findByText('done')
    expect(container.querySelector('[data-message-streaming="true"]')).toBeNull()
    // The marker element itself stays mounted (attribute toggles, no remount).
    expect(
      container.querySelector('[data-slot="aui_assistant-message-root"] [data-slot="aui_message-streaming-marker"]')
    ).toBeTruthy()
  })
})
