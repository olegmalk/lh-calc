#!/usr/bin/env ts-node

import { chromium } from 'playwright';
import type { Browser, Page, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';

interface RuntimeDetectionResult {
  untranslatedStrings: UntranslatedString[];
  missingKeys: string[];
  pageErrors: PageError[];
  coverage: Coverage;
}

interface UntranslatedString {
  text: string;
  selector: string;
  page: string;
  screenshot?: string;
  context?: string;
}

interface PageError {
  page: string;
  error: string;
  stack?: string;
}

interface Coverage {
  totalElements: number;
  translatedElements: number;
  untranslatedElements: number;
  coveragePercentage: number;
}

interface RuntimeDetectorConfig {
  baseUrl: string;
  pages: string[];
  locales: string[];
  outputDir: string;
  screenshots: boolean;
  waitTime: number;
  selectors: {
    exclude: string[];
    include: string[];
  };
}

class TranslationRuntimeDetector {
  private browser?: Browser;
  private context?: BrowserContext;
  private config: RuntimeDetectorConfig;

  constructor(config: Partial<RuntimeDetectorConfig> = {}) {
    this.config = {
      baseUrl: 'http://localhost:5173',
      pages: [
        '/',
        '/calculations',
        '/supply-parameters',
        '/saved-calculations',
        '/calculation'
      ],
      locales: ['en', 'ru'],
      outputDir: './translation-runtime-reports',
      screenshots: true,
      waitTime: 2000,
      selectors: {
        exclude: [
          'script',
          'style',
          'noscript',
          '[data-testid]',
          '.mantine-*[data-*]' // Mantine internal elements
        ],
        include: [
          'button',
          'label',
          'h1, h2, h3, h4, h5, h6',
          'p',
          'span:not([class*="icon"])',
          'div[role="alert"]',
          '[placeholder]',
          '[title]',
          '[aria-label]'
        ]
      },
      ...config
    };
  }

  /**
   * Initialize browser and context
   */
  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: 'en-US'
    });

    // Enable console logging
    this.context.on('page', page => {
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error(`Browser console error: ${msg.text()}`);
        }
      });
    });
  }

  /**
   * Detect untranslated strings across all pages and locales
   */
  async detect(): Promise<RuntimeDetectionResult> {
    if (!this.browser || !this.context) {
      await this.initialize();
    }

    const results: RuntimeDetectionResult = {
      untranslatedStrings: [],
      missingKeys: [],
      pageErrors: [],
      coverage: {
        totalElements: 0,
        translatedElements: 0,
        untranslatedElements: 0,
        coveragePercentage: 0
      }
    };

    console.log('🕷️ Starting runtime translation detection...');

    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    // Test each locale
    for (const locale of this.config.locales) {
      console.log(`\n🌐 Testing locale: ${locale}`);
      
      for (const pagePath of this.config.pages) {
        console.log(`  📄 Scanning page: ${pagePath}`);
        
        try {
          const pageResults = await this.detectOnPage(pagePath, locale);
          results.untranslatedStrings.push(...pageResults.untranslatedStrings);
          results.missingKeys.push(...pageResults.missingKeys);
          results.coverage.totalElements += pageResults.coverage.totalElements;
          results.coverage.untranslatedElements += pageResults.coverage.untranslatedElements;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          results.pageErrors.push({
            page: `${pagePath} (${locale})`,
            error: errorMsg,
            stack: error instanceof Error ? error.stack : undefined
          });
          console.error(`    ❌ Error on ${pagePath}: ${errorMsg}`);
        }
      }
    }

    // Calculate coverage
    results.coverage.translatedElements = results.coverage.totalElements - results.coverage.untranslatedElements;
    results.coverage.coveragePercentage = results.coverage.totalElements > 0 
      ? (results.coverage.translatedElements / results.coverage.totalElements) * 100 
      : 100;

    console.log('\n📊 Detection Summary:');
    console.log(`  - Pages tested: ${this.config.pages.length * this.config.locales.length}`);
    console.log(`  - Untranslated strings: ${results.untranslatedStrings.length}`);
    console.log(`  - Coverage: ${results.coverage.coveragePercentage.toFixed(1)}%`);

    return results;
  }

  /**
   * Detect untranslated strings on a specific page
   */
  private async detectOnPage(pagePath: string, locale: string): Promise<RuntimeDetectionResult> {
    const page = await this.context!.newPage();
    const url = `${this.config.baseUrl}${pagePath}`;
    
    const pageResults: RuntimeDetectionResult = {
      untranslatedStrings: [],
      missingKeys: [],
      pageErrors: [],
      coverage: { totalElements: 0, translatedElements: 0, untranslatedElements: 0, coveragePercentage: 0 }
    };

    try {
      // Set language (if your app supports URL-based locale switching)
      await page.goto(`${url}?lang=${locale}`, { waitUntil: 'networkidle' });
      
      // Wait for page to load completely
      await page.waitForTimeout(this.config.waitTime);

      // Switch language if there's a language selector
      await this.switchLanguage(page, locale);
      await page.waitForTimeout(1000); // Wait for language change

      // Detect untranslated strings
      const untranslatedElements = await this.findUntranslatedElements(page, locale);
      
      // Process each element
      for (const element of untranslatedElements) {
        const selector = await this.getElementSelector(page, element);
        const text = await element.textContent() || '';
        const context = await this.getElementContext(page, element);
        
        let screenshot: string | undefined;
        if (this.config.screenshots && text.trim()) {
          screenshot = await this.takeElementScreenshot(page, element, pagePath, locale);
        }

        pageResults.untranslatedStrings.push({
          text: text.trim(),
          selector,
          page: `${pagePath} (${locale})`,
          screenshot,
          context
        });
      }

      // Calculate coverage for this page
      const allTextElements = await page.$$eval(
        this.config.selectors.include.join(', '),
        (elements) => elements.filter(el => el.textContent?.trim()).length
      );
      
      pageResults.coverage.totalElements = allTextElements;
      pageResults.coverage.untranslatedElements = untranslatedElements.length;

    } catch (error) {
      throw new Error(`Failed to process page ${url}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await page.close();
    }

    return pageResults;
  }

  /**
   * Find elements that contain untranslated strings
   */
  private async findUntranslatedElements(page: Page, locale: string) {
    // Patterns that indicate untranslated content
    const untranslatedPatterns = [
      // Translation keys showing directly (common.save, form.title, etc.)
      /^[a-zA-Z]+\.[a-zA-Z.]+$/,
      // Missing translation placeholders
      /^\[\[missing:.+\]\]$/,
      // React-i18next missing keys
      /^[a-zA-Z_]+:[a-zA-Z._]+$/,
      // Hardcoded English in Russian locale
      locale === 'ru' ? /^[A-Za-z\s]+$/ : null,
      // Common debug/placeholder patterns
      /^(TODO|FIXME|PLACEHOLDER):/i
    ].filter(Boolean);

    return await page.$$eval(
      this.config.selectors.include.join(', '),
      (elements, patterns) => {
        return elements.filter(element => {
          const text = element.textContent?.trim();
          if (!text || text.length < 2) return false;
          
          // Skip if element is hidden
          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          
          // Check against patterns
          return patterns.some(patternStr => {
            const pattern = new RegExp(patternStr);
            return pattern.test(text);
          });
        });
      },
      untranslatedPatterns.map(p => p!.source)
    );
  }

  /**
   * Switch language using the language selector
   */
  private async switchLanguage(page: Page, locale: string): Promise<void> {
    try {
      // Look for common language selector patterns
      const languageSelectors = [
        `[data-testid="language-${locale}"]`,
        `[data-language="${locale}"]`,
        `button[aria-label*="${locale.toUpperCase()}"]`,
        `select option[value="${locale}"]`,
        `.language-${locale}`,
        `[href*="lang=${locale}"]`
      ];

      for (const selector of languageSelectors) {
        const element = await page.$(selector);
        if (element) {
          await element.click();
          console.log(`    🌐 Switched to ${locale} using ${selector}`);
          return;
        }
      }

      // Try to find and use a general language selector
      const langButton = await page.$('button:has-text("EN"), button:has-text("RU"), [aria-label*="language"]');
      if (langButton) {
        await langButton.click();
        await page.waitForTimeout(500);
        
        // Look for the specific locale option
        const localeOption = await page.$(`text="${locale.toUpperCase()}"`);
        if (localeOption) {
          await localeOption.click();
          console.log(`    🌐 Switched to ${locale} via dropdown`);
          return;
        }
      }

      console.log(`    ⚠️  No language selector found for ${locale}`);
    } catch (error) {
      console.log(`    ⚠️  Failed to switch language: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a unique selector for an element
   */
  private async getElementSelector(page: Page, element: unknown): Promise<string> {
    return await page.evaluate((el) => {
      // Generate a unique selector
      if (el.id) return `#${el.id}`;
      
      let selector = el.tagName.toLowerCase();
      
      if (el.className) {
        const classes = el.className.split(' ').filter(c => c && !c.startsWith('mantine-'));
        if (classes.length > 0) {
          selector += `.${classes[0]}`;
        }
      }
      
      // Add position if needed
      const siblings = Array.from(el.parentElement?.children || []).filter(s => s.tagName === el.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(el) + 1;
        selector += `:nth-of-type(${index})`;
      }
      
      return selector;
    }, element);
  }

  /**
   * Get context information for an element
   */
  private async getElementContext(page: Page, element: unknown): Promise<string> {
    return await page.evaluate((el) => {
      // Find the nearest parent with meaningful context
      let parent = el.parentElement;
      while (parent) {
        if (parent.getAttribute('data-testid') || 
            parent.className.includes('form') || 
            parent.className.includes('section') ||
            parent.tagName.toLowerCase() === 'form') {
          return parent.tagName.toLowerCase() + (parent.className ? `.${parent.className.split(' ')[0]}` : '');
        }
        parent = parent.parentElement;
      }
      return 'unknown';
    }, element);
  }

  /**
   * Take a screenshot of an element
   */
  private async takeElementScreenshot(_page: Page, _element: unknown, _pagePath: string, _locale: string): Promise<string> {
    try {
      const filename = `untranslated-${pagePath.replace(/[^a-zA-Z0-9]/g, '-')}-${locale}-${Date.now()}.png`;
      const filepath = path.join(this.config.outputDir, filename);
      
      await element.screenshot({ path: filepath });
      return filename;
    } catch (error) {
      console.warn(`Failed to take screenshot: ${error instanceof Error ? error.message : String(error)}`);
      return '';
    }
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(results: RuntimeDetectionResult): string {
    const timestamp = new Date().toISOString();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Translation Runtime Detection Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
        .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .issue { background: white; border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .issue.error { border-left: 5px solid #e74c3c; }
        .issue.warning { border-left: 5px solid #f39c12; }
        .screenshot { max-width: 300px; border: 1px solid #ddd; margin: 10px 0; }
        .code { background: #f8f8f8; padding: 10px; font-family: monospace; border-radius: 3px; }
        .stats { display: flex; gap: 20px; }
        .stat { text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .stat-label { color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🕷️ Translation Runtime Detection Report</h1>
        <p>Generated: ${timestamp}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <div class="stats">
            <div class="stat">
                <div class="stat-value">${results.coverage.coveragePercentage.toFixed(1)}%</div>
                <div class="stat-label">Coverage</div>
            </div>
            <div class="stat">
                <div class="stat-value">${results.untranslatedStrings.length}</div>
                <div class="stat-label">Issues Found</div>
            </div>
            <div class="stat">
                <div class="stat-value">${results.coverage.totalElements}</div>
                <div class="stat-label">Elements Checked</div>
            </div>
            <div class="stat">
                <div class="stat-value">${results.pageErrors.length}</div>
                <div class="stat-label">Page Errors</div>
            </div>
        </div>
    </div>

    ${results.pageErrors.length > 0 ? `
    <div class="section">
        <h2>❌ Page Errors</h2>
        ${results.pageErrors.map(error => `
            <div class="issue error">
                <h3>${error.page}</h3>
                <p><strong>Error:</strong> ${error.error}</p>
                ${error.stack ? `<div class="code">${error.stack}</div>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${results.untranslatedStrings.length > 0 ? `
    <div class="section">
        <h2>🔍 Untranslated Strings</h2>
        ${results.untranslatedStrings.map((item, index) => `
            <div class="issue warning">
                <h3>Issue #${index + 1}: "${item.text}"</h3>
                <p><strong>Page:</strong> ${item.page}</p>
                <p><strong>Selector:</strong> <code>${item.selector}</code></p>
                <p><strong>Context:</strong> ${item.context}</p>
                ${item.screenshot ? `
                    <p><strong>Screenshot:</strong></p>
                    <img src="${item.screenshot}" alt="Screenshot" class="screenshot">
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : `
    <div class="issue">
        <h2>✅ No Translation Issues Found!</h2>
        <p>All text elements appear to be properly translated.</p>
    </div>
    `}

    <div class="footer" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d;">
        <p>Report generated by Translation Runtime Detector</p>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Clean up browser resources
   */
  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export { TranslationRuntimeDetector, type RuntimeDetectionResult, type RuntimeDetectorConfig };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const detector = new TranslationRuntimeDetector();
  
  async function main() {
    try {
      console.log('🚀 Starting runtime translation detection...');
      
      const results = await detector.detect();
      
      // Generate reports
      const htmlReport = detector.generateHTMLReport(results);
      const reportPath = path.join(detector['config'].outputDir, 'runtime-detection-report.html');
      fs.writeFileSync(reportPath, htmlReport);
      
      const jsonPath = path.join(detector['config'].outputDir, 'runtime-detection-results.json');
      fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
      
      console.log('\n📄 Reports generated:');
      console.log(`  - HTML: ${reportPath}`);
      console.log(`  - JSON: ${jsonPath}`);
      
      if (results.untranslatedStrings.length > 0) {
        console.log(`\n❌ Found ${results.untranslatedStrings.length} translation issues`);
        process.exit(1);
      } else {
        console.log('\n✅ No translation issues found!');
        process.exit(0);
      }
      
    } catch (error) {
      console.error('❌ Runtime detection failed:', error);
      process.exit(1);
    } finally {
      await detector.cleanup();
    }
  }
  
  main();
}