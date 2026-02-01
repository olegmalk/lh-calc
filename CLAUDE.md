# lh-calc - Heat Exchanger Calculator

## Remote Access

Code lives on remote Ubuntu server. SSH via Mac Mini jump host (server accepts only Mac Mini IP).

### Setup SSH Control Socket
```bash
ssh -J oleg@olegs-mac-mini -p 22022 -M -S /tmp/ssh-remote -fN lhe@188.246.164.131
```

### Run Remote Commands
```bash
ssh -S /tmp/ssh-remote -p 22022 lhe@188.246.164.131 "command"
```

Node requires nvm:
```bash
ssh -S /tmp/ssh-remote -p 22022 lhe@188.246.164.131 "source ~/.nvm/nvm.sh && cd /home/lhe/lh-calc/excel-api && npm run build"
```

### Close Socket
```bash
ssh -S /tmp/ssh-remote -p 22022 -O exit lhe@188.246.164.131
```

## Project Layout

```
/home/lhe/lh-calc/
├── calc.xlsx                    # Excel template with formulas
├── excel-api/                   # TypeScript Express API
│   ├── src/
│   │   ├── index.ts             # Main server (port 5555)
│   │   ├── constants/field-mapping.ts  # API field -> Excel cell mapping
│   │   ├── types/api-contract.ts       # Request/response types
│   │   ├── processors/libreoffice-processor.ts  # Core: write cells -> LibreOffice recalc -> read results
│   │   ├── integrations/bitrix24.ts    # Bitrix24 webhook/REST integration
│   │   ├── validators/field-validator.ts
│   │   ├── services/
│   │   └── routes/
│   ├── dist/                    # Compiled JS
│   └── public/                  # Static files + generated Excel downloads
├── ecosystem.config.js          # PM2 config
└── git-watcher.sh               # Auto-deploy on git push
```

## Architecture

1. Input: ~134 fields from Bitrix24 or direct API call
2. Fields written to `calc.xlsx` template (sheets: `технолог`, `снабжение`)
3. LibreOffice headless recalculates formulas
4. Results extracted from `результат ` sheet (note trailing space in name)
5. Response includes: calculated_values, total_cost, component_costs, detailed_costs

## Key Endpoints

- `POST /api/calculate` - Main calculation (no auth)
- `POST /api/bitrix24/webhook` - Bitrix24 webhook
- `POST /api/bitrix24/rest` - Bitrix24 REST
- `GET /health` - Health check (basic auth: admin/lhcalc2024)
- `GET /api/fields/required` - Required fields list
- `POST /api/upload-prefill` - Upload Excel to prefill form
- Admin endpoints under `/api/admin/` (basic auth)

## PM2 Management

```bash
# Must source nvm first
source ~/.nvm/nvm.sh && cd /home/lhe/lh-calc

pm2 restart lh-calc-app
pm2 logs lh-calc-app --lines 50 --nostream
pm2 status
```

## Build & Deploy

```bash
source ~/.nvm/nvm.sh && cd /home/lhe/lh-calc/excel-api
npm run build          # tsc compile
pm2 restart lh-calc-app
```

## Git

Repo: `github.com/olegmalk/lh-calc` (private)

Push from server requires GITHUB_TOKEN env var:
```bash
git push https://${GITHUB_TOKEN}@github.com/olegmalk/lh-calc.git master
```

## Testing

```bash
curl -s -X POST http://localhost:5555/api/calculate \
  -H 'Content-Type: application/json' \
  -d '{ ... }' | python3 -m json.tool
```

## File Transfer (via control socket)

```bash
# Local -> Remote
cat localfile | base64 | ssh -S /tmp/ssh-remote -p 22022 lhe@188.246.164.131 "base64 -d > /remote/path"

# Remote -> Local
ssh -S /tmp/ssh-remote -p 22022 lhe@188.246.164.131 "base64 /remote/file" | base64 -d > localfile
```

## Editing Remote Files

Use python3 scripts for complex edits (sed mangles multiline). Transfer via base64 pipe, execute remotely.
