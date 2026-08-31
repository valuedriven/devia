# Design — Frontend Design System Alignment

## Context

`docs/design.md` is the single source of truth for the brand's visual system: a monochrome palette (`ink` #111111, `canvas` #ffffff, `soft-cloud` #f5f5f5, semantic `sale`/`success`/`info` only), an extreme typography contrast (96px uppercase display tier vs. quiet 12–16px Helvetica Now/Inter tier), pill-shaped CTAs (`rounded.lg` 30px / `rounded.md` 24px), flat zero-radius product cards with no shadow/padding, and an 8px spacing system with `spacing.section` (48px) rhythm.

Current frontend state:
- `apps/frontend/src/app/globals.css` holds **two parallel token systems**: the design.md-derived `--color-*` tokens (already present, lines 53–69) and a legacy shadcn-style HSL block (`--background`, `--foreground`, `--primary`, `--muted`, ...) plus a `.dark` variant that design.md does not define.
- Components mix both systems: inline `hsl(var(--foreground))`/`hsl(var(--border))` next to `var(--color-ink)`/`var(--color-soft-cloud)`.
- Violations of design.md: glassmorphism (`.glass`, `.glass-card`, header `backdrop-filter`), drop shadows (`.card`, `.auth-card`, `.menu-trigger-btn`, `.mobile-menu-content`, `.cart-badge`, `.hero-logo-wrapper`), `.badge-promo` with a red background (design.md: sale red is **text-only**, never a background), 8px padding inside `.product-image-wrapper` (design.md: full-bleed, 0px), product title 18px/600 (design.md: `body-strong` 16px/500), gray centered footer (design.md: canvas + hairline top divider, multi-column), generic `#dc2626`/`#0f172a`/slate-red hex literals in admin utilities.
- The OpenSpec capability `design-system-alignment` exists with 4 stub requirements and will be expanded via delta specs.

Constraints: Next.js App Router presentation layer only; no new dependencies wanted (Bebas Neue + Inter already imported, matching the design.md substitute recommendation); no backend/API changes; DOM structure and `data-testid` selectors must remain stable so the existing Playwright suite (which asserts selectors, not CSS values) keeps passing.

## Goals / Non-Goals

**Goals:**
- Single token source of truth derived from design.md — remove the legacy HSL block and `.dark` mode.
- Eliminate all drop shadows and glassmorphism; adopt the flat/hairline-only elevation model.
- Restyle components to the exact design.md specifications (buttons, badges, search pill, product card, footer, header, hero) using tokens only.
- Apply the typography scale (display-campaign 96/0.9/uppercase, heading-xl 32/500, body-strong 16/500, caption tiers) across storefront and admin.
- Apply 8px grid gutters and 48px section rhythm; align admin surfaces with the same tokens (no parallel system).
- Keep `data-testid` and DOM structure intact so Playwright specs keep passing.

**Non-Goals:**
- No backend, API, schema, or data changes.
- No new npm dependencies, fonts, or build tooling.
- No new icon set, images, or photography (hero stays a typographic campaign block on `ink`, since no campaign imagery exists).
- No light/dark theme toggle work — the system is light-only by design.
- No micro-interactions beyond what design.md documents (no hover states per system policy; the only interaction states are Default and Active/Pressed).

## Decisions

### D1 — Collapse to design.md tokens only; delete legacy HSL + `.dark`
Replace the two-system CSS with the existing `--color-*` tokens (they already match design.md hex values) plus new typography, radius, and spacing token groups. Delete `.dark` and every `hsl(var(--...))` reference, rewriting them to the palette tokens.
- *Alternatives considered*: (a) Keep both systems and map them — rejected: two sources of truth guarantee drift; (b) migrate hsl-vars to design.md names via find/replace — same result, this is just the explicit form.
- Rationale: the `--color-*` block already encodes design.md correctly; everything else is legacy scaffolding (shadcn-influenced) not present in the spec.

