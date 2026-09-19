/**
 * Runs the built bundle in Chromium 52, the engine of SketchUp 2017's dialogs on Windows,
 * and exercises it through the DevTools protocol: schema loading, toolbar, wiring, menus.
 *
 *   npm run test:compat                      downloads Chromium 52 (once) and uses it
 *   npm run test:compat -- --browser <path> [browser flags...]   uses another browser
 *
 * Chromium 52 has no headless mode: a window opens for a few seconds.
 */
import { spawn } from 'node:child_process'
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve as resolvePath } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { pathToFileURL } from 'node:url'

import extract from 'extract-zip'

const ROOT = resolvePath(import.meta.dirname, '..')
const BUNDLE = join(ROOT, '..', 'HTML Dialogs', 'nodes-editor.html')
const SCHEMAS = join(ROOT, '..', 'Schemas')
const STORAGE_KEY = 'pmg.nodes-editor.schema'
const CACHE = join(ROOT, 'node_modules', '.cache', 'chromium-52')
const SNAPSHOTS = 'https://commondatastorage.googleapis.com/chromium-browser-snapshots'

/** Archived Chromium builds closest to the Chrome 52 branch point (revision 394939). */
const SNAPSHOT = {
  win32: { path: 'Win_x64/394938/chrome-win32.zip', exe: 'chrome-win32/chrome.exe' },
  darwin: {
    path: 'Mac/394942/chrome-mac.zip',
    exe: 'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
  },
}[process.platform]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function browserExecutable(args) {
  const index = args.indexOf('--browser')

  if (index !== -1) {
    return args[index + 1]
  }

  if (!SNAPSHOT) {
    throw new Error('SketchUp runs on Windows and macOS only.')
  }

  const exe = join(CACHE, SNAPSHOT.exe)

  if (!existsSync(exe)) {
    const zip = join(CACHE, 'chromium.zip')

    mkdirSync(CACHE, { recursive: true })
    console.log(`Downloading ${SNAPSHOTS}/${SNAPSHOT.path} …`)

    const response = await fetch(`${SNAPSHOTS}/${SNAPSHOT.path}`)

    if (!response.ok || !response.body) {
      throw new Error(`Download failed: HTTP ${response.status}`)
    }

    await pipeline(Readable.fromWeb(response.body), createWriteStream(zip))
    await extract(zip, { dir: CACHE })
    rmSync(zip)
  }

  return exe
}

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()

    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()

      server.close(() => resolve(port))
    })
  })
}

/** Minimal DevTools protocol client over the WebSocket built into Node. */
async function connect(port) {
  let targets = []

  for (let attempt = 0; attempt < 60 && targets.length === 0; attempt++) {
    await sleep(500)
    targets = await fetch(`http://127.0.0.1:${port}/json/list`)
      .then((response) => response.json())
      .then((list) => list.filter((target) => target.type === 'page'))
      .catch(() => [])
  }

  if (targets.length === 0) {
    throw new Error('The browser did not expose a page to the DevTools protocol.')
  }

  const socket = new WebSocket(targets[0].webSocketDebuggerUrl)
  const pending = new Map()
  const errors = []
  let nextId = 1

  await new Promise((resolve, reject) => {
    socket.onopen = resolve
    socket.onerror = () => reject(new Error('DevTools WebSocket failed'))
  })

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)

    if (message.id) {
      pending.get(message.id)?.(message)
      pending.delete(message.id)
      return
    }

    // Chrome 52 reports through the Console domain, newer versions through Runtime.
    if (message.method === 'Console.messageAdded' && message.params.message.level === 'error') {
      errors.push(message.params.message.text)
    } else if (message.method === 'Runtime.exceptionThrown') {
      const details = message.params.exceptionDetails

      errors.push(details.exception?.description ?? details.text)
    } else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '))
    }
  }

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++

      pending.set(id, (message) =>
        message.error
          ? reject(new Error(`${method}: ${message.error.message}`))
          : resolve(message.result)
      )
      socket.send(JSON.stringify({ id, method, params }))
    })

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true })

    if (result.exceptionDetails || result.wasThrown) {
      throw new Error(
        `evaluate failed: ${result.exceptionDetails?.text ?? result.result?.description}`
      )
    }

    return result.result.value
  }

  for (const domain of ['Page', 'Runtime', 'Console']) {
    await send(`${domain}.enable`).catch(() => {})
  }

  return { send, evaluate, errors, close: () => socket.close() }
}

function loadSampleSchema() {
  const file = readdirSync(SCHEMAS).find((name) => name.endsWith('.schema'))
  const schema = JSON.parse(readFileSync(join(SCHEMAS, file), 'utf8'))
  const nodes = Object.values(schema.nodes)
  const connections = nodes.reduce(
    (count, node) =>
      count +
      Object.values(node.outputs).reduce((sum, output) => sum + output.connections.length, 0),
    0
  )

  return { file, json: JSON.stringify(schema), nodes: nodes.length, connections }
}

