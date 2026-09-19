import { useSyncExternalStore } from 'react'

import type { ControlValue, BaseControl } from '../../editor/controls/BaseControl'

/** Re-renders the view when the control value changes (typing, engine previews, …). */
export function useControlValue<V extends ControlValue>(control: BaseControl<V>): V | undefined {
  return useSyncExternalStore(
    (listener) => control.subscribe(listener),
    () => control.getValue()
  )
}
