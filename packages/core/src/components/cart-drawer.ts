import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons, type IconName } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";
import "./quantity-stepper.js";

/**
 * Cart line item shape passed in by the cart remote. Note `price` and
 * `lineTotal` are PRE-FORMATTED strings, the drawer never does currency math.
 */
export interface CartLine {
  id: string;
  name: string;
  brand?: string;
  glyph?: IconName;
  image?: string;
  qty: number;
  lineTotal: string; // e.g. "Rp 698.000", formatted by the remote
}

/**
 * <bion-cart-drawer .items=${lines} subtotal="Rp …" total="Rp …" ?open=${o}>
 *
 * Slide-over drawer matching the reference cart. Renders whatever line items it
 * is given and emits intents; it does NOT own cart state, pricing, or totals.
 * The cart remote keeps the source of truth, passes formatted strings in, and
 * reacts to events out.
 *
 * Properties: items (CartLine[]), subtotal, total (formatted strings),
 *   shipping (label, default "Gratis"), open (boolean, reflected).
 *
 * Events (composed/bubbling):
 *   - bion-close                          close requested (×, scrim, Esc)
 *   - bion-quantity-change  { id, value } a line's stepper changed
 *   - bion-checkout                       checkout button pressed
 */
@customElement("bion-cart-drawer")
export class BionCartDrawer extends LitElement {
  @property({ attribute: false }) items: CartLine[] = [];
  @property() subtotal = "";
  @property() total = "";
  @property() shipping = "Gratis";
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = [
    hostTokens,
    css`
      :host {
        display: contents;
      }
      .scrim {
        position: fixed;
        inset: 0;
        background: transparent;
        z-index: var(--bion-z-index-scrim);
        pointer-events: none;
        transition: background var(--bion-motion-slow) var(--bion-motion-ease);
      }
      :host([open]) .scrim {
        background: var(--bion-color-scrim);
        pointer-events: auto;
      }
      .drawer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 418px;
        max-width: 92vw;
        z-index: var(--bion-z-index-drawer);
        background: var(--bion-color-bg);
        border-left: 1px solid var(--bion-color-line);
        transform: translateX(100%);
        transition: transform var(--bion-motion-slow) var(--bion-motion-ease);
        display: flex;
        flex-direction: column;
      }
      :host([open]) .drawer {
        transform: translateX(0);
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 26px 28px 22px;
        border-bottom: 1px solid var(--bion-color-line);
      }
      .head h2 {
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-lg);
        display: flex;
        align-items: baseline;
        gap: 9px;
        letter-spacing: var(--bion-letter-spacing-tight);
      }
      .head .n {
        font-size: var(--bion-font-size-sm);
        color: var(--bion-color-mute);
      }
      .close {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--bion-color-ink);
        display: grid;
        place-items: center;
        transition: var(--bion-motion-fast);
      }
      .close:hover {
        background: var(--bion-color-tile);
      }
      .items {
        flex: 1;
        overflow-y: auto;
        padding: 0 28px;
      }
      .row {
        display: flex;
        gap: 16px;
        padding: 22px 0;
        border-bottom: 1px solid var(--bion-color-line);
      }
      .thumb {
        width: 72px;
        height: 72px;
        border-radius: var(--bion-radius-md);
        background: var(--bion-color-tile);
        border: 1px solid var(--bion-color-line);
        display: grid;
        place-items: center;
        flex-shrink: 0;
        overflow: hidden;
      }
      .thumb svg {
        width: 38%;
        height: 38%;
        color: var(--bion-color-ink);
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .info .nm {
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-base);
        line-height: var(--bion-line-height-snug);
      }
      .info .br {
        font-size: var(--bion-font-size-2xs);
        color: var(--bion-color-mute);
        letter-spacing: var(--bion-letter-spacing-wide);
        text-transform: uppercase;
        margin-top: 3px;
      }
      .info .row2 {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 14px;
      }
      .lt {
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-base);
        font-variant-numeric: tabular-nums;
      }
      .foot {
        padding: 24px 28px 28px;
        border-top: 1px solid var(--bion-color-line);
      }
      .sum {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: var(--bion-font-size-sm);
        color: var(--bion-color-mute);
      }
      .sum.tot {
        margin: 16px 0 20px;
        padding-top: 16px;
        border-top: 1px solid var(--bion-color-line);
        color: var(--bion-color-ink);
        align-items: baseline;
      }
      .sum.tot .v {
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-xl);
        font-variant-numeric: tabular-nums;
      }
      .checkout {
        width: 100%;
        background: var(--bion-color-ink);
        color: var(--bion-color-on-ink);
        border: none;
        border-radius: var(--bion-radius-pill);
        padding: 15px;
        font-family: var(--bion-font-body);
        font-size: var(--bion-font-size-base);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      .checkout:hover {
        gap: 13px;
      }
      .empty {
        flex: 1;
        display: grid;
        place-content: center;
        justify-items: center;
        gap: 16px;
        text-align: center;
        padding: 40px;
        color: var(--bion-color-mute);
      }
      .empty .circ {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 1px solid var(--bion-color-line);
        display: grid;
        place-items: center;
      }
      .empty .circ svg {
        width: 26px;
        height: 26px;
        color: var(--bion-color-mute);
      }
      .empty p {
        font-family: var(--bion-font-display);
        font-weight: var(--bion-font-weight-medium);
        font-size: var(--bion-font-size-md);
        color: var(--bion-color-ink);
      }
      .empty small {
        font-size: var(--bion-font-size-sm);
      }
    `,
  ];

