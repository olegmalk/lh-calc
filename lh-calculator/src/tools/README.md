# Translation Management Tools

A comprehensive suite of tools for detecting and fixing missing translations in the LH Calculator React application.

## 🎯 Overview

This toolkit provides both **static analysis** and **runtime detection** capabilities to ensure complete translation coverage across your React application using react-i18next.

### Tools Included:

1. **🔍 Translation Analyzer** - Static analysis of source code
2. **✅ Translation Validator** - Comprehensive validation and consistency checking  
3. **🔧 Translation Auto-Fixer** - Automated missing key generation
4. **🕷️ Runtime Detector** - Browser-based detection using Playwright

---

## 🚀 Quick Start

### Prerequisites

```bash
npm install --save-dev typescript ts-node glob playwright
```

### Basic Usage

```bash
# Analyze translations (static analysis)
npx ts-node src/tools/translation-analyzer.ts

# Validate all translations
npx ts-node src/tools/translation-validator.ts

# Auto-fix missing keys
npx ts-node src/tools/translation-auto-fixer.ts

# Runtime detection (requires running dev server)
npm run dev  # In terminal 1
npx ts-node src/tools/translation-runtime-detector.ts  # In terminal 2
```

---

## 📊 1. Translation Analyzer

**Purpose**: Static analysis to extract and analyze translation key usage

### Features:
- ✅ Scans all TSX/TS files for `t()` calls
- ✅ Compares used keys with available translations
- ✅ Finds missing, unused, and duplicate keys
- ✅ Generates detailed reports

### Usage:

```bash
# Basic analysis
npx ts-node src/tools/translation-analyzer.ts

# Programmatic usage
import { TranslationAnalyzer } from './tools/translation-analyzer';

const analyzer = new TranslationAnalyzer('./src', './src/i18n/locales');
const analysis = await analyzer.analyze();
console.log(`Missing keys: ${analysis.missingKeys.length}`);
```

### Output:
- **Console summary** with key statistics
- **`translation-analysis-report.md`** - Detailed markdown report
- **`missing-keys.json`** - Template for missing keys

### Example Output:
```
📊 Analysis Results:
- Used keys: 245
- Missing keys: 12
- Unused keys: 8
- Coverage: 95.1%

❌ Missing keys:
  - form.validation.emailRequired
  - dashboard.stats.totalRevenue
  - settings.notifications.enabled
```

---

## ✅ 2. Translation Validator

**Purpose**: Comprehensive validation across multiple locales

### Features:
- ✅ Cross-locale consistency checking
- ✅ File existence validation
- ✅ Duplicate and unused key detection
- ✅ Coverage percentage calculation
- ✅ CI/CD integration ready

### Usage:

```bash
# Full validation
npx ts-node src/tools/translation-validator.ts

# Check validation status (for CI/CD)
if npx ts-node src/tools/translation-validator.ts; then
  echo "✅ Translations are valid"
else
  echo "❌ Translation issues found"
  exit 1
fi
```

### CI/CD Integration:

```yaml
# .github/workflows/translations.yml
- name: Validate Translations
  run: |
    npx ts-node src/tools/translation-validator.ts
```

### Output:
- **Exit code 0** = Valid, **Exit code 1** = Issues found
- **`translation-validation-report.md`** - Detailed validation report

---

## 🔧 3. Translation Auto-Fixer

**Purpose**: Automatically generate missing translation keys with smart defaults

### Features:
- ✅ Smart default value generation
- ✅ Russian translation patterns
- ✅ Backup creation
- ✅ Dry-run mode
- ✅ Unused key cleanup

### Usage:

```bash
# Auto-fix missing keys
npx ts-node src/tools/translation-auto-fixer.ts

# Dry run (see what would be changed)
npx ts-node src/tools/translation-auto-fixer.ts --dry-run

# Clean unused keys
npx ts-node src/tools/translation-auto-fixer.ts --clean-unused

# No backup files
npx ts-node src/tools/translation-auto-fixer.ts --no-backup
```

### Smart Default Generation:

