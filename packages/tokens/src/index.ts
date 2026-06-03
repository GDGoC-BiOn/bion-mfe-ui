/**
 * Bion MFE UI — Design Tokens
 *
 * Single source of truth. Every value here maps 1:1 to a CSS custom property
 * (`--bion-<group>-<name>`) and a JS path (`tokens.<group>.<name>`).
 *
 * This package is the quiet contract between every micro-frontend. Changing a
 * value re-themes all remotes on their next build, so treat changes here as
 * semver-significant: a visual breaking change is a MAJOR bump.
 *
 * Palette: pure monochrome (per the agreed swatch). Color encodes elevation and
 * text hierarchy only — there is no brand hue. Ink itself is the accent.
 */

export const color = {
  // page + surfaces (lightest → tile)
  bg: '#ffffff', // root background
  paper: '#fafafa', // raised surfaces
  tile: '#f4f4f4', // image tiles / thumbnails
  // borders
  line: '#ebebeb', // hairline default
  line2: '#dcdcdc', // hairline emphasis (hover, controls)
  // text / ink (the accent is ink)
  ink: '#191919', // primary text, buttons, active
  ink2: '#4d4d4d', // secondary text
  mute: '#8d8d8d', // tertiary / hints
  // inverse (text/icons on ink surfaces)
  onInk: '#ffffff',
  // overlay (drawer scrim) — ink with alpha
  scrim: 'rgba(25,25,25,0.16)',
} as const;

export const radius = {
  sm: '6px',
  md: '6px',
  lg: '10px',
  pill: '99px',
} as const;

export const space = {
  // 4px base scale
  '0': '0',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
} as const;

export const font = {
  display: "'Inter Tight', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

export const fontSize = {
  '2xs': '11px',
  xs: '12px',
  sm: '13px',
  base: '14px',
  md: '15px',
  lg: '18px',
  xl: '24px',
  '2xl': '28px',
  hero: '52px',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  // intentionally only two weights — keeps the minimalist tone
} as const;

export const lineHeight = {
  tight: '1.02',
  snug: '1.3',
  normal: '1.55',
  relaxed: '1.65',
} as const;

export const letterSpacing = {
  tight: '-.02em',
  normal: '0',
  wide: '.06em',
  wider: '.1em',
  widest: '.14em',
} as const;

export const motion = {
  ease: 'cubic-bezier(.4,0,.1,1)',
  fast: '.2s',
  base: '.28s',
  slow: '.5s',
} as const;

export const zIndex = {
  header: '50',
  scrim: '90',
  drawer: '100',
} as const;

/** The full token tree. Import as `tokens` for JS/TS consumers. */
export const tokens = {
  color,
  radius,
  space,
  font,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  motion,
  zIndex,
} as const;

export type Tokens = typeof tokens;
export default tokens;
