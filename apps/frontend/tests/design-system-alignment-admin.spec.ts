// spec: tests/plans/design-system-alignment.md
// Change 12 — Frontend Design System Alignment — ADMIN-only scenarios.
// Runs under the "admin" project (admin storage state). Excluded from the
// "customer" project via testIgnore in playwright.config.ts (same pattern as
// category-management / customer-management / product-management specs).

import { test, expect } from "@playwright/test";

test.describe("Design System Alignment — Admin", () => {
  test("admin orders page renders with shared card/table chrome", async ({ page }) => {
    // Admin storage state from auth.setup (admin.json)
    await page.goto("/admin/orders");

    // Page heading renders
    await expect(page.locator("h1", { hasText: "Pedidos" }).first()).toBeVisible();

    // Data table card renders with the shared card class (flat container)
    const tableCard = page.locator(".card:visible").first();
    await expect(tableCard).toBeVisible();

    // No glass/shadow utility on admin chrome
    await expect(tableCard).not.toHaveClass(/glass|shadow/);
  });

  test("admin products page primary CTA uses the shared primary pill", async ({ page }) => {
    // Open the products listing as admin
    await page.goto("/admin/products");

    // "Novo Produto" link uses the shared primary pill button class
    const newProductLink = page.locator("a.btn-primary:visible", { hasText: "Novo Produto" });
    await expect(newProductLink).toBeVisible();
  });
});