import { ClassicPreset } from 'rete'

import type { BaseNode } from './nodes/BaseNode'

export class BaseConnection extends ClassicPreset.Connection<BaseNode, BaseNode> {
  /** Highlighted after a click on its path. */
  selected?: boolean
}
