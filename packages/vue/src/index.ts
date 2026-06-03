import {
  defineComponent,
  h,
  ref,
  watchEffect,
  onMounted,
  onBeforeUnmount,
} from "vue";
import "@bion-mfe-ui/core";
import type { CartLine } from "@bion-mfe-ui/core";

/**
 * Vue wrappers over @bion-mfe-ui/core Web Components.
 *
 * Vue 3 binds DOM props and listens to native CustomEvents on custom elements
 * (configure `isCustomElement` in the consumer's vue plugin), so these stay
 * thin, typed props + emits + forwarding non-attribute props/instance state.
 *
 * Consumer vite config:
 *   vue({ template: { compilerOptions: { isCustomElement: (t) => t.startsWith('bion-') } } })
 *
 * A small factory removes repetition for the common case.
 */

type PropList = Record<string, unknown>;

function bridge(
  el: HTMLElement | null,
  events: Record<string, (d: any) => void>,
  attach: boolean,
) {
  if (!el) return [] as (() => void)[];
  const cleanups: (() => void)[] = [];
  for (const [type, cb] of Object.entries(events)) {
    const h = (e: Event) => cb((e as CustomEvent).detail);
    if (attach) {
      el.addEventListener(type, h);
      cleanups.push(() => el.removeEventListener(type, h));
    }
  }
  return cleanups;
}

/* ── ProductCard ── */
export const ProductCard = defineComponent({
  name: "BionProductCard",
  props: {
    name: { type: String, required: true },
    brand: String,
    price: { type: String, required: true },
    oldPrice: String,
    glyph: String,
    image: String,
    tag: String,
    rating: Number,
    reviews: String,
    favorite: Boolean,
  },
  emits: ["add", "favorite", "select"],
  setup(props, { emit }) {
    const el = ref<any>(null);
    watchEffect(() => {
      if (!el.value) return;
      if (props.rating != null) el.value.rating = props.rating;
      if (props.favorite != null) el.value.favorite = props.favorite;
    });
    let c: (() => void)[] = [];
    onMounted(() => {
      c = bridge(
        el.value,
        {
          "bion-add": (d) => emit("add", d),
          "bion-favorite": (d) => emit("favorite", d),
          "bion-select": (d) => emit("select", d),
        },
        true,
      );
    });
    onBeforeUnmount(() => c.forEach((f) => f()));
    return () =>
      h("bion-product-card", {
        ref: el,
        name: props.name,
        brand: props.brand,
        price: props.price,
        "old-price": props.oldPrice,
        glyph: props.glyph,
        image: props.image,
        tag: props.tag,
        reviews: props.reviews,
      });
  },
});

/* ── Button ── */
export const Button = defineComponent({
  name: "BionButton",
  props: { variant: String, icon: String, label: String, disabled: Boolean },
  setup(props, { slots }) {
    return () =>
      h(
        "bion-button",
        {
          variant: props.variant,
          icon: props.icon,
          label: props.label,
          disabled: props.disabled || undefined,
        },
        slots.default?.(),
      );
  },
});

/* ── Chip ── */
export const Chip = defineComponent({
  name: "BionChip",
  props: { value: { type: String, required: true }, active: Boolean },
  emits: ["select"],
  setup(props, { emit, slots }) {
    const el = ref<any>(null);
    watchEffect(() => {
      if (el.value) el.value.active = props.active;
    });
    let c: (() => void)[] = [];
    onMounted(() => {
      c = bridge(el.value, { "bion-select": (d) => emit("select", d) }, true);
    });
    onBeforeUnmount(() => c.forEach((f) => f()));
    return () =>
      h("bion-chip", { ref: el, value: props.value }, slots.default?.());
  },
});

/* ── Rating ── */
export const Rating = defineComponent({
  name: "BionRating",
  props: {
    value: { type: Number, required: true },
    reviews: String,
    max: Number,
  },
  setup(props) {
    const el = ref<any>(null);
    watchEffect(() => {
      if (!el.value) return;
      el.value.value = props.value;
      if (props.max != null) el.value.max = props.max;
    });
    return () => h("bion-rating", { ref: el, reviews: props.reviews });
  },
});

/* ── Icon ── */
export const Icon = defineComponent({
  name: "BionIcon",
  props: {
    name: { type: String, required: true },
    size: Number,
    strokeWidth: Number,
  },
  setup(props) {
    return () =>
      h("bion-icon", {
        name: props.name,
        size: props.size,
        "stroke-width": props.strokeWidth,
      });
  },
});

/* ── QuantityStepper ── */
export const QuantityStepper = defineComponent({
  name: "BionQuantityStepper",
  props: { value: { type: Number, required: true }, min: Number, max: Number },
  emits: ["change"],
  setup(props, { emit }) {
    const el = ref<any>(null);
    watchEffect(() => {
      if (!el.value) return;
      el.value.value = props.value;
      if (props.min != null) el.value.min = props.min;
      if (props.max != null) el.value.max = props.max;
    });
    let c: (() => void)[] = [];
    onMounted(() => {
      c = bridge(el.value, { "bion-change": (d) => emit("change", d) }, true);
    });
    onBeforeUnmount(() => c.forEach((f) => f()));
    return () => h("bion-quantity-stepper", { ref: el });
  },
});

/* ── AccountBadge ── */
export const AccountBadge = defineComponent({
  name: "BionAccountBadge",
  props: { name: { type: String, required: true }, initials: String },
  emits: ["select"],
  setup(props, { emit }) {
    const el = ref<any>(null);
    let c: (() => void)[] = [];
    onMounted(() => {
      c = bridge(el.value, { "bion-select": (d) => emit("select", d) }, true);
    });
    onBeforeUnmount(() => c.forEach((f) => f()));
    return () =>
      h("bion-account-badge", {
        ref: el,
        name: props.name,
        initials: props.initials,
      });
  },
});

/* ── Carousel ── */
export const Carousel = defineComponent({
  name: "BionCarousel",
  props: { aspect: String, interval: Number },
  setup(props, { slots }) {
    return () =>
      h(
        "bion-carousel",
        { aspect: props.aspect, interval: props.interval },
        slots.default?.(),
      );
  },
});

/* ── CartDrawer ── */
export const CartDrawer = defineComponent({
  name: "BionCartDrawer",
  props: {
    items: { type: Array, default: () => [] },
    subtotal: String,
    total: String,
    shipping: String,
    open: Boolean,
  },
  emits: ["close", "quantity-change", "checkout"],
  setup(props, { emit }) {
    const el = ref<any>(null);
    watchEffect(() => {
      if (!el.value) return;
      el.value.items = props.items;
      el.value.open = props.open;
    });
    let c: (() => void)[] = [];
    onMounted(() => {
      c = bridge(
        el.value,
        {
          "bion-close": () => emit("close"),
          "bion-quantity-change": (d) => emit("quantity-change", d),
          "bion-checkout": () => emit("checkout"),
        },
        true,
      );
    });
    onBeforeUnmount(() => c.forEach((f) => f()));
    return () =>
      h("bion-cart-drawer", {
        ref: el,
        subtotal: props.subtotal,
        total: props.total,
        shipping: props.shipping,
      });
  },
});

export type { CartLine };
