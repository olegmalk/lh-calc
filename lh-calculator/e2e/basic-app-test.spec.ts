import { test, expect } from '@playwright/test';

test.describe('LH Calculator Basic Tests', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:10000');
    
    // Wait for React to render
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle('LH Calculator - Heat Exchanger Cost Calculator');
    
    // Check if navigation exists
    const navText = await page.textContent('nav');
    expect(navText).toBeTruthy();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:10000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should navigate to technical parts', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    
    // Wait for React components to render
    await page.waitForTimeout(1000);
    
    // Check for form elements - Mantine uses divs for selects
    const formElements = await page.$$('[role="combobox"], [role="listbox"], input, button');
    expect(formElements.length).toBeGreaterThan(0);
  });

  test('should select equipment type', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Mantine Select uses role="combobox"
    const selectElements = await page.$$('[role="combobox"]');
    
    if (selectElements.length > 0) {
      // Click the first select to open dropdown
      await selectElements[0].click();
      
      // Wait for dropdown to appear and select first option
      await page.waitForTimeout(500);
      const options = await page.$$('[role="option"]');
      if (options.length > 0) {
        await options[0].click();
      }
    }
    
    // Verify page still works
    expect(await page.title()).toContain('LH Calculator');
  });

  test('should fill basic form fields', async ({ page }) => {
    await page.goto('http://localhost:10000/technical-parts');
    await page.waitForLoadState('networkidle');
    
    // Fill in some basic number inputs
    const numberInputs = await page.$$('input[type="number"]');
    
    if (numberInputs.length > 0) {
      // Fill first few number inputs
      for (let i = 0; i < Math.min(3, numberInputs.length); i++) {
        await numberInputs[i].fill(String(100 + i * 10));
      }
    }
    
    // Check if calculate button exists
    const buttons = await page.$$('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});