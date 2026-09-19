import type { NodeEditor } from 'rete'

import type { Area } from '../plugins/createArea'
import type { Schemes } from '../types'

export interface ConnectionSelection {
  destroy(): void
}

/** Pressing on a connection path highlights it (and un-highlights the previous one). */
export function createConnectionSelection(
  editor: NodeEditor<Schemes>,
  area: Area
): ConnectionSelection {
  const onMouseDown = (event: MouseEvent) => {
    const target = event.target

    if (!(target instanceof Element) || !target.classList.contains('hit-path')) {
      return
    }

    // getAttribute, not dataset: SketchUp 2017's Chromium 52 has no dataset on SVG elements,
    // and the connection curve is an SVG.
    const clickedId = target.closest('[data-connection-id]')?.getAttribute('data-connection-id')

    if (!clickedId) {
      return
    }

    for (const connection of editor.getConnections()) {
      const selected = connection.id === clickedId

      if (Boolean(connection.selected) !== selected) {
        connection.selected = selected
        void area.update('connection', connection.id)
      }
    }
  }

  // mousedown, not click: a click is dispatched on the common ancestor of the press and
  // the release, so moving the pointer off the curve before releasing would lose it.
  window.addEventListener('mousedown', onMouseDown)

  return {
    destroy() {
      window.removeEventListener('mousedown', onMouseDown)
    },
  }
}
