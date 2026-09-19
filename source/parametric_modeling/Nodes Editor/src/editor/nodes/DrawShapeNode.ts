import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class DrawShapeNode extends BaseNode {
  constructor() {
    super('Draw shape')
    this.addTextControl('name', t('Name'))
    this.addMaterialControl()
    this.addLayerControl()
    this.addSocketOutput('groups', t('Group'), 'groups')
  }
}
