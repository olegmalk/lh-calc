import { test, expect } from '@playwright/test';

test('Translations should work properly', async ({ page }) => {
  await page.goto('http://localhost:10000/technical-parts');
  await page.waitForLoadState('networkidle');
  
  // Wait for React and i18n to initialize
  await page.waitForTimeout(2000);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'translations-test.png', fullPage: true });
  
  // Get the page content
  const bodyText = await page.textContent('body');
  
  // Check for translation keys that shouldn't be visible
  const hasTranslationKeys = bodyText.includes('form.titleWithNote') || 
                             bodyText.includes('form.fields.') ||
                             bodyText.includes('form.sections.');
  
  if (hasTranslationKeys) {
    console.log('Found untranslated keys in page:');
    const keys = bodyText.match(/form\.\w+\.\w+/g) || [];
    console.log(keys.slice(0, 10));
  }
  
  // Check for expected translated text
  expect(bodyText).toContain('Technical Specifications');
  expect(bodyText).not.toContain('form.titleWithNote');
  expect(bodyText).not.toContain('form.fields.positionNumber');
});