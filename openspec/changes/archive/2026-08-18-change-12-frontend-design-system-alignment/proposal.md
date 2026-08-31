# 12 — Frontend Design System Alignment

## Why

`docs/design.md` defines the single source of truth for the brand's visual system (monochrome ink/canvas/soft-cloud palette, pill CTAs at 30px, flat zero-radius cards, 8px spacing rhythm, editorial display typography). The frontend currently keeps a parallel legacy set of shadcn-style HSL tokens plus a `.dark` mode, and several components violate the documented system outright — glassmorphism surfaces, drop shadows, a red-filled promo badge, padded product-card image wrappers, and a centered gray footer. The capability spec `design-system-alignment` exists but only stubs 4 requirements; this change expands it into full compliance and refactors the frontend layer to match `docs/design.md` exactly.

## What Changes

- **Token unification**: retire the legacy HSL shadcn-style `:root` token block and the `.dark` mode (the system is light-only by design); keep the single design.md-derived token set (`--color-*`, `--spacing-*`, `--radius-*`, typography scale) as the only source of truth in `globals.css`.
- **Elevation compliance**: remove every drop shadow and glassmorphism effect (`.glass`, `.glass-card`, header backdrop blur, card/auth-card/menu shadows, cart-badge shadow). The only permitted depth cue is the 1px inset hairline-soft line on sticky bars.
- **Component restyle per design.md**: buttons (primary black pill 48px/radius 30px, secondary soft-cloud, on-image, icon-circular 40px), search pill (soft-cloud, 24px, 40px, focused state), filter chips (canvas+hairline → inverted ink when active), badges (promo = canvas+hairline, sale stays text-only), product card (0px radius, 0px padding, full-bleed image on soft-cloud, metadata rows at 8px), footer (canvas, hairline top divider, link columns).
- **Typography scale**: apply the documented tiers (`heading-xl` 32/500, `body-md` 16/400, `body-strong` 16/500, `caption-md` 14/500, display-campaign 96/0.9 uppercase) to page titles, product names/prices, and button labels; remove non-system weights (600/700 in chrome).
- **Hero / storefront layout**: restyle the home hero into a campaign tile using `display-campaign` typography with a white on-image pill CTA; apply the 8px grid gutters and `spacing.section` (48px) block rhythm.
- **Admin surfaces** follow the same tokens and components (sidebar, header, buttons, tables, forms, dashboard) — no parallel visual system.
- **BREAKING (visual only)**: the `.dark` class stops having effect; any hardcoded non-palette hex values (`#dc2626`, `#f87171`, `#0f172a`, slate/red scales, `#fecaca` etc.) are replaced by palette tokens or neutralized.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `design-system-alignment`: expand the 4 stub requirements into full docs/design.md compliance — palette exclusivity, elevation/shadow prohibition, shape vocabulary (0px/24px/30px/9999px), typography scale, component-level specifications (buttons, badges, search pill, product card, footer, hero), spacing/grid rhythm, and removal of the dark mode and legacy HSL tokens.

## Impact

- `apps/frontend/src/app/globals.css` — dominant change: token consolidation, shadow/glass removal, component restyle, admin utility alignment.
- Component styles: `apps/frontend/src/components/ui/{Button,Badge,Input,Card,ProductCard,Pagination}.tsx` (class usage), `apps/frontend/src/components/layout/{Header,Footer,MobileMenu,UserDropdown,AdminHeader,DesktopSidebar}.tsx`, `apps/frontend/src/components/auth/{LoginForm,RegisterForm}.css`.
- Page styles: `apps/frontend/src/app/page.module.css`, shop pages (home, product, cart, checkout, success, orders, profile), auth pages, admin pages (catalog, customers, orders, dashboard, categories, products).
- No API/backend changes; no new dependencies (Bebas Neue + Inter already loaded).
- E2E stability: visual selectors (`data-testid`) and DOM structure must remain intact; only class/style changes allowed.