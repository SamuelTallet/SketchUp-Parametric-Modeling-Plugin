import { useEffect, useState } from 'react'

import { waitForBootstrap } from '../bootstrap/waitForBootstrap'
import type { Bootstrap } from '../bridge/Bridge'
import { setEnvironment } from '../editor/environment'
import { resetSockets } from '../editor/sockets/sockets'
import { setTranslation } from '../i18n/translate'
import { NodesEditor } from './NodesEditor'

/** Waits for the host bootstrap payload, then shows the editor. */
export function App() {
  const [bootstrap, setBootstrap] = useState<Bootstrap | null>(null)

  useEffect(() => {
    let cancelled = false

    void waitForBootstrap().then((payload) => {
      if (cancelled) {
        return
      }

      document.documentElement.lang = payload.locale
      setTranslation(payload.translation)
      resetSockets()
      setEnvironment({
        sketchupVersion: payload.sketchupVersion,
        materials: payload.materials,
        layers: payload.layers,
      })
      setBootstrap(payload)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return bootstrap ? <NodesEditor bootstrap={bootstrap} /> : null
}
