# CLAUDE.md - Critical Project Context

## 📁 FILE ORGANIZATION RULES - PREVENT ROOT CLUTTER

### NEVER create files in root directory unless absolutely necessary:

- ✅ **OK in root**: README.md, CLAUDE.md, package.json, config files (vite, tsconfig, etc)
- ❌ **NOT in root**: Screenshots, test reports, scripts, documentation, validation reports

### Where files belong:

- **Screenshots/Images**: `/archive/screenshots/`
- **Test Reports/Validation**: `/archive/validation-reports/`
- **Scripts/Tools**: `/archive/scripts/`
- **Old Documentation**: `/archive/old-architecture/`
- **Sprint Planning**: `/archive/old-sprint-planning/`
- **Temporary Files**: Delete immediately after use
- **Communication Logs**: `/communications/`
- **Reports**: `/reports/`

### Clean up rules:

1. After taking screenshots for debugging → Move to `/archive/screenshots/`
2. After running validation scripts → Move outputs to `/archive/validation-reports/`
3. After creating helper scripts → Move to `/archive/scripts/`
4. Delete all `page-check-*.png` files after debugging
5. Never commit temporary files to git

### If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.

## 🎭 Use Playwright, Not Puppeteer

**We already have Playwright installed** - use it for all browser testing and automation:

- E2E tests: `npx playwright test`
- Debug specific test: `npx playwright test -g "test name"`
- Don't install puppeteer when Playwright is already available

## ⚠️ TypeScript Rules - NO ANY TYPES

**NEVER use `any` type in TypeScript code**. This is a critical quality rule.

Instead:

- Use proper type definitions
- Create interfaces for complex objects
- Use `unknown` if type is truly unknown (then narrow it)
- Use generics for flexible types
- Use union types for multiple possibilities

Examples:

```typescript
// ❌ BAD
const result = {} as any;

// ✅ GOOD
const result = {} as { totalCost: number };

// ✅ BETTER
interface CalculationResult {
  totalCost: number;
  // ... other fields
}
const result = {} as CalculationResult;
```

## 🚨 CRITICAL LESSON LEARNED (2025-08-07)

### What Happened: We Almost Built the Wrong Thing

**The Mistake:**

1. We completed Sprint 1 successfully (calculation engine works!)
2. Started planning Sprint 2 with complex database architecture
3. Planned PostgreSQL + Prisma + tRPC + sync mechanisms
4. Created 10+ planning documents for database features
5. **COMPLETELY MISSED** the main PRD requirement: Bitrix24 integration

**The Discovery:**

- The Excel file is literally named "...ДЛЯ БИТРИКС" (FOR BITRIX)
- PRD explicitly requires Bitrix24 CRM integration (BR-004)
- Client needs to export calculations to their CRM for quotes
- We were building complex database while ignoring actual requirement

**Root Cause:**

- Over-engineering based on assumptions
- Not reading PRD carefully enough
- Focusing on "best practices" instead of client needs
- Assuming need for database without checking requirements

**The Fix:**

1. STOP all Sprint 2 database planning
2. Archive all complex architecture documents
3. Focus on ACTUAL requirements: Bitrix24 export
4. Use simple localStorage (sufficient for single user)
5. Create single, clear PRD document

### Prevention Rules Going Forward

✅ **ALWAYS CHECK**:

1. What does the PRD ACTUALLY say?
2. What problem are we ACTUALLY solving?
3. Is this the SIMPLEST solution?
4. Are we building what was REQUESTED?

❌ **NEVER**:

1. Assume complex architecture is needed
2. Add databases "because it's best practice"
3. Plan features not in requirements
4. Over-engineer for imaginary scale

### The Real Requirements (Simple!)

- Calculator that works ✅ (DONE)
- Save/load calculations locally (localStorage)
- Export to Excel
- **Export to Bitrix24 CRM** (CRITICAL, was missing)
- Russian language support ✅ (DONE)

## ⚠️ CRITICAL: READ THIS FIRST - PREVENT HALLUCINATIONS

