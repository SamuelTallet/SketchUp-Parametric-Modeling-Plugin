import type { BaseNode } from '../nodes/BaseNode'
import { BaseControl } from './BaseControl'

export class CheckBoxControl extends BaseControl<boolean> {
  constructor(
    node: BaseNode,
    key: string,
    readonly label: string
  ) {
    super(node, key)
  }
}
