import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'

import type { TextControl } from '../../editor/controls/TextControl'
import { useControlValue } from './useControlValue'

interface TextControlViewProps {
  data: TextControl
}

export function TextControlView({ data: control }: TextControlViewProps) {
  const value = useControlValue(control)
  const ref = useRef<HTMLInputElement>(null)

  Drag.useNoDrag(ref)

  return (
    <input
      ref={ref}
      type="text"
      spellCheck={false}
      placeholder={control.placeholder || undefined}
      data-tooltip={control.title || undefined}
      value={value ?? ''}
      onChange={(event) => control.setValue(event.target.value)}
      onPointerMove={(event) => event.stopPropagation()}
    />
  )
}
