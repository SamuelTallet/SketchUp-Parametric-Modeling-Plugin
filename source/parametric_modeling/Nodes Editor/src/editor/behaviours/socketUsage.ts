import type { NodeEditor } from 'rete'

import type { Area } from '../plugins/createArea'
import type { Schemes } from '../types'

/** Keeps `node.usedSockets` up to date so connected sockets render as "used". */
export function trackSocketUsage(editor: NodeEditor<Schemes>, area: Area): void {
  editor.addPipe((context) => {
    if (context.type === 'connectioncreated' || context.type === 'connectionremoved') {
      const { source, sourceOutput, target, targetInput } = context.data
      const sourceNode = editor.getNode(source)
      const targetNode = editor.getNode(target)
      const add = context.type === 'connectioncreated'

      if (sourceNode) {
        sourceNode.usedSockets[add ? 'add' : 'delete'](`output:${sourceOutput}`)
        void area.update('node', source)
      }

      if (targetNode) {
        targetNode.usedSockets[add ? 'add' : 'delete'](`input:${targetInput}`)
        void area.update('node', target)
      }
    }

    return context
  })
}
