import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class ConcatenateNode extends BaseNode {
  constructor() {
    super('Concatenate')

    for (let index = 1; index <= 12; index++) {
      this.addSocketInput(`groups${String(index)}`, t('Groups'), 'groups')
    }

    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
