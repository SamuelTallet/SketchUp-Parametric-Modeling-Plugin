import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class PushPullNode extends BaseNode {
  constructor() {
    super('Push/Pull')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addNumberInput('distance', t('Distance'), t('Distance'))
    this.addCheckBoxControl('increment_distance', t('Increment distance'))
    this.addSocketInput('direction', t('Direction'), 'vector')
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
