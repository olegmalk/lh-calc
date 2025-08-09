#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { TranslationAnalyzer } from './translation-analyzer';
import type { TranslationAnalysis } from './translation-analyzer';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: ValidationSummary;
}

interface ValidationError {
  type: 'missing_key' | 'invalid_syntax' | 'file_not_found';
  message: string;
  file?: string;
  line?: number;
  key?: string;
}

interface ValidationWarning {
  type: 'unused_key' | 'duplicate_key' | 'inconsistent_casing';
  message: string;
  key?: string;
  details?: string;
}

interface ValidationSummary {
  totalKeys: number;
  validKeys: number;
  missingKeys: number;
  unusedKeys: number;
  duplicateKeys: number;
  coveragePercentage: number;
}

class TranslationValidator {
  private analyzer: TranslationAnalyzer;
  private supportedLocales: string[] = ['en', 'ru'];
  
  constructor() {
    this.analyzer = new TranslationAnalyzer();
  }

  /**
   * Validate all translations across supported locales
   */
  async validate(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Run analysis
    const analysis = await this.analyzer.analyze();
    
    // Validate missing keys
    analysis.missingKeys.forEach(key => {
      errors.push({
        type: 'missing_key',
        message: `Translation key '${key}' is used in code but missing from translation files`,
        key
      });
    });

    // Check for unused keys (warnings)
    analysis.unusedKeys.forEach(key => {
      warnings.push({
        type: 'unused_key',
        message: `Translation key '${key}' is defined but never used`,
        key
      });
    });

    // Check for duplicate usage (warnings)
    analysis.duplicateKeys.forEach(key => {
      const usageCount = analysis.usedKeys.filter(k => k.key === key).length;
      warnings.push({
        type: 'duplicate_key',
        message: `Translation key '${key}' is used ${usageCount} times`,
        key,
        details: `Consider extracting to a reusable component or variable`
      });
    });

    // Validate locale consistency
    const localeErrors = this.validateLocaleConsistency(analysis);
    errors.push(...localeErrors);

    // Generate summary
    const totalUsedKeys = new Set(analysis.usedKeys.map(k => k.key)).size;
    const validKeys = totalUsedKeys - analysis.missingKeys.length;
    const coveragePercentage = totalUsedKeys > 0 ? (validKeys / totalUsedKeys) * 100 : 100;

    const summary: ValidationSummary = {
      totalKeys: totalUsedKeys,
      validKeys,
      missingKeys: analysis.missingKeys.length,
      unusedKeys: analysis.unusedKeys.length,
      duplicateKeys: analysis.duplicateKeys.length,
      coveragePercentage
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary
    };
  }

  /**
   * Validate consistency across multiple locales
   */
  private validateLocaleConsistency(analysis: TranslationAnalysis): ValidationError[] {
    const errors: ValidationError[] = [];
    const baseKeys = analysis.availableKeys;
    
    for (const locale of this.supportedLocales) {
      if (locale === 'en') continue; // Skip base locale
      
      const localeKeys = this.analyzer.loadAvailableKeys(locale);
      const filePath = path.join('./src/i18n/locales', `${locale}.json`);
      
      if (localeKeys.size === 0) {
        errors.push({
          type: 'file_not_found',
          message: `Translation file for locale '${locale}' is missing or invalid`,
          file: filePath
        });
        continue;
      }

      // Check for missing keys in this locale
      const missingInLocale = [...baseKeys].filter(key => !localeKeys.has(key));
      missingInLocale.forEach(key => {
        errors.push({
          type: 'missing_key',
          message: `Key '${key}' exists in base locale but missing in '${locale}'`,
          file: filePath,
          key
        });
      });

      // Check for extra keys in this locale
      const extraInLocale = [...localeKeys].filter(key => !baseKeys.has(key));
      extraInLocale.forEach(key => {
        errors.push({
          type: 'missing_key',
          message: `Key '${key}' exists in '${locale}' but missing in base locale`,
          file: filePath,
          key
        });
      });
    }

    return errors;
  }

