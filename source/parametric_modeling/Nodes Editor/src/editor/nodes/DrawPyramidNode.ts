import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class DrawPyramidNode extends BaseNode {
  constructor() {
    super('Draw pyramid')
    this.addNumberInput('radius', t('Radius'), t('Radius'))
    this.addNumberInput('height', t('Height'), t('Height'))
    this.addNumberInput('sides', t('Sides'), t('Sides'))
    this.addTextControl('name', t('Name'))
    this.addMaterialControl()
    this.addLayerControl()
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
