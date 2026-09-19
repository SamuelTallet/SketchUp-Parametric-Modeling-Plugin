import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'

import type { TextAreaControl } from '../../editor/controls/TextAreaControl'
import { useControlValue } from './useControlValue'

interface TextAreaControlViewProps {
  data: TextAreaControl
}

export function TextAreaControlView({ data: control }: TextAreaControlViewProps) {
  const value = useControlValue(control)
  const ref = useRef<HTMLTextAreaElement>(null)

  Drag.useNoDrag(ref)

  return (
    <textarea
      ref={ref}
      spellCheck={false}
      placeholder={control.placeholder || undefined}
      value={value ?? ''}
      onChange={(event) => control.setValue(event.target.value)}
      onPointerMove={(event) => event.stopPropagation()}
    />
  )
}
