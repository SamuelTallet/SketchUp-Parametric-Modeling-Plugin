import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { finalizeOutput } from './vite/finalize-output.ts'

export default defineConfig({
  plugins: [react(), finalizeOutput('nodes-editor.html')],
  // The dev server is for a regular, modern browser only (see MockBridge): the Chromium
  // embedded in SketchUp cannot run Vite's module-based dev output, so the plugin always
  // loads the built bundle (`npm run watch` rebuilds it on each change). A fixed port keeps
  // the same origin, so the schema stored in localStorage survives server restarts.
  server: {
    host: '127.0.0.1',
    port: 21318,
    strictPort: true,
  },
  build: {
    // SketchUp 2017 ships Chromium 52 (Windows) / system WebKit (macOS).
    target: 'es2015',
    cssTarget: 'chrome52',
    modulePreload: false,
    cssCodeSplit: false,
    // Every image is inlined as a data URI: the page must be self-contained.
    assetsInlineLimit: () => true,
    outDir: '../HTML Dialogs',
    emptyOutDir: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        format: 'iife',
      },
    },
  },
})
