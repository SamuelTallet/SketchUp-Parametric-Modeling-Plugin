import { HELP_ICON } from '../../editor/icons/nodeIcons'
import { t } from '../../i18n/translate'

interface HelpIconProps {
  onClick: () => void
}

export function HelpIcon({ onClick }: HelpIconProps) {
  const label = t('Access online help')

  return (
    <span className="toolbar-item" data-tooltip={label}>
      <img className="help-icon" src={HELP_ICON} alt={label} onClick={onClick} />
    </span>
  )
}
