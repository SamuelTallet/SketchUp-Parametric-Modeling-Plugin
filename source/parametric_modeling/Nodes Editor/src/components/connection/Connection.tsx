import { Presets } from 'rete-react-plugin'

import type { BaseConnection } from '../../editor/BaseConnection'
import { classNames } from '../../utils/classNames'

const { useConnection } = Presets.classic

interface ConnectionProps {
  data: BaseConnection
}

/** A connection curve between two sockets (selectable by click). */
export function Connection({ data: connection }: ConnectionProps) {
  const { path } = useConnection()

  if (!path) {
    return null
  }

  return (
    <svg className="connection" data-connection-id={connection.id} data-testid="connection">
      {/* A 2px curve is a 1px click target: this invisible twin widens it. */}
      <path className="hit-path" d={path} />
      <path className={classNames('main-path', connection.selected && 'selected')} d={path} />
    </svg>
  )
}
