import { test, expect } from '@playwright/test';

test.describe('Client CRUD and History', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/products');
    
    // Navigate to clients
    await page.click('text=Clients');
    await page.waitForURL('/clients');
  });

  test('should create a new client', async ({ page }) => {
    await page.click('text=Nouveau client');
    await page.waitForURL('/clients/new');

    // Fill form
    await page.fill('input[name="nom"]', 'E2E Test Client');
    await page.fill('input[name="email"]', 'e2e-client@test.com');
    await page.fill('input[name="telephone"]', '0612345678');
    await page.fill('input[name="adresse"]', '123 Test Street');
    await page.selectOption('select[name="niveauFidelite"]', 'SILVER');

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForURL('/clients');

    // Verify client appears
    await expect(page.locator('text=E2E Test Client')).toBeVisible();
  });

  test('should view client details with stats', async ({ page }) => {
    // Click on first client
    await page.click('table tbody tr:first-child .btn-view');
    await page.waitForURL(/\/clients\/\d+$/);

    // Verify client info is displayed
    await expect(page.locator('h2')).toContainText('Détails du client');
    
    // Verify stats cards are present
    await expect(page.locator('text=Total des commandes')).toBeVisible();
    await expect(page.locator('text=Montant total dépensé')).toBeVisible();

    // Verify order history section
    await expect(page.locator('text=Historique des commandes')).toBeVisible();
  });

  test('should update a client', async ({ page }) => {
    // Click edit on first client
    await page.click('table tbody tr:first-child .btn-edit');
    await page.waitForURL(/\/clients\/\d+\/edit/);

    // Update fields
    await page.fill('input[name="nom"]', 'Updated Client Name');
    await page.selectOption('select[name="niveauFidelite"]', 'GOLD');

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForURL('/clients');

    // Verify update
    await expect(page.locator('text=Updated Client Name')).toBeVisible();
    await expect(page.locator('.badge-gold')).toBeVisible();
  });

  test('should display loyalty badge correctly', async ({ page }) => {
    // Verify loyalty badges are visible
    const badges = page.locator('.badge');
    await expect(badges.first()).toBeVisible();
    
    // Check badge classes
    const badgeClasses = ['badge-basic', 'badge-silver', 'badge-gold', 'badge-platinum'];
    for (const badgeClass of badgeClasses) {
      const count = await page.locator(`.${badgeClass}`).count();
      // At least one of each type might exist
      console.log(`Found ${count} badges with class ${badgeClass}`);
    }
  });
});
