import { LitElement, html, css, nothing } from "lit";
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { icons } from "@bion-mfe-ui/icons";
import { hostTokens } from "../styles.js";

/**
 * <bion-carousel aspect="16/9" interval="5500">
 *   <img src="…" />   <!-- each direct child is a slide -->
 *   <img src="…" />
 * </bion-carousel>
 *
 * Banner carousel matching the reference hero: scroll-snap track of slotted
 * children, auto-rotate, arrows that reveal on hover (dark ink, no chrome),
 * bottom-left dots, and a bottom scrim so dots stay legible over any image.
 * Content-agnostic: slides are whatever the consumer slots in.
 *
 * aspect:   CSS aspect-ratio for each slide (default '16/9'); mobile override
 *           is left to the consumer via CSS custom prop --bion-carousel-aspect.
 * interval: ms between auto-advances; 0 disables auto-rotate.
 */
@customElement("bion-carousel")
export class BionCarousel extends LitElement {
  @property() aspect = "16/9";
  @property({ type: Number }) interval = 5500;

  @state() private index = 0;
  @state() private count = 0;
  private timer?: ReturnType<typeof setInterval>;

  @queryAssignedElements() private slides!: HTMLElement[];
  @query(".track") private track?: HTMLElement;

  static styles = [
    hostTokens,
    css`
      :host {
        display: block;
        position: relative;
      }
      .track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        border-radius: var(--bion-radius-lg);
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .track::-webkit-scrollbar {
        display: none;
      }
      ::slotted(*) {
        flex: 0 0 100%;
        scroll-snap-align: center;
        aspect-ratio: var(--bion-carousel-aspect, 16/9);
        object-fit: cover;
        display: block;
        border-radius: var(--bion-radius-lg);
        border: 1px solid var(--bion-color-line);
        background: var(--bion-color-tile);
      }
      .scrim {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 72px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
        pointer-events: none;
        z-index: 2;
        border-radius: 0 0 var(--bion-radius-lg) var(--bion-radius-lg);
      }
      .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%) scale(0.92);
        z-index: 6;
        width: 48px;
        height: 48px;
        border: none;
        background: none;
        color: var(--bion-color-ink);
        cursor: pointer;
        display: grid;
        place-items: center;
        opacity: 0;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      :host(:hover) .arrow {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
      .arrow:hover {
        opacity: 0.7;
      }
      .arrow.prev {
        left: 12px;
      }
      .arrow.next {
        right: 12px;
      }
      .arrow svg {
        width: 34px;
        height: 34px;
      }
      .dots {
        position: absolute;
        bottom: 16px;
        left: 16px;
        z-index: 6;
        display: flex;
        gap: 8px;
      }
      .dots button {
        width: 24px;
        height: 3px;
        border: none;
        border-radius: var(--bion-radius-pill);
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 0;
        transition: var(--bion-motion-base) var(--bion-motion-ease);
      }
      .dots button.on {
        background: #fff;
        width: 32px;
      }
    `,
  ];

  firstUpdated() {
    this.style.setProperty("--bion-carousel-aspect", this.aspect);
    this.start();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  private start() {
    this.stop();
    if (this.interval > 0)
      this.timer = setInterval(() => this.go(this.index + 1), this.interval);
  }
  private stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private go(i: number) {
    const n = this.slides.length;
    if (!n) return;
    this.index = (i + n) % n;
    // Scroll only the internal track horizontally. `slide.scrollIntoView()`
    // also scrolls every ancestor scroll container (i.e. the page), which yanks
    // the viewport back up to the banner whenever the user has scrolled down and
    // the auto-rotate advances. Scrolling the track itself never moves the page.
    this.track?.scrollTo({
      left: this.index * this.track.clientWidth,
      behavior: "smooth",
    });
    this.start();
  }

  private onSlotChange() {
    this.count = this.slides.length;
  }

  // keep dots in sync when the user swipes the track manually
  private onScroll(e: Event) {
    const track = e.target as HTMLElement;
    const w = this.slides[0]?.offsetWidth || 1;
    const i = Math.round(track.scrollLeft / w);
    if (i !== this.index) this.index = i;
  }

  render() {
    return html`
      <div class="track" @scroll=${this.onScroll}>
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="scrim"></div>
      ${this.count > 1
        ? html`
            <button
              class="arrow prev"
              aria-label="Previous"
              @click=${() => this.go(this.index - 1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                ${unsafeSVG(icons.chevronLeft)}
              </svg>
            </button>
            <button
              class="arrow next"
              aria-label="Next"
              @click=${() => this.go(this.index + 1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                ${unsafeSVG(icons.chevronRight)}
              </svg>
            </button>
            <div class="dots">
              ${Array.from(
                { length: this.count },
                (_, i) =>
                  html`<button
                    class=${i === this.index ? "on" : ""}
                    aria-label=${`Go to slide ${i + 1}`}
                    @click=${() => this.go(i)}
                  ></button>`,
              )}
            </div>
          `
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bion-carousel": BionCarousel;
  }
}
