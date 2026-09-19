/** `"Draw box"` → `"draw-box"`, usable as a CSS class name. */
export function kebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
