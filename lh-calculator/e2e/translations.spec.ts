import { test, expect } from '@playwright/test';

test.describe('Translations', () => {
  test('should load translations correctly on Supply page', async ({ page }) => {
    await page.goto('/supply');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we don't see translation keys
    const bodyText = await page.textContent('body');
    
    // These are the keys user reported as broken
    expect(bodyText).not.toContain('form.titleWithNote');
    expect(bodyText).not.toContain('FORM.UNSAVEDCHANGES');
    expect(bodyText).not.toContain('form.sections.identification');
    expect(bodyText).not.toContain('form.fields.positionNumber');
    expect(bodyText).not.toContain('form.fields.customerOrderNumber');
    expect(bodyText).not.toContain('form.fields.deliveryType');
    expect(bodyText).not.toContain('form.sections.equipmentConfig');
    expect(bodyText).not.toContain('form.fields.equipmentTypeWithNote');
    
    // Check that actual translations are present
    expect(bodyText).toContain('Equipment Type');
    expect(bodyText).toContain('Position Number');
  });
});