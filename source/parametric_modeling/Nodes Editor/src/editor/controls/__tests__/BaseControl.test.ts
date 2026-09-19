import { describe, expect, it, vi } from 'vitest'

import { createNode } from '../../nodes/registry'
import { controlEvents } from '../controlEvents'
import { NumberControl } from '../NumberControl'

describe('BaseControl', () => {
  it('reads and writes the node value under its key', () => {
    const node = createNode('Number', { number: 4 })
    const control = new NumberControl(node, 'number')

    expect(control.getValue()).toBe(4)

    control.setValue(5)

    expect(node.values.number).toBe(5)
  })

  it('treats null as undefined', () => {
    const node = createNode('Number', { number: null })

    expect(new NumberControl(node, 'number').getValue()).toBeUndefined()
  })

  it('notifies its subscribers and the editor on a change', () => {
    const node = createNode('Number')
    const control = new NumberControl(node, 'number')
    const view = vi.fn()
    const editor = vi.fn()
    const unsubscribeView = control.subscribe(view)
    const unsubscribeEditor = controlEvents.subscribe(editor)

    control.setValue(1)

    expect(view).toHaveBeenCalledTimes(1)
    expect(editor).toHaveBeenCalledWith({ node, control })

    unsubscribeView()
    unsubscribeEditor()
    control.setValue(2)

    expect(view).toHaveBeenCalledTimes(1)
    expect(editor).toHaveBeenCalledTimes(1)
  })

  it('skips the editor-level event when silent', () => {
    const node = createNode('Number')
    const control = new NumberControl(node, 'number')
    const view = vi.fn()
    const editor = vi.fn()
    const unsubscribeEditor = controlEvents.subscribe(editor)

    control.subscribe(view)
    control.setValue(1, { silent: true })
    unsubscribeEditor()

    expect(view).toHaveBeenCalledTimes(1)
    expect(editor).not.toHaveBeenCalled()
  })
})
