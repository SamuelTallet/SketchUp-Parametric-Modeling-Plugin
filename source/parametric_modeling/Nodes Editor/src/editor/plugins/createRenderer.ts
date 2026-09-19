import { createRoot } from 'react-dom/client'
import { Presets, ReactPlugin } from 'rete-react-plugin'

import { Connection } from '../../components/connection/Connection'
import { ContextMenuItem, ContextMenuRoot } from '../../components/contextMenu/ContextMenuStyles'
import { renderControl } from '../../components/controls/renderControl'
import { Node } from '../../components/node/Node'
import { Socket } from '../../components/socket/Socket'
import type { AreaExtra, Schemes } from '../types'
import type { Area } from './createArea'

export type Renderer = ReactPlugin<Schemes, AreaExtra>

/** Renders nodes, sockets, connections, controls, the context menu and the minimap with React. */
export function createRenderer(area: Area): Renderer {
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })

  render.addPreset(
    Presets.classic.setup({
      customize: {
        node: () => Node,
        socket: () => Socket,
        connection: () => Connection,
        control: renderControl,
      },
    })
  )
  render.addPreset(
    Presets.contextMenu.setup({
      delay: 1000,
      customize: {
        main: () => ContextMenuRoot,
        item: () => ContextMenuItem,
      },
    })
  )
  render.addPreset(Presets.minimap.setup({ size: 200 }))

  area.use(render)

  return render
}
