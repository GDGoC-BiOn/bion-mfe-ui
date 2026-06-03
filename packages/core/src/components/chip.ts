import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { hostTokens } from "../styles.js";

/**
 * <bion-chip value="audio" ?active=${cur==='audio'}>Audio</bion-chip>
 *
 * Underline-on-active filter chip (matches the catalog filter row). Emits
 * `bion-select` with { value } on click. The parent owns which chip is active,
 * the chip just reports intent (so a remote can drive filtering, not the DS).
 */
@customElement("bion-chip")
export class BionChip extends LitElement {
  @property() value = "";
  @property({ type: Boolean, reflect: true }) active = false;

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-block;
      }
      button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        color: var(--bion-color-mute);
        cursor: pointer;
        position: relative;
        font-family: var(--bion-font-body);
        font-size: var(--bion-font-size-sm);
        transition: var(--bion-motion-fast);
      }
      button:hover {
        color: var(--bion-color-ink);
      }
      :host([active]) button {
        color: var(--bion-color-ink);
        font-weight: var(--bion-font-weight-medium);
      }
      :host([active]) button::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 1px;
        background: var(--bion-color-ink);
      }
    `,
  ];

  private onClick() {
    this.dispatchEvent(
      new CustomEvent("bion-select", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`<button aria-pressed=${this.active} @click=${this.onClick}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-chip": BionChip;
  }
}
