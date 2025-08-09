#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { TranslationAnalyzer } from './translation-analyzer';

interface AutoFixOptions {
  dryRun: boolean;
  backup: boolean;
  generateDefaults: boolean;
  locales: string[];
  smartDefaults: boolean;
  preserveFormatting: boolean;
}

interface FixResult {
  success: boolean;
  addedKeys: string[];
  removedKeys: string[];
  errors: string[];
  backupFiles: string[];
}

class TranslationAutoFixer {
  private analyzer: TranslationAnalyzer;
  private localesDir: string;
  
  constructor(localesDir: string = './src/i18n/locales') {
    this.analyzer = new TranslationAnalyzer();
    this.localesDir = localesDir;
  }

  /**
   * Auto-fix missing translations with smart defaults
   */
  async autoFix(options: Partial<AutoFixOptions> = {}): Promise<FixResult> {
    const config: AutoFixOptions = {
      dryRun: false,
      backup: true,
      generateDefaults: true,
      locales: ['en', 'ru'],
      smartDefaults: true,
      preserveFormatting: true,
      ...options
    };

    const result: FixResult = {
      success: true,
      addedKeys: [],
      removedKeys: [],
      errors: [],
      backupFiles: []
    };

    try {
      // Analyze current state
      console.log('🔍 Analyzing current translations...');
      const analysis = await this.analyzer.analyze();
      
      if (analysis.missingKeys.length === 0) {
        console.log('✅ No missing keys found!');
        return result;
      }

      console.log(`📝 Found ${analysis.missingKeys.length} missing keys to fix`);

      // Generate smart defaults
      const missingKeysWithDefaults = this.generateSmartDefaults(analysis.missingKeys);
      
      // Fix each locale
      for (const locale of config.locales) {
        const localeResult = await this.fixLocale(locale, missingKeysWithDefaults, config);
        result.addedKeys.push(...localeResult.addedKeys);
        result.errors.push(...localeResult.errors);
        result.backupFiles.push(...localeResult.backupFiles);
      }

      console.log(`✅ Auto-fix completed: ${result.addedKeys.length} keys added`);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`Auto-fix failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Fix missing keys for a specific locale
   */
  private async fixLocale(
    locale: string, 
    missingKeys: Record<string, string>, 
    config: AutoFixOptions
  ): Promise<FixResult> {
    const result: FixResult = {
      success: true,
      addedKeys: [],
      removedKeys: [],
      errors: [],
      backupFiles: []
    };

    const filePath = path.join(this.localesDir, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      result.errors.push(`Translation file not found: ${filePath}`);
      return result;
    }

    try {
      // Load existing translations
      const content = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      
      // Create backup if requested
      if (config.backup && !config.dryRun) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        fs.writeFileSync(backupPath, content);
        result.backupFiles.push(backupPath);
        console.log(`💾 Backup created: ${backupPath}`);
      }

      // Add missing keys
      const updatedTranslations = this.addMissingKeys(translations, missingKeys, locale);
      result.addedKeys = Object.keys(missingKeys);

      // Write updated file
      if (!config.dryRun) {
        const updatedContent = JSON.stringify(updatedTranslations, null, 2) + '\n';
        fs.writeFileSync(filePath, updatedContent);
        console.log(`📝 Updated ${locale}.json with ${result.addedKeys.length} new keys`);
      } else {
        console.log(`🔍 [DRY RUN] Would add ${result.addedKeys.length} keys to ${locale}.json`);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to fix ${locale}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Generate smart default values for missing keys
   */
  private generateSmartDefaults(missingKeys: string[]): Record<string, string> {
    const defaults: Record<string, string> = {};

    missingKeys.forEach(key => {
      defaults[key] = this.generateSmartDefault(key);
    });

    return defaults;
  }

  /**
   * Generate a smart default value for a key
   */
  private generateSmartDefault(key: string): string {
    // Split key into parts
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Special cases for common patterns
    if (lastPart.includes('Success')) {
      return 'Operation completed successfully';
    }
    if (lastPart.includes('Error') || lastPart.includes('Failed')) {
      return 'An error occurred';
    }
    if (lastPart.includes('Loading')) {
      return 'Loading...';
    }
    if (lastPart.includes('Save')) {
      return 'Save';
    }
    if (lastPart.includes('Delete')) {
      return 'Delete';
    }
    if (lastPart.includes('Cancel')) {
      return 'Cancel';
    }
    if (lastPart.includes('Confirm')) {
      return 'Confirm';
    }
    if (lastPart.includes('Title')) {
      return 'Title';
    }
    if (lastPart.includes('Description')) {
      return 'Description';
    }
    if (lastPart.includes('Name')) {
      return 'Name';
    }
    if (lastPart.includes('Email')) {
      return 'Email';
    }
    if (lastPart.includes('Password')) {
      return 'Password';
    }
    if (lastPart.includes('Required')) {
      return 'This field is required';
    }
    if (lastPart.includes('Invalid')) {
      return 'Invalid value';
    }
    if (lastPart.includes('Min')) {
      return 'Minimum value';
    }
    if (lastPart.includes('Max')) {
      return 'Maximum value';
    }
    if (lastPart.includes('Count')) {
      return 'Count';
    }
    if (lastPart.includes('Total')) {
      return 'Total';
    }
    if (lastPart.includes('Cost') || lastPart.includes('Price')) {
      return 'Cost';
    }

    // Convert camelCase/kebab-case to human readable
    const humanReadable = lastPart
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim()
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

    // If still not good enough, use the full key as context
    if (humanReadable.length < 3) {
      const contextPart = parts.length > 1 ? parts[parts.length - 2] : '';
      return contextPart ? `${contextPart} ${humanReadable}`.replace(/^./, str => str.toUpperCase()) : 'Value';
    }

    return humanReadable;
  }

  /**
   * Add missing keys to translations object while preserving structure
   */
  private addMissingKeys(
    translations: Record<string, any>, 
    missingKeys: Record<string, string>,
    locale: string
  ): Record<string, any> {
    const updated = { ...translations };

    Object.entries(missingKeys).forEach(([key, defaultValue]) => {
      // Adjust default value for Russian locale
      let value = defaultValue;
      if (locale === 'ru') {
        value = this.translateToRussian(defaultValue, key);
      }

      // Set nested key
      this.setNestedKey(updated, key, value);
    });

    return updated;
  }

  /**
   * Set a nested key in an object using dot notation
   */
  private setNestedKey(obj: Record<string, any>, key: string, value: string): void {
    const parts = key.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Provide basic Russian translations for common patterns
   */
  private translateToRussian(englishValue: string, key: string): string {
    const commonTranslations: Record<string, string> = {
      'Save': 'Сохранить',
      'Delete': 'Удалить',
      'Cancel': 'Отмена',
      'Confirm': 'Подтвердить',
      'Loading...': 'Загрузка...',
      'Error': 'Ошибка',
      'Success': 'Успешно',
      'Title': 'Заголовок',
      'Name': 'Название',
      'Description': 'Описание',
      'Email': 'Email',
      'Password': 'Пароль',
      'This field is required': 'Это поле обязательно',
      'Invalid value': 'Недопустимое значение',
      'Minimum value': 'Минимальное значение',
      'Maximum value': 'Максимальное значение',
      'Count': 'Количество',
      'Total': 'Итого',
      'Cost': 'Стоимость',
      'Operation completed successfully': 'Операция выполнена успешно',
      'An error occurred': 'Произошла ошибка'
    };

    // Direct translation
    if (commonTranslations[englishValue]) {
      return commonTranslations[englishValue];
    }

    // Pattern-based translation
    if (englishValue.toLowerCase().includes('button')) {
      return englishValue.replace(/button/gi, 'кнопка');
    }
    if (englishValue.toLowerCase().includes('field')) {
      return englishValue.replace(/field/gi, 'поле');
    }
    if (englishValue.toLowerCase().includes('form')) {
      return englishValue.replace(/form/gi, 'форма');
    }

    // For technical terms, keep English but add placeholder
    if (key.includes('technical') || key.includes('engineering') || key.includes('calculation')) {
      return `${englishValue} (RU)`;
    }

    return englishValue; // Fallback to English
  }

  /**
   * Remove unused keys from translation files
   */
  async removeUnusedKeys(options: Partial<AutoFixOptions> = {}): Promise<FixResult> {
    const config: AutoFixOptions = {
      dryRun: false,
      backup: true,
      generateDefaults: false,
      locales: ['en', 'ru'],
      smartDefaults: false,
      preserveFormatting: true,
      ...options
    };

    const result: FixResult = {
      success: true,
      addedKeys: [],
      removedKeys: [],
      errors: [],
      backupFiles: []
    };

    try {
      const analysis = await this.analyzer.analyze();
      
      if (analysis.unusedKeys.length === 0) {
        console.log('✅ No unused keys found!');
        return result;
      }

      console.log(`🧹 Found ${analysis.unusedKeys.length} unused keys to remove`);

      for (const locale of config.locales) {
        const localeResult = await this.removeUnusedKeysFromLocale(locale, analysis.unusedKeys, config);
        result.removedKeys.push(...localeResult.removedKeys);
        result.errors.push(...localeResult.errors);
        result.backupFiles.push(...localeResult.backupFiles);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Remove unused keys failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Remove unused keys from a specific locale file
   */
  private async removeUnusedKeysFromLocale(
    locale: string, 
    unusedKeys: string[], 
    config: AutoFixOptions
  ): Promise<FixResult> {
    const result: FixResult = {
      success: true,
      addedKeys: [],
      removedKeys: [],
      errors: [],
      backupFiles: []
    };

    const filePath = path.join(this.localesDir, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      result.errors.push(`Translation file not found: ${filePath}`);
      return result;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      
      // Create backup
      if (config.backup && !config.dryRun) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        fs.writeFileSync(backupPath, content);
        result.backupFiles.push(backupPath);
      }

      // Remove unused keys
      const updatedTranslations = this.removeKeysFromObject(translations, unusedKeys);
      result.removedKeys = unusedKeys;

      if (!config.dryRun) {
        const updatedContent = JSON.stringify(updatedTranslations, null, 2) + '\n';
        fs.writeFileSync(filePath, updatedContent);
        console.log(`🧹 Removed ${result.removedKeys.length} unused keys from ${locale}.json`);
      } else {
        console.log(`🔍 [DRY RUN] Would remove ${result.removedKeys.length} keys from ${locale}.json`);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to clean ${locale}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Remove specific keys from a nested object
   */
  private removeKeysFromObject(obj: Record<string, any>, keysToRemove: string[]): Record<string, any> {
    const updated = JSON.parse(JSON.stringify(obj)); // Deep clone

    keysToRemove.forEach(key => {
      this.removeNestedKey(updated, key);
    });

    return updated;
  }

  /**
   * Remove a nested key from an object
   */
  private removeNestedKey(obj: Record<string, any>, key: string): void {
    const parts = key.split('.');
    let current = obj;

    // Navigate to parent
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) return; // Key doesn't exist
      current = current[parts[i]];
    }

    // Remove final key
    delete current[parts[parts.length - 1]];
  }
}

export { TranslationAutoFixer, type AutoFixOptions, type FixResult };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new TranslationAutoFixer();
  
  async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const noBackup = args.includes('--no-backup');
    const cleanUnused = args.includes('--clean-unused');
    
    console.log('🔧 Translation Auto-Fixer');
    console.log(dryRun ? '🔍 Running in DRY RUN mode' : '💾 Making actual changes');
    
    try {
      if (cleanUnused) {
        console.log('\n🧹 Removing unused keys...');
        const result = await fixer.removeUnusedKeys({ 
          dryRun, 
          backup: !noBackup 
        });
        
        if (result.errors.length > 0) {
          console.error('❌ Errors occurred:');
          result.errors.forEach(error => console.error(`  - ${error}`));
        }
        
        console.log(`✅ Cleanup complete: ${result.removedKeys.length} keys removed`);
      } else {
        console.log('\n🔧 Adding missing translations...');
        const result = await fixer.autoFix({ 
          dryRun, 
          backup: !noBackup 
        });
        
        if (result.errors.length > 0) {
          console.error('❌ Errors occurred:');
          result.errors.forEach(error => console.error(`  - ${error}`));
        }
        
        console.log(`✅ Auto-fix complete: ${result.addedKeys.length} keys added`);
        
        if (result.backupFiles.length > 0) {
          console.log('\n💾 Backup files created:');
          result.backupFiles.forEach(file => console.log(`  - ${file}`));
        }
      }
      
      if (!dryRun) {
        console.log('\n💡 Next steps:');
        console.log('  - Review the generated translations');
        console.log('  - Update with proper translations where needed');
        console.log('  - Run validation: npm run validate-translations');
      }
      
      process.exit(0);
      
    } catch (error) {
      console.error('❌ Auto-fix failed:', error);
      process.exit(1);
    }
  }
  
  main();
}