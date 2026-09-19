import { t } from '../../i18n/translate'
import { getEnvironment } from '../environment'
import type { BaseNode } from '../nodes/BaseNode'
import { BaseControl } from './BaseControl'

export type SelectKind = 'material' | 'layer'

export interface SelectOption {
  value: string
  label: string
}

/** Drop-down list of the model's materials or tags/layers. */
export class SelectControl extends BaseControl<string> {
  constructor(
    node: BaseNode,
    key: string,
    readonly kind: SelectKind
  ) {
    super(node, key)
  }

  getPlaceholder(): string {
    return this.kind === 'material' ? t('Material...') : t('Tag/Layer...')
  }

  getOptions(): SelectOption[] {
    const environment = getEnvironment()
    const items = this.kind === 'material' ? environment.materials : environment.layers

    return items.map((item) => ({ value: item.name, label: item.display_name }))
  }
}
