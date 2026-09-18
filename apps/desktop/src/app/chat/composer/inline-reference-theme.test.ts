// @vitest-environment node
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compile } from '@tailwindcss/node'
import { describe, expect, it } from 'vitest'

const SRC = dirname(fileURLToPath(import.meta.url))

async function compiledStyles(): Promise<string> {
  const { build } = await compile('@import "../../../styles.css";\n', { base: SRC, onDependency() {} })

  return build([])
}

describe('inline references in dark themes', () => {
  it('keeps default and group mention references on readable foreground-accent mixes', async () => {
    const css = await compiledStyles()

    for (const selector of [
      ':root.dark .ref',
      ":root.dark [data-ref='agent']",
      ":root.dark [data-ref='human']",
      ":root.dark [data-ref='broadcast']"
    ]) {
      const rule = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1]

      expect(rule, `${selector} must override the dark-invisible primary fallback`).toMatch(
        /--ref-color:\s*color-mix\(in srgb, var\(--(?:dt-foreground|ui-(?:accent|warm))\) \d+%, var\(--(?:dt-foreground|ui-accent)\)\)/
      )
    }
  })
})
