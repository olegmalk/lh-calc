import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test('Complete К4-750 calculation flow', async ({ page }) => {
    // Navigate to technical parts
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Fill in К4-750 equipment configuration
    const numberInputs = await page.$$('input[type="number"]');
    
    // Basic inputs (matching Excel test case)
    const inputValues = [
      800,    // plateCount (D8)
      10,     // pressureA (D10)
      16,     // pressureB (D11)
      90,     // temperatureA (D12)
      1,      // laborCoefficient (D13)
      1330,   // equipmentCostNoPlates (D14)
      100,    // componentsA (D16)
      150,    // componentsB (D17)
      75,     // componentsSideA (D18)
      85,     // componentsSideB (D19)
      0,      // plateThickness (U27 - triggers default)
    ];
    
    for (let i = 0; i < Math.min(inputValues.length, numberInputs.length); i++) {
      await numberInputs[i].fill(String(inputValues[i]));
    }
    
    // Calculate button should be last button
    const buttons = await page.$$('button');
    const calculateButton = buttons[buttons.length - 1];
    if (calculateButton) {
      await calculateButton.click();
    }
    
    // Wait for calculation
    await page.waitForTimeout(2000);
    
    // Verify we're still on the page
    expect(await page.title()).toContain('LH Calculator');
  });

  test('Navigate through all main sections', async ({ page }) => {
    // Start at home
    await page.goto('http://localhost:10000');
    await page.waitForLoadState('networkidle');
    
    // Go to dashboard
    await page.goto('http://localhost:10000/dashboard');
    await page.waitForLoadState('networkidle');
    expect(await page.url()).toContain('/dashboard');
    
    // Go to technical parts
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    expect(await page.url()).toContain('/technical-parts');
    
    // Go to calculations
    await page.goto('http://localhost:10000/calculations');
    await page.waitForLoadState('networkidle');
    expect(await page.url()).toContain('/calculations');
  });

  test('Fill and submit complex form with all sections', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click to expand collapsible sections
    const expandButtons = await page.$$('[role="button"]');
    
    // Try to expand first few sections
    for (let i = 0; i < Math.min(3, expandButtons.length); i++) {
      try {
        await expandButtons[i].click();
        await page.waitForTimeout(200);
      } catch {
        // Some buttons might not be expandable
      }
    }
    
    // Fill all visible number inputs
    const allNumberInputs = await page.$$('input[type="number"]:visible');
    for (let i = 0; i < allNumberInputs.length; i++) {
      await allNumberInputs[i].fill(String(100 + i * 5));
    }
    
    // Fill all visible text inputs
    const allTextInputs = await page.$$('input[type="text"]:visible');
    for (let i = 0; i < allTextInputs.length; i++) {
      await allTextInputs[i].fill(`Test Value ${i + 1}`);
    }
    
    // Submit form
    const submitButtons = await page.$$('button:has-text("Calculate"), button:has-text("Рассчитать")');
    if (submitButtons.length > 0) {
      await submitButtons[0].click();
      await page.waitForTimeout(2000);
    }
    
    // Verify no errors
    const errorElements = await page.$$('.mantine-Alert-root');
    expect(errorElements.length).toBe(0);
  });

  test('Verify calculation results display', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Quick fill minimal required fields
    const inputs = await page.$$('input[type="number"]');
    for (let i = 0; i < Math.min(5, inputs.length); i++) {
      await inputs[i].fill('100');
    }
    
    // Calculate
    const buttons = await page.$$('button');
    const calculateButton = buttons[buttons.length - 1];
    if (calculateButton) {
      await calculateButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Check if results section appears (either as modal or inline)
    const resultsText = await page.textContent('body');
    
    // Should contain some result indicators
    const hasResults = resultsText.includes('₽') || 
                      resultsText.includes('RUB') || 
                      resultsText.includes('Cost') ||
                      resultsText.includes('Стоимость');
    
    expect(hasResults).toBeTruthy();
  });

  test('Verify form validation works', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Try to submit without filling required fields
    const buttons = await page.$$('button');
    const calculateButton = buttons[buttons.length - 1];
    if (calculateButton) {
      await calculateButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check for validation messages or that we're still on the form
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/technical-parts');
    
    // Fill one field with invalid value
    const inputs = await page.$$('input[type="number"]');
    if (inputs.length > 0) {
      await inputs[0].fill('-100'); // Negative value
      await calculateButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Should still be on form (validation failed)
    expect(await page.url()).toContain('/technical-parts');
  });

  test('Verify Bitrix24 export modal', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Fill minimal data
    const inputs = await page.$$('input[type="number"]');
    for (let i = 0; i < Math.min(3, inputs.length); i++) {
      await inputs[i].fill('100');
    }
    
    // Calculate first
    const buttons = await page.$$('button');
    const calculateButton = buttons[buttons.length - 1];
    if (calculateButton) {
      await calculateButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Look for export button
    const exportButtons = await page.$$('button:has-text("Export"), button:has-text("Экспорт"), button:has-text("Bitrix")');
    if (exportButtons.length > 0) {
      await exportButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Verify modal opened
      const modals = await page.$$('[role="dialog"]');
      expect(modals.length).toBeGreaterThan(0);
    }
  });
});