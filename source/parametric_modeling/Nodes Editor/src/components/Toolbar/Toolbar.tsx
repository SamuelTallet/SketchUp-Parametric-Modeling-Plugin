import type { NodeName } from '../../editor/nodes/nodeNames'
import { TOOLBAR_ORDER } from '../../editor/nodes/registry'
import { HelpIcon } from './HelpIcon'
import { ToolbarIcon } from './ToolbarIcon'

interface ToolbarProps {
  onAddNode: (name: NodeName) => void
  onHelp: () => void
}

/** One icon per node type, plus the online help icon. */
export function Toolbar({ onAddNode, onHelp }: ToolbarProps) {
  return (
    <div className="toolbar" onPointerDown={(event) => event.stopPropagation()}>
      {TOOLBAR_ORDER.map((name) => (
        <ToolbarIcon key={name} name={name} onClick={() => onAddNode(name)} />
      ))}
      <HelpIcon onClick={onHelp} />
    </div>
  )
}
