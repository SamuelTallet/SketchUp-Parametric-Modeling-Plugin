import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { BaseConnection } from '../../editor/BaseConnection'
import { deserializeSchema } from '../deserializeSchema'
import { NodeIdAllocator } from '../nodeIds'
import { isCompatibleSchema } from '../schemaId'
import type { SchemaJson } from '../SchemaJson'
import { serializeSchema, type Position } from '../serializeSchema'

const SCHEMAS_DIR = join(__dirname, '../../../../Schemas')
const SCHEMA_VERSION = '1.0.0'

/** In-memory stand-in for the editor + area. */
function createMemoryTarget() {
  const nodes: BaseNode[] = []
  const connections: BaseConnection[] = []
  const positions = new Map<string, Position>()

  return {
    nodes,
    connections,
    positionOf: (nodeId: string) => positions.get(nodeId) ?? { x: 0, y: 0 },
    addNode(node: BaseNode, position: Position) {
      nodes.push(node)
      positions.set(node.id, position)
      return Promise.resolve()
    },
    addConnection(connection: BaseConnection) {
      connections.push(connection)
      return Promise.resolve()
    },
  }
}

describe('schema round trip', () => {
  const files = readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith('.schema'))

  it('finds the bundled example schemas', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    it(`${file} survives deserialize → serialize unchanged`, async () => {
      await expectRoundTrip(file)
    })
  }
})

/**
 * Older schema files predate some ports (e.g. the "Parent point" input of Point nodes).
 * Like Rete.js v1, the serializer lists every current port, so added ports must simply be empty.
 */
function expectSameSchema(serialized: SchemaJson, original: SchemaJson): void {
  expect(serialized.id).toBe(original.id)
  expect(Object.keys(serialized.nodes)).toEqual(Object.keys(original.nodes))

  for (const [key, originalNode] of Object.entries(original.nodes)) {
    const serializedNode = serialized.nodes[key]

    expect(serializedNode).toBeDefined()

    if (!serializedNode) {
      continue
    }

    expect(serializedNode.id).toBe(originalNode.id)
    expect(serializedNode.name).toBe(originalNode.name)
    expect(serializedNode.data).toEqual(originalNode.data)
    expect(serializedNode.position).toEqual(originalNode.position)
    expectSamePorts(serializedNode.inputs, originalNode.inputs)
    expectSamePorts(serializedNode.outputs, originalNode.outputs)
  }
}

function expectSamePorts(
  serialized: Record<string, { connections: unknown[] }>,
  original: Record<string, { connections: unknown[] }>
): void {
  for (const [key, port] of Object.entries(serialized)) {
    const originalPort = original[key]

    if (originalPort) {
      expect(port).toEqual(originalPort)
    } else {
      expect(port.connections).toEqual([])
    }
  }

  expect(Object.keys(original).every((key) => key in serialized)).toBe(true)
}

async function expectRoundTrip(file: string): Promise<void> {
  {
    const original: unknown = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), 'utf8'))

    expect(isCompatibleSchema(original, SCHEMA_VERSION)).toBe(true)

    if (!isCompatibleSchema(original, SCHEMA_VERSION)) {
      return
    }

    const target = createMemoryTarget()
    const allocator = new NodeIdAllocator()

    await deserializeSchema(original, target, allocator)

    const serialized = serializeSchema(target, SCHEMA_VERSION)

    expectSameSchema(serialized, original)

    const maxId = Math.max(...Object.values(original.nodes).map((node) => node.id))

    expect(allocator.allocate()).toBe(String(maxId + 1))
  }
}

describe('isCompatibleSchema', () => {
  it('rejects another schema version', () => {
    expect(isCompatibleSchema({ id: 'ParametricModeling@0.9.0', nodes: {} }, SCHEMA_VERSION)).toBe(
      false
    )
  })

  it('rejects unknown node names', () => {
    const schema = {
      id: 'ParametricModeling@1.0.0',
      nodes: {
        '1': { id: 1, data: {}, inputs: {}, outputs: {}, position: [0, 0], name: 'Teleport' },
      },
    }

    expect(isCompatibleSchema(schema, SCHEMA_VERSION)).toBe(false)
  })
})
