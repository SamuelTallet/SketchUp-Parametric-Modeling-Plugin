import { describe, expect, it } from 'vitest'

import { addNode, connect, createHeadlessEditor } from '../../../testing/headlessEditor'
import { removeNode } from '../createContextMenu'

describe('removeNode', () => {
  it('removes a node together with its connections', async () => {
    const editor = createHeadlessEditor()
    const number = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')
    const multiply = await addNode(editor, 'Multiply')

    await connect(editor, number, 'number', add, 'number1')
    await connect(editor, add, 'number', multiply, 'number1')

    await removeNode(editor, add.id)

    expect(editor.getNode(add.id)).toBeUndefined()
    expect(editor.getConnections()).toEqual([])
    expect(editor.getNodes().map((node) => node.id)).toEqual([number.id, multiply.id])
  })
})
