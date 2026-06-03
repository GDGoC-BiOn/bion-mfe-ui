import { css, unsafeCSS } from "lit";
import { tokens } from "@bion-mfe-ui/tokens";

/**
 * Web Components use Shadow DOM, which does NOT inherit page CSS, but it DOES
 * inherit CSS custom properties from the document `:root`. So if the host page
 * has loaded `@bion-mfe-ui/tokens/css`, every --bion-* var is available inside
 * the shadow root for free.
 *
 * As a safety net (e.g. a remote rendered before tokens.css loads), we also
 * inline the token values as fallbacks so components never render unstyled.
 */
const kebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const fallbacks = Object.entries(tokens)
  .flatMap(([group, entries]) =>
    Object.entries(entries).map(
      ([key, value]) =>
        `--bion-${kebab(group)}-${kebab(key)}: var(--bion-${kebab(group)}-${kebab(key)}, ${value});`,
    ),
  )
  .join("\n");

/** Apply to every component's `static styles` so tokens resolve inside shadow DOM. */
export const hostTokens = css`
  :host {
    ${unsafeCSS(fallbacks)}
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
