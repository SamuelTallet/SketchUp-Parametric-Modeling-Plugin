import { t } from '../../i18n/translate'
import { FORMULA_VARIABLES } from '../engine/evaluateFormula'
import { BaseNode } from './BaseNode'

export class SelectNode extends BaseNode {
  constructor() {
    super('Select')
    this.addTextControl('query', `${t('Query example:')} odd`)
    this.addSocketInput('groups', t('Groups'), 'groups')

    for (const variable of FORMULA_VARIABLES) {
      const label = t(`Variable ${variable.toUpperCase()}`)

      this.addNumberInput(variable, label, label)
    }

    this.addSocketOutput('groups', t('Matching groups'), 'groups')
    this.addSocketOutput('not_groups', t('Not matching groups'), 'groups')
  }
}
