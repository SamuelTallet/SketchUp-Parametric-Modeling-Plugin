import { t } from '../../i18n/translate'
import { toNumber } from '../../utils/toNumber'
import type { NumberControl } from '../controls/NumberControl'
import { BaseNode, type NodeInputs } from './BaseNode'

export class DivideNode extends BaseNode {
  private readonly preview: NumberControl

  constructor() {
    super('Divide')
    this.addNumberInput('dividend', t('Dividend'), t('Dividend'))
    this.addNumberInput('divisor', t('Divisor'), t('Divisor'))
    this.preview = this.addNumberControl('preview', '', true)
    this.addSocketOutput('quotient', t('Quotient'), 'number')
    this.addSocketOutput('remainder', t('Remainder'), 'number')
  }

  override data(inputs: NodeInputs): { quotient: number; remainder: number } {
    const dividend = toNumber(this.resolveInput(inputs, 'dividend'))
    const divisor = toNumber(this.resolveInput(inputs, 'divisor'), 1)
    const quotient = dividend / divisor
    const remainder = dividend % divisor

    this.preview.setValue(quotient, { silent: true })

    return { quotient, remainder }
  }
}
