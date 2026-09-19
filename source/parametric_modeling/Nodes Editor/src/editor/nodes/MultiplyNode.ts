import { t } from '../../i18n/translate'
import { toNumber } from '../../utils/toNumber'
import type { NumberControl } from '../controls/NumberControl'
import { BaseNode, type NodeInputs } from './BaseNode'

export class MultiplyNode extends BaseNode {
  private readonly preview: NumberControl

  constructor() {
    super('Multiply')
    this.addNumberInput('number1', t('Number'))
    this.addNumberInput('number2', t('Number'))
    this.preview = this.addNumberControl('preview', '', true)
    this.addSocketOutput('number', t('Number'), 'number')
  }

  override data(inputs: NodeInputs): { number: number } {
    const number1 = toNumber(this.resolveInput(inputs, 'number1'))
    const number2 = toNumber(this.resolveInput(inputs, 'number2'))
    const result = number1 * number2

    this.preview.setValue(result, { silent: true })

    return { number: result }
  }
}
