import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class UniteSolidsNode extends BaseNode {
  constructor() {
    super('Unite solids')
    this.addSocketInput('groups1', t('Group'), 'groups')
    this.addSocketInput('groups2', t('Group'), 'groups')
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
