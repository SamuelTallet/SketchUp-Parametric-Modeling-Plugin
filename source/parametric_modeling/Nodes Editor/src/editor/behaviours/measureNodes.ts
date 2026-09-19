import type { NodeEditor } from 'rete'

import type { Area } from '../plugins/createArea'
import type { Schemes } from '../types'

/** Records the rendered size of each node; the minimap draws nodes with it. */
export function measureNodes(editor: NodeEditor<Schemes>, area: Area): void {
  area.addPipe((context) => {
    if (context.type === 'rendered' && context.data.type === 'node') {
      const node = editor.getNode(context.data.payload.id)
      const element = context.data.element.querySelector<HTMLElement>('.node')

      if (node && element) {
        node.width = element.offsetWidth
        node.height = element.offsetHeight
      }
    }

    return context
  })
}
