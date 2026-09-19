import { useRef, useState } from 'react'
import { Drag } from 'rete-react-plugin'

import type { NumberControl } from '../../editor/controls/NumberControl'
import { adaptNumberInputStep } from '../../utils/adaptNumberInputStep'
import { isValidNumber } from '../../utils/isValidNumber'
import { useControlValue } from './useControlValue'

interface NumberControlViewProps {
  data: NumberControl
}

function formatValue(value: number | undefined): string {
  return value === undefined ? '' : String(value)
}

export function NumberControlView({ data: control }: NumberControlViewProps) {
  const value = useControlValue(control)
  const [text, setText] = useState(formatValue(value))
  const [syncedValue, setSyncedValue] = useState(value)
  const ref = useRef<HTMLInputElement>(null)

  Drag.useNoDrag(ref)

  // The value changed outside this input (engine preview, schema load): refresh the text.
  if (value !== syncedValue) {
    setSyncedValue(value)
    setText(formatValue(value))
  }

  return (
    <input
      ref={ref}
      type="number"
      placeholder={control.placeholder || undefined}
      data-tooltip={control.placeholder || undefined}
      readOnly={control.readonly}
      value={text}
      onChange={(event) => {
        const typed = event.target.value

        setText(typed)
        adaptNumberInputStep(event.target)

        if (isValidNumber(typed)) {
          control.setValue(parseFloat(typed))
        }
      }}
      onPointerMove={(event) => event.stopPropagation()}
    />
  )
}
