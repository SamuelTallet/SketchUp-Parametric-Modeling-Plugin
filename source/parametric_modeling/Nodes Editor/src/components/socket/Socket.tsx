import type { BaseSocket } from '../../editor/sockets/BaseSocket'
import { classNames } from '../../utils/classNames'

interface SocketProps {
  data: BaseSocket
}

/** A socket circle; its tooltip is the socket type name. */
export function Socket({ data: socket }: SocketProps) {
  return <div className={classNames('socket', socket.kind)} data-tooltip={socket.name} />
}
