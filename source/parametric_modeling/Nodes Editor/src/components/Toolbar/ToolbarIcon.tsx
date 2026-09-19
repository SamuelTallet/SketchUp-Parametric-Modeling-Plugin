import { NODE_ICONS } from '../../editor/icons/nodeIcons'
import type { NodeName } from '../../editor/nodes/nodeNames'
import { t } from '../../i18n/translate'

interface ToolbarIconProps {
  name: NodeName
  onClick: () => void
}

export function ToolbarIcon({ name, onClick }: ToolbarIconProps) {
  const label = t(name)

  return (
    <span className="toolbar-item" data-tooltip={label}>
      <img
        className="node-icon"
        src={NODE_ICONS[name].path}
        alt={label}
        data-node-name={name}
        onClick={onClick}
      />
    </span>
  )
}
