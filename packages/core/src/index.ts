/**
 * @bion-mfe-ui/core, Web Component entry.
 *
 * Importing this module registers every <bion-*> custom element as a side
 * effect. For smaller bundles, import a single component instead:
 *
 *   import '@bion-mfe-ui/core/product-card';
 *
 * Components (each ported from the reference UI, same boundary rules, render +
 * emit events, never business logic):
 *   bion-icon              shared
 *   bion-button            shared
 *   bion-chip              catalog (filters)
 *   bion-rating            catalog
 *   bion-product-card      catalog
 *   bion-carousel          catalog (hero banners)
 *   bion-quantity-stepper  cart
 *   bion-cart-drawer       cart
 *   bion-account-badge     shell
 */
export * from "./components/icon.js";
export * from "./components/button.js";
export * from "./components/chip.js";
export * from "./components/rating.js";
export * from "./components/product-card.js";
export * from "./components/carousel.js";
export * from "./components/quantity-stepper.js";
export * from "./components/cart-drawer.js";
export * from "./components/account-badge.js";