### D2 — Elevation: flat by default, single inset hairline utility
Remove `box-shadow` from `.card`, `.auth-card`, `.menu-trigger-btn`, `.mobile-menu-content`, `.cart-badge`, `.hero-logo-wrapper`, `.glass*`; remove `.glass`/`.glass-card`/`backdrop-filter` entirely. Provide one utility `.hairline-inset-bottom` (`box-shadow: inset 0 -1px 0 var(--color-hairline-soft)`) for sticky bars.
- *Alternatives considered*: keep shadows "light" — rejected: design.md's Do/Don't list is explicit ("no drop shadows or card elevation").
- Rationale: matches the documented elevation table (Level 0 flat / Level 1 hairline / Level 2 inset only).

### D3 — Token-organized radius and typography groups in `:root`
Add `--radius-none: 0px`, `--radius-sm: 18px`, `--radius-md: 24px`, `--radius-lg: 30px`, `--radius-full: 9999px`; `--space-*` (2/4/8/12/18/24/30/48px); typography tokens (`--font-display: "Bebas Neue"` for display tier; `--font-sans: Inter` for UI/body; size/weight/line-height per tier). Use these in all component rules; no hardcoded `px` in component rules (except 1px hairlines, which design.md fixes at 1px).
- Rationale: mirrors the exact design.md front-matter structure so `docs/design.md` stays the readable source; lints against the design system become trivial.

### D4 — Component restyle mapping table (authoritative)
| design.md component | Current implementation | Change |
|---|---|---|
| `button-primary` (ink pill, 48px, 16/32 padding, radius 30) | `.btn-primary` mostly matches | fix hover (no background change; pressed = `scale(0.98)`, no color shift beyond active state), remove `translateY` |
| `button-secondary` (soft-cloud pill) | `.btn-secondary` matches | keep; drop hover background shift to `hairline-soft` → keep neutral |
| `button-outline-on-image` (canvas pill) | `btn-outline` uses `hsl(var(--input))` border | rebuild as canvas bg + ink text + hairline border + radius 30 |
| `button-icon-circular` (40px, full radius) | `.menu-trigger-btn`, `.btn-icon-size`, `.btn-ghost` cart/user | unify into `.btn-icon-circular` (40px, radius full, soft-cloud bg, ink icon) |
| `search-pill` (soft-cloud, 24px, 40px, focused = canvas + 2px ink + halo) | `.search-input` (canvas, hairline border) | soft-cloud default; focused adds 2px ink border + 12px soft-cloud outer halo |
| `filter-chip` (canvas+hairline→inverted ink) | home category links use `.btn btn-sm` | new `.chip` class: default canvas+hairline, active ink+on-primary, radius 30, 8/16 padding |
| `badge-promo` (canvas + hairline, radius 30, caption-sm) | `.badge-promo` red background | canvas+hairline; sale red only in `.badge-sale-text` (inline price text) |
| `badge-sale-text` | exists | keep (text-only, `sale`) |
| `product-card` (0 radius, 0 padding, full-bleed image on soft-cloud, meta rows 8px) | `.product-card` has hairline border; `.product-image-wrapper` 8px padding; content 16px padding | remove border, remove paddings; image full-bleed; metadata block directly below with 8px gaps |
| product title/price | 18px/600; price 20px/700 | `body-strong` (16px/500) for name; price row per design (regular = body-strong; sale = `sale` + strike `mute` + "% off" `sale`) |
| `footer` (canvas, hairline top, link columns) | gray centered single row | canvas bg, hairline top, multi-column link list, `mute` caption links, utility-xs fine-print row |
| `primary-nav` (canvas, 56–64px, no blur) | glass header with backdrop blur | solid canvas, hairline bottom, height 64px |
| hero / campaign block | `.hero-section` ink block (already) | align typography: display-campaign 96px/0.9 uppercase (clamp 48/64/96), white on-image CTA pill bottom-left |
| grid gutters | `.products-grid` gap 2rem | 8px gutters (`--space-sm`), 4-up → 3-up → 2-up → 1-up at documented breakpoints |
| section rhythm | `.home-container` gap 2rem | `spacing.section` (48px) between major blocks |

