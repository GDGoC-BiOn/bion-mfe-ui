import { LitElement, html, css, svg as litSvg, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";

/**
 * <bion-rating value="5" reviews="1.2rb"></bion-rating>
 *
 * Display-only star rating (filled vs empty), with an optional review count.
 * Read-only by design, the reference UI never had interactive rating input.
 */
@customElement("bion-rating")
export class BionRating extends LitElement {
  @property({ type: Number }) value = 0;
  @property() reviews = "";
  @property({ type: Number }) max = 5;

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--bion-space-1);
      }
      .stars {
        display: flex;
        gap: 1.5px;
      }
      .stars svg {
        width: 11px;
        height: 11px;
        color: var(--bion-color-ink);
        fill: var(--bion-color-ink);
      }
      .stars svg.empty {
        color: var(--bion-color-line2);
        fill: var(--bion-color-line2);
      }
      .count {
        font-size: var(--bion-font-size-2xs);
        color: var(--bion-color-mute);
      }
    `,
  ];

  render() {
    const stars = Array.from(
      { length: this.max },
      (_, i) =>
        litSvg`<svg class=${i < this.value ? "" : "empty"} viewBox="0 0 24 24">${unsafeSVG(icons.star)}</svg>`,
    );
    return html`
      <span
        class="stars"
        role="img"
        aria-label=${`${this.value} of ${this.max} stars`}
        >${stars}</span
      >
      ${this.reviews
        ? html`<span class="count">(${this.reviews})</span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-rating": BionRating;
  }
}
