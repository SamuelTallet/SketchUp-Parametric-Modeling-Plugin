import { describe, expect, it } from 'vitest'

import { addNode, connect, createHeadlessEditor } from '../../../testing/headlessEditor'
import { createEngine, runEngine } from '../createEngine'

describe('runEngine', () => {
  it('propagates values through connections to the previews', async () => {
    const editor = createHeadlessEditor()
    const engine = createEngine(editor)
    const two = await addNode(editor, 'Number', { number: 2 })
    const three = await addNode(editor, 'Number', { number: 3 })
    const ten = await addNode(editor, 'Number', { number: 10 })
    const add = await addNode(editor, 'Add')
    const multiply = await addNode(editor, 'Multiply')

    await connect(editor, two, 'number', add, 'number1')
    await connect(editor, three, 'number', add, 'number2')
    await connect(editor, add, 'number', multiply, 'number1')
    await connect(editor, ten, 'number', multiply, 'number2')

    await runEngine(engine, editor)

    expect(add.values.preview).toBe(5)
    expect(multiply.values.preview).toBe(50)
  })

  it('recomputes from scratch on every run', async () => {
    const editor = createHeadlessEditor()
    const engine = createEngine(editor)
    const number = await addNode(editor, 'Number', { number: 2 })
    const add = await addNode(editor, 'Add', { number2: '1' })

    await connect(editor, number, 'number', add, 'number1')
    await runEngine(engine, editor)
    expect(add.values.preview).toBe(3)

    number.values.number = 4
    await runEngine(engine, editor)
    expect(add.values.preview).toBe(5)
  })

  it('ignores nodes removed while it runs', async () => {
    const editor = createHeadlessEditor()
    const engine = createEngine(editor)
    const remover = await addNode(editor, 'Number')
    const victim = await addNode(editor, 'Number')

    // Computing the first node removes the second one, as "Remove all nodes" would meanwhile.
    remover.data = () => {
      void editor.removeNode(victim.id)
      return { number: 0 }
    }

    await expect(runEngine(engine, editor)).resolves.toBeUndefined()
    expect(editor.getNode(victim.id)).toBeUndefined()
  })

  it('reports genuine computation errors', async () => {
    const editor = createHeadlessEditor()
    const engine = createEngine(editor)
    const broken = await addNode(editor, 'Number')

    broken.data = () => {
      throw new Error('boom')
    }

    await expect(runEngine(engine, editor)).rejects.toThrow('boom')
  })
})
