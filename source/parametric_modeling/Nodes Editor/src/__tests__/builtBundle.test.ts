import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { parse } from 'acorn'
import { JSDOM, VirtualConsole, type DOMWindow } from 'jsdom'
import { describe, expect, it } from 'vitest'

import type { SchemaJson } from '../schema/SchemaJson'
import { removeApisMissingInChrome52 } from '../testing/chrome52'

/** The committed bundle the plugin ships; `npm run build` regenerates it. */
const BUNDLE_PATH = join(__dirname, '..', '..', '..', 'HTML Dialogs', 'nodes-editor.html')
const STORAGE_KEY = 'pmg.nodes-editor.schema'

const html = readFileSync(BUNDLE_PATH, 'utf8')

/** Number(2) wired into Add, whose second input is 3: the Add preview must read 5. */
const schema: SchemaJson = {
  id: 'ParametricModeling@1.0.0',
  nodes: {
    '1': {
      id: 1,
      data: { number: 2 },
      inputs: {},
      outputs: { number: { connections: [{ node: 2, input: 'number1', data: {} }] } },
      position: [40, 40],
      name: 'Number',
    },
    '2': {
      id: 2,
      data: { number2: 3 },
      inputs: { number1: { connections: [{ node: 1, output: 'number', data: {} }] } },
      outputs: { number: { connections: [] } },
      position: [320, 40],
      name: 'Add',
    },
  },
}

function scripts(): { attributes: string; code: string }[] {
  return [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map((match) => ({
    attributes: match[1] ?? '',
    code: match[2] ?? '',
  }))
}

async function waitFor(condition: () => boolean, timeoutMs = 5000): Promise<void> {
  const start = Date.now()

  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for the bundle: ${condition.toString()}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 20))
  }
}

/** Loads the bundle in a jsdom window trimmed down to the API surface of Chrome 52. */
async function bootBundle(): Promise<{ window: DOMWindow; errors: string[] }> {
  const errors: string[] = []
  const virtualConsole = new VirtualConsole()

  virtualConsole.on('jsdomError', (error: Error) => {
    // "Not implemented" messages are jsdom limitations, not bundle errors.
    if (!error.message.startsWith('Not implemented')) {
      errors.push(error.message)
    }
  })
  virtualConsole.on('error', (...args: unknown[]) => {
    errors.push(args.map(String).join(' '))
  })

  const { window } = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(page) {
      removeApisMissingInChrome52(page)
      page.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema))
    },
  })

  await waitFor(() => window.document.querySelector('#pmg-nodes-editor[data-ready]') !== null)

  return { window, errors }
}

function storedSchema(window: DOMWindow): SchemaJson {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as SchemaJson
}

describe('built bundle', () => {
  it('is a single page with one classic inline script and no external resource', () => {
    const inline = scripts()

    expect(inline).toHaveLength(1)
    expect(inline[0]?.attributes).not.toMatch(/type=|src=/)
    expect(html).not.toMatch(/<(script|link|img)[^>]+(src|href)=["'](?!data:)/)
  })

  it('uses only ES2015 syntax, as SketchUp 2017 requires', () => {
    for (const { code } of scripts()) {
      expect(() => parse(code, { ecmaVersion: 2015, sourceType: 'script' })).not.toThrow()
    }
  })

  describe('with the API surface of Chrome 52 (jsdom)', () => {
    it('boots, renders the schema and computes the previews', async () => {
      const { window, errors } = await bootBundle()
      const { document } = window

      expect(document.querySelectorAll('.node.number')).toHaveLength(1)
      expect(document.querySelectorAll('.node.add')).toHaveLength(1)
      // jsdom has no layout, so Rete draws no connection path; the used sockets prove the link.
      expect(document.querySelectorAll('[data-used="true"] .socket')).toHaveLength(2)
      expect(document.querySelector<HTMLInputElement>('.node.add input[readonly]')?.value).toBe('5')
      expect(errors).toEqual([])
      // The mask held: nothing polyfills this one, so it must stay absent.
      expect('getRootNode' in window.Node.prototype).toBe(false)
    })

    it('adds nodes through the Ruby-facing API and exports the schema', async () => {
      const { window, errors } = await bootBundle()

      window.PMG?.NodesEditor.addNode('Draw box', { width: 7 })
      await waitFor(() => window.document.querySelectorAll('.node').length === 3)
      await waitFor(() => Object.keys(storedSchema(window).nodes).length === 3)

      const exported = storedSchema(window)

      expect(exported.nodes['3']).toMatchObject({ id: 3, name: 'Draw box', data: { width: 7 } })
      expect(errors).toEqual([])
    })

    it('flags and unflags invalid nodes', async () => {
      const { window, errors } = await bootBundle()
      const { document } = window

      window.PMG?.NodesEditor.tagNodeAsInvalid(2)
      await waitFor(() => document.querySelectorAll('.node.invalid').length === 1)
      expect(document.querySelector('.node.invalid')?.classList.contains('add')).toBe(true)

      window.PMG?.NodesEditor.tagNodesAsValid()
      await waitFor(() => document.querySelectorAll('.node.invalid').length === 0)
      expect(errors).toEqual([])
    })
  })
})
