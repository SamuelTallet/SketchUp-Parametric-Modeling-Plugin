import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class MoveNode extends BaseNode {
  constructor() {
    super('Move')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addSocketInput('point', t('Position'), 'point')

    for (const variable of ['a', 'b', 'c', 'd', 'e', 'f']) {
      const label = t(`Variable ${variable.toUpperCase()}`)

      this.addNumberInput(variable, label, label)
    }

    this.addTextControl('x_position', `${t('X position. Example:')} nth * a`, t('X position'))
    this.addTextControl('y_position', `${t('Y position. Example:')} nth * b`, t('Y position'))
    this.addTextControl('z_position', `${t('Z position. Example:')} nth * c`, t('Z position'))
    this.addCheckBoxControl('point_is_absolute', t('Position is absolute'))
    this.addSocketOutput('groups', t('Groups'), 'groups')
  }
}
