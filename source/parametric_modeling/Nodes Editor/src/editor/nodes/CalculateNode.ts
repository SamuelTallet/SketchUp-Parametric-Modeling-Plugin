import { t } from '../../i18n/translate'
import { toNumber } from '../../utils/toNumber'
import {
  evaluateFormula,
  FORMULA_VARIABLES,
  type FormulaVariables,
} from '../engine/evaluateFormula'
import { BaseNode, type NodeInputs } from './BaseNode'

export class CalculateNode extends BaseNode {
  constructor() {
    super('Calculate')
    this.addTextControl('formula', `${t('Formula example:')} round(a) * b`)

    for (const variable of FORMULA_VARIABLES) {
      const label = t(`Variable ${variable.toUpperCase()}`)

      this.addNumberInput(variable, label, label)
    }

    this.addSocketOutput('number', t('Number'), 'number')
  }

  override data(inputs: NodeInputs): { number: number } {
    const formula = this.values.formula

    if (typeof formula !== 'string') {
      return { number: 0 }
    }

    const variables = {} as FormulaVariables

    for (const variable of FORMULA_VARIABLES) {
      variables[variable] = toNumber(this.resolveInput(inputs, variable))
    }

    return { number: evaluateFormula(formula, variables) }
  }
}
