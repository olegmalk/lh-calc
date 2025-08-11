# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dynamic Validation Rules from Excel Template

### Overview
The system now dynamically extracts dropdown validation rules from the Excel template at runtime, eliminating the need to hardcode enum values in the code. This ensures the API validation always matches the Excel template's dropdown lists.

### How It Works
1. **Extraction**: The `ExcelValidationExtractor` service reads the Excel file's XML structure to extract all dropdown validation rules
2. **Caching**: Rules are cached in `validation-rules.json` and in memory for performance
3. **Auto-refresh**: When a new template is uploaded via `/api/admin/template/upload`, validation rules are automatically re-extracted
4. **Validation**: The `FieldValidator` uses these dynamic rules to validate enum fields in API requests

### Extracted Enum Fields (31 total)
- **технолог sheet**: Material types, surface types, thickness values, delivery types
- **снабжение sheet**: Pressure ratings (Ру), diameters (Ду), fastener materials, coatings, sizes

### API Endpoints
- `GET /api/admin/validation-rules` - View current validation rules (requires auth)
- `POST /api/admin/validation-rules/refresh` - Force refresh rules from template
- `GET /api/fields/enum` - Get enum fields for API documentation and frontend dropdowns

### Files
- `/src/services/excel-validation-extractor.ts` - Extraction logic
- `/validation-rules.json` - Cached validation rules (auto-generated)
- `/src/validators/field-validator.ts` - Uses dynamic rules for validation

### Important Notes
- Validation rules are extracted on server startup
- Rules are refreshed automatically when template is uploaded
- Validation errors are reported but don't block requests (warnings only)
- Cache TTL is 5 minutes for the validator, indefinite for extractor
- Frontend automatically detects enum fields from API response and converts them to dropdowns
- No manual field type declarations needed - all enum fields are auto-detected

## Critical Rules
- **ALWAYS READ FILES IN FULL BEFORE MODIFYING** - Read the entire file content before making any edits
- **NEVER LEAVE FALLBACKS** - Always fix the root cause, don't settle for workarounds
- **NO BACKWARDS COMPATIBILITY** - Breaking changes are the default
- **Every fallback must be temporary** - Mark with TODO and fix immediately

## Servers and Access

### Main API Server
- **Port**: 3000
- **Start Command**: `npm run dev` (development with hot reload)
- **Production**: `npm run build && npm run start`
- **Serves**: API endpoints + static files from `/public` directory

### Web UI Access
- **Dashboard**: http://localhost:3000/
- **Template Upload**: http://localhost:3000/template-upload.html
- **Authentication**: 
  - Username: `admin`
  - Password: `lhcalc2024` (from .env BASIC_AUTH_PASSWORD)

### API Endpoints
- **Health Check**: http://localhost:3000/health
- **Calculate**: POST http://localhost:3000/api/calculate
- **Template Info**: GET http://localhost:3000/api/admin/template/info
- **Template Upload**: POST http://localhost:3000/api/admin/template/upload

## Commands

### Development
```bash
npm run dev         # Start development server with hot reload on port 3000
npm run build       # Compile TypeScript to dist/
npm run start       # Run production build from dist/
```

### Starting the Server
```bash
cd /home/vmuser/dev/lh_calc/excel-api
npm run dev         # Starts on port 3000 with nodemon for auto-restart
```

### Accessing the UI
1. Start the server: `npm run dev`
2. Open browser to http://localhost:3000/
3. Login with admin/lhcalc2024
4. Click "Template Management" for upload functionality

### Testing
```bash
npm test            # Run all tests except load tests with coverage
npm run test:watch  # Run tests in watch mode (excludes load tests)
npm run test:load   # Run load tests only (sequential execution)
npm run test:all    # Run all tests including load tests
```

### Code Quality
```bash
npm run lint        # Type-check TypeScript without compilation
```

### Running Specific Tests
```bash
npx jest tests/integration/edge-cases.test.ts          # Run specific test file
npx jest -t "should handle zero denominator"           # Run test by name pattern
npx jest --testNamePattern="Division by Zero"          # Run tests matching pattern
```

## Architecture

### Core Processing Flow
1. **Request Entry** → Express middleware stack (CORS, rate limiting, body parsing)
2. **Validation** → FieldValidator with Joi schema validates 134+ fields against business rules
3. **Queue Management** → QueueManager allocates worker from pool (5 workers, 45s timeout)
4. **Excel Processing** → ExcelProcessor loads template, writes values to cells, recalculates formulas
5. **Result Extraction** → Reads calculated cells from результат sheet, formats response
6. **Error Recovery** → Circuit breaker pattern with automatic retry and graceful degradation

