import { describe, expect, it, vi } from 'vitest'

import { addNode, createHeadlessEditor } from '../../../testing/headlessEditor'
import type { Area } from '../../plugins/createArea'
import { createInvalidNodes } from '../invalidNodes'

describe('createInvalidNodes', () => {
  it('flags a node by its integer id and re-renders it', async () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const invalidNodes = createInvalidNodes(editor, { update } as unknown as Area)
    const node = await addNode(editor, 'Number')

    invalidNodes.tagNodeAsInvalid(Number(node.id))

    expect(node.invalid).toBe(true)
    expect(update).toHaveBeenCalledWith('node', node.id)
  })

  it('ignores unknown ids', () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const invalidNodes = createInvalidNodes(editor, { update } as unknown as Area)

    invalidNodes.tagNodeAsInvalid(42)

    expect(update).not.toHaveBeenCalled()
  })

  it('clears every flagged node and re-renders only those', async () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const invalidNodes = createInvalidNodes(editor, { update } as unknown as Area)
    const flagged = await addNode(editor, 'Number')
    const untouched = await addNode(editor, 'Number')

    invalidNodes.tagNodeAsInvalid(Number(flagged.id))
    update.mockClear()
    invalidNodes.tagNodesAsValid()

    expect(flagged.invalid).toBe(false)
    expect(untouched.invalid).toBe(false)
    expect(update.mock.calls).toEqual([['node', flagged.id]])
  })
})
