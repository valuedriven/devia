## MODIFIED Requirements

### Requirement: Color Palette Compliance
The frontend implementation SHALL restrict colors strictly to the palette defined in docs/design.md. The primary colors include Nike Black (#111111) for primary text and CTAs, Pure White (#ffffff) for canvas, and Soft Cloud (#f5f5f5) for product backgrounds and secondary CTAs. Semantic colors (Sale #d30005, Success #007d48, Info #1151ff) SHALL be used only where documented: Sale exclusively as text/price signal, never as a background or badge fill; Success for confirmation/in-stock indicators; Info for informational accents. No hardcoded hex values outside the palette SHALL appear in frontend styles; category accent colors (accent-pink, accent-purple-*, accent-teal, accent-pink-deep) SHALL NOT be used in primary chrome.

#### Scenario: Global background color
- **WHEN** the storefront or admin page is rendered
- **THEN** the canvas background color SHALL be `#ffffff` and default text color SHALL be `#111111`

#### Scenario: Product card background color
- **WHEN** product card images are rendered
- **THEN** the background color of the image container SHALL be `#f5f5f5`

#### Scenario: Sale color is text-only
- **WHEN** a sale price or discount notice is rendered
- **THEN** the Sale color (#d30005) SHALL be applied to text only and SHALL NOT be used as a background or badge fill

#### Scenario: No off-palette hex colors
- **WHEN** frontend styles are inspected
- **THEN** no hex color outside the docs/design.md palette SHALL be used, including slate/red utility scales (e.g. #0f172a, #dc2626, #fecaca)

### Requirement: Component Shape Vocabulary
The border-radius of all frontend UI components SHALL strictly match the values defined in the design system. Product cards, campaign tiles, navigation headers, and footers must be completely flat (0px). Every call-to-action button, filter chip, and badge must have 30px pill radius; search inputs use 24px; icon-only circular buttons use 9999px. No component SHALL introduce an intermediate radius (e.g. 6px, 8px, 12px) not present in the scale.

#### Scenario: Product card border radius
- **WHEN** a product card or campaign tile is rendered
- **THEN** its CSS border-radius SHALL be `0px`

#### Scenario: CTA button border radius
- **WHEN** a primary or secondary CTA button is rendered
- **THEN** its CSS border-radius SHALL be `30px`

#### Scenario: Search input border radius
- **WHEN** the search pill input is rendered
- **THEN** its CSS border-radius SHALL be `24px`

#### Scenario: Icon button radius
- **WHEN** an icon-only control (cart, user, menu trigger, carousel paddle) is rendered
- **THEN** its CSS border-radius SHALL be `9999px` (fully round)

#### Scenario: No intermediate radii
- **WHEN** any interactive or container component is rendered
- **THEN** no border-radius value outside {0, 18, 24, 30, 9999}px SHALL be applied

### Requirement: Typography Scale Compliance
Typography across the frontend SHALL match the Helvetica Now Display / Inter typography hierarchy defined in the design system. The display tier (campaign hero headlines) SHALL use 96px on desktop (clamping to 64px tablet / 48px mobile), 0.9 line height, uppercase transformation, and SHALL be reserved exclusively for editorial campaign moments. The display weight SHALL follow the loaded display font: the proprietary tier is 500 weight, while the sanctioned open-source substitute Bebas Neue (single-weight, 400) SHALL use 400 (its only available weight), per the Font Substitutes note in docs/design.md. Body, product names, buttons, captions, and UI labels SHALL use the Inter scale: body-md 16px/400, body-strong 16px/500, button-md 16px/500, caption-md 14px/500, caption-sm 12px/500, heading-xl 32px/500, heading-lg 24px/500. Weights 600/700 SHALL NOT be used for chrome text.

#### Scenario: Campaign Display Headline
- **WHEN** a campaign hero banner is rendered
- **THEN** the display headline text SHALL use 96px size (desktop), 0.9 line height, uppercase transformation, and the weight supported by the loaded display font (500 for the proprietary tier, 400 for the Bebas Neue substitute)

#### Scenario: Button text typography
- **WHEN** a standard button is rendered
- **THEN** the button text SHALL use 16px size and 500 weight

#### Scenario: Product name typography
- **WHEN** a product name is rendered on a product card or PDP
- **THEN** it SHALL use 16px size and 500 weight (body-strong)

#### Scenario: Display tier reserved for hero
- **WHEN** a section header or product title is rendered outside the campaign hero
- **THEN** it SHALL NOT use the 96px display-campaign tier

### Requirement: Design System Sizing Consistency
The design system CSS tokens (`globals.css`) SHALL use a consistent token system for sizing and border-radius properties, avoiding hardcoded `px` overrides in component rules. Radius values SHALL map to the token scale {none: 0, sm: 18, md: 24, lg: 30, full: 9999}px and spacing SHALL map to the token scale {xxs: 2, xs: 4, sm: 8, md: 12, lg: 18, xl: 24, xxl: 30, section: 48}px.

#### Scenario: Defining border radius
- **WHEN** the border-radius variables are defined
- **THEN** they MUST use the standard unit defined for the system (e.g., `rem`) without mixing absolute `px` values

#### Scenario: Component rules use tokens
- **WHEN** a component rule in globals.css specifies radius, spacing, or typography size
- **THEN** it MUST reference the corresponding token variable instead of a raw value

## ADDED Requirements

### Requirement: No Drop Shadows or Elevation
The frontend SHALL NOT use drop shadows or card elevation anywhere in the retail chrome. Cards, buttons, sections, and menus sit flat on the page. The only permitted depth cue is the 1px inset hairline-soft bottom line on sticky bars/tab strips (`box-shadow: inset 0 -1px 0 #e5e5e5`) and 1px hairline dividers. Glassmorphism (backdrop-filter blur on chrome surfaces) SHALL NOT be used.

#### Scenario: Card has no shadow
- **WHEN** a card, product card, auth card, or menu surface is rendered
- **THEN** its box-shadow SHALL be `none` (except the documented inset hairline on sticky bars)

#### Scenario: No backdrop blur on chrome
- **WHEN** the header, sidebar, menu, or any chrome surface is rendered
- **THEN** no `backdrop-filter` blur SHALL be applied to it

### Requirement: Light-Only Theme with Single Token Source
The frontend SHALL be light-only, with the docs/design.md token set as the single source of truth in `globals.css`. The legacy shadcn-style HSL token block and the `.dark` theme SHALL be removed; no component SHALL reference `hsl(var(--...))` tokens or a dark variant.

#### Scenario: No dark theme
- **WHEN** the application is rendered
- **THEN** no `.dark` class or dark-mode style block SHALL exist or take effect

#### Scenario: Single token source
- **WHEN** globals.css is inspected
- **THEN** component and utility rules SHALL reference the design.md token variables (--color-*, --radius-*, --space-*) and SHALL NOT reference a parallel HSL token block

### Requirement: Button Component Compliance
Button components SHALL implement the documented variants with exact values: `button-primary` (ink #111111 background, white text, 16px/500, 30px radius, 48px height, 16px/32px padding, pressed state collapses the surface via scale with no background shift); `button-secondary` (soft-cloud #f5f5f5 background, ink text, same metrics); `button-outline-on-image` (canvas background, ink text, hairline border, 12px/24px padding, 30px radius); `button-icon-circular` (40px circle, 9999px radius, soft-cloud background or transparent, ink icon). Hover states SHALL NOT change background color or lift the button (translateY), per system policy documenting only Default and Active/Pressed.

#### Scenario: Primary button metrics
- **WHEN** a primary CTA button is rendered
- **THEN** it SHALL have ink background, 48px height, 30px border-radius, and NOT translate or change background on hover

#### Scenario: Sale red never on buttons
- **WHEN** any button variant is rendered
- **THEN** its background SHALL NOT use the Sale color

### Requirement: Badge Component Compliance
Badges SHALL follow the documented spec: `badge-promo` is canvas background with a 1px hairline border, ink text, 12px/500 (caption-sm), 30px radius, and 4px/12px padding, sitting on top of product imagery; `badge-sale-text` is inline price-row text in Sale color with no background. Badge backgrounds SHALL use canvas, soft-cloud, or success surfaces per documentation, never Sale red.

#### Scenario: Promo badge style
- **WHEN** a promo badge ("Just In", "Coming Soon", "Esgotado") is rendered
- **THEN** it SHALL have a canvas background with hairline border and SHALL NOT have a Sale-colored background

### Requirement: Product Card Compliance
Product cards SHALL have zero radius, zero shadow, zero internal padding, and no border. The product image SHALL be full-bleed within the card on a soft-cloud background at 1:1 ratio. Metadata (name, subtitle, price) SHALL sit directly below the image separated by 8px gaps, with name/price in body-strong (16px/500).

#### Scenario: Full-bleed product image
- **WHEN** a product card is rendered
- **THEN** the image container SHALL have 0px padding and the image SHALL fill it edge to edge

#### Scenario: No card border or shadow
- **WHEN** a product card is rendered
- **THEN** its border and box-shadow SHALL be none and border-radius SHALL be 0px

#### Scenario: Metadata spacing
- **WHEN** product name, subtitle, and price rows are rendered below the image
- **THEN** the gap between them SHALL be 8px and the card SHALL NOT add internal padding around them

### Requirement: Search Pill Compliance
The search input SHALL render as a pill with soft-cloud background, ink text, 16px/400 body text, 24px radius, 8px/16px padding, and 40px height. On focus it SHALL switch to canvas background with a 2px ink border and a 12px outer halo of soft-cloud (the system's only focus ring).

#### Scenario: Default search pill
- **WHEN** the search pill is rendered unfocused
- **THEN** its background SHALL be soft-cloud, radius SHALL be 24px, and height SHALL be 40px

#### Scenario: Focused search pill
- **WHEN** the search pill receives focus
- **THEN** its background SHALL become canvas with a 2px ink border and a soft-cloud outer halo

### Requirement: Footer Compliance
The footer SHALL use a canvas background with a single 1px hairline top divider. Footer links SHALL use caption-md (14px/500) in Mute color; column headers use body-strong; the fine-print row uses the utility tier (9px/500). The footer SHALL NOT use a gray (soft-cloud/muted) background.

#### Scenario: Footer background
- **WHEN** the footer is rendered
- **THEN** its background SHALL be canvas (#ffffff) and its top edge SHALL be a 1px hairline divider

### Requirement: Header Compliance
The primary header SHALL use a solid canvas background with a 1px hairline bottom divider, no backdrop blur and no translucency, height 56–64px. Icon controls in the header (cart, search toggle, user) SHALL be 40px circular buttons; the cart count badge SHALL use ink text on canvas with hairline border or an on-primary/ink circular badge, never a Sale-colored background.

#### Scenario: Solid header background
- **WHEN** the primary header is rendered
- **THEN** it SHALL have a solid canvas background without backdrop-filter blur or translucent color

#### Scenario: Header icon controls
- **WHEN** cart, user, or menu icon controls are rendered in the header
- **THEN** they SHALL be circular 40px controls with ink icons

### Requirement: Home Page Section Rhythm and Grid
The storefront home SHALL stack its major content blocks (hero, category rail, product grid) with 48px section spacing and no decorative dividers. Product grids SHALL use 8px gutters and collapse from 4-up → 3-up → 2-up → 1-up across the documented breakpoints. The hero SHALL render as a campaign block: ink background, display-campaign headline (96px/0.9/uppercase), and a canvas on-image CTA pill anchored bottom-left.

#### Scenario: Hero campaign typography
- **WHEN** the home hero is rendered
- **THEN** it SHALL use the display-campaign tier (96px desktop / uppercase / 0.9 line height) with a canvas pill CTA

#### Scenario: Product grid gutters
- **WHEN** the product grid is rendered
- **THEN** the gutters between cards SHALL be 8px

### Requirement: Admin Surfaces Follow the Same Design System
Admin surfaces (sidebar, header, tables, forms, dialogs, dashboard cards) SHALL use the same design.md tokens and component classes as the storefront. Hardcoded slate/red hex utilities in admin styles SHALL be replaced with palette tokens. No separate or parallel visual system SHALL exist for admin.

#### Scenario: Admin uses palette tokens
- **WHEN** admin pages are rendered
- **THEN** their colors SHALL resolve from the design.md token set, with no off-palette slate/red hex values

#### Scenario: Shared button and badge components
- **WHEN** admin buttons and badges are rendered
- **THEN** they SHALL use the same Button/Badge components and classes as the storefront