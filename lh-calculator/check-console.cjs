const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2] || 'http://localhost:10000';
  console.log(`Checking ${url} for console errors...`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const errors = [];
    const warnings = [];
    const logs = [];
    
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push(text);
        console.error('❌ Console Error:', text);
      } else if (type === 'warning') {
        warnings.push(text);
        console.warn('⚠️ Console Warning:', text);
      } else if (process.env.VERBOSE) {
        logs.push(text);
        console.log('📝 Console Log:', text);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.toString());
      console.error('💥 Page Error:', error.toString());
    });
    
    page.on('requestfailed', request => {
      const failure = `${request.failure().errorText} ${request.url()}`;
      errors.push(failure);
      console.error('🚫 Request Failed:', failure);
    });
    
    console.log('\n📊 Loading page...');
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log(`✅ Page loaded with status: ${response.status()}`);
    
    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);
    
    // Get page content
    const title = await page.title();
    const bodyText = await page.$eval('body', el => el.innerText || el.textContent || '');
    
    console.log(`\n📄 Page Title: ${title}`);
    console.log(`📝 Body Text (first 500 chars): ${bodyText.substring(0, 500)}`);
    
    // Check for React error boundary
    const hasErrorBoundary = await page.$('.error-boundary-fallback');
    if (hasErrorBoundary) {
      const errorText = await page.$eval('.error-boundary-fallback', el => el.textContent);
      console.error('🚨 React Error Boundary Triggered:', errorText);
      errors.push('Error Boundary: ' + errorText);
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`  Errors: ${errors.length}`);
    console.log(`  Warnings: ${warnings.length}`);
    console.log(`  Logs: ${logs.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors found:');
      errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
      process.exit(1);
    } else {
      console.log('\n✅ No console errors detected!');
    }
    
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();