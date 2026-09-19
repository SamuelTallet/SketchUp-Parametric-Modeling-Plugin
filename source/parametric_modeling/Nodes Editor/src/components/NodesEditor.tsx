import { useCallback, useEffect, useRef } from 'react'
import { useRete } from 'rete-react-plugin'

import { setEditorHandle } from '../api/PublicApi'
import { bridge } from '../bridge'
import type { Bootstrap } from '../bridge/Bridge'
import { createEditor } from '../editor/createEditor'
import type { NodeName } from '../editor/nodes/nodeNames'
import { Toolbar } from './Toolbar/Toolbar'
import { Tooltip } from './Tooltip/Tooltip'

interface NodesEditorProps {
  bootstrap: Bootstrap
}

/** The editor area plus its floating toolbar. */
export function NodesEditor({ bootstrap }: NodesEditorProps) {
  const create = useCallback(
    (element: HTMLElement) => createEditor(element, bootstrap),
    [bootstrap]
  )
  const [areaRef, handle] = useRete(create)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current

    setEditorHandle(handle)

    // Tells tests and scripts that the editor accepts commands.
    if (handle) {
      root?.setAttribute('data-ready', 'true')
    }

    return () => {
      setEditorHandle(null)
      root?.removeAttribute('data-ready')
    }
  }, [handle])

  const onAddNode = (name: NodeName) => {
    void handle?.addNode(name)
  }

  return (
    <div id="pmg-nodes-editor" ref={rootRef}>
      <div className="area" ref={areaRef} />
      <Toolbar onAddNode={onAddNode} onHelp={() => bridge.accessOnlineHelp()} />
      <Tooltip />
    </div>
  )
}
