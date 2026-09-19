import type { ClassicPreset } from 'rete'
import type { Presets } from 'rete-react-plugin'

import { CheckBoxControl } from '../../editor/controls/CheckBoxControl'
import { NumberControl } from '../../editor/controls/NumberControl'
import { SelectControl } from '../../editor/controls/SelectControl'
import { TextAreaControl } from '../../editor/controls/TextAreaControl'
import { TextControl } from '../../editor/controls/TextControl'
import { CheckBoxControlView } from './CheckBoxControlView'
import { NumberControlView } from './NumberControlView'
import { SelectControlView } from './SelectControlView'
import { TextAreaControlView } from './TextAreaControlView'
import { TextControlView } from './TextControlView'

type ControlCustomizer = NonNullable<
  NonNullable<Parameters<typeof Presets.classic.setup>[0]>['customize']
>['control']

type ControlComponent = ReturnType<NonNullable<ControlCustomizer>>

/** Picks the React view matching a control class (`customize.control` of the classic preset). */
export function renderControl(context: { payload: ClassicPreset.Control }): ControlComponent {
  const control = context.payload

  if (control instanceof NumberControl) {
    return NumberControlView as ControlComponent
  }

  if (control instanceof TextControl) {
    return TextControlView as ControlComponent
  }

  if (control instanceof TextAreaControl) {
    return TextAreaControlView as ControlComponent
  }

  if (control instanceof CheckBoxControl) {
    return CheckBoxControlView as ControlComponent
  }

  if (control instanceof SelectControl) {
    return SelectControlView as ControlComponent
  }

  return null
}