### Key Design Patterns

#### Worker Pool Architecture
- **Pool Size**: 5 workers in production, 10 in tests
- **Queue**: FIFO with overflow rejection (503 Service Unavailable)
- **Timeout**: 45 seconds per request (120s in tests)
- **Memory Management**: Workers reset after each request to prevent memory leaks

#### Error Handling Hierarchy
```
CustomError (base)
├── ValidationError (422) - Input validation failures
├── ProcessingError (422) - Excel calculation errors
├── CircuitBreakerError (503) - Service temporarily unavailable
├── WorkerTimeoutError (504) - Processing exceeded timeout
└── SecurityError (403) - Detected malicious input
```

#### Bitrix24 Integration
- **Webhook Endpoint**: `/api/bitrix24/webhook` - No auth, processes Bitrix24 form data
- **REST Endpoint**: `/api/bitrix24/rest` - Token validation, full API integration
- **CORS**: Configured for `*.bitrix24.com` and `*.bitrix24.ru` domains

### Excel Template Location

- **Template File**: `/home/vmuser/dev/lh_calc/calc.xlsx`
- **Backup Directory**: `/home/vmuser/dev/lh_calc/excel-api/backups/`
- **Temp Files**: `/tmp/temp_validate_*.xlsx`

### Excel Template Mapping

The system maps API fields to Excel cells across three sheets:

**технолог (Engineering) Sheet**:
- Input cells: D27-V27 (equipment specs, temperatures, pressures)
- Calculated cells: F27, G27, P27-U27 (derived values)

**снабжение (Supply) Sheet**:
- Material codes: F2 (dropdown selection)
- Prices: D8-E8, K13, P13, D78 (material and labor costs)
- Cost matrix: D10-T43 (134+ price input fields)

**результат (Results) Sheet**:
- Total cost: B3
- Component breakdown: B4-B8 (materials, processing, hardware, etc.)

### Field Validation Rules

**Required Fields** (26 total):
- Engineering: `tech_D27_type`, `tech_E27_weightType`, `tech_H27_quantityType`, etc.
- Supply: `sup_F2_parameter`, `sup_D8_priceMaterial`, `sup_K13_costQuantityNormTotal`, etc.

**Enum Validations**:
- Material codes: Must match exact strings (e.g., "09Г2С", "12Х18Н10Т")
- Pressure ratings: Format "Ру{number}" (e.g., "Ру10", "Ру160")
- Diameter codes: Format "Ду{number}" (e.g., "Ду25", "Ду1000")

**Pattern Validations**:
- Equipment codes: `/^[ЕК][-0-9А-Я*]*$/` (Cyrillic)
- Fractions: `/^\d+\/\d+$/` (e.g., "1/6")
- Numbers: Must be >= 0

## Important Implementation Details

### Rate Limiting
- **Production**: 100 requests/minute per IP
- **Test Mode**: Bypassed (10,000 limit for load testing)
- **Block Duration**: 60 seconds after limit exceeded

### Memory Management
- Excel files loaded once per worker
- Template cached in memory for performance
- Workers reset after each request to prevent leaks
- 512MB heap limit per worker process

### Security Considerations
- Input sanitization for XSS/SQL injection attempts
- Request size limits: 10MB JSON, 1MB validated body
- Security incident logging to `logs/security.log`
- Production error messages sanitized (no stack traces)

### Test Environment Differences
- Rate limiting bypassed
- Circuit breaker disabled
- Worker pool size increased to 10
- Request timeout extended to 120 seconds
- Detailed error messages enabled

## Common Issues and Solutions

### "Queue is full" (503 Error)
- Cause: All 5 workers busy processing requests
- Solution: Retry after delay or increase worker pool size

### "Excel calculation failed" (422 Error)  
- Cause: Division by zero or invalid formula in Excel
- Solution: Check input values cause invalid calculations

### High Memory Usage
- Cause: Excel files not being properly released
- Solution: Workers automatically reset after each request

### Slow Processing Times
- Cause: Complex Excel formulas or large datasets
- Solution: 45-second timeout enforced, optimize Excel template

## Monitoring Endpoints

- `GET /health` - Basic health check
- `GET /api/metrics` - System metrics (memory, queue, workers)
- `GET /api/diagnostics` - Excel processor diagnostics
- `GET /api/admin/queue/stats` - Detailed queue statistics
- `GET /api/admin/errors/recent` - Recent error log (last 100)
- `GET /api/admin/errors/security` - Security incidents

## Email Capabilities

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