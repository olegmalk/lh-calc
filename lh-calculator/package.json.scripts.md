# Package.json Scripts for Translation Tools

Add these scripts to your `package.json` to integrate the translation management tools:

```json
{
  "scripts": {
    "translations:analyze": "ts-node src/tools/translation-analyzer.ts",
    "translations:validate": "ts-node src/tools/translation-validator.ts", 
    "translations:fix": "ts-node src/tools/translation-auto-fixer.ts",
    "translations:fix-dry": "ts-node src/tools/translation-auto-fixer.ts --dry-run",
    "translations:runtime": "ts-node src/tools/translation-runtime-detector.ts",
    "translations:clean": "ts-node src/tools/translation-auto-fixer.ts --clean-unused",
    "translations:check": "npm run translations:validate && npm run translations:runtime",
    "translations:report": "npm run translations:analyze && npm run translations:validate"
  },
  "devDependencies": {
    "glob": "^10.0.0",
    "playwright": "^1.40.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

## Usage Examples:

```bash
# Quick analysis
npm run translations:analyze

# Validate everything  
npm run translations:validate

# Auto-fix missing keys (with preview)
npm run translations:fix-dry
npm run translations:fix

# Runtime detection
npm run translations:runtime

# Full check (CI/CD)
npm run translations:check
```