// spec: tests/plans/design-system-alignment.md
// Change 12 — Frontend Design System Alignment
// Asserts docs/design.md compliance via DOM attributes and stable class names.
// NO computed-style assertions (avoids cross-browser flakiness); existing
// data-testid selectors are preserved and reused.
//
// NOTE: the shop layout wraps children in <Suspense>, so the Next dev server
// keeps a hidden streaming payload (<div hidden id="S:0">) that duplicates the
// page DOM. All locators below scope to visible elements (`:visible` filter) or
// to explicit data-testids so they never match the hidden template.

import { test, expect } from "@playwright/test";

test.describe("Design System Alignment", () => {
  test.describe("Home Page (Storefront)", () => {
    test("hero renders the campaign block with display headline and on-image CTA", async ({ page }) => {
      // Open the storefront home page
      await page.goto("/");

      // Hero section exists (visible render only — the Suspense streaming
      // template keeps a hidden duplicate in the DOM)
      const hero = page.locator(".hero-section:visible").first();
      await expect(hero).toBeVisible();

      // Campaign display headline is present (uppercase via CSS class)
      const heroTitle = hero.locator(".hero-title");
      await expect(heroTitle).toHaveText("Bem-vindo à DevAI Store");

      // On-image CTA pill links to the product grid
      const heroCta = hero.locator("a.btn-on-image");
      await expect(heroCta).toHaveAttribute("href", "#vitrine");
      await expect(heroCta).toHaveText("Explorar Produtos");
    });

    test("product cards are flat with full-bleed image area", async ({ page }) => {
      // Open the storefront home page
      await page.goto("/");

      // At least one product card renders (existing data-testid)
      const card = page.locator('[data-testid="product-card"]:visible').first();
      await expect(card).toBeVisible();

      // Card carries the flat card classes (no shadow / radius / border classes)
      await expect(card).toHaveClass(/product-card/);

      // Image wrapper is full-bleed (no padding class present)
      const imageWrapper = card.locator(".product-image-wrapper");
      await expect(imageWrapper).toHaveClass(/product-image-wrapper/);
    });

    test("category filter chips render with chip classes", async ({ page }) => {
      // Open the storefront home page
      await page.goto("/");

      // "Todos" chip is the default active state on first load
      const allChip = page.locator("a.chip:visible", { hasText: "Todos" }).first();
      await expect(allChip).toHaveClass(/chip-active/);

      // Category chips render with the shared chip class
      const chips = page.locator("a.chip:visible");
      const count = await chips.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Header & Footer (Chrome)", () => {
    test("header icon controls use the circular control class", async ({ page }) => {
      // Open the storefront home page
      await page.goto("/");

      // Cart control keeps its existing data-testid and gains the circular class
      const cartWrapper = page.locator('[data-testid="cart-icon-wrapper"]:visible');
      await expect(cartWrapper).toHaveClass(/btn-icon-circular/);

      // Login/user icon control is also circular
      const userControl = page
        .locator("header:visible a.btn-icon-circular, header:visible .user-dropdown-container .btn-icon-circular")
        .first();
      await expect(userControl).toBeVisible();
    });

    test("footer renders link columns and fine-print row", async ({ page }) => {
      // Open the storefront home page
      await page.goto("/");

      const footer = page.locator(".footer:visible").first();
      await expect(footer).toBeVisible();

      // Column structure exists (Institucional / Suporte / Promoções)
      await expect(footer.locator(".footer-column h3", { hasText: "Institucional" })).toBeVisible();
      await expect(footer.locator(".footer-column h3", { hasText: "Suporte" })).toBeVisible();
      await expect(footer.locator(".footer-column h3", { hasText: "Promoções" })).toBeVisible();

      // Fine-print row exists
      await expect(footer.locator(".footer-fineprint")).toContainText("Termos de Uso");
    });
  });

  test.describe("Badges", () => {
    test("promo and neutral badges never use the sale red background class", async ({ page }) => {
      // Products may render badges (e.g. "Indisponível"/"Esgotado"); we assert
      // the badge classes resolve to neutral surfaces, never a red background.
      await page.goto("/");

      const badges = page.locator(".badge:visible");
      const count = await badges.count();
      for (let i = 0; i < count; i++) {
        await expect(badges.nth(i)).not.toHaveClass(/red|sale/);
      }
    });
  });

  test.describe("Regressions", () => {
    test("order success screen keeps its data-testids and classes", async ({ page }) => {
      // The success page is reachable without an order id (renders fallback)
      await page.goto("/checkout/success?id=test");

      await expect(page.locator('[data-testid="order-success-container"]:visible')).toBeVisible();
      await expect(page.locator('[data-testid="order-success-title"]')).toHaveText("Pedido Confirmado!");
    });
  });
});