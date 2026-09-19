import type { BaseNode } from '../nodes/BaseNode'
import { BaseControl } from './BaseControl'

export class NumberControl extends BaseControl<number> {
  constructor(
    node: BaseNode,
    key: string,
    readonly placeholder = '',
    readonly readonly = false
  ) {
    super(node, key)
  }
}
