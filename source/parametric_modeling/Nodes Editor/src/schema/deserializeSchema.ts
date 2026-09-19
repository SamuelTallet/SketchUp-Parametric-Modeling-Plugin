import type { BaseNode } from '../editor/nodes/BaseNode'
import { createNode } from '../editor/nodes/registry'
import { BaseConnection } from '../editor/BaseConnection'
import type { NodeIdAllocator } from './nodeIds'
import type { SchemaJson } from './SchemaJson'
import type { Position } from './serializeSchema'

/** Where deserialized nodes and connections go (the editor and area in the app, maps in tests). */
export interface SchemaTarget {
  addNode(node: BaseNode, position: Position): Promise<void>
  addConnection(connection: BaseConnection): Promise<void>
}

/**
 * Rebuilds nodes and connections from a schema.
 * Connections are read from the `outputs` side, in file order, which also fixes their order.
 */
export async function deserializeSchema(
  schema: SchemaJson,
  target: SchemaTarget,
  idAllocator: NodeIdAllocator
): Promise<void> {
  const nodesById = new Map<string, BaseNode>()
  const entries = Object.values(schema.nodes)

  for (const entry of entries) {
    const node = createNode(entry.name, entry.data)

    node.id = String(entry.id)
    idAllocator.reserve(entry.id)
    nodesById.set(node.id, node)

    await target.addNode(node, { x: entry.position[0], y: entry.position[1] })
  }

  for (const entry of entries) {
    const source = nodesById.get(String(entry.id))

    if (!source) {
      continue
    }

    for (const [outputKey, output] of Object.entries(entry.outputs)) {
      for (const link of output.connections) {
        const targetNode = nodesById.get(String(link.node))

        if (!targetNode || !source.hasOutput(outputKey) || !targetNode.hasInput(link.input)) {
          continue
        }

        await target.addConnection(new BaseConnection(source, outputKey, targetNode, link.input))
      }
    }
  }
}
