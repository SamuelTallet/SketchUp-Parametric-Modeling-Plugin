import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Bridge } from '../../../bridge/Bridge'
import type { SchemaJson } from '../../../schema/SchemaJson'
import { addNode, createHeadlessEditor } from '../../../testing/headlessEditor'
import { controlEvents } from '../../controls/controlEvents'
import { NumberControl } from '../../controls/NumberControl'
import { createEngine } from '../../engine/createEngine'
import type { Area } from '../../plugins/createArea'
import { createSchemaSync } from '../schemaSync'

type AreaPipe = (context: { type: string; data: unknown }) => unknown

function createFixture() {
  const editor = createHeadlessEditor()
  const engine = createEngine(editor)
  const positions = new Map<string, { position: { x: number; y: number } }>()
  let areaPipe: AreaPipe = (context) => context
  const area = {
    addPipe: (pipe: AreaPipe) => {
      areaPipe = pipe
    },
    nodeViews: positions,
  } as unknown as Area
  const exportModelSchema = vi.fn<Bridge['exportModelSchema']>()
  const bridge: Bridge = {
    ready: vi.fn(),
    exportModelSchema,
    importSchemaFromFile: vi.fn(),
    exportSchemaToFile: vi.fn(),
    freezeParametricEntities: vi.fn(),
    accessOnlineHelp: vi.fn(),
  }
  const sync = createSchemaSync({ editor, area, engine, bridge, schemaVersion: '1.0.0' })

  return {
    editor,
    positions,
    bridge,
    sync,
    exportCalls: () => exportModelSchema.mock.calls,
    drag: (nodeId: string) => areaPipe({ type: 'nodedragged', data: editor.getNode(nodeId) }),
  }
}

describe('createSchemaSync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exports nothing until enabled', async () => {
    const { editor, sync, exportCalls } = createFixture()

    await addNode(editor, 'Number')
    vi.runAllTimers()

    expect(exportCalls()).toHaveLength(0)
    sync.destroy()
  })

  it('merges the structural changes of one task into a single redraw export', async () => {
    const { editor, positions, sync, exportCalls } = createFixture()

    sync.enable()

    const first = await addNode(editor, 'Number', { number: '1' })
    const second = await addNode(editor, 'Add')

    positions.set(first.id, { position: { x: 10, y: 20 } })
    vi.runAllTimers()

    const calls = exportCalls()

    expect(calls).toHaveLength(1)

    const [json, redraw] = calls[0] ?? ['', false]
    const schema = JSON.parse(json) as SchemaJson

    expect(redraw).toBe(true)
    expect(Object.keys(schema.nodes)).toEqual([first.id, second.id])
    expect(schema.nodes[first.id]?.position).toEqual([10, 20])
    expect(schema.nodes[first.id]?.data).toEqual({ number: '1' })
    expect(schema.nodes[second.id]?.position).toEqual([0, 0])
    sync.destroy()
  })

  it('exports a drag without redraw', async () => {
    const { editor, sync, drag, exportCalls } = createFixture()

    const node = await addNode(editor, 'Number')

    sync.enable()
    drag(node.id)
    vi.runAllTimers()

    expect(exportCalls()).toEqual([[expect.any(String), false]])
    sync.destroy()
  })

  it('keeps the redraw when a drag and a structural change share a task', async () => {
    const { editor, sync, drag, exportCalls } = createFixture()

    const node = await addNode(editor, 'Number')

    sync.enable()
    drag(node.id)
    await editor.removeNode(node.id)
    vi.runAllTimers()

    expect(exportCalls()).toEqual([[expect.any(String), true]])
    sync.destroy()
  })

  it('redraws on a control change, except for comments', async () => {
    const { editor, sync, exportCalls } = createFixture()

    const number = await addNode(editor, 'Number')
    const comment = await addNode(editor, 'Comment')

    sync.enable()
    controlEvents.emit({ node: comment, control: new NumberControl(comment, 'text') })
    vi.runAllTimers()
    controlEvents.emit({ node: number, control: new NumberControl(number, 'number') })
    vi.runAllTimers()

    expect(exportCalls().map(([, redraw]) => redraw)).toEqual([false, true])
    sync.destroy()
  })

  it('stops listening to controls once destroyed', async () => {
    const { editor, sync, exportCalls } = createFixture()

    const number = await addNode(editor, 'Number')

    sync.enable()
    sync.destroy()
    controlEvents.emit({ node: number, control: new NumberControl(number, 'number') })
    vi.runAllTimers()

    expect(exportCalls()).toHaveLength(0)
  })
})
