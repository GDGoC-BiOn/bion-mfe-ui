import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons, type IconName } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";

/**
 * <bion-icon name="cart" size="20">
 *
 * Convenience wrapper around the raw SVG strings in @bion-mfe-ui/icons.
 * Inherits color via currentColor; size + stroke are props.
 */
@customElement("bion-icon")
export class BionIcon extends LitElement {
  @property() name: IconName = "box";
  @property({ type: Number }) size = 20;
  @property({ type: Number, attribute: "stroke-width" }) strokeWidth = 1.6;

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-flex;
        line-height: 0;
        color: inherit;
      }
      svg {
        display: block;
      }
    `,
  ];

  render() {
    return html`<svg
      viewBox="0 0 24 24"
      width=${this.size}
      height=${this.size}
      fill="none"
      stroke="currentColor"
      stroke-width=${this.strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${unsafeSVG(icons[this.name] ?? icons.box)}
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-icon": BionIcon;
  }
}