### PROJECT IDENTITY

**Project Name**: LH Calculator (Heat Exchanger Cost Calculator)  
**Domain**: INDUSTRIAL MANUFACTURING / ENGINEERING  
**NOT**: Insurance, Healthcare, Life & Health, Medical

### WHAT "LH" MEANS

- LH = Heat Exchanger Product Line/Company Identifier
- This is an INDUSTRIAL EQUIPMENT cost calculator
- Domain: Heat exchangers (теплообменники) manufacturing

### PROJECT PURPOSE

Calculate production costs for heat exchanger equipment including:

- Heat exchanger assemblies (Теплообменные аппараты)
- Plates (Пластины)
- Flanges (Фланцы)
- Gaskets (Прокладки)
- Technical components with pressure/temperature specifications

## 📋 PROJECT STATUS & COMPLETED WORK

### Original PRD Source

**Excel File**: `/home/vmuser/dev/lh_calc/Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx`

- Russian language Excel calculator with 962 formulas
- 3 sheets: технолог (input), снабжение (calculations), результат (results)
- Complex formula-based cost calculation system
- Full extraction completed: see `excel_formulas.json` and `EXCEL_ANALYSIS.md`

### What We've Built (2025-08-06)

#### 1. Initial Setup & Research

- ✅ Extracted PRD from Russian Word document
- ✅ Deep research on B2B dashboard tech stack
- ✅ Selected optimal stack: TypeScript, React, Vite, Mantine
- ✅ Installed BMAD method framework for development

#### 2. Project Initialization

```bash
Location: /home/vmuser/dev/lh_calc/lh-calculator
Tech Stack:
- React 18 + TypeScript + Vite
- Mantine v8 (UI components)
- TanStack Query + Zustand (state management)
- React Hook Form + Zod (forms)
- react-i18next (RU/EN translations)
- React Router v6
```

#### 3. Corrected Domain Confusion

- ❌ Initially misinterpreted as "Life & Health" insurance
- ✅ Corrected to Heat Exchanger industrial equipment
- ✅ Created this CLAUDE.md to prevent future mistakes
- ✅ Fixed all naming, translations, and branding

#### 4. Cleaned Up to MVP

**Removed non-essential pages:**

- Reports, Settings, Reference Data
- Components, Flanges, Materials (will be part of Technical Parts)

**Current MVP Structure (3 pages only):**

- `/dashboard` - Overview with statistics
- `/technical-parts` - Heat exchanger specifications
- `/calculations` - Cost calculations (placeholder)

#### 5. Fixed Mobile Responsiveness

- ✅ Added burger menu for mobile navigation
- ✅ Fixed AppShell collapsed navbar on mobile
- ✅ Proper viewport configuration

#### 6. Infrastructure Setup

- ✅ Dev server running on port 10000
- ✅ GCloud firewall rule: `allow-vite-dev-10000`
- ✅ Public access: http://34.88.248.65:10000/

### Key Requirements (From Excel Analysis)

#### Excel Calculator Structure

1. **Input Sheet (технолог)**
   - Equipment type and size (типоразмер)
   - Pressure parameters (давление A/B)
   - Temperature parameters (температура A/B)
   - Material specifications (AISI 316L, etc.)
   - 26 formulas for interpolation and calculations

2. **Calculation Sheet (снабжение)**
   - 907 formulas for cost calculations
   - Component dimensioning (rows 18-40)
   - Material calculations (rows 40-60)
   - Detailed specifications (rows 110-122)
   - Named ranges for configuration:
     - материал_корпуса (body material)
     - материал_пластин (plate material)
     - размер*крепежа*панелей (fastener sizes)
     - толщина_пластины (plate thickness)

3. **Results Sheet (результат)**
   - 29 aggregation formulas
   - Total cost summaries
   - Component cost breakdown
   - Material summaries

#### Key Calculation Logic

