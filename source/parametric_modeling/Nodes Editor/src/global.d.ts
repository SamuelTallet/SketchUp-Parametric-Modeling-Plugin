import type { PublicApi } from './api/PublicApi'
import type { SketchUpCallbacks } from './bridge/Bridge'

declare global {
  /**
   * Bridge object injected by SketchUp's `UI::HtmlDialog`.
   * It is undefined when the page runs in a regular browser.
   */
  const sketchup: SketchUpCallbacks

  interface Window {
    /** Entry points called by the Ruby side through `UI::HtmlDialog#execute_script`. */
    PMG?: PublicApi
  }
}
