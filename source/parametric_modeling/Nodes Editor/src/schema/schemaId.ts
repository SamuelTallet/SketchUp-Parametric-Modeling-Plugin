import { isNodeName } from '../editor/nodes/nodeNames'
import type { SchemaJson } from './SchemaJson'

/** Same as `ParametricModeling::CODE_NAME` on the Ruby side. */
export const CODE_NAME = 'ParametricModeling'

export function schemaId(schemaVersion: string): string {
  return `${CODE_NAME}@${schemaVersion}`
}

export function emptySchema(schemaVersion: string): SchemaJson {
  return { id: schemaId(schemaVersion), nodes: {} }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Structural check of a schema, including the version stamp in its `id`. */
export function isCompatibleSchema(
  candidate: unknown,
  schemaVersion: string
): candidate is SchemaJson {
  if (
    !isRecord(candidate) ||
    candidate.id !== schemaId(schemaVersion) ||
    !isRecord(candidate.nodes)
  ) {
    return false
  }

  return Object.values(candidate.nodes).every(
    (node) =>
      isRecord(node) &&
      typeof node.id === 'number' &&
      isRecord(node.data) &&
      isRecord(node.inputs) &&
      isRecord(node.outputs) &&
      Array.isArray(node.position) &&
      node.position.length === 2 &&
      isNodeName(node.name)
  )
}
