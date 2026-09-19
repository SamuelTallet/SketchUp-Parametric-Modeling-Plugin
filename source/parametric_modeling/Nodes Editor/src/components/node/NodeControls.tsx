import { Presets, type RenderEmit } from 'rete-react-plugin'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { Schemes } from '../../editor/types'

const { RefControl } = Presets.classic

interface NodeControlsProps {
  node: BaseNode
  emit: RenderEmit<Schemes>
}

export function NodeControls({ node, emit }: NodeControlsProps) {
  return (
    <>
      {Object.entries(node.controls).map(([key, control]) =>
        control ? (
          <RefControl
            key={key}
            name="control"
            emit={emit}
            payload={control}
            data-testid={`control-${key}`}
          />
        ) : null
      )}
    </>
  )
}
