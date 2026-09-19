import type { NodeName } from '../editor/nodes/nodeNames'
import type { NodeValues } from '../editor/nodes/BaseNode'

/**
 * Schema file format (also stored in the SketchUp model attributes).
 * It is the JSON produced by Rete.js v1 `editor.toJSON()`, kept unchanged so that
 * existing `.schema` files and the Ruby side keep working.
 */
export interface SchemaJson {
  /** `ParametricModeling@<schema version>` */
  id: string
  /** Nodes keyed by their id (as a string). */
  nodes: Record<string, SchemaNodeJson>
}

export interface SchemaNodeJson {
  id: number
  data: NodeValues
  inputs: Record<string, SchemaInputJson>
  outputs: Record<string, SchemaOutputJson>
  position: [x: number, y: number]
  name: NodeName
}

export interface SchemaInputJson {
  connections: SchemaInputConnectionJson[]
}

export interface SchemaOutputJson {
  connections: SchemaOutputConnectionJson[]
}

/** Seen from an input: the node and output key it is connected to. */
export interface SchemaInputConnectionJson {
  node: number
  output: string
  data: Record<string, never>
}

/** Seen from an output: the node and input key it is connected to. */
export interface SchemaOutputConnectionJson {
  node: number
  input: string
  data: Record<string, never>
}
