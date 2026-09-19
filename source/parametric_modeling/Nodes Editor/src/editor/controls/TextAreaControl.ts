import type { BaseNode } from '../nodes/BaseNode'
import { BaseControl } from './BaseControl'

export class TextAreaControl extends BaseControl<string> {
  constructor(
    node: BaseNode,
    key: string,
    readonly placeholder = ''
  ) {
    super(node, key)
  }
}