- **Pressure calculations**: Using MATCH, INDEX, VLOOKUP for interpolation
- **Material density**: 7880 kg/m³ (steel), 8080 kg/m³ (stainless)
- **Safety factor**: 1.25 multiplier in pressure calculations
- **Cost aggregation**: Multi-level summation across components

### Key PRD Requirements (From Original Document)

#### Business Requirements

1. Automated cost calculation process for production
2. Unified results page with tables and diagrams

#### Technical Entities (Smart Processes in Bitrix24)

1. **Technical Parts** (Технические части)
   - Number, Position, Delivery Type
   - Model, Plate Count
   - Pressure A/B (bar), Temperature A/B (°C)
   - Materials specifications

2. **Components** (Комплектующие)
   - Types: Covers, Columns, Panels A/B
   - Thickness, Processing price

3. **Flanges** (Фланцы)
   - Pressure classes (РУ10-РУ100)
   - Diameters (ДУ25-ДУ1000)
   - Materials and coatings

4. **Other Materials** (Другие материалы)
   - Additional cost items

5. **Reference Data** (Справочники)
   - Type sizes (Типоразмеры)
   - Plate materials (Материалы пластин)
   - Body materials (Материалы корпуса)
   - Voltages/Stress (Напряжения)

#### Calculation Results Required

- Summary table (Сводный результат)
- Cost structure table and pie chart
- Total cost (Итоговая стоимость)
- Export to PDF/Excel

### KEY TERMINOLOGY (RUSSIAN → ENGLISH)

```
Калькулятор себестоимости = Cost Calculator
Технические части = Technical Parts
Комплектующие = Components
Фланцы = Flanges
Другие материалы = Other Materials
Типоразмер = Type/Size
Материал пластин = Plate Material
Материал корпуса = Body/Housing Material
Напряжения = Voltages/Stress
Расчетное давление = Design Pressure (bar)
Расчетная температура = Design Temperature (°C)
Количество пластин = Number of Plates
Тип поставки = Delivery Type
КОЛ-ВО ХОДОВ = Number of Passes
Толщина = Thickness (mm)
```

### TECHNICAL SPECIFICATIONS

- **Pressure**: Measured in bar (e.g., 10 bar, 16 bar)
- **Temperature**: Measured in °C
- **Materials**: Stainless steel grades, various alloys
- **Flanges**: Standards like РУ10-РУ100, ДУ25-ДУ1000
- **Plate thickness**: 0.2mm to 10mm range

### BUSINESS RULES

1. Cost calculation based on:
   - Material costs (per kg)
   - Processing costs
   - Assembly labor
   - Additional components
2. Complex formulas involving multiple entities
3. Results displayed as tables and pie charts

### MINIMUM VIABLE FEATURES (Phase 1)

1. Technical Parts management (CRUD)
2. Basic cost calculation
3. Results display (table format)
4. Russian language interface

### DO NOT IMPLEMENT (Until Explicitly Asked)

- Complex visualizations beyond basic tables
- Export functionality
- Advanced reporting
- Multiple calculation methods
- API integrations

### DEVELOPMENT APPROACH

1. **ALWAYS** refer back to original PRD
2. **NEVER** assume domain context
3. **ASK** if terminology is unclear
4. **START MINIMAL** - basic CRUD first
5. **FOLLOW BMAD** - proper epics and stories
6. **NO HALLUCINATIONS** - stick to PRD facts

### CURRENT MISTAKES TO FIX

- [x] Incorrectly interpreted as "Life & Health" insurance
- [ ] Remove all insurance/healthcare references
- [ ] Fix all naming to reflect industrial domain
- [ ] Align features with heat exchanger calculations

### VALIDATION CHECKLIST

Before any feature implementation:

- [ ] Does it relate to heat exchangers?
- [ ] Is it mentioned in the PRD?
- [ ] Is the terminology industrial/engineering?
- [ ] Have we created proper BMAD stories?

## REMEMBER

This is an INDUSTRIAL MANUFACTURING cost calculator for HEAT EXCHANGERS.
Not insurance. Not healthcare. HEAT EXCHANGERS.

