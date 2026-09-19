import { t } from '../../i18n/translate'
import { BaseSocket, type SocketKind } from './BaseSocket'

export type Sockets = Record<SocketKind, BaseSocket>

let sockets: Sockets | null = null

/** Shared socket instances (created lazily so that their names are translated). */
export function getSockets(): Sockets {
  sockets ??= {
    number: new BaseSocket('number', t('Number')),
    groups: new BaseSocket('groups', t('Groups')),
    point: new BaseSocket('point', t('Point')),
    vector: new BaseSocket('vector', t('Vector')),
  }

  return sockets
}

/** Forgets the shared sockets, e.g. after the translation changed. */
export function resetSockets(): void {
  sockets = null
}