```typescript
// Input key: "form.validation.emailRequired"
// English output: "Email Required" 
// Russian output: "Email обязателен"

// Input key: "dashboard.stats.totalCost"
// English output: "Total Cost"
// Russian output: "Общая стоимость"
```

### Safety Features:
- 🔒 **Backup files** created automatically
- 🔍 **Dry-run mode** to preview changes
- 🎯 **Smart defaults** based on key patterns
- 📝 **Preserves JSON formatting**

---

## 🕷️ 4. Runtime Detector (Playwright)

**Purpose**: Browser-based detection of untranslated strings in live application

### Features:
- ✅ Tests actual rendered UI
- ✅ Multi-locale support
- ✅ Screenshot capture
- ✅ Automatic language switching
- ✅ HTML report generation

### Setup:

```bash
# Install Playwright browsers
npx playwright install chromium

# Ensure your dev server is running
npm run dev  # Port 5173
```

### Usage:

```bash
# Basic runtime detection
npx ts-node src/tools/translation-runtime-detector.ts

# Custom configuration
npx ts-node src/tools/translation-runtime-detector.ts
```

### Configuration:

```typescript
const detector = new TranslationRuntimeDetector({
  baseUrl: 'http://localhost:5173',
  pages: [
    '/',
    '/calculations',
    '/supply-parameters',
    '/saved-calculations'
  ],
  locales: ['en', 'ru'],
  screenshots: true,
  waitTime: 2000
});
```

### Output:
- **HTML Report** with screenshots and details
- **JSON Results** for programmatic processing
- **Screenshots** of untranslated elements

### Detection Patterns:
- Translation keys showing in UI (`form.title`)
- Missing key placeholders (`[[missing:key]]`)
- Hardcoded English text in Russian locale
- Debug placeholders (`TODO:`, `PLACEHOLDER:`)

---

## 🔄 Complete Workflow

### Development Workflow:

```bash
# 1. Analyze current state
npx ts-node src/tools/translation-analyzer.ts

# 2. Auto-fix missing keys
npx ts-node src/tools/translation-auto-fixer.ts

# 3. Validate everything
npx ts-node src/tools/translation-validator.ts

# 4. Runtime check (with dev server running)
npx ts-node src/tools/translation-runtime-detector.ts
```

### CI/CD Pipeline:

```bash
#!/bin/bash
# ci-translation-check.sh

echo "🔍 Running translation validation..."

# Static validation
if ! npx ts-node src/tools/translation-validator.ts; then
  echo "❌ Static validation failed"
  exit 1
fi

# Runtime validation (if applicable)
if command -v playwright &> /dev/null; then
  echo "🕷️ Running runtime detection..."
  npm run build
  npm run preview &
  SERVER_PID=$!
  sleep 5
  
  npx ts-node src/tools/translation-runtime-detector.ts
  RUNTIME_EXIT_CODE=$?
  
  kill $SERVER_PID
  
  if [ $RUNTIME_EXIT_CODE -ne 0 ]; then
    echo "❌ Runtime detection found issues"
    exit 1
  fi
fi

echo "✅ All translation checks passed"
```

---

## 📁 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "translations:analyze": "ts-node src/tools/translation-analyzer.ts",
    "translations:validate": "ts-node src/tools/translation-validator.ts",
    "translations:fix": "ts-node src/tools/translation-auto-fixer.ts",
    "translations:fix-dry": "ts-node src/tools/translation-auto-fixer.ts --dry-run",
    "translations:runtime": "ts-node src/tools/translation-runtime-detector.ts",
    "translations:clean": "ts-node src/tools/translation-auto-fixer.ts --clean-unused",
    "translations:check": "npm run translations:validate && npm run translations:runtime"
  }
}
```

---

## 🎯 Architecture & Design

### Static Analysis Flow:
```
Source Files (.tsx/.ts) 
    ↓ [AST Parsing]
Translation Keys (t() calls)
    ↓ [Comparison]
Translation Files (.json)
    ↓ [Analysis]
Missing/Unused Keys Report
```

### Runtime Detection Flow:
```
Live Application
    ↓ [Playwright Browser]
