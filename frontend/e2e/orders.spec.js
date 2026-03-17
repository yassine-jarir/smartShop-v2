import { test, expect } from '@playwright/test';

test.describe('Order Creation and Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');
    
    // Navigate to orders
    await page.click('text=Commandes');
    await page.waitForURL('/orders');
  });

  test('should reject order with insufficient stock', async ({ page }) => {
    await page.click('text=Nouvelle commande');
    await page.waitForURL('/orders/new');

    // Select client
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });

    // Try to add product with excessive quantity
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '99999'); // Unrealistic quantity
    await page.click('button:has-text("Ajouter")');

    // Verify error message
    await expect(page.locator('text=/Stock insuffisant/i')).toBeVisible();
  });

  test('should create order with valid stock', async ({ page }) => {
    await page.click('text=Nouvelle commande');
    await page.waitForURL('/orders/new');

    // Select client
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });
    
    // Add product with valid quantity
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '2');
    await page.click('button:has-text("Ajouter")');

    // Verify product added to cart
    await expect(page.locator('table tbody tr')).toHaveCount(1);

    // Submit order
    await page.click('button[type="submit"]');
    
    // Should redirect to order details
    await page.waitForURL(/\/orders\/\d+$/);
    await expect(page.locator('h2')).toContainText('Détails de la commande');
  });

  test('should validate promo code format', async ({ page }) => {
    await page.click('text=Nouvelle commande');
    await page.waitForURL('/orders/new');

    // Try invalid promo code
    await page.fill('input[placeholder="PROMO-XXXX"]', 'INVALID');
    await page.click('button:has-text("Valider")');

    // Verify error
    await expect(page.locator('.promo-error')).toContainText('Format invalide');

    // Try valid format
    await page.fill('input[placeholder="PROMO-XXXX"]', 'PROMO-TEST');
    await page.click('button:has-text("Valider")');
    
    // Error or success depending on backend validation
    const hasError = await page.locator('.promo-error').isVisible();
    const hasSuccess = await page.locator('.promo-success').isVisible();
    expect(hasError || hasSuccess).toBeTruthy();
  });
});
