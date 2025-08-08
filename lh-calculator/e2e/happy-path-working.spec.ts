import { test, expect } from '@playwright/test';

test.describe('LH Calculator Happy Path', () => {
  test('should complete basic workflow with supply parameters and verify test pressure calculations', async ({ page }) => {
    // 1. Navigate to application
    await page.goto('http://localhost:10000');
    
    // 2. Wait for app to load and check title
    await expect(page).toHaveTitle(/LH Calculator/);
    
    // 3. Verify we're on dashboard
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });
    
    // 4. Stay on dashboard (form is there now)
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });
    
    // 5. First fill required fields for calculation
    // Equipment type
    await page.locator('[data-testid="equipment-type-select"]').selectOption('К4-150');
    
    // Model code - use the actual placeholder text
    await page.locator('input[placeholder*="750"]').fill('TEST-001');
    
    // Plate configuration
    await page.locator('[data-testid="plate-config-select"]').selectOption('1/2');
    
    // Plate count
    await page.locator('input[placeholder="400"]').fill('50');
    
    // 6. Set pressure values to trigger test pressure calculations
    // Find pressure fields by placeholder or label
    const pressureInputs = page.locator('input[type="number"][min="0"][max="400"]');
    await pressureInputs.nth(0).fill('22'); // Pressure A
    await pressureInputs.nth(1).fill('22'); // Pressure B
    
    // 7. Set temperatures to trigger test pressure calculations 
    const tempInputs = page.locator('input[type="number"][min="-40"][max="200"]');
    await tempInputs.nth(0).fill('100'); // Temperature A
    await tempInputs.nth(1).fill('60');  // Temperature B
    
    // 8. Select materials (required fields)
    await page.locator('[data-testid="plate-material-select"]').selectOption('AISI 316L');
    await page.locator('[data-testid="body-material-select"]').selectOption('09Г2С');
    await page.locator('[data-testid="surface-type-select"]').selectOption('гофра');
    
    // 9. Fill other required fields
    // Plate thickness
    await page.locator('input[placeholder="3"]').fill('0.6');
    
    // 10. Navigate to Supply page
    await page.getByText('Supply').click();
    await page.waitForURL('**/supply', { timeout: 10000 });
    
    // 11. Wait for supply form to load
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });
    
    // 12. Get first number input and change value
    const firstInput = page.locator('input[type="number"]').first();
    await firstInput.clear();
    await firstInput.fill('850');
    
    // 13. Click save button (using text that includes save)
    await page.getByRole('button', { name: /save/i }).first().click();
    
    // 14. Wait for any indication of success
    await page.waitForTimeout(1000); // Give it time to save
    
    // 15. Navigate back to dashboard
    await page.getByText('Dashboard').click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // 16. Click Calculate button
    await page.getByRole('button', { name: /Calculate|Рассчитать/i }).click();
    
    // 17. Verify we see calculation results
    await expect(page.locator('text=Total Cost')).toBeVisible({ timeout: 10000 });
    
    // 18. Check the total cost is reasonable (not in trillions)
    const costText = await page.locator('text=/\\d+\\s*₽/').first().textContent();
    console.log('Found cost:', costText);
    
    // Extract number from cost
    const costNumber = parseInt(costText?.replace(/[^\d]/g, '') || '0');
    expect(costNumber).toBeGreaterThan(10000); // At least 10K rubles
    expect(costNumber).toBeLessThan(10000000); // Less than 10M rubles
    
    console.log('✅ Workflow completed successfully with cost:', costText);
  });

  test('should persist supply parameters', async ({ page }) => {
    // 1. Go directly to supply page
    await page.goto('http://localhost:10000/supply');
    
    // 2. Wait for form to load
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });
    
    // 3. Set a specific value
    const firstInput = page.locator('input[type="number"]').first();
    await firstInput.clear();
    await firstInput.fill('1234');
    
    // 4. Save
    await page.getByRole('button', { name: /save/i }).first().click();
    
    // 5. Wait for save
    await page.waitForTimeout(1000);
    
    // 6. Reload page
    await page.reload();
    
    // 7. Wait for form to reload
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });
    
    // 8. Check value persisted
    const reloadedInput = page.locator('input[type="number"]').first();
    await expect(reloadedInput).toHaveValue('1234');
    
    console.log('✅ Supply parameters persist correctly!');
  });

  test('should verify test pressure field calculations and read-only status', async ({ page }) => {
    // 1. Go to dashboard
    await page.goto('http://localhost:10000/dashboard');
    
    // 2. Wait for form to load
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });
    
    // 3. Fill required fields first
    await page.locator('[data-testid="equipment-type-select"]').selectOption('К4-150');
    await page.locator('input[placeholder*="750"]').fill('TEST-002');
    await page.locator('[data-testid="plate-config-select"]').selectOption('1/2');
    await page.locator('input[placeholder="400"]').fill('50');
    
    // 4. Set pressure and temperature values
    const pressureInputs = page.locator('input[type="number"][min="0"][max="400"]');
    await pressureInputs.nth(0).fill('22'); // Pressure A
    await pressureInputs.nth(1).fill('22'); // Pressure B
    
    const tempInputs = page.locator('input[type="number"][min="-40"][max="200"]');
    await tempInputs.nth(0).fill('100'); // Temperature A
    await tempInputs.nth(1).fill('60');  // Temperature B
    
    // 5. Select materials
    await page.locator('[data-testid="plate-material-select"]').selectOption('AISI 316L');
    await page.locator('[data-testid="body-material-select"]').selectOption('09Г2С');
    await page.locator('[data-testid="surface-type-select"]').selectOption('гофра');
    
    // 6. Wait for calculations to trigger
    await page.waitForTimeout(1000);
    
    // 7. Check that test pressure fields exist and are read-only
    // The test pressure fields have specific styling
    const readOnlyInputs = await page.locator('input[readonly]').all();
    
    // Should have at least 2 readonly fields (test pressures)
    expect(readOnlyInputs.length).toBeGreaterThanOrEqual(2);
    
    // 8. Verify last 2 readonly fields have calculated values (test pressures)
    const firstTestPressure = await readOnlyInputs[readOnlyInputs.length - 2].inputValue();
    const secondTestPressure = await readOnlyInputs[readOnlyInputs.length - 1].inputValue();
    
    expect(parseFloat(firstTestPressure)).toBeGreaterThan(0);
    expect(parseFloat(secondTestPressure)).toBeGreaterThan(0);
    
    console.log('✅ Test pressure calculations working:', firstTestPressure, secondTestPressure);
  });
});