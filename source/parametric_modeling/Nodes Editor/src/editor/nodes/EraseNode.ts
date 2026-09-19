import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class EraseNode extends BaseNode {
  constructor() {
    super('Erase')
    this.addSocketInput('groups', t('Groups'), 'groups')
  }
}
