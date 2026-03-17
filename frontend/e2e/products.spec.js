import { test, expect } from '@playwright/test';

test.describe('Product CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');
  });

  test('should create a new product', async ({ page }) => {
    await page.click('text=Nouveau produit');
    await page.waitForURL('/products/new');

    // Fill form
    await page.fill('input[name="nom"]', 'Test Product E2E');
    await page.fill('input[name="prixUnitaire"]', '199.99');
    await page.fill('input[name="stockDisponible"]', '25');

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');

    // Verify product appears in list
    await expect(page.locator('text=Test Product E2E')).toBeVisible();
  });

  test('should update a product', async ({ page }) => {
    // Find and click edit on first product
    await page.click('table tbody tr:first-child .btn-edit');
    await page.waitForURL(/\/products\/\d+\/edit/);

    // Update name
    await page.fill('input[name="nom"]', 'Updated Product Name');
    await page.fill('input[name="prixUnitaire"]', '249.99');

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');

    // Verify update
    await expect(page.locator('text=Updated Product Name')).toBeVisible();
  });

  test('should delete a product (soft delete)', async ({ page }) => {
    const productName = 'Product to Delete';

    // Create product
    await page.click('text=Nouveau produit');
    await page.fill('input[name="nom"]', productName);
    await page.fill('input[name="prixUnitaire"]', '99.99');
    await page.fill('input[name="stockDisponible"]', '10');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');

    // Delete product
    const row = page.locator(`tr:has-text("${productName}")`);
    await row.locator('.btn-delete').click();
    
    // Confirm dialog
    page.on('dialog', dialog => dialog.accept());
    await page.click('.btn-delete');

    // Verify product is hidden (soft deleted)
    await expect(page.locator(`text=${productName}`)).not.toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await page.fill('input[placeholder*="Rechercher"]', 'Test');
    await page.waitForTimeout(500); // Debounce
    
    // Verify filtered results
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
  });
});
