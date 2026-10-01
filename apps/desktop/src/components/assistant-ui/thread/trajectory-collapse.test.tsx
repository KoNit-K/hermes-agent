import { AssistantRuntimeProvider, type ThreadMessage, useExternalStoreRuntime } from '@assistant-ui/react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { $trajectoryCollapsedByDefault } from '@/store/trajectory-disclosure'

import { stubThreadEnvironment } from '../test-utils'

import { Thread } from '.'

const createdAt = new Date('2026-05-01T00:00:00.000Z')

stubThreadEnvironment()

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  $trajectoryCollapsedByDefault.set(true)
})

const assistantMetadata = {
  unstable_state: null,
  unstable_annotations: [],
  unstable_data: [],
  steps: [],
  custom: {}
}

function userMessage(): ThreadMessage {
  return {
    id: 'user-1',
    role: 'user',
    content: [{ type: 'text', text: 'what should I do?' }],
    attachments: [],
    createdAt,
    metadata: { custom: {} }
  } as ThreadMessage
}

function trajectoryMessage({
  finalText = 'final answer here',
  running = false,
  timestamps = true
}: {
  finalText?: string
  running?: boolean
  timestamps?: boolean
} = {}): Extract<ThreadMessage, { role: 'assistant' }> {
  const started = createdAt.getTime() / 1000
  const content: unknown[] = [
    {
      type: 'reasoning',
      text: 'plan',
      ...(timestamps ? { timestamp: started + 0.05, completedAt: started + 0.1 } : {})
    },
    {
      type: 'tool-call',
      toolCallId: 'read-1',
      toolName: 'read_file',
      args: { path: '/etc/hosts' },
      argsText: JSON.stringify({ path: '/etc/hosts' }),
      result: { content: '127.0.0.1 localhost' },
      ...(timestamps ? { timestamp: started + 0.2, completedAt: started + 1.2 } : {})
    }
  ]

  if (finalText) {
    content.push({
      type: 'text',
      text: finalText,
      ...(timestamps ? { timestamp: started + 1.3, completedAt: started + 1.5 } : {})
    })
  }

  return {
    id: 'assistant-1',
    role: 'assistant',
    content,
    status: running ? { type: 'running' } : { type: 'complete', reason: 'stop' },
    createdAt,
    metadata: assistantMetadata
  } as unknown as Extract<ThreadMessage, { role: 'assistant' }>
}

