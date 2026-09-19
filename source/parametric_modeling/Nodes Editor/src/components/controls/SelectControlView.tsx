import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'

import type { SelectControl } from '../../editor/controls/SelectControl'
import { useControlValue } from './useControlValue'

interface SelectControlViewProps {
  data: SelectControl
}

export function SelectControlView({ data: control }: SelectControlViewProps) {
  const value = useControlValue(control) ?? ''
  const ref = useRef<HTMLSelectElement>(null)

  Drag.useNoDrag(ref)

  return (
    <select ref={ref} value={value} onChange={(event) => control.setValue(event.target.value)}>
      <option value="">{control.getPlaceholder()}</option>
      {control.getOptions().map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
