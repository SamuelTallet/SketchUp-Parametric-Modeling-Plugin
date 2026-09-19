import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class TagNode extends BaseNode {
  constructor() {
    super('Tag')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addLayerControl()
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
