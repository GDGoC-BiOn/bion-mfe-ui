import { LitElement, html, css, svg as litSvg, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icons, type IconName } from '@bion-mfe-ui/icons';
import { hostTokens } from '../styles.js';

/**
 * <bion-product-card>
 *
 * A framework-agnostic product card. Owns ONLY presentation + local UI state
 * (the favourite toggle). It does NOT know about a cart, prices in any currency,
 * or auth — it emits events and lets the consuming remote decide what to do.
 * This keeps the design system free of business logic, exactly like the cart /
 * catalog boundary in the MFE.
 *
 * Properties (set as attributes or JS props):
 *   - name      string   product title
 *   - brand     string   brand label (uppercased)
 *   - price     string   pre-formatted price (the remote formats currency, not us)
 *   - old-price string   optional struck-through original price
 *   - glyph     IconName product icon name from @bion-mfe-ui/icons
 *   - image     string   optional image URL (overrides glyph)
 *   - tag       string   optional corner badge ("30% off", "Baru"…)
 *   - rating    number   0–5, integer stars
 *   - reviews   string   review count label, e.g. "1.2rb"
 *   - favorite  boolean  controlled favourite state (optional)
 *
 * Events (composed, bubbling — cross framework + cross shadow boundary):
 *   - bion-add        detail: { name }   user clicked the add button
 *   - bion-favorite   detail: { favorite } user toggled favourite
 *   - bion-select     detail: { name }   user clicked the card body
 */
@customElement('bion-product-card')
export class BionProductCard extends LitElement {
  @property() name = '';
  @property() brand = '';
  @property() price = '';
  @property({ attribute: 'old-price' }) oldPrice = '';
  @property() glyph: IconName = 'box';
  @property() image = '';
  @property() tag = '';
  @property({ type: Number }) rating = 0;
  @property() reviews = '';
  @property({ type: Boolean, reflect: true }) favorite = false;

  static styles = [
    hostTokens,
    css`
      :host { display: block; }
      .card { display: flex; flex-direction: column; cursor: pointer; }
      .thumb {
        aspect-ratio: 1;
        background: var(--bion-color-tile);
        border: 1px solid var(--bion-color-line);
        border-radius: var(--bion-radius-lg);
        display: grid; place-items: center;
        position: relative; overflow: hidden;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      .card:hover .thumb { border-color: var(--bion-color-line2); }
      .glyph { width: 40%; height: 40%; color: var(--bion-color-ink); transition: transform var(--bion-motion-slow) var(--bion-motion-ease); }
      .card:hover .glyph { transform: scale(1.06); }
      img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .tag {
        position: absolute; top: 13px; left: 13px;
        font-size: var(--bion-font-size-2xs); font-weight: var(--bion-font-weight-medium);
        letter-spacing: var(--bion-letter-spacing-wide); text-transform: uppercase;
        color: var(--bion-color-ink); background: rgba(255,255,255,0.85);
        padding: 4px 9px; border-radius: var(--bion-radius-pill);
      }
      .fav, .add { border: none; cursor: pointer; display: grid; place-items: center; }
      .fav {
        position: absolute; top: 11px; right: 11px;
        width: 32px; height: 32px; border-radius: 50%; background: none;
        color: var(--bion-color-ink2); opacity: 0;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      .card:hover .fav, :host([favorite]) .fav { opacity: 1; }
      :host([favorite]) .fav { color: var(--bion-color-ink); }
      :host([favorite]) .fav svg { fill: var(--bion-color-ink); }
      .add {
        position: absolute; right: 13px; bottom: 13px;
        width: 40px; height: 40px; border-radius: 50%;
        background: var(--bion-color-ink); color: var(--bion-color-on-ink);
        opacity: 0; transform: translateY(8px) scale(.9);
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      .card:hover .add { opacity: 1; transform: translateY(0) scale(1); }
      .add svg { transition: transform var(--bion-motion-base) var(--bion-motion-ease); }
      .add:hover svg { transform: rotate(90deg); }
      .add:active { transform: scale(.92); }
      .body { padding: 15px 2px 0; display: flex; flex-direction: column; }
      .brand { font-size: var(--bion-font-size-2xs); color: var(--bion-color-mute); letter-spacing: var(--bion-letter-spacing-wide); text-transform: uppercase; margin-bottom: 5px; }
      .name { font-family: var(--bion-font-display); font-weight: var(--bion-font-weight-medium); font-size: var(--bion-font-size-md); line-height: var(--bion-line-height-snug); margin-bottom: 10px; }
      .rating { display: flex; align-items: center; gap: var(--bion-space-1); margin-bottom: 12px; }
      .stars { display: flex; gap: 1.5px; }
      .stars svg { width: 11px; height: 11px; color: var(--bion-color-ink); fill: var(--bion-color-ink); }
      .stars svg.empty { color: var(--bion-color-line2); fill: var(--bion-color-line2); }
      .reviews { font-size: var(--bion-font-size-2xs); color: var(--bion-color-mute); }
      .price { font-family: var(--bion-font-display); font-weight: var(--bion-font-weight-medium); font-size: var(--bion-font-size-md); font-variant-numeric: tabular-nums; }
      .price s { color: var(--bion-color-mute); font-weight: var(--bion-font-weight-regular); font-size: var(--bion-font-size-xs); margin-left: 2px; }
    `,
  ];

  private emit(type: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  private onAdd(e: Event) {
    e.stopPropagation();
    this.emit('bion-add', { name: this.name });
  }

  private onFav(e: Event) {
    e.stopPropagation();
    this.favorite = !this.favorite;
    this.emit('bion-favorite', { favorite: this.favorite });
  }

  private renderStars() {
    return Array.from({ length: 5 }, (_, i) =>
      litSvg`<svg class=${i < this.rating ? '' : 'empty'} viewBox="0 0 24 24">${unsafeSVG(icons.star)}</svg>`
    );
  }

  render() {
    return html`
      <article class="card" @click=${() => this.emit('bion-select', { name: this.name })}>
        <div class="thumb">
          ${this.tag ? html`<span class="tag">${this.tag}</span>` : nothing}
          <button class="fav" aria-label="Toggle favourite" aria-pressed=${this.favorite} @click=${this.onFav}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">${unsafeSVG(icons.heart)}</svg>
          </button>
          ${this.image
            ? html`<img src=${this.image} alt=${this.name} />`
            : html`<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".9">${unsafeSVG(icons[this.glyph])}</svg>`}
          <button class="add" aria-label=${`Add ${this.name} to cart`} @click=${this.onAdd}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">${unsafeSVG(icons.plus)}</svg>
          </button>
        </div>
        <div class="body">
          ${this.brand ? html`<span class="brand">${this.brand}</span>` : nothing}
          <span class="name">${this.name}</span>
          ${this.rating
            ? html`<span class="rating"><span class="stars">${this.renderStars()}</span>${this.reviews ? html`<span class="reviews">(${this.reviews})</span>` : nothing}</span>`
            : nothing}
          <span class="price">${this.price}${this.oldPrice ? html`<s>${this.oldPrice}</s>` : nothing}</span>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bion-product-card': BionProductCard;
  }
}
