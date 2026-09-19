import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class SubtractSolidsNode extends BaseNode {
  constructor() {
    super('Subtract solids')
    this.addSocketInput('groups1', t('Group'), 'groups')
    this.addSocketInput('groups2', t('Group'), 'groups')
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
