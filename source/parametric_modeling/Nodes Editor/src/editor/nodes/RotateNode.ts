import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class RotateNode extends BaseNode {
  constructor() {
    super('Rotate')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addSocketInput('center', t('Center'), 'point')
    this.addSocketInput('axis', t('Axis'), 'vector')
    this.addNumberInput('angle', t('Angle'), t('Angle'))
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
