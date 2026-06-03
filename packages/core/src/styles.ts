import { css } from "lit";

/**
 * Idempotent custom-element registration.
 *
 * @bion-mfe-ui is a design system meant to be shared across micro-frontends,
 * where more than one copy of @bion-mfe-ui/core can legitimately load in the
 * same document (e.g. a React remote and a Vue remote that each pull core).
 * Native `customElements.define` throws `NotSupportedError: "bion-…" has already
 * been used` on the second registration of a tag, which crashes the page. We
 * make it a no-op when the tag is already defined.
 *
 * This lives in `styles.ts` (rather than its own module) because every component
 * imports `hostTokens` from here, so the patch is guaranteed to run before any
 * `@customElement` decorator — and a separate side-effect-only module would be
 * tree-shaken by the build. The guard flag lives on the one shared
 * `window.customElements`, so it is installed once across all copies.
 */
if (typeof customElements !== "undefined") {
  const registry = customElements as CustomElementRegistry & {
    __bionDefineGuard?: boolean;
  };
  if (!registry.__bionDefineGuard) {
    const define = registry.define.bind(registry);
    registry.define = (name, constructor, options) => {
      if (!registry.get(name)) define(name, constructor, options);
    };
    registry.__bionDefineGuard = true;
  }
}

/**
 * Web Components use Shadow DOM, which does NOT inherit page CSS — but it DOES
 * inherit CSS custom properties from the document `:root`, and that inheritance
 * crosses every shadow boundary at any nesting depth. So once the host page
 * loads `@bion-mfe-ui/tokens/css`, every --bion-* var is available inside every
 * component's shadow root for free.
 *
 * We deliberately do NOT re-declare the tokens on `:host` as a fallback. A
 * `:host { --x: var(--x, default) }` "safety net" is self-referential, which
 * Chromium resolves to the guaranteed-invalid (empty) value — wiping out the
 * inherited tokens inside the shadow DOM (transparent backgrounds, dead
 * transitions). Plain `:root` inheritance is the correct, working mechanism;
 * load `@bion-mfe-ui/tokens/css` (or `@bion-mfe-ui/css/index.css`) once at the
 * app root. If a per-property default is ever needed, put the fallback at the
 * point of use, e.g. `background: var(--bion-color-bg, #fff)`.
 */
export const hostTokens = css`
  :host {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
