# Heat Exchanger Calculator - Formula Analysis

## Overview

- Total Sheets: 3
- Total Formulas: 962
- Named Ranges: 9

## Named Ranges (Configuration Parameters)

- **материал_корпуса**: `снабжение!$AU$47:$AU$54`
- **материал_пластин**: `снабжение!$AS$47:$AS$54`
- **размер*крепежа*панелей**: `снабжение!$AV$37:$AV$43`
- **тип_поверхности**: `снабжение!$AZ$36:$AZ$40`
- **тип_поставки**: `снабжение!$AL$39:$AL$41`
- **типоразмеры_К4**: `снабжение!$AM$45:$AM$52`
- **типоразмерыК4**: `снабжение!$AM$45:$AM$46`
- **типорзамеры_К4**: `снабжение!$AM$40:$AM$52`
- **толщина_пластины**: `снабжение!$AL$47:$AL$53`

## Cross-Sheet Dependencies

- **снабжение → технолог**: 81 references
- **результат → снабжение**: 51 references
- **результат → технолог**: 10 references

## Calculation Logic

### Input Sheet (технолог)

Contains technical specifications and parameters:

- Equipment type and size
- Pressure and temperature parameters
- Material specifications

### Processing Sheet (снабжение)

Main calculation engine with:

- Component dimensioning (rows 18-40)
- Material calculations (rows 40-60)
- Cost calculations (rows 78+)
- Detailed component specifications (rows 110-122)

### Output Sheet (результат)

Aggregates results:

- Total costs per component
- Material summaries
- Final pricing

## Key Formulas

### технолог

- `N27`: `=AI73`
- `O27`: `=AJ73`
- `AI73`: `=_xlfn.CEILING.PRECISE(1.25*AG73*$AA$60/AE73,0.01)`
- `AJ73`: `=_xlfn.CEILING.PRECISE(1.25*AH73*$AA$60/AF73,0.01)`

### снабжение

- `K14`: `=K13*D12`
- `G22`: `=IF(технолог!G27=снабжение!AM46,G20*D10+E20+E21,G20*D10*D16+E20+E21)`
- `M22`: `=IF(технолог!G27=снабжение!AM46,M20*D10*(D15+0.03)+K20+K21,M20*D10*D15+K20+K21)`
- `E78`: `=E101`
- `Q78`: `=M78*D44+N78*D43+O78*G44+P78*G43`

### результат

- `N26`: `=снабжение!F78*снабжение!D8+технолог!U27*снабжение!J78*снабжение!D13`
- `V26`: `=снабжение!P45`
