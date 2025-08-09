#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface TranslationKey {
  key: string;
  file: string;
  line: number;
  column: number;
  context?: string;
}

interface TranslationAnalysis {
  usedKeys: TranslationKey[];
  missingKeys: string[];
  unusedKeys: string[];
  duplicateKeys: string[];
  availableKeys: Set<string>;
}

class TranslationAnalyzer {
  private sourceDir: string;
  private localesDir: string;

  constructor(sourceDir: string = './src', localesDir: string = './src/i18n/locales') {
    this.sourceDir = sourceDir;
    this.localesDir = localesDir;
  }

  /**
   * Extract all translation keys used in source files
   */
  async extractUsedKeys(): Promise<TranslationKey[]> {
    const files = await glob(`${this.sourceDir}/**/*.{ts,tsx}`, { ignore: ['**/*.test.*', '**/*.d.ts'] });
    const usedKeys: TranslationKey[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const keys = this.parseTranslationKeys(content, file);
      usedKeys.push(...keys);
    }

    return usedKeys;
  }

  /**
   * Parse translation keys from file content
   */
  private parseTranslationKeys(content: string, filePath: string): TranslationKey[] {
    const keys: TranslationKey[] = [];
    const lines = content.split('\n');

    // Patterns to match t() calls
    const patterns = [
      // t('key')
      /t\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // t("key")
      /t\s*\(\s*"([^"]+)"\s*\)/g,
      // t(`key`)
      /t\s*\(\s*`([^`]+)`\s*\)/g,
      // t('key', options)
      /t\s*\(\s*['"`]([^'"`]+)['"`]\s*,/g,
      // More complex cases with interpolation
      /t\s*\(\s*['"`]([^'"`]*\{\{[^}]*\}\}[^'"`]*)['"`]/g,
    ];

    lines.forEach((line, lineIndex) => {
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const key = match[1];
          if (key && !key.includes('${') && !key.includes('{{')) { // Skip template literals
            keys.push({
              key,
              file: filePath,
              line: lineIndex + 1,
              column: match.index || 0,
              context: line.trim()
            });
          }
        }
      });
    });

    return keys;
  }

  /**
   * Load available translation keys from locale files
   */
  loadAvailableKeys(locale: string = 'en'): Set<string> {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Translation file not found: ${filePath}`);
      return new Set();
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      return this.flattenKeys(translations);
    } catch (error) {
      console.error(`Error loading translations from ${filePath}:`, error);
      return new Set();
    }
  }

  /**
   * Flatten nested translation object into dot notation keys
   */
  private flattenKeys(obj: any, prefix: string = ''): Set<string> {
    const keys = new Set<string>();

    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively flatten nested objects
        const nestedKeys = this.flattenKeys(obj[key], fullKey);
        nestedKeys.forEach(k => keys.add(k));
      } else {
        keys.add(fullKey);
      }
    });

    return keys;
  }

  /**
   * Perform comprehensive translation analysis
   */
  async analyze(): Promise<TranslationAnalysis> {
    console.log('🔍 Analyzing translations...');
    
    const usedKeys = await this.extractUsedKeys();
    const availableKeys = this.loadAvailableKeys('en');
    
    const usedKeyStrings = new Set(usedKeys.map(k => k.key));
    const missingKeys = [...usedKeyStrings].filter(key => !availableKeys.has(key));
    const unusedKeys = [...availableKeys].filter(key => !usedKeyStrings.has(key));
    
    // Find duplicate keys
    const keyCount = new Map<string, number>();
    usedKeys.forEach(k => {
      keyCount.set(k.key, (keyCount.get(k.key) || 0) + 1);
    });
    const duplicateKeys = [...keyCount.entries()]
      .filter(([, count]) => count > 1)
      .map(([key]) => key);

    return {
      usedKeys,
      missingKeys,
      unusedKeys,
      duplicateKeys,
      availableKeys
    };
  }

  /**
   * Generate detailed report
   */
  generateReport(analysis: TranslationAnalysis): string {
    const { usedKeys, missingKeys, unusedKeys, duplicateKeys, availableKeys } = analysis;
    
    let report = `# Translation Analysis Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Summary
    report += `## Summary\n\n`;
    report += `- **Total used keys**: ${usedKeys.length}\n`;
    report += `- **Unique used keys**: ${new Set(usedKeys.map(k => k.key)).size}\n`;
    report += `- **Available keys**: ${availableKeys.size}\n`;
    report += `- **Missing keys**: ${missingKeys.length}\n`;
    report += `- **Unused keys**: ${unusedKeys.length}\n`;
    report += `- **Duplicate usage**: ${duplicateKeys.length}\n\n`;

    // Missing keys
    if (missingKeys.length > 0) {
      report += `## ❌ Missing Translation Keys\n\n`;
      report += `The following keys are used in code but missing from translation files:\n\n`;
      
      missingKeys.forEach(key => {
        const usages = usedKeys.filter(k => k.key === key);
        report += `### \`${key}\`\n\n`;
        report += `Used in ${usages.length} location(s):\n\n`;
        
        usages.forEach(usage => {
          report += `- **${usage.file}:${usage.line}** - \`${usage.context}\`\n`;
        });
        report += `\n`;
      });
    }

    // Unused keys
    if (unusedKeys.length > 0) {
      report += `## 🗑️ Unused Translation Keys\n\n`;
      report += `The following keys exist in translation files but are not used:\n\n`;
      unusedKeys.slice(0, 20).forEach(key => { // Limit to first 20 to avoid huge reports
        report += `- \`${key}\`\n`;
      });
      if (unusedKeys.length > 20) {
        report += `- ... and ${unusedKeys.length - 20} more\n`;
      }
      report += `\n`;
    }

    // Duplicate keys
    if (duplicateKeys.length > 0) {
      report += `## 🔄 Keys with Multiple Usage\n\n`;
      duplicateKeys.forEach(key => {
        const usages = usedKeys.filter(k => k.key === key);
        report += `### \`${key}\` (${usages.length} usages)\n\n`;
        usages.forEach(usage => {
          report += `- **${usage.file}:${usage.line}**\n`;
        });
        report += `\n`;
      });
    }

    return report;
  }

  /**
   * Generate auto-fix suggestions for missing keys
   */
  generateMissingKeysJSON(analysis: TranslationAnalysis): Record<string, any> {
    const missingKeysObj: Record<string, any> = {};

    analysis.missingKeys.forEach(key => {
      // Smart default value generation
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      
      // Convert camelCase to human readable
      const defaultValue = lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();

      // Set nested structure
      let current = missingKeysObj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = defaultValue;
    });

    return missingKeysObj;
  }
}

export { TranslationAnalyzer, type TranslationAnalysis, type TranslationKey };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new TranslationAnalyzer();
  
  analyzer.analyze().then(analysis => {
    console.log('\n📊 Analysis Results:');
    console.log(`- Used keys: ${analysis.usedKeys.length}`);
    console.log(`- Missing keys: ${analysis.missingKeys.length}`);
    console.log(`- Unused keys: ${analysis.unusedKeys.length}`);
    
    if (analysis.missingKeys.length > 0) {
      console.log('\n❌ Missing keys:');
      analysis.missingKeys.forEach(key => console.log(`  - ${key}`));
    }
    
    // Generate report file
    const report = analyzer.generateReport(analysis);
    fs.writeFileSync('./translation-analysis-report.md', report);
    console.log('\n📄 Report saved to: translation-analysis-report.md');
    
    // Generate missing keys JSON
    if (analysis.missingKeys.length > 0) {
      const missingKeysObj = analyzer.generateMissingKeysJSON(analysis);
      fs.writeFileSync('./missing-keys.json', JSON.stringify(missingKeysObj, null, 2));
      console.log('🔧 Missing keys template saved to: missing-keys.json');
    }
  }).catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}