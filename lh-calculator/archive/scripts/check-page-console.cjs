#!/usr/bin/env node
/**
 * Universal Page Console Error Checker
 * Usage: node check-page-console.cjs [URL]
 * Default URL: http://localhost:10000/
 */

const { chromium } = require('playwright');

const url = process.argv[2] || 'http://localhost:10000/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  const logs = [];
  
  // Listen for console messages
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    if (type === 'error') {
      console.error('❌ Console error:', text);
      errors.push(text);
    } else if (type === 'warning') {
      console.warn('⚠️  Console warning:', text);
      warnings.push(text);
    } else if (type === 'log' && process.env.VERBOSE) {
      console.log('📝 Console log:', text);
      logs.push(text);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.error('💥 Page error:', error.message);
    errors.push(`Page error: ${error.message}`);
  });
  
  // Listen for request failures
  page.on('requestfailed', request => {
    console.error('🔴 Request failed:', request.url());
    errors.push(`Request failed: ${request.url()}`);
  });
  
  try {
    console.log(`\n🔍 Checking page: ${url}\n`);
    console.log('─'.repeat(50));
    
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log(`✅ Page loaded with status: ${response.status()}`);
    
    // Wait for React/Vue/Angular to render
    await page.waitForTimeout(2000);
    
    // Try to get page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);
    
    // Check for common elements
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => null);
    const h2 = await page.$eval('h2', el => el.textContent).catch(() => null);
    const h3 = await page.$eval('h3', el => el.textContent).catch(() => null);
    
    if (h1) console.log(`📌 H1: "${h1}"`);
    if (h2) console.log(`📌 H2: "${h2}"`);
    if (h3) console.log(`📌 H3: "${h3}"`);
    
    // Check for body content
    const bodyText = await page.$eval('body', el => el.innerText).catch(() => '');
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;
    console.log(`📊 Page has ${wordCount} words of content`);
    
    // Check for forms
    const forms = await page.$$('form');
    console.log(`📋 Found ${forms.length} form(s)`);
    
    // Check for buttons
    const buttons = await page.$$('button');
    console.log(`🔘 Found ${buttons.length} button(s)`);
    
    // Check for inputs
    const inputs = await page.$$('input, textarea, select');
    console.log(`📝 Found ${inputs.length} input field(s)`);
    
    // Take screenshot
    const screenshotPath = `page-check-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    
    console.log('─'.repeat(50));
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    if (process.env.VERBOSE) {
      console.log(`   Logs: ${logs.length}`);
    }
    
    if (errors.length === 0) {
      console.log('\n✅ No console errors detected!');
    } else {
      console.log('\n❌ Console errors found:');
      errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    }
    
    process.exit(errors.length > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Failed to load page:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();