import type { BaseNode } from '../editor/nodes/BaseNode'
import type { BaseConnection } from '../editor/BaseConnection'
import { schemaId } from './schemaId'
import type { SchemaInputJson, SchemaJson, SchemaNodeJson, SchemaOutputJson } from './SchemaJson'

export interface Position {
  x: number
  y: number
}

/** What the serializer needs to know about the editor (kept abstract so tests run without a DOM). */
export interface SchemaSource {
  nodes: BaseNode[]
  connections: BaseConnection[]
  positionOf(nodeId: string): Position
}

function nodeNumericId(node: BaseNode): number {
  return parseInt(node.id, 10)
}

function serializeNode(node: BaseNode, source: SchemaSource): SchemaNodeJson {
  const inputs: Record<string, SchemaInputJson> = {}
  const outputs: Record<string, SchemaOutputJson> = {}
  const nodesById = new Map(source.nodes.map((candidate) => [candidate.id, candidate]))

  for (const key of Object.keys(node.inputs)) {
    inputs[key] = {
      connections: source.connections
        .filter((connection) => connection.target === node.id && connection.targetInput === key)
        .map((connection) => {
          const sourceNode = nodesById.get(connection.source)

          return {
            node: sourceNode ? nodeNumericId(sourceNode) : parseInt(connection.source, 10),
            output: connection.sourceOutput,
            data: {},
          }
        }),
    }
  }

  for (const key of Object.keys(node.outputs)) {
    outputs[key] = {
      connections: source.connections
        .filter((connection) => connection.source === node.id && connection.sourceOutput === key)
        .map((connection) => {
          const targetNode = nodesById.get(connection.target)

          return {
            node: targetNode ? nodeNumericId(targetNode) : parseInt(connection.target, 10),
            input: connection.targetInput,
            data: {},
          }
        }),
    }
  }

  const { x, y } = source.positionOf(node.id)

  return {
    id: nodeNumericId(node),
    data: { ...node.values },
    inputs,
    outputs,
    position: [x, y],
    name: node.name,
  }
}

/** Serializes the editor content in the Rete.js v1 JSON format used by the schema files. */
export function serializeSchema(source: SchemaSource, schemaVersion: string): SchemaJson {
  const nodes: Record<string, SchemaNodeJson> = {}

  for (const node of source.nodes) {
    nodes[node.id] = serializeNode(node, source)
  }

  return { id: schemaId(schemaVersion), nodes }
}
