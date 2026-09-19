let translation: Record<string, string> = {}

export function setTranslation(map: Record<string, string>): void {
  translation = { ...map }
}

/** Translates a string, falling back to the string itself. */
export function t(text: string): string {
  return Object.prototype.hasOwnProperty.call(translation, text)
    ? (translation[text] ?? text)
    : text
}
