import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";

/**
 * <bion-quantity-stepper value="2" min="0"></bion-quantity-stepper>
 *
 * Pill stepper used in the cart drawer line items. Emits `bion-change` with
 * { value } whenever it changes. Controlled or uncontrolled: set `value` to
 * control it; otherwise it tracks internally. The cart remote decides what a
 * change means (e.g. remove at 0), the stepper only reports the number.
 */
@customElement("bion-quantity-stepper")
export class BionQuantityStepper extends LitElement {
  @property({ type: Number }) value = 1;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = Infinity;

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-flex;
      }
      .qty {
        display: flex;
        align-items: center;
        border: 1px solid var(--bion-color-line2);
        border-radius: var(--bion-radius-pill);
      }
      button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--bion-color-ink);
        display: grid;
        place-items: center;
        transition: var(--bion-motion-fast);
      }
      button:hover:not(:disabled) {
        background: var(--bion-color-tile);
      }
      button:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      span {
        min-width: 26px;
        text-align: center;
        font-size: var(--bion-font-size-sm);
        font-variant-numeric: tabular-nums;
      }
      svg {
        display: block;
      }
    `,
  ];

  private set(next: number) {
    const clamped = Math.max(this.min, Math.min(this.max, next));
    if (clamped === this.value) return;
    this.value = clamped;
    this.dispatchEvent(
      new CustomEvent("bion-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="qty">
        <button
          aria-label="Decrease"
          ?disabled=${this.value <= this.min}
          @click=${() => this.set(this.value - 1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            ${unsafeSVG(icons.minus)}
          </svg>
        </button>
        <span aria-live="polite">${this.value}</span>
        <button
          aria-label="Increase"
          ?disabled=${this.value >= this.max}
          @click=${() => this.set(this.value + 1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            ${unsafeSVG(icons.plus)}
          </svg>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-quantity-stepper": BionQuantityStepper;
  }
}
