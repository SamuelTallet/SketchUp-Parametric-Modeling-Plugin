import type { GetSchemes } from 'rete'
import type { ContextMenuExtra } from 'rete-context-menu-plugin'
import type { MinimapExtra } from 'rete-minimap-plugin'
import type { ReactArea2D } from 'rete-react-plugin'

import type { BaseNode } from './nodes/BaseNode'
import type { BaseConnection } from './BaseConnection'

export type Schemes = GetSchemes<BaseNode, BaseConnection>

export type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra | MinimapExtra
