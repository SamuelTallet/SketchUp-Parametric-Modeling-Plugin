import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class ScaleNode extends BaseNode {
  constructor() {
    super('Scale')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addSocketInput('point', t('Point'), 'point')
    this.addNumberInput('x_factor', t('X factor'), t('X factor'))
    this.addNumberInput('y_factor', t('Y factor'), t('Y factor'))
    this.addNumberInput('z_factor', t('Z factor'), t('Z factor'))
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
