import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'

import type { CheckBoxControl } from '../../editor/controls/CheckBoxControl'
import { useControlValue } from './useControlValue'

interface CheckBoxControlViewProps {
  data: CheckBoxControl
}

export function CheckBoxControlView({ data: control }: CheckBoxControlViewProps) {
  const checked = useControlValue(control) ?? false
  const ref = useRef<HTMLInputElement>(null)

  Drag.useNoDrag(ref)

  return (
    <div className="checkbox-control">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(event) => control.setValue(event.target.checked)}
      />
      {control.label}
    </div>
  )
}
