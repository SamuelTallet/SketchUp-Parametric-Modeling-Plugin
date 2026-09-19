import type { RenderEmit } from 'rete-react-plugin'

import type { BaseNode } from '../../editor/nodes/BaseNode'
import type { Schemes } from '../../editor/types'
import { classNames } from '../../utils/classNames'
import { kebabCase } from '../../utils/kebabCase'
import { NodeControls } from './NodeControls'
import { NodeInputs } from './NodeInputs'
import { NodeOutputs } from './NodeOutputs'
import { NodeTitle } from './NodeTitle'

export interface NodeProps {
  data: BaseNode
  emit: RenderEmit<Schemes>
}

/** A node: title, then outputs, controls and inputs (same layout as the Rete.js v1 template). */
export function Node({ data: node, emit }: NodeProps) {
  return (
    <div
      className={classNames(
        'node',
        kebabCase(node.name),
        node.selected && 'selected',
        node.invalid && 'invalid'
      )}
      data-node-id={node.id}
      data-testid="node"
    >
      <NodeTitle node={node} />
      <NodeOutputs node={node} emit={emit} />
      <NodeControls node={node} emit={emit} />
      <NodeInputs node={node} emit={emit} />
    </div>
  )
}
