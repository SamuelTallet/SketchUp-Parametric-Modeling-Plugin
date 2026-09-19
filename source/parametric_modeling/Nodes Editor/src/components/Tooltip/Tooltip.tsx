import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/*
 * The editor draws its own tooltips: SketchUp 2017 shows no native `title` tooltip, 2027
 * draws one the page cannot recolor, and a `::before` tooltip cannot serve an `<input>`.
 */

/** Matches the delay the host browsers use before a tooltip appears. */
const DELAY_MS = 500

/** Gap between the cursor and the tooltip, wide enough to clear the cursor itself. */
const CURSOR_OFFSET = 18

/** Keeps the tooltip off the very edge of the dialog. */
const VIEWPORT_MARGIN = 4

interface TooltipState {
  text: string
  x: number
  y: number
}

/** The nearest ancestor carrying a tooltip, starting at the hovered element. */
function tooltipTarget(target: EventTarget | null): Element | null {
  return target instanceof Element ? target.closest('[data-tooltip]') : null
}

/**
 * Single tooltip for the whole editor, fed by the `data-tooltip` attribute.
 *
 * It is `position: fixed` so that the editor's `overflow: hidden` never clips it and the
 * area's zoom transform never scales it.
 */
export function Tooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = { x: 0, y: 0 }
    let hovered: Element | null = null
    let timer = 0

    const hide = () => {
      if (timer) {
        window.clearTimeout(timer)
        timer = 0
      }

      hovered = null
      setTooltip(null)
    }

    const onMouseMove = (event: MouseEvent) => {
      cursor.x = event.clientX
      cursor.y = event.clientY
    }

    const onMouseOver = (event: MouseEvent) => {
      const target = tooltipTarget(event.target)

      if (target === hovered) {
        return
      }

      hide()

      const text = target?.getAttribute('data-tooltip')

      if (!text) {
        return
      }

      hovered = target
      timer = window.setTimeout(() => {
        timer = 0
        // `mousemove` fires before this, so the cursor position is up to date.
        setTooltip({ text, x: cursor.x, y: cursor.y })
      }, DELAY_MS)
    }

    // Capture phase: node controls stop pointer events from bubbling out of their input.
    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('mouseover', onMouseOver, true)
    document.addEventListener('mouseout', hide, true)
    // A drag, a zoom or a keystroke means the pointer is busy: get out of the way.
    document.addEventListener('mousedown', hide, true)
    document.addEventListener('wheel', hide, true)
    document.addEventListener('keydown', hide, true)

    return () => {
      document.removeEventListener('mousemove', onMouseMove, true)
      document.removeEventListener('mouseover', onMouseOver, true)
      document.removeEventListener('mouseout', hide, true)
      document.removeEventListener('mousedown', hide, true)
      document.removeEventListener('wheel', hide, true)
      document.removeEventListener('keydown', hide, true)

      if (timer) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  // Placing needs the rendered size, so it happens here rather than through `style`.
  useLayoutEffect(() => {
    const element = ref.current

    if (!element || !tooltip) {
      return
    }

    const { width, height } = element.getBoundingClientRect()
    const maxLeft = document.documentElement.clientWidth - width - VIEWPORT_MARGIN
    const maxTop = document.documentElement.clientHeight - height - VIEWPORT_MARGIN
    const left = Math.min(tooltip.x + CURSOR_OFFSET, maxLeft)
    // No room below: flip above the cursor rather than cover what is being pointed at.
    const top =
      tooltip.y + CURSOR_OFFSET > maxTop
        ? tooltip.y - CURSOR_OFFSET - height
        : tooltip.y + CURSOR_OFFSET

    element.style.left = `${Math.max(VIEWPORT_MARGIN, left)}px`
    element.style.top = `${Math.max(VIEWPORT_MARGIN, top)}px`
    element.style.visibility = 'visible'
  }, [tooltip])

  return tooltip ? (
    <div className="tooltip" ref={ref}>
      {tooltip.text}
    </div>
  ) : null
}
