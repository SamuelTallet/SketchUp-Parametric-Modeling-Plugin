import { BaseNode } from './BaseNode'

export class CommentNode extends BaseNode {
  constructor() {
    super('Comment')
    this.addTextAreaControl('comment', '...')
  }
}
