import { Presets, type RenderEmit } from 'rete-react-plugin'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { Schemes } from '../../editor/types'

const { RefControl, RefSocket } = Presets.classic

interface NodeInputsProps {
  node: BaseNode
  emit: RenderEmit<Schemes>
}

export function NodeInputs({ node, emit }: NodeInputsProps) {
  return (
    <>
      {Object.entries(node.inputs).map(([key, input]) => {
        if (!input) {
          return null
        }

        const showControl = Boolean(input.control && input.showControl)

        return (
          <div className="input" key={key} data-testid={`input-${key}`}>
            <RefSocket
              name="input-socket"
              side="input"
              socketKey={key}
              nodeId={node.id}
              emit={emit}
              payload={input.socket}
              data-used={node.usedSockets.has(`input:${key}`) ? 'true' : undefined}
            />
            {!showControl && <div className="input-title">{input.label}</div>}
            {showControl && input.control && (
              <RefControl name="input-control" emit={emit} payload={input.control} />
            )}
          </div>
        )
      })}
    </>
  )
}