## 🌍 LOCALIZATION REQUIREMENTS

### CRITICAL: All UI Features Must Support Localization

**ALWAYS include localization from the start when planning and developing ANY feature.**

#### Core Principles

1. **No Hardcoded Strings**: NEVER put user-facing text directly in components
2. **Use Translation Keys**: ALWAYS use `t('key.path')` for all UI text
3. **Bilingual Support**: Project supports Russian (primary) and English
4. **Structure Translation Files**: Group translations logically by feature/component

#### Implementation Checklist

When implementing ANY UI feature:

- [ ] Import `useTranslation` hook from 'react-i18next'
- [ ] Add `const { t } = useTranslation()` to component
- [ ] Replace ALL hardcoded strings with `t('key')`
- [ ] Add translations to BOTH en.json and ru.json files
- [ ] Use interpolation for dynamic values: `t('key', { value })`
- [ ] Test that language switching works correctly

#### Translation File Structure

```json
{
  "form": {
    "title": "Title text",
    "fields": {
      "fieldName": "Field Label"
    },
    "validation": {
      "required": "Field is required"
    },
    "placeholders": {
      "fieldName": "Placeholder text"
    }
  }
}
```

#### Common Translation Patterns

- Form labels: `t('form.fields.fieldName')`
- Validation errors: `t('form.validation.errorType')`
- Button text: `t('common.action')`
- Section titles: `t('component.sections.sectionName')`
- Dynamic values: `t('message', { count: 5, name: 'value' })`

#### Files to Update

When adding new translations:

1. `/src/i18n/locales/en.json` - English translations
2. `/src/i18n/locales/ru.json` - Russian translations (primary language)

#### Testing Localization

1. Check all text renders correctly in both languages
2. Verify dynamic interpolations work
3. Ensure no console warnings about missing translations
4. Test language switcher functionality (if implemented)

#### Current Translation Coverage

- ✅ TechnicalInputFormSimple - Fully localized
- ✅ CalculationResults - Fully localized
- ✅ Dashboard - Fully localized
- ✅ Common UI elements - Fully localized
- ⚠️ Error messages in stores - Partially localized (TODO)
- ⚠️ TechnicalParts page - Uses translations but mock data hardcoded

#### Important Development Notes

- ALWAYS include localization when implementing UI features
- NO hardcoded user-facing strings allowed
- Think about translation structure before implementing
- Consider text length variations between languages in UI design

## 👥 PROJECT CONTACTS

### Primary Contact

- **Name**: Александр (Alex)
- **Email**: a1538800@gmail.com
- **Role**: Primary Project Contact
- **Communication**: RUSSIAN ONLY - все коммуникации только на русском языке
- **Important**: Use "Александр" when addressing by name

### CC Recipients

- **Oleg Malkov**: olegmalkov2023@gmail.com (CC on all communications)

### Communication Rules

- ✅ Always CC olegmalkov2023@gmail.com on ALL emails
- ✅ Store all communications in `/communications/` folder
- ✅ Use format: `YYYY-MM-DD_subject.md`
- ✅ Log all email sends in this document
- ✅ **NEVER ATTACH FILES TO EMAILS** - All content must be in email body
- ✅ **ALL EMAIL CONTENT IN RUSSIAN** - No English in emails to Александр
- ✅ **NO ATTACHMENTS** - Include all information directly in email text
- ✅ **NEVER ATTACH FILES** - all content must be in email body
- ✅ **ALL CONTENT IN RUSSIAN** - no English in emails to client
- ✅ Use "Александр" when addressing by name

### Email Configuration

- **Sender**: olegmalkov2023@gmail.com
- **App Password**: ✅ Configured and working
- **Status**: Gmail SMTP operational
- **Script**: `send_project_email.py`

### Email History

