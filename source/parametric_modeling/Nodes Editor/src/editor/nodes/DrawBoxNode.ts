import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class DrawBoxNode extends BaseNode {
  constructor() {
    super('Draw box')
    this.addNumberInput('width', t('Width'), t('Width'))
    this.addNumberInput('depth', t('Depth'), t('Depth'))
    this.addNumberInput('height', t('Height'), t('Height'))
    this.addTextControl('name', t('Name'))
    this.addMaterialControl()
    this.addLayerControl()
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
