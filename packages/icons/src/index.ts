/**
 * Bion MFE UI — Icons
 *
 * Each icon is the inner markup of a 24×24 stroke SVG (no <svg> wrapper), so any
 * consumer can wrap it however it likes:
 *
 *   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${icons.cart}</svg>`
 *
 * Stroke icons inherit `currentColor` and stroke-width from the host context,
 * which keeps them theme-agnostic. The <bion-icon> element in @bion-mfe-ui/core
 * wraps these for convenience.
 */

export const icons = {
  cart: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M18 6L6 18M6 6l12 12"/>',
  chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  star: '<path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z"/>',
  box: '<path d="M4 7h16v13H4z"/><path d="M4 7l2-3h12l2 3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.6"/><path d="M21 16l-5-5L5 21"/>',
  // product glyphs (used by demo catalog)
  audio: '<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>',
  watch: '<circle cx="12" cy="12" r="6"/><path d="M12 9v3l1.5 1.5M9 3h6l.5 3M9 21h6l.5-3"/>',
  camera: '<path d="M3 8a2 2 0 012-2h2l1.5-2h7L18 6h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  speaker: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="15" r="3.5"/><circle cx="12" cy="6" r="1"/>',
} as const;

export type IconName = keyof typeof icons;

/** Convenience: wrap an icon's inner markup into a complete SVG string. */
export function svg(name: IconName, size = 24, strokeWidth = 1.6): string {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

export default icons;
