## 1. Token Consolidation (globals.css)

- [x] 1.1 Remove the legacy shadcn-style HSL `:root` block (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`) and the `.dark` variant, replacing every `hsl(var(--...))` reference with design.md tokens
- [x] 1.2 Add radius token variables to `:root` mapping the design.md scale (`--radius-none: 0px`, `--radius-sm: 18px`, `--radius-md: 24px`, `--radius-lg: 30px`, `--radius-full: 9999px`)
- [x] 1.3 Add spacing token variables to `:root` mapping the design.md scale (2/4/8/12/18/24/30/48px)
- [x] 1.4 Add typography token variables to `:root` (display: "Bebas Neue"; sans: Inter; size/weight/line-height per tier) and update `--font-heading`/`--font-sans` accordingly
- [x] 1.5 Delete the `.glass` / `.glass-card` classes and the glassmorphism utility block (backdrop-filter chrome)
- [x] 1.6 Remove `box-shadow` from `.card`, `.auth-card`, `.menu-trigger-btn`, `.mobile-menu-content`, `.cart-badge`, `.hero-logo-wrapper`, `.glass-card` and any remaining drop-shadow rules; add `.hairline-inset-bottom` utility (`box-shadow: inset 0 -1px 0 var(--color-hairline-soft)`) for sticky bars
- [x] 1.7 Replace hardcoded hex colors outside the palette in globals.css (slate `#0f172a`, `#1e293b`, `#475569`, `#e2e8f0`, red `#dc2626`, `#ef4444`, `#fca5a5`, `#fecaca`, `#fee2e2`, `#bfdbfe`, etc.) with palette tokens or neutralized values
- [x] 1.8 Replace hardcoded `px` radius/spacing values in component rules with the new token variables (keeping 1px hairline borders and 2px rings as documented)

## 2. Button and Input Components

- [x] 2.1 Update `.btn-primary`: keep ink bg / white text / 16px 500 / 48px height / 16px 32px padding / 30px radius; remove hover background shift to charcoal and `translateY(-1px)`; pressed state uses `scale` only
- [x] 2.2 Update `.btn-secondary` (soft-cloud bg, ink text, same metrics) and remove hover background change
- [x] 2.3 Rebuild `.btn-outline` as `button-outline-on-image`: canvas background, ink text, 1px hairline border, 12px 24px padding, 30px radius, no hover background fill
- [x] 2.4 Add `.btn-icon-circular` class (40px circle, `--radius-full`, soft-cloud or transparent bg, ink icon) and rewire `.btn-icon-size`/`.menu-trigger-btn`/header icon controls to it
- [x] 2.5 Update `.input`/`.search-pill` to the search-pill spec: soft-cloud background, hairline-free default, 24px radius, 8px 16px padding, 40px height; focused state = canvas bg + 2px ink border + soft-cloud outer halo (12px)
- [x] 2.6 Audit `Button.tsx` / `Input.tsx` class mappings against the new classes and remove any variant that no longer maps to a documented component (ghost/link/destructive re-map to primary/secondary/outline or stay as admin-only aliases mapped to tokens)

## 3. Badges and Chips

- [x] 3.1 Restyle `.badge-promo` to canvas background + 1px hairline border + ink text + 30px radius + 4px 12px padding (caption-sm); remove the Sale-red background
- [x] 3.2 Keep `.badge-sale-text` as inline text-only Sale color; ensure no badge uses Sale as background
- [x] 3.3 Align `.badge-success`/`.badge-info`/`.badge-error`/`.badge-warning` soft-color backgrounds with palette-derived tints or neutral tokens (no off-palette `#dcfce7`, `#dbeafe`, `#fee2e2`, `#fef9c3`)
- [x] 3.4 Add `.chip` / `.chip-active` classes for filter chips (default: canvas + hairline + ink + 30px radius + 8px 16px; active: inverted ink bg + white text) and rewire the home category links and any admin filter pills to use them

## 4. Product Card and Layout

- [x] 4.1 Update `.product-card`: remove border and shadow, keep 0px radius; `.product-image-wrapper` padding → 0 (full-bleed); `.product-content` padding → 0 with 8px gaps between metadata rows
- [x] 4.2 Update `.product-title` to body-strong (16px/500, ink) and `.product-price` to body-strong metrics with design.md price-row treatment (regular ink; sale = `sale` + strike `mute` + "% off" `sale` where data supports it)
- [x] 4.3 Update `.products-grid` gutters to 8px and adjust column counts to 4-up → 3-up → 2-up → 1-up per design.md breakpoints (1920/1440/1200/1024/960/640/599)
- [x] 4.4 Update `.home-container` and section blocks to 48px `--space-section` rhythm; remove `.animate-in` decorative animation from the hero if it conflicts with the flat campaign treatment or keep only if it does not add elevation
- [x] 4.5 Restyle `.hero-section`/`.hero-title` to the campaign block: ink background, display-campaign headline (96px desktop / 64 tablet / 48 mobile, 0.9 line-height, uppercase) and a canvas on-image CTA pill anchored bottom-left; remove hero-logo blur/shadow wrapper if unused

## 5. Header, Footer, Admin Surfaces

- [x] 5.1 Update `.header-root` to solid canvas background with 1px hairline bottom divider; remove `backdrop-filter` blur and translucency; keep 64px height
- [x] 5.2 Rewire header icon controls (cart, user, menu trigger) to `.btn-icon-circular`; restyle `.cart-badge` without shadow and without Sale-red background (ink on canvas or ink circular badge)
- [x] 5.3 Restyle `.footer` to canvas background + 1px hairline top divider + multi-column link layout (caption-md Mute links, body-strong headers, utility-xs fine-print row); update `Footer.tsx` structure if needed (keep existing links/text)
- [x] 5.4 Replace admin utility hex literals in globals.css with palette tokens; restyle `.sidebar-desktop`, `.sidebar-link`, `.sidebar-header`, `.sidebar-footer`, `.sidebar-logout-btn` to design.md tokens
- [x] 5.5 Audit admin components (`DesktopSidebar`, `AdminHeader`, `AdminDataTable`, `AdminSearchBar`, `AdminDeleteButton`, forms, dialogs, `OrderPayments`, `PaymentRegistrationModal`, `OrderTimeline`, `StatusActions`, `OrderFilters`) for off-palette classes/hex and remap to shared Button/Badge/Input/card classes
- [x] 5.6 Audit shop pages (product PDP, cart, checkout, success, orders, profile) and auth pages (`LoginForm.css`, `RegisterForm.css`, `UserDropdown.css`) for removed utilities (`.glass`, hsl vars, `.dark`, dropped shadow classes) and inline style remnants; fix all references

## 6. Validation

- [x] 6.1 Create the Playwright test plan using `.agents/prompts/playwright-test-planner.md` covering: hero renders campaign typography, product card is flat with full-bleed image, promo badge is not red, footer is canvas-based, header has no translucent backdrop, admin pages render with palette tokens
- [x] 6.2 Generate Playwright E2E tests using `.agents/prompts/playwright-test-generator.md` based on the plan (visual/DOM-attribute assertions only, no computed-style flakiness; keep existing `data-testid` selectors intact)
- [x] 6.3 Run `npm run lint` (frontend workspace) and fix all issues
- [x] 6.4 Run frontend `npm run build` and fix all issues
- [x] 6.5 Run the full Playwright E2E suite (`npx playwright test` with `--workers=1`) and confirm all existing specs still pass
- [x] 6.6 Run `npm run test:all` (complete pipeline) and confirm no regressions in backend or frontend