import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class DrawTubeNode extends BaseNode {
  constructor() {
    super('Draw tube')
    this.addNumberInput('radius', t('Radius'), t('Radius'))
    this.addNumberInput('thickness', t('Thickness'), t('Thickness'))
    this.addNumberInput('height', t('Height'), t('Height'))
    this.addNumberInput('segments', t('Segments'), t('Segments'))
    this.addTextControl('name', t('Name'))
    this.addMaterialControl()
    this.addLayerControl()
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
