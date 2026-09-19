import { NODE_ICONS, nodeTitleGradient } from '../../editor/icons/nodeIcons'
import type { BaseNode } from '../../editor/nodes/BaseNode'
import { t } from '../../i18n/translate'

interface NodeTitleProps {
  node: BaseNode
}

export function NodeTitle({ node }: NodeTitleProps) {
  return (
    <div className="title" style={{ backgroundImage: nodeTitleGradient(node.name) }}>
      {t(node.name)}
      <img className="icon" src={NODE_ICONS[node.name].path} alt="" />
    </div>
  )
}
