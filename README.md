# @bion-mfe-ui

**Live demo:** https://gdgoc-bion.github.io/bion-mfe-ui/

Framework-agnostic design system for the Bion micro-frontends. Built so the
shell, product-catalog, and cart remotes, which deploy independently and may
even be written in different frameworks, share one visual language without
coupling their code.

## Why it's structured this way

The brief was: _a UI component design system that doesn't care whether it's
installed in React, Vue, etc._ That single requirement decides the architecture.
If the shared layer were React components, it would not be agnostic. So the real
shared layer is **tokens + CSS + Web Components**, and per-framework packages are
thin adapters on top.

```
tokens ─┬─► css ──────────────► (any framework, class-based)
        │
        └─► core (Web Components) ─┬─► react (adapter)
                                   ├─► vue   (adapter)
            icons ─────────────────┘   └─► svelte / angular (future)
```

## Packages

| Package                                                                    | npm                                                                                                           | Agnostic? | What it is                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| [`@bion-mfe-ui/tokens`](https://www.npmjs.com/package/@bion-mfe-ui/tokens) | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/tokens)](https://www.npmjs.com/package/@bion-mfe-ui/tokens) | yes       | Source of truth for color, type, spacing, radius, motion. Emits CSS vars, JS, SCSS. |
| [`@bion-mfe-ui/icons`](https://www.npmjs.com/package/@bion-mfe-ui/icons)   | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/icons)](https://www.npmjs.com/package/@bion-mfe-ui/icons)   | yes       | Raw SVG icon strings. No framework.                                                 |
| [`@bion-mfe-ui/css`](https://www.npmjs.com/package/@bion-mfe-ui/css)       | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/css)](https://www.npmjs.com/package/@bion-mfe-ui/css)       | yes       | Class-based stylesheet on top of tokens. Use without any JS framework.              |
| [`@bion-mfe-ui/core`](https://www.npmjs.com/package/@bion-mfe-ui/core)     | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/core)](https://www.npmjs.com/package/@bion-mfe-ui/core)     | yes       | The actual components, as Web Components (Lit). `<bion-product-card>` etc.          |
| [`@bion-mfe-ui/react`](https://www.npmjs.com/package/@bion-mfe-ui/react)   | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/react)](https://www.npmjs.com/package/@bion-mfe-ui/react)   | React     | Thin wrappers: bridge props + custom events.                                        |
| [`@bion-mfe-ui/vue`](https://www.npmjs.com/package/@bion-mfe-ui/vue)       | [![npm](https://img.shields.io/npm/v/@bion-mfe-ui/vue)](https://www.npmjs.com/package/@bion-mfe-ui/vue)       | Vue       | Thin wrappers: typed props + emits.                                                 |

## Components (all implemented)

| Component       | Tag                     | Owner remote      | Key events                                            |
| --------------- | ----------------------- | ----------------- | ----------------------------------------------------- |
| Icon            | `bion-icon`             | shared            | none                                                  |
| Button          | `bion-button`           | shared            | native `click`                                        |
| Chip            | `bion-chip`             | catalog (filters) | `bion-select`                                         |
| Rating          | `bion-rating`           | catalog           | none (display only)                                   |
| ProductCard     | `bion-product-card`     | product-catalog   | `bion-add`, `bion-favorite`, `bion-select`            |
| Carousel        | `bion-carousel`         | catalog (hero)    | none (slotted slides)                                 |
| QuantityStepper | `bion-quantity-stepper` | cart              | `bion-change`                                         |
| CartDrawer      | `bion-cart-drawer`      | cart              | `bion-close`, `bion-quantity-change`, `bion-checkout` |
| AccountBadge    | `bion-account-badge`    | shell             | `bion-select`                                         |

Every component is available three ways: the Web Component directly
(`@bion-mfe-ui/core/<name>`), the React wrapper (`@bion-mfe-ui/react`), and the
Vue wrapper (`@bion-mfe-ui/vue`). Same props, same events, one implementation.

## Installation

All packages are ESM-only and published under the `@bion-mfe-ui` scope. Install
the one that matches your setup — framework adapters pull `core`, `tokens`, and
`icons` in automatically.

| Setup                                           | Install                           |
| ----------------------------------------------- | --------------------------------- |
| **React**                                       | `npm install @bion-mfe-ui/react`  |
| **Vue**                                         | `npm install @bion-mfe-ui/vue`    |
| **Plain HTML / any framework** (Web Components) | `npm install @bion-mfe-ui/core`   |
| **CSS only** (no JS framework)                  | `npm install @bion-mfe-ui/css`    |
| **Design tokens only**                          | `npm install @bion-mfe-ui/tokens` |

```bash
# pnpm
pnpm add @bion-mfe-ui/react
# yarn
yarn add @bion-mfe-ui/react
```

**Peer dependencies** (you provide these):

- `@bion-mfe-ui/react` → `react` and `react-dom` `>=18`
- `@bion-mfe-ui/vue` → `vue` `>=3.4`

### Load tokens once (required)

Components read CSS variables from `tokens`, including inside their shadow DOM,
so import the stylesheet once at your app root:

```css
@import "@bion-mfe-ui/css/index.css"; /* tokens + reset + component classes */
/* or only the variables: */
@import "@bion-mfe-ui/tokens/css";
```

### Via CDN (no install)

For quick prototyping, load straight from a CDN — `esm.sh` resolves `lit` for you:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@bion-mfe-ui/css/dist/index.css"
/>
<script type="module">
  import "https://esm.sh/@bion-mfe-ui/core/product-card";
</script>
<bion-product-card name="Auro Headset" price="Rp 349.000"></bion-product-card>
```

## Usage

The host page loads tokens once (so CSS vars exist for every remote and inside
shadow DOM):

```css
@import "@bion-mfe-ui/css/index.css"; /* tokens + reset + classes */
/* or just tokens: @import '@bion-mfe-ui/tokens/css'; */
```

**Plain HTML / any framework**

```html
<script type="module">
  import "@bion-mfe-ui/core/product-card";
</script>
<bion-product-card
  name="Auro Headset"
  brand="Auro"
  price="Rp 349.000"
  old-price="Rp 499.000"
  glyph="audio"
  tag="30% off"
  rating="5"
  reviews="1.2rb"
>
</bion-product-card>
<script>
  document
    .querySelector("bion-product-card")
    .addEventListener("bion-add", (e) => console.log("add", e.detail));
</script>
```

**React** (product-catalog remote)

```tsx
import { ProductCard } from "@bion-mfe-ui/react";

<ProductCard
  name="Auro Headset"
  brand="Auro"
  price="Rp 349.000"
  oldPrice="Rp 499.000"
  glyph="audio"
  tag="30% off"
  rating={5}
  reviews="1.2rb"
  onAdd={({ name }) =>
    window.dispatchEvent(
      new CustomEvent("cart:add-item", { detail: { product: { name } } }),
    )
  }
/>;
```

Note how `onAdd` re-emits the existing `cart:add-item` MFE contract, so the design
system stays unaware of the cart.

**Vue**

```vue
<script setup>
import { ProductCard } from "@bion-mfe-ui/vue";
</script>
<template>
  <ProductCard
    name="Auro Headset"
    brand="Auro"
    price="Rp 349.000"
    glyph="audio"
    :rating="5"
    reviews="1.2rb"
    @add="({ name }) => /* re-emit cart:add-item */"
  />
</template>
```

## The two rules that keep this from breaking MFE

1. **Tokens are a quiet contract.** Every remote re-themes when `tokens` changes
   on rebuild. So tokens is the most stable package: discipline the semver, and a
   visual breaking change is a MAJOR bump.

2. **No business logic in the design system.** Components render and emit events.
   `bion-product-card` emits `bion-add`; it never knows what a cart is or how
   prices are calculated. Currency formatting, cart math, and auth live in the
   remotes. If cart logic leaked in here, every remote would be coupled through
   the back door, defeating the point of micro-frontends.

## Build

```bash
pnpm install
pnpm build           # builds every package (tokens first, adapters last)
```

Each package has a `tsconfig.json` extending `tsconfig.base.json`. The base sets
`moduleResolution: "bundler"` and `experimentalDecorators: true`, both required:
the first lets the `--dts` step resolve workspace + peer imports (react, vue,
`@bion-mfe-ui/core`), the second is needed for Lit's `@property` decorators.
`pnpm -r` builds in dependency order, so `core` is compiled before the react/vue
adapters that import its types.