Rendered UI Elements
    ↓ [Pattern Matching]
Untranslated Strings
    ↓ [Screenshot + Report]
HTML Report with Evidence
```

### Auto-Fix Process:
```
Missing Keys List
    ↓ [Smart Default Generation]
Key-Value Pairs
    ↓ [Locale-Specific Translation]
Updated JSON Files
    ↓ [Backup + Validation]
Fixed Translation Files
```

---

## 🛠️ Customization

### Adding New Detection Patterns:

```typescript
// In translation-runtime-detector.ts
const customPatterns = [
  /^UNTRANSLATED:/,  // Custom placeholder pattern
  /^\[.*\]$/,        // Bracketed placeholders
  /^__.*__$/         // Double underscore pattern
];
```

### Custom Smart Defaults:

```typescript
// In translation-auto-fixer.ts
private generateSmartDefault(key: string): string {
  // Add custom logic for your domain
  if (key.includes('calculation')) {
    return 'Calculation';
  }
  if (key.includes('heatExchanger')) {
    return 'Heat Exchanger';
  }
  // ... existing logic
}
```

### Extending Language Support:

```typescript
// Add new locale
const supportedLocales = ['en', 'ru', 'es', 'de'];

// Add locale-specific translations
private translateToSpanish(englishValue: string): string {
  const commonTranslations = {
    'Save': 'Guardar',
    'Delete': 'Eliminar',
    // ...
  };
  return commonTranslations[englishValue] || englishValue;
}
```

---

## 📈 Best Practices

### 1. **Regular Validation**
```bash
# Run before every commit
npm run translations:validate
```

### 2. **Staged Fixes**
```bash
# Always dry-run first
npm run translations:fix-dry
# Then apply changes
npm run translations:fix
```

### 3. **Runtime Testing**
```bash
# Test on staging before production
npm run translations:runtime
```

### 4. **Key Naming Conventions**
```typescript
// Good: Hierarchical, descriptive
t('dashboard.stats.totalRevenue')
t('form.validation.emailRequired')
t('buttons.actions.saveAndClose')

// Bad: Flat, unclear
t('text1')
t('msg')
t('btn')
```

### 5. **Smart Defaults Review**
```bash
# Generate defaults, then review
npm run translations:fix-dry
# Review generated keys in missing-keys.json
# Apply and refine manually
npm run translations:fix
```

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"No translation keys found"**
```bash
# Check if t() pattern is correct
grep -r "useTranslation" src/
grep -r "t(" src/
```

#### 2. **"Browser launch failed"**
```bash
# Install Playwright browsers
npx playwright install chromium

# Or use different browser
export BROWSER=firefox
```

#### 3. **"Dev server not running"**
```bash
# Ensure dev server is accessible
curl http://localhost:5173
# Or change baseUrl in config
```

#### 4. **"Permission denied on backup files"**
```bash
# Check write permissions
ls -la src/i18n/locales/
# Or disable backups
npm run translations:fix -- --no-backup
```

### Debug Mode:

```typescript
// Enable debug logging
const analyzer = new TranslationAnalyzer();
process.env.DEBUG = 'translation-tools';
```

---

## 🎉 Success Metrics

After implementing these tools, you should see:

- **📊 100% Translation Coverage** - No missing keys
- **🚀 Faster Development** - Automated key generation  
- **🔒 Consistency** - Cross-locale validation
- **📱 Better UX** - No untranslated text in production
- **⚡ CI/CD Integration** - Automated validation

---

## 🤝 Contributing

To extend these tools:

1. **Add new detection patterns** in the respective tool files
2. **Extend language support** by adding new locale handlers
3. **Create custom reporters** by extending the base classes
4. **Add new validation rules** in the validator

---

## 📚 References

- **React i18next**: https://react.i18next.com/
- **Playwright**: https://playwright.dev/
- **TypeScript AST**: https://ts-ast-viewer.com/
- **Translation Best Practices**: https://react.i18next.com/guides/quick-start

---

*Generated by the LH Calculator Translation Management System* 🛠️