- **2025-08-06 14:48**: Sprint 1 Clarification - ✅ SENT SUCCESSFULLY
  - To: Alex (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Обновление Sprint 1: Обнаружена реальная структура 962 формул в Excel
  - Content: `/communications/2025-08-06_sprint_1_clarification.md`
  - Explained 962 formulas structure (13 equipment types × 53 calculations)

- **2025-08-06 21:09**: Sprint 1 Completion Report - ✅ SENT SUCCESSFULLY
  - To: Alex (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Отчет Sprint 1 завершен - Готов к тестированию
  - Content: `/communications/2025-08-06_sprint_1_complete.md`
  - Full Sprint 1 report with testing areas and Sprint 2 planning

- **2025-08-07 07:47**: Sprint 2 Planning - ✅ SENT SUCCESSFULLY
  - To: Alex (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Sprint 2 План: Финальная фаза калькулятора - Упрощенный подход
  - Content: `/communications/2025-08-07_sprint_2_plan.md`
  - Simplified architecture, 10-day plan, Bitrix24 integration priority

- **2025-08-07 09:41**: Requirements Clarification - ✅ SENT SUCCESSFULLY
  - To: Alex (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: 🔴 СРОЧНО: Требуется уточнение требований - Обнаружены критические пропуски
  - Attachment: `REQUIREMENTS-CLARIFICATION-NEEDED.md`
  - Critical gaps found: 40% технолог fields missing, 100% снабжение fields missing

- **2025-08-07 09:45**: Russian Questions Only - ✅ SENT SUCCESSFULLY
  - To: Александр (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Срочные вопросы по калькулятору - требуются ответы для продолжения
  - Attachment: `ВОПРОСЫ-ТРЕБУЮЩИЕ-ОТВЕТА.md` (Russian only)
  - Simplified questions document with checkboxes for client to answer

- **2025-08-07 09:53**: Requirements Resent (No Attachments) - ✅ SENT SUCCESSFULLY
  - To: Александр (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Вопросы по калькулятору - требуются ответы для продолжения
  - Content: All requirements questions in email body (no attachments)
  - Fixed per client request - all content directly in email

- **2025-08-08 00:34**: Delivery Type Clarification - ✅ SENT SUCCESSFULLY
  - To: Александр (a1538800@gmail.com)
  - CC: Oleg Malkov (olegmalkov2023@gmail.com)
  - Subject: Вопрос по полю "Тип поставки" в калькуляторе
  - Content: `/communications/2025-08-08_delivery_type_clarification.md`
  - Asked about F27 field usage - not used in calculations, need clarification

## 📊 EXCEL FORMULA DOCUMENTATION & STATUS

### Formula Analysis Complete (2025-08-07)

- **Total Formulas**: 962 across 3 sheets
- **Unique Patterns**: 43 calculation patterns (NOT 962 unique formulas!)
- **Current Implementation**: ~20% (8-10 patterns implemented)
- **Critical Gap**: Safety calculations missing (PRODUCTION BLOCKING)

### Key Documentation Files

- **PRD_FORMULAS.md**: Single source of truth for all formulas
- **FORMULA_TRACKING.md**: Implementation checklist and progress
- **FORMULA_ANALYSIS.md**: Shows repetition patterns
- **excel_formulas.json**: Raw formula database

### Implementation Status by Priority

#### 🔴 CRITICAL - MUST FIX (Production Blocking)

1. **Missing Safety Calculations**:
   - AI73/AJ73: Pressure test formulas (`CEILING.PRECISE`)
   - N27/O27: Test pressure fields completely missing from form
2. **Field Mapping Error**:
   - U27: Incorrectly mapped as "componentsA" vs Excel's "thickness"

3. **Missing Fields**:
   - N27 (Test pressure hot side) - NOT IN FORM
   - O27 (Test pressure cold side) - NOT IN FORM

#### 🟡 HIGH PRIORITY - Core Functionality

- VLOOKUP matrix operations (partially implemented)
- Equipment-specific calculations (13 types)
- Weight calculations with margins
- Dimension interpolations

#### 🟢 IMPLEMENTED - Working

- Basic weight calculations
- Material constants and densities
- Equipment type selection
- Supply parameters (100% complete)
- Basic cost aggregations

### Formula Implementation Phases

**Phase 1 (4 hours)**: Safety-Critical

- [ ] Add N27/O27 fields to form
- [ ] Implement AI73/AJ73 calculations
- [ ] Fix U27 field mapping

**Phase 2 (8 hours)**: Core Calculations

- [ ] VLOOKUP matrix (dimensions from pressure/temp)
- [ ] All weight calculations (8 patterns)
- [ ] Cost calculations with corrections

**Phase 3 (8 hours)**: Business Logic

- [ ] Conditional equipment logic
- [ ] Material compatibility
- [ ] Delivery type adjustments

**Phase 4 (4 hours)**: Aggregations

- [ ] Final summations
- [ ] Component breakdowns
- [ ] Report generation

### The 962 Formula Reality

```
962 formulas = 43 unique patterns × repetition
- 30 calculations × 13 equipment types = 390 repetitive formulas
- Plus aggregations, lookups, and cross-references
- Most are the SAME calculation for different equipment
```

Example: Plate weight formula appears 13 times (rows 110-122),
one for each equipment type. That's 1 pattern to code, not 13.

## 🚀 BMAD METHOD INTEGRATION

### BMAD Agents Available

The project now has BMAD (Breakthrough Method for Agile AI-Driven Development) integrated with specialized agents:

- `/bmad-orchestrator` - Coordinate all agents and workflow
- `/bmad-analyst` - Requirements discovery and PRD creation
- `/bmad-pm` - Product management and roadmap
- `/bmad-architect` - System design and architecture
- `/bmad-sm` - Scrum master for sprint planning
- `/bmad-dev` - Development and implementation
- `/bmad-qa` - Testing and quality assurance

### BMAD Workflow

1. **Discovery Phase**: Start with `/bmad-analyst` to analyze requirements
2. **Planning Phase**: Use `/bmad-sm` to create user stories
3. **Implementation Phase**: Use `/bmad-dev` for coding
4. **Testing Phase**: Use `/bmad-qa` for quality assurance

### Using BMAD Commands

- Type `/` in Claude Code to see available BMAD agents
- Each agent has specific commands (use `*help` after activation)
- Agents maintain context for the LH Calculator project
- Follow BMAD methodology for structured development

### BMAD Files Location

- **Global Commands**: `~/.claude/commands/bmad-*.md` (available in all projects)
- **Project Commands**: `.claude/commands/` (project-specific)
- **BMAD Core**: `~/.claude/bmad-core/` (global installation)
- **Excel Requirements**: `/home/vmuser/dev/lh_calc/Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx`

## 📧 EMAIL CAPABILITIES

### Configuration

- **Gmail**: olegmalkov2023@gmail.com
- **App Password**: Configured in `.env` file
- **Script**: `send_email.py`

### Usage

```bash
# Send email using .env configuration
python3 send_email.py

# Send to specific recipient
python3 send_email.py "" recipient@email.com

# Override app password
python3 send_email.py "new-app-password"
```

### Security

- App Password stored in `.env` (gitignored)
- Never commit credentials
- Revoke at: https://myaccount.google.com/apppasswords

## 🔍 DEBUGGING TOOLS

### Page Console Error Checker

**Script**: `check-page-console.cjs`
**Purpose**: Universal tool to check any web page for console errors, warnings, and page issues

**Usage**:

```bash
# Check default (localhost:10000)
node check-page-console.cjs

# Check specific URL
node check-page-console.cjs https://example.com

# Verbose mode (show all console logs)
VERBOSE=1 node check-page-console.cjs
```

**Features**:

- Detects console errors and warnings
- Captures page errors and failed requests
- Takes screenshots automatically
- Provides page content summary
- Returns exit code 1 if errors found (useful for CI/CD)

**Output includes**:

- Page load status
- Console errors/warnings
- Page title and headings
- Form/button/input counts
- Screenshot path
- Error summary
