import React, { useEffect, useRef } from "react";
import "@bion-mfe-ui/core";
import type {
  BionProductCard,
  BionCartDrawer,
  BionQuantityStepper,
  BionChip,
  BionAccountBadge,
} from "@bion-mfe-ui/core";
import type { CartLine } from "@bion-mfe-ui/core";

/**
 * React wrappers over @bion-mfe-ui/core Web Components.
 *
 * React (pre-19) sets unknown props as attributes and doesn't subscribe to DOM
 * CustomEvents, so each wrapper: (1) forwards complex/boolean props onto the
 * element instance via a ref, and (2) bridges bion-* events to React callbacks.
 * Rendering/styling/animation all live in /core, these stay tiny.
 *
 * A small `useBridge` helper removes the repetition.
 */

type EventMap = Record<string, (detail: any) => void>;
type PropMap = Record<string, unknown>;

function useBridge<T extends HTMLElement>(
  ref: React.RefObject<T>,
  props: PropMap,
  events: EventMap,
  propDeps: unknown[],
  eventDeps: unknown[],
) {
  // forward instance props (booleans, numbers, arrays/objects)
  useEffect(() => {
    const el = ref.current as any;
    if (!el) return;
    for (const [k, v] of Object.entries(props)) if (v !== undefined) el[k] = v;
  }, propDeps); // eslint-disable-line react-hooks/exhaustive-deps

  // bridge custom events
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlers = Object.entries(events).map(([type, cb]) => {
      const h = (e: Event) => cb((e as CustomEvent).detail);
      el.addEventListener(type, h);
      return [type, h] as const;
    });
    return () =>
      handlers.forEach(([type, h]) => el.removeEventListener(type, h));
  }, eventDeps); // eslint-disable-line react-hooks/exhaustive-deps
}

const h = React.createElement;

/* ── ProductCard ── */
export interface ProductCardProps {
  name: string;
  brand?: string;
  price: string;
  oldPrice?: string;
  glyph?: string;
  image?: string;
  tag?: string;
  rating?: number;
  reviews?: string;
  favorite?: boolean;
  onAdd?: (d: { name: string }) => void;
  onFavorite?: (d: { favorite: boolean }) => void;
  onSelect?: (d: { name: string }) => void;
  className?: string;
  style?: React.CSSProperties;
}
export function ProductCard(p: ProductCardProps) {
  const ref = useRef<BionProductCard>(null);
  useBridge(
    ref,
    { rating: p.rating, favorite: p.favorite },
    {
      "bion-add": p.onAdd ?? (() => {}),
      "bion-favorite": p.onFavorite ?? (() => {}),
      "bion-select": p.onSelect ?? (() => {}),
    },
    [p.rating, p.favorite],
    [p.onAdd, p.onFavorite, p.onSelect],
  );
  return h("bion-product-card", {
    ref,
    name: p.name,
    brand: p.brand,
    price: p.price,
    "old-price": p.oldPrice,
    glyph: p.glyph,
    image: p.image,
    tag: p.tag,
    reviews: p.reviews,
    class: p.className,
    style: p.style,
  });
}

/* ── Button ── */
export interface ButtonProps {
  variant?: "solid" | "outline" | "icon";
  icon?: string;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export function Button(p: ButtonProps) {
  return h(
    "bion-button",
    {
      variant: p.variant,
      icon: p.icon,
      label: p.label,
      disabled: p.disabled || undefined,
      onClick: p.onClick,
      class: p.className,
      style: p.style,
    },
    p.children,
  );
}

/* ── Chip ── */
export interface ChipProps {
  value: string;
  active?: boolean;
  onSelect?: (d: { value: string }) => void;
  children?: React.ReactNode;
}
export function Chip(p: ChipProps) {
  const ref = useRef<BionChip>(null);
  useBridge(
    ref,
    { active: p.active },
    { "bion-select": p.onSelect ?? (() => {}) },
    [p.active],
    [p.onSelect],
  );
  return h("bion-chip", { ref, value: p.value }, p.children);
}

/* ── Rating ── */
export interface RatingProps {
  value: number;
  reviews?: string;
  max?: number;
}
export function Rating(p: RatingProps) {
  const ref = useRef<HTMLElement>(null);
  useBridge(ref, { value: p.value, max: p.max }, {}, [p.value, p.max], []);
  return h("bion-rating", { ref, reviews: p.reviews });
}

/* ── Icon ── */
export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
}
export function Icon(p: IconProps) {
  return h("bion-icon", {
    name: p.name,
    size: p.size,
    "stroke-width": p.strokeWidth,
  });
}

/* ── QuantityStepper ── */
export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (d: { value: number }) => void;
}
export function QuantityStepper(p: QuantityStepperProps) {
  const ref = useRef<BionQuantityStepper>(null);
  useBridge(
    ref,
    { value: p.value, min: p.min, max: p.max },
    { "bion-change": p.onChange ?? (() => {}) },
    [p.value, p.min, p.max],
    [p.onChange],
  );
  return h("bion-quantity-stepper", { ref });
}

/* ── AccountBadge ── */
export interface AccountBadgeProps {
  name: string;
  initials?: string;
  onSelect?: (d: { name: string }) => void;
}
export function AccountBadge(p: AccountBadgeProps) {
  const ref = useRef<BionAccountBadge>(null);
  useBridge(
    ref,
    {},
    { "bion-select": p.onSelect ?? (() => {}) },
    [],
    [p.onSelect],
  );
  return h("bion-account-badge", { ref, name: p.name, initials: p.initials });
}

/* ── Carousel ── */
export interface CarouselProps {
  aspect?: string;
  interval?: number;
  children?: React.ReactNode;
}
export function Carousel(p: CarouselProps) {
  return h(
    "bion-carousel",
    { aspect: p.aspect, interval: p.interval },
    p.children,
  );
}

/* ── CartDrawer ── */
export interface CartDrawerProps {
  items: CartLine[];
  subtotal: string;
  total: string;
  shipping?: string;
  open?: boolean;
  onClose?: () => void;
  onQuantityChange?: (d: { id: string; value: number }) => void;
  onCheckout?: () => void;
}
export function CartDrawer(p: CartDrawerProps) {
  const ref = useRef<BionCartDrawer>(null);
  useBridge(
    ref,
    { items: p.items, open: p.open },
    {
      "bion-close": () => p.onClose?.(),
      "bion-quantity-change": (d) => p.onQuantityChange?.(d),
      "bion-checkout": () => p.onCheckout?.(),
    },
    [p.items, p.open],
    [p.onClose, p.onQuantityChange, p.onCheckout],
  );
  return h("bion-cart-drawer", {
    ref,
    subtotal: p.subtotal,
    total: p.total,
    shipping: p.shipping,
  });
}

export type { CartLine };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [el: `bion-${string}`]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        Record<string, unknown>;
    }
  }
}
