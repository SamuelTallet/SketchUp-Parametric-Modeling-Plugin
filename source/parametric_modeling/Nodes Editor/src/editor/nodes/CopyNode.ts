import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

export class CopyNode extends BaseNode {
  constructor() {
    super('Copy')
    this.addSocketInput('groups', t('Groups'), 'groups')
    this.addNumberInput('copies', t('Copies'), t('Copies'))
    this.addCheckBoxControl('output_original', t('Put originals with copies'))
    this.addSocketOutput('groups', t('Copied groups'), 'groups')
    this.addSocketOutput('original_groups', t('Original groups'), 'groups')
  }
}
