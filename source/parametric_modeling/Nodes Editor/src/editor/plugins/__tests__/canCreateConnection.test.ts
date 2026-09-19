import { describe, expect, it } from 'vitest'

import {
  addNode,
  connect,
  createHeadlessEditor,
  inputOfKind,
  outputOfKind,
} from '../../../testing/headlessEditor'
import { canCreateConnection } from '../createConnectionPlugin'

describe('canCreateConnection', () => {
  it('accepts sockets of the same kind', async () => {
    const editor = createHeadlessEditor()
    const number = await addNode(editor, 'Number')
    const box = await addNode(editor, 'Draw box')

    expect(
      canCreateConnection(editor, {
        source: number.id,
        sourceOutput: 'number',
        target: box.id,
        targetInput: inputOfKind(box, 'number'),
      })
    ).toBe(true)
  })

  it('refuses sockets of different kinds', async () => {
    const editor = createHeadlessEditor()
    const box = await addNode(editor, 'Draw box')
    const move = await addNode(editor, 'Move')

    expect(
      canCreateConnection(editor, {
        source: box.id,
        sourceOutput: outputOfKind(box, 'groups'),
        target: move.id,
        targetInput: inputOfKind(move, 'number'),
      })
    ).toBe(false)
  })

  it('refuses a second connection into an occupied input', async () => {
    const editor = createHeadlessEditor()
    const first = await addNode(editor, 'Number')
    const second = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')

    await connect(editor, first, 'number', add, 'number1')

    expect(
      canCreateConnection(editor, {
        source: second.id,
        sourceOutput: 'number',
        target: add.id,
        targetInput: 'number1',
      })
    ).toBe(false)
    expect(
      canCreateConnection(editor, {
        source: second.id,
        sourceOutput: 'number',
        target: add.id,
        targetInput: 'number2',
      })
    ).toBe(true)
  })

  it('refuses unknown nodes and ports', async () => {
    const editor = createHeadlessEditor()
    const number = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')

    expect(
      canCreateConnection(editor, {
        source: number.id,
        sourceOutput: 'nope',
        target: add.id,
        targetInput: 'number1',
      })
    ).toBe(false)
    expect(
      canCreateConnection(editor, {
        source: '999',
        sourceOutput: 'number',
        target: add.id,
        targetInput: 'number1',
      })
    ).toBe(false)
  })
})
