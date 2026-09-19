import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class AlignNode extends BaseNode {
  constructor() {
    super('Align')
    this.addSocketInput('groups', t('Group'), 'groups')
    this.addSocketInput('origin', t('Origin'), 'point')
    this.addSocketInput('target', t('Target'), 'point')
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