async function main() {
  const args = process.argv.slice(2)
  const executable = await browserExecutable(args)
  const browserArgs = args.filter(
    (arg, index) => arg !== '--browser' && args[index - 1] !== '--browser'
  )
  const port = await freePort()
  const profile = mkdtempSync(join(tmpdir(), 'pmg-compat-'))
  const browser = spawn(
    executable,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--window-size=1280,800',
      // Chromium runs as a throwaway profile on a local file, so its own sandbox buys
      // nothing here and breaks on some setups.
      '--no-sandbox',
      // Hides the yellow "unsupported command-line flag" bar the line above triggers. That
      // bar also shrinks the viewport, which shifts every coordinate the checks below click.
      '--test-type',
      ...browserArgs,
      'about:blank',
    ],
    { stdio: 'ignore' }
  )
  const failures = []
  const check = (label, actual, expected) => {
    const ok = JSON.stringify(actual) === JSON.stringify(expected)

    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${label}: ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`
    )

    if (!ok) {
      failures.push(label)
    }
  }

  try {
    const page = await connect(port)
    const { send, evaluate } = page
    const url = pathToFileURL(BUNDLE).href
    const waitFor = async (expression, timeoutMs = 10000) => {
      const start = Date.now()

      while (!(await evaluate(expression))) {
        if (Date.now() - start > timeoutMs) {
          throw new Error(`Timed out waiting for: ${expression}`)
        }

        await sleep(50)
      }
    }
    const rect = async (selector) => {
      const box = await evaluate(
        `(function () { var el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`
      )

      if (!box) {
        throw new Error(`No element matches ${selector}`)
      }

      return box
    }
    const mouse = (type, x, y, extra = {}) =>
      send('Input.dispatchMouseEvent', { type, x: Math.round(x), y: Math.round(y), ...extra })
    const click = async ({ x, y }, button = 'left') => {
      await mouse('mouseMoved', x, y)
      await mouse('mousePressed', x, y, { button, clickCount: 1 })
      await mouse('mouseReleased', x, y, { button, clickCount: 1 })
      await sleep(200)
    }
    const drag = async (from, to) => {
      await mouse('mouseMoved', from.x, from.y)
      await mouse('mousePressed', from.x, from.y, { button: 'left', clickCount: 1 })

      for (let step = 1; step <= 5; step++) {
        await mouse(
          'mouseMoved',
          from.x + ((to.x - from.x) * step) / 5,
          from.y + ((to.y - from.y) * step) / 5,
          { button: 'left', buttons: 1 }
        )
        await sleep(30)
      }

      await mouse('mouseReleased', to.x, to.y, { button: 'left', clickCount: 1 })
      await sleep(300)
    }
    /** A point 5px beside a connection curve, on its widened hit path. */
    const wirePoint = async () => {
      const point = await evaluate(
        `(function () { var svgs = document.querySelectorAll('svg.connection'); for (var i = 0; i < svgs.length; i++) { var hit = svgs[i].querySelector('.hit-path'); var len = hit.getTotalLength(); var m = hit.getScreenCTM(); var a = hit.getPointAtLength(len / 2).matrixTransform(m); var b = hit.getPointAtLength(len / 2 + 2).matrixTransform(m); var dx = b.x - a.x, dy = b.y - a.y; var n = Math.sqrt(dx * dx + dy * dy) || 1; var x = Math.round(a.x - (dy / n) * 5), y = Math.round(a.y + (dx / n) * 5); if (document.elementFromPoint(x, y) === hit) return { x: x, y: y, id: svgs[i].getAttribute('data-connection-id') } } return null })()`
      )

      if (!point) {
        throw new Error('No connection curve is clickable beside its visible stroke')
      }

      return point
    }
    const wireStyle = (id) =>
      evaluate(
        `(function () { var path = document.querySelector('svg.connection[data-connection-id="' + ${JSON.stringify(id)} + '"] .main-path'); return { className: path.getAttribute('class'), stroke: getComputedStyle(path).stroke } })()`
      )
    const count = (selector) =>
      evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`)
    const stored = () =>
      evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}))`)
    /**
     * Top-left corner of a free 280x240 area, where a dropped node will not overlap another.
     * Connection curves do not count: their hit path is wide, and a node may sit over a wire.
     */
    const emptySpot = () =>
      evaluate(
        `(function () { var area = document.querySelector('.area'); var free = function (x, y) { var el = document.elementFromPoint(x, y); if (!el) return false; if (el.getAttribute('class') === 'hit-path') return true; return el === area || el.parentElement === area }; var boxIsFree = function (x, y) { for (var dy = 0; dy <= 240; dy += 40) for (var dx = 0; dx <= 280; dx += 40) if (!free(x + dx, y + dy)) return false; return true }; for (var y = 80; y < window.innerHeight - 260; y += 40) for (var x = 40; x < window.innerWidth - 300; x += 40) if (boxIsFree(x, y)) return { x: x, y: y }; return null })()`
      )
    /** Center of the context menu item with the given text. */
    const menuItem = async (text) => {
      const box = await evaluate(
        `(function () { var items = document.querySelectorAll('[data-testid="context-menu"] *'); for (var i = 0; i < items.length; i++) { if (items[i].children.length === 0 && items[i].textContent === ${JSON.stringify(text)}) { var r = items[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } } } return null })()`
      )

      if (!box) {
        throw new Error(`No context menu item "${text}"`)
      }

      return box
    }
    const menuItems = () =>
      evaluate(
        `(function () { var items = document.querySelectorAll('[data-testid="context-menu"] *'); var texts = []; for (var i = 0; i < items.length; i++) if (items[i].children.length === 0 && items[i].textContent) texts.push(items[i].textContent); return texts })()`
      )
    /** Adds a node from the toolbar and drops it on a free spot; returns its selector. */
    const addFromToolbar = async (name) => {
      const before = await count('.node')
      const spot = await emptySpot()

      if (!spot) {
        throw new Error('No free spot in the viewport')
      }

      await click(await rect(`.toolbar img[data-node-name="${name}"]`))
      await waitFor(`document.querySelectorAll('.node').length === ${before + 1}`)
      await mouse('mouseMoved', spot.x, spot.y)
      await sleep(100)
      await mouse('mouseMoved', spot.x + 10, spot.y + 10)
      // The node is placed once when created and again on each move, and those two can land
      // in either order. Waiting for it to reach the pointer avoids measuring it in between.
      await waitFor(
        `(function () { var nodes = document.querySelectorAll('.node'); var el = nodes[nodes.length - 1]; if (!el) return false; var r = el.getBoundingClientRect(); return Math.abs(r.left - ${spot.x + 10}) < 20 && Math.abs(r.top - ${spot.y + 10}) < 20 })()`
      )

      const id = await evaluate(
        `(function () { var nodes = document.querySelectorAll('.node'); return nodes[nodes.length - 1].dataset.nodeId })()`
      )
      const selector = `.node[data-node-id="${id}"]`
      const following = await rect(`${selector} .title`)

      await click({ x: spot.x + 10, y: spot.y + 10 })
      await mouse('mouseMoved', spot.x + 200, spot.y + 200)
      await sleep(200)
      check(
        `${name} follows the pointer`,
        Math.abs(following.x - spot.x) < 300 && Math.abs(following.y - spot.y) < 100,
        true
      )
      check(`${name} stays where dropped`, await rect(`${selector} .title`), following)

      return { id, selector }
    }

    /**
     * Adds a node from the toolbar and drops it at once, without waiting for it to appear.
     * The drop click then races the creation, which is what a user clicking fast does.
     */
    const addFastFromToolbar = async (name) => {
      const before = await count('.node')
      const spot = await emptySpot()

      if (!spot) {
        throw new Error('No free spot in the viewport')
      }

      const icon = await rect(`.toolbar img[data-node-name="${name}"]`)

      await mouse('mouseMoved', icon.x, icon.y)
      await mouse('mousePressed', icon.x, icon.y, { button: 'left', clickCount: 1 })
      await mouse('mouseReleased', icon.x, icon.y, { button: 'left', clickCount: 1 })
      await mouse('mouseMoved', spot.x, spot.y)
      await mouse('mousePressed', spot.x, spot.y, { button: 'left', clickCount: 1 })
      await mouse('mouseReleased', spot.x, spot.y, { button: 'left', clickCount: 1 })
      await waitFor(`document.querySelectorAll('.node').length === ${before + 1}`)
      await sleep(250)

      const id = await evaluate(
        `(function () { var nodes = document.querySelectorAll('.node'); return nodes[nodes.length - 1].dataset.nodeId })()`
      )
      const selector = `.node[data-node-id="${id}"]`
      const dropped = await rect(`${selector} .title`)

      await mouse('mouseMoved', spot.x + 220, spot.y + 170)
      await sleep(250)
      check(`${name} dropped by a fast click stays put`, await rect(`${selector} .title`), dropped)

      return { id, selector }
    }

    const navigate = async () => {
      await send('Page.navigate', { url })
      await sleep(500)
      await waitFor(`!!document.querySelector('#pmg-nodes-editor[data-ready]')`)
      await sleep(300)
    }

    // 1. Load a sample schema.
    const sample = loadSampleSchema()

    await navigate()
    await evaluate(
      `localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(sample.json)}); true`
    )
    await navigate()
    await waitFor(`document.querySelectorAll('.node').length === ${sample.nodes}`)
    check(`${sample.file}: nodes`, await count('.node'), sample.nodes)
    check(`${sample.file}: connections`, await count('svg.connection'), sample.connections)
    console.log(`browser: ${await evaluate('navigator.userAgent')}`)

    // 2. Toolbar: new nodes follow the pointer, then a click drops them.
    const maxId = Math.max(...Object.keys(JSON.parse(sample.json).nodes).map(Number))
    const number = await addFromToolbar('Number')
    const { id: boxId, selector: box } = await addFromToolbar('Draw box')

    check(
      'new node ids continue after the highest one',
      [Number(number.id), Number(boxId)],
      [maxId + 1, maxId + 2]
    )

    // 3. Wiring: drag, refused drags, click-click.
    const numberOut = await rect(`${number.selector} [data-testid="output-number"] .socket`)
    const before = await count('svg.connection')

    await drag(numberOut, await rect(`${box} [data-testid="input-width"] .socket`))
    check('drag creates a connection', await count('svg.connection'), before + 1)
    await drag(
      await rect(`${box} [data-testid="output-groups"] .socket`),
      await rect(`${box} [data-testid="input-depth"] .socket`)
    )
    check(
      'incompatible drag is refused without leftovers',
      await count('svg.connection'),
      before + 1
    )
    await drag(numberOut, await rect(`${box} [data-testid="input-width"] .socket`))
    check('occupied input is refused', await count('svg.connection'), before + 1)
    await click(numberOut)
    await mouse('mouseMoved', numberOut.x + 60, numberOut.y + 60)
    await sleep(100)
    check('a click on a socket picks a wire', await count('svg.connection'), before + 2)
    await click(await rect(`${box} [data-testid="input-height"] .socket`))
    await sleep(300)
    check('a second click connects it', await count('svg.connection'), before + 2)
    check(
      'connections are exported',
      Object.values((await stored()).nodes[boxId].inputs).filter(
        (input) => input.connections.length
      ).length,
      2
    )

    // 3b. Pressing beside a connection curve highlights it, even if the pointer drifts
    //     before the release, as a hand-made click does.
    const wire = await wirePoint()

    await mouse('mouseMoved', wire.x, wire.y)
    await mouse('mousePressed', wire.x, wire.y, { button: 'left', clickCount: 1 })
    await mouse('mouseMoved', wire.x + 6, wire.y + 6, { button: 'left', buttons: 1 })
    await mouse('mouseReleased', wire.x + 6, wire.y + 6, { button: 'left', clickCount: 1 })
    await sleep(300)
    check('a press beside the curve highlights the connection', await wireStyle(wire.id), {
      className: 'main-path selected',
      stroke: 'rgb(130, 191, 64)',
    })

    // 4. Editing a number recomputes and exports.
    const input = await rect(`${box} [data-testid="input-depth"] input`)

    await click(input)
    await evaluate('document.activeElement.select(); true')
    await send('Input.dispatchKeyEvent', { type: 'char', text: '4' })
    await send('Input.dispatchKeyEvent', { type: 'char', text: '2' })
    await sleep(300)
    check('typed value is exported', (await stored()).nodes[boxId].data.depth, 42)

    // 5. Context menus and minimap.
    await click(await emptySpot(), 'right')
    await sleep(300)
    check('root menu items', await menuItems(), [
      'Import schema from a file',
      'Export schema to a file',
      'Freeze parametric entities',
      'Show or hide minimap',
      'Add a comment node',
      'Remove all nodes',
    ])
    await click(await menuItem('Show or hide minimap'))
    await sleep(300)
    check(
      'minimap appears',
      await count('.minimap.displayed [data-testid="minimap-node"]'),
      sample.nodes + 2
    )
    await click(await rect(`${box} .title`), 'right')
    await sleep(300)
    check('node menu offers removal', await menuItems(), ['Remove this node'])
    await click(await menuItem('Remove this node'))
    await waitFor(`document.querySelectorAll('.node').length === ${sample.nodes + 1}`)
    check('node removed with its connections', await count('svg.connection'), before)

    // 6. A node added then dropped by a fast click must not stay glued to the cursor.
    await addFastFromToolbar('Number')

    check('no browser errors', page.errors, [])
    page.close()
  } finally {
    browser.kill()
    await sleep(500)
    rmSync(profile, { recursive: true, force: true })
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed.`)
    process.exit(1)
  }

  console.log('\nAll checks passed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
