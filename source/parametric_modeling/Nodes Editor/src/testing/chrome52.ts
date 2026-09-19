import type { DOMWindow } from 'jsdom'

/**
 * Deletes from a jsdom window the APIs that Chrome 52 (SketchUp 2017's embedded browser)
 * does not have, so that running the built bundle there fails on any use of an API
 * that is neither polyfilled nor avoided. Data from caniuse.com / MDN: every entry
 * shipped in Chrome 53 or later.
 */
export function removeApisMissingInChrome52(window: DOMWindow): void {
  const remove = (target: unknown, ...names: string[]) => {
    for (const name of names) {
      if (typeof target === 'object' && target !== null && name in target) {
        Reflect.deleteProperty(target, name)
      }
    }
  }
  const { Element, Document, DocumentFragment, CharacterData, Node, Event } = window
  const global = window as unknown as Record<string, unknown>

  // Globals
  remove(
    window,
    'globalThis',
    'queueMicrotask',
    'structuredClone',
    'ResizeObserver',
    'PointerEvent',
    'AbortController',
    'AbortSignal',
    'customElements',
    'BigInt',
    'WeakRef',
    'FinalizationRegistry',
    'AggregateError',
    'SharedArrayBuffer',
    'Atomics'
  )
  remove(window.navigator, 'clipboard')
  remove(window.crypto, 'randomUUID')

  // Built-ins
  remove(global.Object, 'entries', 'values', 'getOwnPropertyDescriptors', 'fromEntries', 'hasOwn')
  remove(global.Promise, 'allSettled', 'any', 'withResolvers')
  remove(window.Promise.prototype, 'finally')
  remove(global.Symbol, 'asyncIterator')
  remove(
    window.Array.prototype,
    'flat',
    'flatMap',
    'at',
    'findLast',
    'findLastIndex',
    'toSorted',
    'toReversed',
    'toSpliced',
    'with'
  )
  remove(
    window.String.prototype,
    'padStart',
    'padEnd',
    'trimStart',
    'trimEnd',
    'matchAll',
    'replaceAll',
    'at',
    'isWellFormed',
    'toWellFormed'
  )
  remove(
    global.Intl,
    'PluralRules',
    'RelativeTimeFormat',
    'ListFormat',
    'Locale',
    'DisplayNames',
    'Segmenter'
  )

  // DOM
  remove(Node.prototype, 'getRootNode')
  remove(Event.prototype, 'composedPath', 'composed')
  remove(
    Element.prototype,
    'toggleAttribute',
    'getAttributeNames',
    'replaceChildren',
    'checkVisibility',
    'attachShadow',
    'shadowRoot',
    'scroll',
    'scrollTo',
    'scrollBy',
    'getAnimations'
  )
  for (const parent of [Element.prototype, Document.prototype, DocumentFragment.prototype]) {
    remove(parent, 'append', 'prepend', 'replaceChildren')
  }
  for (const child of [Element.prototype, CharacterData.prototype, window.DocumentType.prototype]) {
    remove(child, 'before', 'after', 'replaceWith')
  }
  remove(window.DOMTokenList.prototype, 'replace', 'supports')
  remove(window.CSSStyleSheet.prototype, 'replace', 'replaceSync')
  remove(window.Document.prototype, 'adoptedStyleSheets')
}