function Harness({ assistant }: { assistant: ThreadMessage }) {
  const runtime = useExternalStoreRuntime<ThreadMessage>({
    messages: [userMessage(), assistant],
    isRunning: assistant.status?.type === 'running',
    onNew: async () => {}
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  )
}

describe('execution trajectory collapse', () => {
  it('collapses preliminary reasoning and tools into a summary once final text exists', async () => {
    const { container } = render(<Harness assistant={trajectoryMessage()} />)

    expect(await screen.findByText(/Completed \d+ steps/i)).toBeTruthy()
    expect(screen.getByText('final answer here')).toBeTruthy()
    expect(container.querySelector('[data-slot="aui_thinking-disclosure"]')).toBeNull()
    expect(container.querySelector('[data-tool-row]')).toBeNull()
    expect(screen.queryByText('plan')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /Completed \d+ steps/i }))

    expect(container.querySelector('[data-slot="aui_thinking-disclosure"]')).toBeTruthy()
    expect(container.querySelector('[data-tool-row]')).toBeTruthy()
  })

  it('still shows the step summary when timestamps are missing', async () => {
    render(<Harness assistant={trajectoryMessage({ timestamps: false })} />)

    expect(await screen.findByText(/Completed \d+ steps/i)).toBeTruthy()
    expect(screen.getByText('final answer here')).toBeTruthy()
  })

  it('leaves reasoning and tools visible when the preference is off', async () => {
    $trajectoryCollapsedByDefault.set(false)

    const { container } = render(<Harness assistant={trajectoryMessage()} />)

    await screen.findByText('final answer here')

    expect(screen.queryByText(/Completed \d+ steps/i)).toBeNull()
    expect(container.querySelector('[data-slot="aui_thinking-disclosure"]')).toBeTruthy()
    expect(container.querySelector('[data-tool-row]')).toBeTruthy()
  })

  it('does not hide in-progress work when the turn has no final text yet', async () => {
    const { container } = render(<Harness assistant={trajectoryMessage({ finalText: '', running: true })} />)

    await waitFor(() => {
      expect(container.querySelector('[data-slot="aui_thinking-disclosure"]')).toBeTruthy()
    })
    expect(screen.queryByText(/Completed \d+ steps/i)).toBeNull()
    expect(container.querySelector('[data-tool-row]')).toBeTruthy()
  })

  it('waits for completion across intermediate text and later tools, preserving manual expansion', async () => {
    const intermediate = trajectoryMessage({ finalText: 'checking another file', running: true })
    const { container, rerender } = render(<Harness assistant={intermediate} />)

    await screen.findByText('checking another file')
    expect(screen.queryByText(/Completed \d+ steps/i)).toBeNull()
    expect(container.querySelector('[data-slot="aui_thinking-disclosure"]')).toBeTruthy()
    expect(container.querySelector('[data-tool-row]')).toBeTruthy()

    const laterTool = {
      ...intermediate.content[1],
      toolCallId: 'read-2'
    }

    const withLaterTool = {
      ...intermediate,
      content: [...intermediate.content, laterTool]
    } as Extract<ThreadMessage, { role: 'assistant' }>

    rerender(<Harness assistant={withLaterTool} />)
    await waitFor(() => expect(container.querySelectorAll('[data-tool-row]')).toHaveLength(2))
    expect(screen.queryByText(/Completed \d+ steps/i)).toBeNull()

    const complete = {
      ...withLaterTool,
      content: [...withLaterTool.content, { type: 'text', text: 'final answer here' }],
      status: { type: 'complete', reason: 'stop' }
    } as Extract<ThreadMessage, { role: 'assistant' }>

    rerender(<Harness assistant={complete} />)
    const summary = await screen.findByRole('button', { name: /Completed \d+ steps/i })
    expect(container.querySelector('[data-tool-row]')).toBeNull()
    fireEvent.click(summary)
    expect(container.querySelectorAll('[data-tool-row]')).toHaveLength(2)

    rerender(
      <Harness assistant={{ ...complete, content: [...complete.content, { type: 'text', text: 'more detail' }] }} />
    )
    await screen.findByText('more detail')
    expect(container.querySelectorAll('[data-tool-row]')).toHaveLength(2)
  })

  it('keeps a successful generated image directly visible alongside final text', async () => {
    const assistant = trajectoryMessage()

    const imageTool = {
      type: 'tool-call',
      toolCallId: 'image-1',
      toolName: 'image_generate',
      args: { prompt: 'draw a cat' },
      argsText: JSON.stringify({ prompt: 'draw a cat' }),
      result: { image: 'https://cdn.example/cat.png', success: true }
    }

    const { container } = render(
      <Harness
        assistant={
          {
            ...assistant,
            content: [...assistant.content.slice(0, -1), imageTool, assistant.content.at(-1)!]
          } as ThreadMessage
        }
      />
    )

    await screen.findByText('final answer here')
    await waitFor(() => expect(container.querySelector('img[src="https://cdn.example/cat.png"]')).toBeTruthy())
    const image = screen.getByRole('img', { name: 'Generated image' })
    fireEvent.load(image)
    expect(image.classList.contains('opacity-100')).toBe(true)
    expect(container.querySelector('[data-slot="aui_generated-image"]')).toBeTruthy()
    expect(screen.queryByText(/Completed \d+ steps/i)).toBeNull()
  })
})
