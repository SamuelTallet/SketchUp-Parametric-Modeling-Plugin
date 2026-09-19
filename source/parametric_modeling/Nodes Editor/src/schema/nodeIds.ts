/**
 * Allocates node ids as consecutive integers (stored as strings, as Rete.js v2 expects),
 * like Rete.js v1 did. The Ruby side and the schema files rely on integer ids.
 */
export class NodeIdAllocator {
  private next = 1

  /** Makes sure future ids are greater than an existing one. */
  reserve(id: number | string): void {
    const numeric = typeof id === 'number' ? id : parseInt(id, 10)

    if (Number.isFinite(numeric) && numeric >= this.next) {
      this.next = numeric + 1
    }
  }

  allocate(): string {
    const id = this.next

    this.next += 1

    return String(id)
  }

  reset(): void {
    this.next = 1
  }
}
