# LH Calculator - Heat Exchanger Cost Calculator

## 📊 Project Status

**Current Version**: 1.0 (Calculation Engine Complete)  
**Live Demo**: http://34.88.248.65:10000/  
**Status**: ✅ Functional, awaiting save/export features

## 🎯 What This Is

A web-based calculator for heat exchanger manufacturing costs, replacing a complex Excel file with 962 formulas. Built for a Russian manufacturing company to streamline their quotation process and integrate with Bitrix24 CRM.

## ✅ What Works Now

- **Full Calculation Engine**: All 962 Excel formulas implemented
- **Web Interface**: Clean, responsive design
- **Input Validation**: All parameters validated
- **Localization**: Russian/English support
- **Real-time Calculation**: Instant results

## 🚧 What's Next (Simple Features)

1. **Save/Load**: Store calculations in localStorage
2. **Excel Export**: Download results as .xlsx
3. **Bitrix24 Integration**: Send quotes to CRM (REQUIRED!)
4. **Project Organization**: Group calculations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Server runs on http://localhost:10000

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
src/
├── components/              # UI components
│   ├── TechnicalInputFormSimple.tsx  # Main input form
│   └── CalculationResults.tsx        # Results display
├── lib/
│   └── calculation-engine/  # Core calculation logic
│       ├── engine-v2.ts     # Main engine
│       └── formula-library-complete.ts  # 56 formulas
├── stores/                  # State management (Zustand)
├── i18n/                   # Translations (RU/EN)
└── pages/                  # Main pages
```

## 🔧 Development

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# Server runs on http://localhost:10000
```

### Build

```bash
npm run build
```

## 🧪 Testing

- **Unit Tests**: 133 tests covering calculation logic
- **E2E Tests**: 16 scenarios, 100% passing
- **Localization Tests**: Complete translation coverage

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 📋 Important Documents

- **`PRD-SIMPLE.md`** - Current requirements (READ THIS FIRST!)
- **`CLAUDE.md`** - Lessons learned and project context
- **`reports/sprint-1-report-ru.md`** - Sprint 1 completion (Russian)
- **`archive/`** - Old planning documents (for reference only)

## ⚠️ Critical Notes

1. **This is for a SINGLE company**, not a SaaS product
2. **Bitrix24 integration is REQUIRED** (see PRD-SIMPLE.md)
3. **Keep it SIMPLE** - no complex architecture needed
4. **Excel file name says "ДЛЯ БИТРИКС"** (FOR BITRIX)

## 🌍 Language Support

- Russian (primary)
- English

## 📞 Contact

- **Primary**: Alex (a1538800@gmail.com)
- **CC**: Oleg Malkov (olegmalkov2023@gmail.com)

---

**Remember**: This is a calculator for a small business. Keep it simple, make it work, ship it fast.
