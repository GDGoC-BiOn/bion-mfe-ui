import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons, type IconName } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";

/**
 * <bion-button variant="solid">Lihat koleksi</bion-button>
 * <bion-button variant="icon" icon="cart" label="Buka keranjang"></bion-button>
 *
 * variant: 'solid' | 'outline' | 'icon'   (default 'solid')
 * icon:    optional IconName, trailing for solid/outline, centered for icon
 * Fires native click, no custom event needed for a button.
 */
@customElement("bion-button")
export class BionButton extends LitElement {
  @property() variant: "solid" | "outline" | "icon" = "solid";
  @property() icon?: IconName;
  @property() label = ""; // aria-label for icon-only buttons
  @property({ type: Boolean }) disabled = false;

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--bion-space-2);
        font-family: var(--bion-font-body);
        font-size: var(--bion-font-size-sm);
        font-weight: var(--bion-font-weight-regular);
        line-height: 1;
        cursor: pointer;
        border-radius: var(--bion-radius-pill);
        border: 1px solid transparent;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
        color: inherit;
      }
      button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .solid {
        background: var(--bion-color-ink);
        color: var(--bion-color-on-ink);
        padding: 13px 24px;
      }
      .solid:hover:not(:disabled) {
        gap: var(--bion-space-3);
      }
      .outline {
        background: none;
        color: var(--bion-color-ink);
        border-color: var(--bion-color-line2);
        padding: 9px 16px;
      }
      .outline:hover:not(:disabled) {
        border-color: var(--bion-color-ink);
      }
      .icon {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        background: var(--bion-color-ink);
        color: var(--bion-color-on-ink);
      }
      .icon:active:not(:disabled) {
        transform: scale(0.92);
      }
      svg {
        display: block;
      }
    `,
  ];

  render() {
    const iconSize = this.variant === "icon" ? 18 : 15;
    const glyph = this.icon
      ? html`<svg
          viewBox="0 0 24 24"
          width=${iconSize}
          height=${iconSize}
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          ${unsafeSVG(icons[this.icon])}
        </svg>`
      : nothing;

    return html`
      <button
        class=${this.variant}
        ?disabled=${this.disabled}
        aria-label=${this.variant === "icon" ? this.label : nothing}
      >
        ${this.variant === "icon" ? glyph : html`<slot></slot>${glyph}`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-button": BionButton;
  }
}
