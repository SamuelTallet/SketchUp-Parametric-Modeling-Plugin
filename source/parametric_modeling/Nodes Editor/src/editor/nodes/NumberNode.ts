import { t } from '../../i18n/translate'
import { toNumber } from '../../utils/toNumber'
import { BaseNode } from './BaseNode'

export class NumberNode extends BaseNode {
  constructor() {
    super('Number')
    this.addTextControl('label', t('Label'))
    this.addNumberControl('number')
    this.addSocketOutput('number', t('Number'), 'number')
  }

  override data(): { number: number } {
    return { number: toNumber(this.values.number) }
  }
}
