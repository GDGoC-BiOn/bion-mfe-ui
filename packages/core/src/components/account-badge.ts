import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { hostTokens } from "../styles.js";

/**
 * <bion-account-badge name="Ilham" initials="IL"></bion-account-badge>
 *
 * Shell-owned identity chip. Purely presentational: it shows who is signed in.
 * It does NOT do auth, the shell passes the resolved name/initials in. Emits
 * `bion-select` on click so the shell can open an account menu.
 */
@customElement("bion-account-badge")
export class BionAccountBadge extends LitElement {
  @property() name = "";
  @property() initials = "";

  static styles = [
    hostTokens,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: flex;
        align-items: center;
        gap: var(--bion-space-2);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-family: var(--bion-font-body);
        font-size: var(--bion-font-size-sm);
        color: var(--bion-color-ink2);
      }
      .av {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--bion-color-ink);
        color: var(--bion-color-on-ink);
        display: grid;
        place-items: center;
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-2xs);
        letter-spacing: 0.02em;
      }
    `,
  ];

  private get derivedInitials() {
    if (this.initials) return this.initials;
    return this.name
      .split(/\s+/)
      .map((w) => w[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  private onClick() {
    this.dispatchEvent(
      new CustomEvent("bion-select", {
        detail: { name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button @click=${this.onClick}>
        <span class="av">${this.derivedInitials}</span>
        ${this.name ? html`<span class="name">${this.name}</span>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-account-badge": BionAccountBadge;
  }
}
