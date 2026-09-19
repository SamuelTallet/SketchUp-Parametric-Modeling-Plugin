import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

import type { Plugin, ResolvedConfig } from 'vite'

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Makes JS safe to embed in a `<script>` element. */
function escapeInlineScript(code: string): string {
  return code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')
}

/**
 * Produces the single-file bundle the Ruby side loads
 * (`HTML Dialogs/nodes-editor.html`, next to this directory):
 * - inlines the JS entry chunk and the CSS asset into the HTML page, using function
 *   replacers so that `$` sequences in the code are never treated as replacement patterns;
 * - emits a classic `<script>` (no `type="module"`), because SketchUp 2017-2020 embed an
 *   old Chromium (CEF 52-74) that ignores module scripts; the bundle is an ES2015 IIFE;
 * - writes the page under the target file name.
 */
export function finalizeOutput(target: string): Plugin {
  let config: ResolvedConfig

  return {
    name: 'pmg-finalize-output',
    apply: 'build',
    enforce: 'post',
    configResolved(resolved) {
      config = resolved
    },
    generateBundle(_options, bundle) {
      const htmlName = Object.keys(bundle).find((name) => name.endsWith('.html'))
      const html = htmlName ? bundle[htmlName] : undefined

      if (html?.type !== 'asset' || typeof html.source !== 'string') {
        this.error('HTML entry not found in the bundle.')
      }

      let page = html.source

      for (const [fileName, item] of Object.entries(bundle)) {
        const baseName = fileName.split('/').pop() ?? fileName

        if (item.type === 'chunk' && item.isEntry) {
          const tag = new RegExp(`<script[^>]*src="[^"]*${escapeRegExp(baseName)}"[^>]*></script>`)

          if (!tag.test(page)) {
            this.error(`Script tag for ${fileName} not found in the HTML entry.`)
          }

          // Vite puts the (deferred) module script in <head>; a classic script must run
          // after the DOM, so it goes at the end of <body>.
          page = page.replace(tag, '')
          page = page.replace(
            /<\/body>/,
            () => `<script>${escapeInlineScript(item.code)}</script>\n  </body>`
          )
          delete bundle[fileName]
        } else if (item.type === 'asset' && fileName.endsWith('.css')) {
          const tag = new RegExp(`<link[^>]*href="[^"]*${escapeRegExp(baseName)}"[^>]*>`)
          const css =
            typeof item.source === 'string' ? item.source : Buffer.from(item.source).toString()

          if (!tag.test(page)) {
            this.error(`Stylesheet link for ${fileName} not found in the HTML entry.`)
          }

          page = page.replace(tag, () => `<style>${css}</style>`)
          delete bundle[fileName]
        }
      }

      page = page.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')

      if (/<script[^>]*src=/.test(page) || /<link[^>]*href=/.test(page)) {
        this.error('The HTML entry still references external files.')
      }

      const targetName = htmlName!.replace(/[^/]*$/, target)

      delete bundle[htmlName!]
      this.emitFile({ type: 'asset', fileName: targetName, source: page })
    },
    closeBundle() {
      // Vite may have written the original entry name in an earlier run.
      const stale = join(config.build.outDir, 'index.html')

      if (existsSync(stale)) {
        unlinkSync(stale)
      }

      config.logger.info(`[pmg] wrote ${join(config.build.outDir, target)}`)
    },
  }
}
