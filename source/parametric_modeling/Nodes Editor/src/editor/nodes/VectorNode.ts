import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class VectorNode extends BaseNode {
  constructor() {
    super('Vector')
    this.addNumberInput('x', 'X', 'X')
    this.addNumberInput('y', 'Y', 'Y')
    this.addNumberInput('z', 'Z', 'Z')
    this.addSocketOutput('vector', t('Vector'), 'vector')
  }
}
