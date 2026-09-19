import { describe, expect, it } from 'vitest'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { BaseConnection } from '../../editor/BaseConnection'
import { deserializeSchema } from '../deserializeSchema'
import { NodeIdAllocator } from '../nodeIds'
import type { SchemaJson } from '../SchemaJson'

function createMemoryTarget() {
  const nodes: BaseNode[] = []
  const connections: BaseConnection[] = []

  return {
    nodes,
    connections,
    addNode(node: BaseNode) {
      nodes.push(node)
      return Promise.resolve()
    },
    addConnection(connection: BaseConnection) {
      connections.push(connection)
      return Promise.resolve()
    },
  }
}

describe('deserializeSchema', () => {
  it('skips links to missing nodes or ports and keeps the valid ones', async () => {
    const schema: SchemaJson = {
      id: 'ParametricModeling@1.0.0',
      nodes: {
        '3': {
          id: 3,
          data: { number: '2' },
          inputs: {},
          outputs: {
            number: {
              connections: [
                { node: 7, input: 'number1', data: {} },
                { node: 99, input: 'number1', data: {} },
                { node: 7, input: 'nope', data: {} },
              ],
            },
            nope: { connections: [{ node: 7, input: 'number2', data: {} }] },
          },
          position: [0, 0],
          name: 'Number',
        },
        '7': {
          id: 7,
          data: {},
          inputs: { number1: { connections: [{ node: 3, output: 'number', data: {} }] } },
          outputs: {},
          position: [100, 0],
          name: 'Add',
        },
      },
    }
    const target = createMemoryTarget()
    const allocator = new NodeIdAllocator()

    await deserializeSchema(schema, target, allocator)

    expect(target.nodes.map((node) => [node.id, node.name])).toEqual([
      ['3', 'Number'],
      ['7', 'Add'],
    ])
    expect(target.nodes[0]?.values).toEqual({ number: '2' })
    expect(
      target.connections.map((c) => [c.source, c.sourceOutput, c.target, c.targetInput])
    ).toEqual([['3', 'number', '7', 'number1']])
    expect(allocator.allocate()).toBe('8')
  })
})
