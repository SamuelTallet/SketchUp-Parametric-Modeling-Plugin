import type { NodeName } from './nodes/nodeNames'
import type { NodeValues } from './nodes/BaseNode'

/** What the React layer and the Ruby-facing API can do with a running editor. */
export interface EditorHandle {
  /** Adds a node at the pointer position; it follows the pointer until the next press. */
  addNode(name: NodeName, values?: NodeValues): Promise<void>
  tagNodesAsValid(): void
  tagNodeAsInvalid(nodeId: number): void
  toggleMinimap(): void
  destroy(): void
}
