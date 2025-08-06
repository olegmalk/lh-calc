# CLAUDE.md - Critical Project Context

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
     - размер_крепежа_панелей (fastener sizes)
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

## 📊 EXCEL FORMULA EXTRACTION

### Extraction Tools Created
- **extract_excel_formulas.py**: Extracts all formulas, relations, and data
- **analyze_excel_logic.py**: Analyzes calculation logic and dependencies

### Generated Documentation
- **excel_formulas.json**: Complete formula database (962 formulas)
- **EXCEL_STRUCTURE.md**: Sheet structure documentation
- **EXCEL_ANALYSIS.md**: Detailed calculation logic analysis

### Key Findings
- **Total Formulas**: 962 across 3 sheets
- **Cross-sheet References**: 142 dependencies
- **Named Ranges**: 9 configuration parameters
- **Calculation Flow**: технолог → снабжение → результат

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