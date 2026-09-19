import { onBoot } from '../api/PublicApi'
import { bridge, type Bootstrap } from '../bridge'

/**
 * Asks the host for the bootstrap payload (`sketchup.ready()`) and resolves
 * when the host answers through `PMG.NodesEditor.boot(payload)`.
 */
export function waitForBootstrap(): Promise<Bootstrap> {
  return new Promise((resolve) => {
    onBoot(resolve)
    bridge.ready()
  })
}
