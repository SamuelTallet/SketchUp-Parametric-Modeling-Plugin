import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class PaintNode extends BaseNode {
  constructor() {
    super('Paint')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addMaterialControl()
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
