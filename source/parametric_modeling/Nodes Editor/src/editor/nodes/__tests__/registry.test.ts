import { describe, expect, it } from 'vitest'

import { BaseControl } from '../../controls/BaseControl'
import { NODE_NAMES } from '../nodeNames'
import { createNode, NODE_FACTORIES, TOOLBAR_ORDER } from '../registry'

describe('NODE_FACTORIES', () => {
  it('builds a node of the right name for every known name', () => {
    for (const name of NODE_NAMES) {
      expect(NODE_FACTORIES[name]().name).toBe(name)
    }
  })

  it('builds a fresh instance on every call', () => {
    expect(NODE_FACTORIES.Add()).not.toBe(NODE_FACTORIES.Add())
  })

  it('gives every node a data() result with exactly its output keys (engine contract)', () => {
    for (const name of NODE_NAMES) {
      const node = createNode(name)

      expect(Object.keys(node.data({})).sort(), name).toEqual(Object.keys(node.outputs).sort())
    }
  })

  it('gives every input control the key of its input', () => {
    const mismatches: string[] = []

    for (const name of NODE_NAMES) {
      const node = createNode(name)

      for (const [key, input] of Object.entries(node.inputs)) {
        const control = input?.control

        if (control instanceof BaseControl && control.key !== key) {
          mismatches.push(`${name}.${key} -> ${control.key}`)
        }
      }
    }

    expect(mismatches).toEqual([])
  })
})

describe('createNode', () => {
  it('copies the given values instead of sharing them', () => {
    const values = { number: 1 }
    const node = createNode('Number', values)

    values.number = 2

    expect(node.values).toEqual({ number: 1 })
  })

  it('starts with empty values otherwise', () => {
    expect(createNode('Add').values).toEqual({})
  })
})

describe('TOOLBAR_ORDER', () => {
  it('offers every node except the shape (added by SketchUp) and the comment (context menu)', () => {
    const expected = NODE_NAMES.filter((name) => name !== 'Draw shape' && name !== 'Comment')

    expect([...TOOLBAR_ORDER]).toEqual(expected)
  })
})
