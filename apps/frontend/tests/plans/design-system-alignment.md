# Test Plan — Frontend Design System Alignment (Change 12)

> Generated with `.agents/prompts/playwright-test-planner.md` guidance.
> Purpose: lock the docs/design.md compliance points into the regression suite
> without depending on computed-style flakiness that changes across browsers.

## Prerequisites

- PostgreSQL (docker compose `db`) running and migrated
- Backend API on `:3001`, frontend dev on `:3000` (Playwright `webServer` handles both)
- Admin and customer storage states exist (auth.setup runs first)

## Assumptions

- All scenarios start from a blank/fresh state (fresh page load per test).
- Only DOM/attribute assertions plus stable computed CSS values (colors/radii from
  fixed design tokens) are used — no animation, layout, or timing assertions.

---

### 1. Home Page (Storefront)

#### 1.1 Hero renders the campaign block

**Steps:**
1. Open `/`.
2. Assert the hero section exists (`data-testid` or `.hero-section`).
3. Assert the hero title text is present ("Bem-vindo à DevAI Store").
4. Assert the hero CTA is a pill button linking to the product grid (`#vitrine`).

**Verify:** hero headline renders uppercase display typography (computed: font-family
includes "Bebas Neue"; font-size matches the clamp minimum on small viewports),
hero background is ink (`rgb(17, 17, 17)`).

#### 1.2 Product card is flat with full-bleed image

**Steps:**
1. Open `/`.
2. Assert at least one product card is rendered (`data-testid="product-card"`).
3. Assert the card computed `border-radius` is `0px`.
4. Assert the card computed `box-shadow` is `none`.
5. Assert the image wrapper has `padding: 0px` (full-bleed).

#### 1.3 Category filter chips render

**Steps:**
1. Open `/`.
2. Assert the "Todos" chip and each category chip are rendered.
3. Assert the active chip (when a category is selected) has the inverted ink
   background; default chips have canvas background and hairline border.

---

### 2. Header & Footer (Chrome)

#### 2.1 Header is solid canvas

**Steps:**
1. Open `/`.
2. Assert the header computed `background-color` is `rgb(255, 255, 255)`.
3. Assert the header computed `backdrop-filter` is `none`.

#### 2.2 Footer is canvas-based with link columns

**Steps:**
1. Open `/`.
2. Assert the footer computed `background-color` is `rgb(255, 255, 255)`.
3. Assert the footer contains "Institucional", "Suporte", "Promoções" column
   headings and the fine-print row.

#### 2.3 Icon controls are circular

**Steps:**
1. Open `/`.
2. Assert the cart control and login/user control are 40px circles
   (`border-radius: 9999px`, `width: 40px`).

---

### 3. Promo Badge (Sale text is never a background)

#### 3.1 Promo badge is canvas + hairline

**Steps:**
1. Open a product card that renders a badge (or the PDP when a badge is shown).
2. When a `.badge` with promo/neutral tone renders, assert its computed
   `background-color` is `rgb(255, 255, 255)` (never `rgb(211, 0, 5)`).
3. Assert `.badge-sale-text` (if rendered) has `background: transparent` and
   `color: rgb(211, 0, 5)`.

---

### 4. Admin Surfaces Use the Same Tokens

#### 4.1 Admin pages render with palette tokens

**Steps:**
1. Sign in as admin (storage state `tests/.auth/admin.json`).
2. Open `/admin/orders` and `/admin/products`.
3. Assert page chrome (sidebar, header, table card) uses `#ffffff`/`#f5f5f5`
   surfaces with hairline borders — assert one table header row background is
   `rgb(245, 245, 245)` or `rgb(255, 255, 255)`.
4. Assert no element has `box-shadow` other than `none` on the order list card.

#### 4.2 Admin buttons reuse shared component classes

**Steps:**
1. Open `/admin/products`.
2. Assert the "Novo Produto" button carries the `btn-primary` pill class and
   computed `border-radius` of `30px`.

---

### 5. Regressions (existing behavior intact)

- The full existing Playwright suite continues to pass (selectors, flows, texts).
- No `data-testid` removed or renamed across storefront and admin pages.

## Notes

- Computed-value assertions use the exact design tokens from docs/design.md:
  ink `rgb(17, 17, 17)`, canvas `rgb(255, 255, 255)`, soft-cloud
  `rgb(245, 245, 245)`, sale `rgb(211, 0, 5)`.
- Avoid asserting on hover/interaction states (not documented by design.md).