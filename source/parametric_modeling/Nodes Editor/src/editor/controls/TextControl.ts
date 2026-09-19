import type { BaseNode } from '../nodes/BaseNode'
import { BaseControl } from './BaseControl'

export class TextControl extends BaseControl<string> {
  constructor(
    node: BaseNode,
    key: string,
    readonly placeholder = '',
    readonly title = ''
  ) {
    super(node, key)
  }
}
