import { ClassicPreset } from 'rete'

export type SocketKind = 'number' | 'groups' | 'point' | 'vector'

/** A typed socket: only sockets of the same kind can be connected together. */
export class BaseSocket extends ClassicPreset.Socket {
  constructor(
    readonly kind: SocketKind,
    name: string
  ) {
    super(name)
  }

  isCompatibleWith(other: ClassicPreset.Socket): boolean {
    return other instanceof BaseSocket && other.kind === this.kind
  }
}
