import type { NodeEditor } from 'rete'

import type { Area } from '../plugins/createArea'
import type { Schemes } from '../types'

export interface InvalidNodes {
  tagNodesAsValid(): void
  tagNodeAsInvalid(nodeId: number): void
}

/** Red border on nodes the Ruby side failed to compute. */
export function createInvalidNodes(editor: NodeEditor<Schemes>, area: Area): InvalidNodes {
  return {
    tagNodesAsValid() {
      for (const node of editor.getNodes()) {
        if (node.invalid) {
          node.invalid = false
          void area.update('node', node.id)
        }
      }
    },
    tagNodeAsInvalid(nodeId) {
      const node = editor.getNode(String(nodeId))

      if (node) {
        node.invalid = true
        void area.update('node', node.id)
      }
    },
  }
}
