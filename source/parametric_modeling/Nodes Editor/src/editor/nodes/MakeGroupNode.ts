import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class MakeGroupNode extends BaseNode {
  constructor() {
    super('Make group')

    for (let index = 1; index <= 12; index++) {
      this.addSocketInput(`groups${String(index)}`, t('Groups'), 'groups')
    }

    this.addTextControl('name', t('Name'))
    this.addMaterialControl()
    this.addLayerControl()
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