### D5 — Admin uses the same tokens without a parallel system
Admin components (`DesktopSidebar`, `AdminHeader`, tables, forms, `AdminDataTable`, dialogs) keep their layout and accessibility behavior but swap hex literals (`#0f172a`, `#dc2626`, slate scale, `#e2e8f0`) for `--color-*` tokens and apply the button/badge/input classes. Dashboard KPIs (change-10/11 scope) follow the same card treatment once they exist.
- *Alternative considered*: leave admin as-is — rejected by decision: user confirmed "Siga os mesmos padrões" (same standards).
- Rationale: one system, consistent chrome everywhere, simpler maintenance.

### D6 — Preserve Playwright compatibility
No `data-testid` changes; no DOM restructuring of interactive elements (buttons stay `<button>`, links stay `<Link>`/`<a>`); visual-only class/style edits. The E2E suite asserts selectors, text, and flows — not CSS computed values — so it acts as the regression net (verified: no `toHaveCSS`/`toHaveClass` in specs).

### D7 — Display hero uses the loaded substitute font weight
The campaign hero headline uses the `--font-heading` stack whose first face is **Bebas Neue**, loaded at its only weight (400) in `layout.tsx` (and the Google Fonts `@import`). Bebas Neue is single-weight, so the hero sets `font-weight: 400` rather than the proprietary tier's 500. This matches the Font Substitutes note in docs/design.md; if a 500 display face is ever available (e.g. replacing Bebas Neue with a variable display font), the hero weight should be raised to 500 and the delta spec re-checked.

### D8 — Typography tier utility classes for page headings
Page headings (shop + admin titles) and PDP price now use semantic tier classes (`heading-xl` 32px/500, `heading-lg` 24px/500, `heading-md` 16px/500) that reference the `--type-heading-*` tokens, replacing raw `text-3xl/2xl font-bold` utilities. This keeps the documented heading scale as the single source for big text and removes 700-weight chrome.

## Risks / Trade-offs

- [Legacy `.dark` consumers] → grep confirms none of the components toggle `.dark` or read theme; removing it only affects styles that referenced it (header/menu/glass were the only consumers).
- [Visual regression not caught by tests] → the Playwright suite won't notice styling drift. Mitigation: keep changes mechanical (token substitution + documented mapping), run lint/build; manual visual pass on home/product/auth/admin pages during implementation.
- [Font availability] → Bebas Neue/Inter are already loaded via Google Fonts; design.md explicitly sanctions this substitution. No flight risk.
- [Hardcoded hex cleanup scope] → globals.css contains many admin utility hexes; the task list must include a grep-driven pass (`#0f172a`, `#dc2626`, `#ef4444`, slate `bg-*`/`text-*` scales, `#fecaca` palette) to avoid leaving strays.
- [Change-10/11 overlap] → dashboard work (in-progress changes) may introduce new cards; the component mapping above already covers "card" treatment, so no conflict. If dashboard UI lands first, apply the same token rules there.
- [Scope creep] → Non-Goals listed explicitly; if new imagery/hero content is desired later, that is a separate change.

## Migration Plan

1. **Tokens first** (globals.css): consolidate `:root`, add radius/spacing/typography token groups, delete `.dark` and HSL block, remove `.glass*`.
2. **Component rules** (globals.css): rewrite button/badge/input/card/product/footer/header/hero/chip classes per D4.
3. **Admin utilities** (globals.css): replace hex literals with tokens.
4. **Component TSX** (`Button`, `Badge`, `Input`, `Card`, `ProductCard`, `Header`, `Footer`, `MobileMenu`, admin components): update class names only.
5. **Pages**: shop + auth + admin pages — adjust any inline styles/classes that used removed utilities.
6. **Validate**: `npm run lint --workspace=frontend`, `npm run build` (frontend), Playwright suite (`npx playwright test`, workers=1).
7. Rollback: changes are CSS/class-name only — revert the diff or the specific commit; no data migration.

## Open Questions

- Whether the hero should later receive real campaign photography (design.md is photography-first) — out of scope now, noted as future enhancement.
- Whether "SAVE % off" strike-through pricing rows are needed on the storefront — design.md documents the sale row; current catalog may not have discounted products. Implementation will wire the pattern where price data supports it.