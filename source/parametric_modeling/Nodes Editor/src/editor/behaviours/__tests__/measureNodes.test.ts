// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import { addNode, createHeadlessEditor } from '../../../testing/headlessEditor'
import type { Area } from '../../plugins/createArea'
import { measureNodes } from '../measureNodes'

type Pipe = (context: unknown) => unknown

describe('measureNodes', () => {
  it('stores the rendered size of a node', async () => {
    const editor = createHeadlessEditor()
    let pipe: Pipe = (context) => context
    const area = {
      addPipe: (added: Pipe) => {
        pipe = added
      },
    } as unknown as Area

    measureNodes(editor, area)

    const node = await addNode(editor, 'Number')
    const element = document.createElement('div')
    const nodeElement = document.createElement('div')

    nodeElement.className = 'node'
    Object.defineProperty(nodeElement, 'offsetWidth', { value: 180 })
    Object.defineProperty(nodeElement, 'offsetHeight', { value: 96 })
    element.append(nodeElement)

    pipe({ type: 'rendered', data: { type: 'node', payload: node, element } })

    expect(node.width).toBe(180)
    expect(node.height).toBe(96)
  })
})
