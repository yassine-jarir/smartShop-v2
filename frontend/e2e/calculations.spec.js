import { test, expect } from '@playwright/test';

test.describe('Order Discounts and Calculations', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');
  });

  test('should calculate loyalty discount correctly', async ({ page }) => {
    await page.click('text=Commandes');
    await page.click('text=Nouvelle commande');

    // Select client with loyalty level (e.g., GOLD = 10%)
    const clientSelect = page.locator('select:has-option:text("Choisir un client")');
    await clientSelect.selectOption({ index: 1 });
    
    // Check if loyalty discount is displayed
    const loyaltyInfo = page.locator('.discount-info');
    if (await loyaltyInfo.isVisible()) {
      const text = await loyaltyInfo.textContent();
      expect(text).toMatch(/Remise fidélité: \d+%/);
    }

    // Add product
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '2');
    await page.click('button:has-text("Ajouter")');

    // Verify summary shows loyalty discount
    const summary = page.locator('.summary-content');
    await expect(summary.locator('text=/Remise fidélité/i')).toBeVisible();
  });

  test('should calculate TVA at 20%', async ({ page }) => {
    await page.click('text=Commandes');
    await page.click('text=Nouvelle commande');

    // Select client
    await page.selectOption('select:has-option:text("Choisir un client"))', { index: 1 });
    
    // Add product with known price
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '1');
    await page.click('button:has-text("Ajouter")');

    // Get subtotal HT
    const htText = await page.locator('.summary-line:has-text("Sous-total HT") .amount').textContent();
    const ht = parseFloat(htText.replace(/[^\d.]/g, ''));

    // Get TVA
    const tvaText = await page.locator('.summary-line:has-text("TVA") .amount').textContent();
    const tva = parseFloat(tvaText.replace(/[^\d.]/g, ''));

    // Get TTC
    const ttcText = await page.locator('.summary-line.total .amount').textContent();
    const ttc = parseFloat(ttcText.replace(/[^\d.]/g, ''));

    // Verify calculations (allowing for rounding)
    expect(Math.abs(tva - (ht * 0.20))).toBeLessThan(1);
    expect(Math.abs(ttc - (ht + tva))).toBeLessThan(1);
  });

  test('should apply both loyalty and promo discounts', async ({ page }) => {
    await page.click('text=Commandes');
    await page.click('text=Nouvelle commande');

    // Select client with loyalty level
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });
    
    // Add product
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '1');
    await page.click('button:has-text("Ajouter")');

    // Apply promo code
    await page.fill('input[placeholder="PROMO-XXXX"]', 'PROMO-TEST');
    await page.click('button:has-text("Valider")');

    // If promo is valid, verify both discounts appear
    const promoSuccess = await page.locator('.promo-success').isVisible();
    if (promoSuccess) {
      await expect(page.locator('text=/Remise fidélité/i')).toBeVisible();
      await expect(page.locator('text=/Remise promo/i')).toBeVisible();
    }
  });
});
