import { MinimapPlugin } from 'rete-minimap-plugin'

import type { Schemes } from '../types'
import type { Area } from './createArea'

export interface Minimap {
  toggle(): void
}

/** The minimap, hidden by default and toggled from the context menu. */
export function createMinimap(area: Area): Minimap {
  const minimap = new MinimapPlugin<Schemes>({ boundViewport: true })

  area.use(minimap)
  minimap.element.classList.add('minimap')

  return {
    toggle() {
      const displayed = minimap.element.classList.toggle('displayed')

      if (displayed) {
        // Forces a first render of the minimap content (it only redraws on area events).
        void area.area.zoom(area.area.transform.k)
      }
    },
  }
}