  /**
   * Generate validation report
   */
  generateValidationReport(result: ValidationResult): string {
    let report = `# Translation Validation Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`;

    // Summary
    report += `## Summary\n\n`;
    report += `- **Total Keys**: ${result.summary.totalKeys}\n`;
    report += `- **Valid Keys**: ${result.summary.validKeys}\n`;
    report += `- **Missing Keys**: ${result.summary.missingKeys}\n`;
    report += `- **Unused Keys**: ${result.summary.unusedKeys}\n`;
    report += `- **Coverage**: ${result.summary.coveragePercentage.toFixed(1)}%\n\n`;

    // Errors
    if (result.errors.length > 0) {
      report += `## ❌ Errors (${result.errors.length})\n\n`;
      result.errors.forEach((error, index) => {
        report += `${index + 1}. **${error.type.replace('_', ' ').toUpperCase()}**: ${error.message}\n`;
        if (error.file) report += `   - File: \`${error.file}\`\n`;
        if (error.key) report += `   - Key: \`${error.key}\`\n`;
        if (error.line) report += `   - Line: ${error.line}\n`;
        report += `\n`;
      });
    }

    // Warnings
    if (result.warnings.length > 0) {
      report += `## ⚠️ Warnings (${result.warnings.length})\n\n`;
      result.warnings.forEach((warning, index) => {
        report += `${index + 1}. **${warning.type.replace('_', ' ').toUpperCase()}**: ${warning.message}\n`;
        if (warning.key) report += `   - Key: \`${warning.key}\`\n`;
        if (warning.details) report += `   - Details: ${warning.details}\n`;
        report += `\n`;
      });
    }

    // Recommendations
    report += `## 🎯 Recommendations\n\n`;
    
    if (result.summary.missingKeys > 0) {
      report += `- Fix ${result.summary.missingKeys} missing translation keys\n`;
    }
    
    if (result.summary.unusedKeys > 5) {
      report += `- Consider removing ${result.summary.unusedKeys} unused keys to reduce bundle size\n`;
    }
    
    if (result.summary.coveragePercentage < 100) {
      report += `- Improve translation coverage from ${result.summary.coveragePercentage.toFixed(1)}% to 100%\n`;
    }
    
    report += `- Use the auto-generation tool to create missing keys\n`;
    report += `- Run validation in CI/CD pipeline to prevent regressions\n\n`;

    return report;
  }

  /**
   * Check if translations are valid (for CI/CD)
   */
  async isValid(): Promise<boolean> {
    const result = await this.validate();
    return result.isValid;
  }

  /**
   * Get exit code for CI/CD
   */
  async getExitCode(): Promise<number> {
    const isValid = await this.isValid();
    return isValid ? 0 : 1;
  }
}

export { TranslationValidator, type ValidationResult, type ValidationError, type ValidationWarning };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new TranslationValidator();
  
  async function main() {
    try {
      console.log('🔍 Validating translations...\n');
      
      const result = await validator.validate();
      
      // Console output
      console.log(`Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log(`Coverage: ${result.summary.coveragePercentage.toFixed(1)}%`);
      console.log(`Errors: ${result.errors.length}`);
      console.log(`Warnings: ${result.warnings.length}`);
      
      if (result.errors.length > 0) {
        console.log('\n❌ Critical Issues:');
        result.errors.slice(0, 5).forEach(error => {
          console.log(`  - ${error.message}`);
        });
        if (result.errors.length > 5) {
          console.log(`  - ... and ${result.errors.length - 5} more errors`);
        }
      }
      
      if (result.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        result.warnings.slice(0, 3).forEach(warning => {
          console.log(`  - ${warning.message}`);
        });
        if (result.warnings.length > 3) {
          console.log(`  - ... and ${result.warnings.length - 3} more warnings`);
        }
      }
      
      // Generate detailed report
      const report = validator.generateValidationReport(result);
      fs.writeFileSync('./translation-validation-report.md', report);
      console.log('\n📄 Detailed report saved to: translation-validation-report.md');
      
      // Exit with appropriate code
      process.exit(result.isValid ? 0 : 1);
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  }
  
  main();
}