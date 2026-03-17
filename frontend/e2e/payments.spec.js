import { test, expect } from '@playwright/test';

test.describe('Payment and Order Confirmation', () => {
  let orderId;

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');
  });

  test('should add fractional payments and track remaining amount', async ({ page }) => {
    // Navigate to orders
    await page.click('text=Commandes');
    
    // Create new order
    await page.click('text=Nouvelle commande');
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '1');
    await page.click('button:has-text("Ajouter")');
    
    // Get total TTC
    const ttcText = await page.locator('.summary-line.total .amount').textContent();
    const totalTTC = parseFloat(ttcText.replace(/[^\d.]/g, ''));
    
    // Submit order
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/orders\/\d+$/);

    // Add first payment (50% of total)
    await page.click('button:has-text("Ajouter un paiement")');
    await page.selectOption('select', 'VIREMENT');
    const firstPayment = (totalTTC / 2).toFixed(2);
    await page.fill('input[type="number"]', firstPayment);
    await page.fill('input[placeholder*="transaction"]', 'VIR-001');
    await page.fill('input[placeholder*="Banque"]', 'Test Bank');
    await page.click('button[type="submit"]:has-text("Ajouter")');

    // Verify remaining amount updated
    await expect(page.locator('.summary-line.remaining .amount')).not.toContainText('0.00');

    // Add second payment (remaining 50%)
    await page.click('button:has-text("Ajouter un paiement")');
    await page.selectOption('select', 'VIREMENT');
    await page.fill('input[type="number"]', firstPayment);
    await page.fill('input[placeholder*="transaction"]', 'VIR-002');
    await page.fill('input[placeholder*="Banque"]', 'Test Bank');
    await page.click('button[type="submit"]:has-text("Ajouter")');

    // Verify remaining amount is zero
    await expect(page.locator('.summary-line.remaining .amount')).toContainText('0.00');
  });

  test('should enforce ESPECES limit of 20,000 DH', async ({ page }) => {
    await page.click('text=Commandes');
    
    // Find any pending order
    const viewButton = page.locator('table tbody tr .btn-view').first();
    await viewButton.click();
    await page.waitForURL(/\/orders\/\d+$/);

    // Try to add cash payment over 20,000
    await page.click('button:has-text("Ajouter un paiement")');
    await page.selectOption('select', 'ESPECES');
    await page.fill('input[type="number"]', '25000');
    await page.click('button[type="submit"]:has-text("Ajouter")');

    // Verify error message
    await expect(page.locator('text=/limité à 20,000/i')).toBeVisible();
  });

  test('should require complete payment before confirmation', async ({ page }) => {
    await page.click('text=Commandes');
    
    // Create order
    await page.click('text=Nouvelle commande');
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '1');
    await page.click('button:has-text("Ajouter")');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/orders\/\d+$/);

    // Try to confirm without payment
    const confirmButton = page.locator('button:has-text("Confirmer la commande")');
    await expect(confirmButton).toBeDisabled();
  });

  test('should enable confirm button when fully paid', async ({ page }) => {
    await page.click('text=Commandes');
    
    // Create small order
    await page.click('text=Nouvelle commande');
    await page.selectOption('select:has-option:text("Choisir un client")', { index: 1 });
    await page.selectOption('select:has-option:text("Sélectionner un produit")', { index: 1 });
    await page.fill('input.quantity-input', '1');
    await page.click('button:has-text("Ajouter")');
    
    // Get total
    const ttcText = await page.locator('.summary-line.total .amount').textContent();
    const totalTTC = parseFloat(ttcText.replace(/[^\d.]/g, ''));
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/orders\/\d+$/);

    // Add full payment
    await page.click('button:has-text("Ajouter un paiement")');
    await page.selectOption('select', 'VIREMENT');
    await page.fill('input[type="number"]', totalTTC.toFixed(2));
    await page.fill('input[placeholder*="transaction"]', 'FULL-PAY');
    await page.fill('input[placeholder*="Banque"]', 'Test Bank');
    await page.click('button[type="submit"]:has-text("Ajouter")');

    // Confirm button should be enabled
    const confirmButton = page.locator('button:has-text("Confirmer la commande")');
    await expect(confirmButton).toBeEnabled();

    // Confirm order
    await confirmButton.click();

    // Verify status changed
    await expect(page.locator('.status-confirmed')).toBeVisible();
  });

  test('should display CHEQUE-specific fields', async ({ page }) => {
    await page.click('text=Commandes');
    const viewButton = page.locator('table tbody tr .btn-view').first();
    await viewButton.click();
    await page.waitForURL(/\/orders\/\d+$/);

    await page.click('button:has-text("Ajouter un paiement")');
    await page.selectOption('select', 'CHEQUE');

    // Verify CHEQUE fields appear
    await expect(page.locator('input[placeholder*="transaction"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Banque"]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible(); // Date d'échéance
  });
});
