import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class PointNode extends BaseNode {
  constructor() {
    super('Point')
    this.addSocketInput('parent_point', t('Parent point'), 'point')
    this.addNumberInput('x', 'X', 'X')
    this.addNumberInput('y', 'Y', 'Y')
    this.addNumberInput('z', 'Z', 'Z')
    this.addCheckBoxControl('increment_inherited_xyz', t('Increment inherited XYZ'))
    this.addSocketOutput('point', t('Point'), 'point')
  }
}
