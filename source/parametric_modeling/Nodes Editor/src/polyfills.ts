/**
 * Runtime polyfills for the browsers embedded in SketchUp 2017+
 * (Chromium 52 on Windows, the system WebKit on macOS).
 */
import 'core-js/stable'
import 'pepjs'
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer'

type WindowWithResizeObserver = Window & { ResizeObserver?: typeof ResizeObserver }

const windowRef = window as WindowWithResizeObserver

if (typeof windowRef.ResizeObserver === 'undefined') {
  windowRef.ResizeObserver = ResizeObserverPolyfill
}

if (typeof Event !== 'undefined' && typeof Event.prototype.composedPath !== 'function') {
  Event.prototype.composedPath = function composedPath(this: Event): EventTarget[] {
    const path: EventTarget[] = []
    let node: Node | null = this.target instanceof Node ? this.target : null

    while (node) {
      path.push(node)
      node = node.parentNode
    }

    if (path[path.length - 1] === document) {
      path.push(window)
    }

    return path
  }
}
