// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

import { addNode, connect, createHeadlessEditor } from '../../../testing/headlessEditor'
import type { Area } from '../../plugins/createArea'
import { createConnectionSelection } from '../connectionSelection'

function renderConnection(id: string): SVGPathElement {
  const wrapper = document.createElement('div')

  // Same shape as Connection.tsx: the id sits on the SVG, and the invisible hit path,
  // not the visible one, is what the pointer lands on.
  wrapper.innerHTML = `<svg class="connection" data-connection-id="${id}"><path class="hit-path"></path><path class="main-path"></path></svg>`
  document.body.append(wrapper)

  return wrapper.querySelector('.hit-path')!
}

describe('createConnectionSelection', () => {
  it('selects the pressed connection and deselects the previous one', async () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const selection = createConnectionSelection(editor, { update } as unknown as Area)
    const number = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')
    const first = await connect(editor, number, 'number', add, 'number1')
    const second = await connect(editor, number, 'number', add, 'number2')

    renderConnection(first.id).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(first.selected).toBe(true)
    expect(second.selected).toBeUndefined()
    expect(update.mock.calls).toEqual([['connection', first.id]])

    renderConnection(second.id).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(first.selected).toBe(false)
    expect(second.selected).toBe(true)

    selection.destroy()
  })

  it('ignores presses elsewhere and stops after destroy', async () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const selection = createConnectionSelection(editor, { update } as unknown as Area)
    const number = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')
    const connection = await connect(editor, number, 'number', add, 'number1')
    const path = renderConnection(connection.id)

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(update).not.toHaveBeenCalled()

    selection.destroy()
    path.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(update).not.toHaveBeenCalled()
  })
})
