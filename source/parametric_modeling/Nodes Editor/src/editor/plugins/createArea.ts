import type { NodeEditor } from 'rete'
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin'

import type { AreaExtra, Schemes } from '../types'

export type Area = AreaPlugin<Schemes, AreaExtra>

export interface AreaSetup {
  area: Area
  selector: ReturnType<typeof AreaExtensions.selector>
  accumulating: ReturnType<typeof AreaExtensions.accumulateOnCtrl>
}

/** The 2D area: dragging, zooming, node selection (Ctrl to accumulate) and ordering. */
export function createArea(container: HTMLElement, editor: NodeEditor<Schemes>): AreaSetup {
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const selector = AreaExtensions.selector()
  const accumulating = AreaExtensions.accumulateOnCtrl()

  AreaExtensions.selectableNodes(area, selector, { accumulating })
  AreaExtensions.simpleNodesOrder(area)
  AreaExtensions.showInputControl(area)

  // Double-click used to zoom in Rete.js v1 too; the plugin disabled it.
  area.addPipe((context) => {
    if (context.type === 'zoom' && context.data.source === 'dblclick') {
      return undefined
    }

    return context
  })

  editor.use(area)

  return { area, selector, accumulating }
}
