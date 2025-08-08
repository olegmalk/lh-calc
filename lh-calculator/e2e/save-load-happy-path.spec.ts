import { test, expect } from '@playwright/test';

test.describe('Save and Load Calculations Happy Path', () => {
  test('should calculate, save, and load a calculation', async ({ page }) => {
    // 1. Navigate to dashboard
    await page.goto('http://localhost:10000/dashboard');
    
    // 2. Fill in the form with valid data
    await page.selectOption('select[data-testid="equipment-type-select"]', 'К4-750');
    await page.selectOption('select[data-testid="plate-config-select"]', '1/6');
    
    // Fill in required number inputs
    await page.fill('input[placeholder="400"]', '300'); // Plate count
    
    // Fill pressures - find all inputs with max="400" attribute
    const pressureInputs = await page.locator('input[type="number"][max="400"]').all();
    if (pressureInputs.length >= 2) {
      await pressureInputs[0].fill('25'); // Pressure A
      await pressureInputs[1].fill('25'); // Pressure B
    }
    
    // Fill temperatures - find inputs with max="200" attribute
    const tempInputs = await page.locator('input[type="number"][max="200"]').all();
    if (tempInputs.length >= 2) {
      await tempInputs[0].fill('90'); // Temperature A
      await tempInputs[1].fill('60'); // Temperature B
    }
    
    // Select materials
    await page.selectOption('select[data-testid="plate-material-select"]', 'AISI 316L');
    await page.selectOption('select[data-testid="body-material-select"]', '09Г2С');
    await page.selectOption('select[data-testid="surface-type-select"]', 'гофра');
    
    // Fill additional required fields
    await page.fill('input[placeholder="3"]', '1'); // Plate thickness
    
    // 3. Click Calculate button
    const calculateButton = page.locator('button:has-text("Рассчитать"), button:has-text("Calculate")');
    await calculateButton.click();
    
    // 4. Wait for results to appear
    await page.waitForSelector('text=/Результаты расчета|Calculation Results/', { timeout: 10000 });
    
    // 5. Verify save button appears
    const saveButton = page.locator('button:has-text("Сохранить"), button:has-text("Save")').first();
    await expect(saveButton).toBeVisible();
    
    // 6. Click save button
    await saveButton.click();
    
    // 7. Fill in save modal
    // Wait a moment for modal to render
    await page.waitForTimeout(1000);
    
    // Clear the default name and enter our test name
    const nameInput = page.locator('input[placeholder*="Calculation"]').first();
    await nameInput.clear();
    await nameInput.fill('Test Calculation 123');
    
    // Project select is optional - skip if not needed
    
    // 8. Confirm save
    const confirmSaveButton = page.locator('button:has-text("Save")').last();
    await confirmSaveButton.click();
    
    // Wait for modal to close
    await page.waitForTimeout(1000);
    
    // 9. Navigate to saved calculations
    await page.goto('http://localhost:10000/saved-calculations');
    
    // 10. Verify saved calculation appears
    await page.waitForSelector('text="Test Calculation 123"', { timeout: 5000 });
    
    // 11. Click on the saved calculation to load it
    const loadButton = page.locator('button:has-text("Загрузить"), button:has-text("Load")').first();
    
    // Handle confirmation dialog before clicking
    page.once('dialog', dialog => {
      console.log('Dialog message:', dialog.message());
      dialog.accept();
    });
    
    await loadButton.click();
    
    // 13. Verify we're back on dashboard with loaded data
    await page.waitForURL('**/dashboard');
    
    // Verify calculation results are visible
    await expect(page.locator('text=/Результаты расчета|Calculation Results/')).toBeVisible();
  });

  test('should display empty state when no calculations saved', async ({ page }) => {
    // Clear localStorage first
    await page.goto('http://localhost:10000');
    await page.evaluate(() => {
      localStorage.removeItem('lh-calculations');
      localStorage.removeItem('lh-projects');
    });
    
    // Navigate to saved calculations
    await page.goto('http://localhost:10000/saved-calculations');
    
    // Should show empty state message
    await expect(page.locator('text=/Нет сохраненных расчетов|No saved calculations/')).toBeVisible();
  });
});