  private emit(type: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true }),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.onKey = this.onKey.bind(this);
    window.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKey);
  }
  private onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && this.open) this.emit("bion-close");
  }

  private count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  }

  private renderItem(item: CartLine) {
    return html`
      <div class="row">
        <div class="thumb">
          ${item.image
            ? html`<img src=${item.image} alt=${item.name} />`
            : html`<svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              >
                ${unsafeSVG(icons[item.glyph ?? "box"])}
              </svg>`}
        </div>
        <div class="info">
          <span class="nm">${item.name}</span>
          ${item.brand ? html`<span class="br">${item.brand}</span>` : nothing}
          <div class="row2">
            <bion-quantity-stepper
              .value=${item.qty}
              min="0"
              @bion-change=${(e: CustomEvent) =>
                this.emit("bion-quantity-change", {
                  id: item.id,
                  value: e.detail.value,
                })}
            ></bion-quantity-stepper>
            <span class="lt">${item.lineTotal}</span>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const c = this.count();
    return html`
      <div class="scrim" @click=${() => this.emit("bion-close")}></div>
      <aside
        class="drawer"
        role="dialog"
        aria-label="Keranjang"
        aria-hidden=${!this.open}
      >
        <div class="head">
          <h2>Keranjang <span class="n">${c} item</span></h2>
          <button
            class="close"
            aria-label="Tutup"
            @click=${() => this.emit("bion-close")}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              ${unsafeSVG(icons.close)}
            </svg>
          </button>
        </div>

        ${this.items.length === 0
          ? html`
              <div class="empty">
                <span class="circ"
                  ><svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                  >
                    ${unsafeSVG(icons.cart)}
                  </svg></span
                >
                <p>Keranjang masih kosong</p>
                <small>Tambahkan produk untuk mulai checkout</small>
              </div>
            `
          : html`
              <div class="items">
                ${this.items.map((i) => this.renderItem(i))}
              </div>
              <div class="foot">
                <div class="sum">
                  <span>Subtotal</span><span>${this.subtotal}</span>
                </div>
                <div class="sum">
                  <span>Ongkir</span><span>${this.shipping}</span>
                </div>
                <div class="sum tot">
                  <span>Total</span><span class="v">${this.total}</span>
                </div>
                <button
                  class="checkout"
                  @click=${() => this.emit("bion-checkout")}
                >
                  Checkout
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    ${unsafeSVG(icons.arrowRight)}
                  </svg>
                </button>
              </div>
            `}
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-cart-drawer": BionCartDrawer;
  }
}
