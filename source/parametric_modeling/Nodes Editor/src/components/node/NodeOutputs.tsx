import { Presets, type RenderEmit } from 'rete-react-plugin'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { Schemes } from '../../editor/types'

const { RefSocket } = Presets.classic

interface NodeOutputsProps {
  node: BaseNode
  emit: RenderEmit<Schemes>
}

export function NodeOutputs({ node, emit }: NodeOutputsProps) {
  return (
    <>
      {Object.entries(node.outputs).map(([key, output]) =>
        output ? (
          <div className="output" key={key} data-testid={`output-${key}`}>
            <div className="output-title">{output.label}</div>
            <RefSocket
              name="output-socket"
              side="output"
              socketKey={key}
              nodeId={node.id}
              emit={emit}
              payload={output.socket}
              data-used={node.usedSockets.has(`output:${key}`) ? 'true' : undefined}
            />
          </div>
        ) : null
      )}
    </>
  )
}
