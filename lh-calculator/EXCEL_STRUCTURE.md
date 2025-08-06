# Excel Calculator Structure Documentation

## Summary
- Total Sheets: 3
- Total Formulas: 962
- Sheets: технолог, снабжение, результат 

## Sheets Analysis

### технолог
- Formulas: 26
- Data Cells: 85
- Merged Cells: 8

#### Key Formulas:
- `N27`: `=AI73`
- `O27`: `=AJ73`
- `Q27`: `=P27`
- `AE60`: `=MATCH(AF61,$Z$60:$Z$68)`
- `AF60`: `=INDEX($Z$60:$Z$68,AE60,1)`
- `AG60`: `=VLOOKUP(AF60,$Z$60:$AA$68,$AA$69)`
- `AI60`: `=MATCH(AJ61,$Z$60:$Z$68)`
- `AJ60`: `=INDEX($Z$60:$Z$68,AI60,1)`
- `AK60`: `=VLOOKUP(AJ60,$Z$60:$AA$68,$AA$69)`
- `AF61`: `=L27`
- ... and 16 more formulas

### снабжение
- Formulas: 907
- Data Cells: 715
- Merged Cells: 114

#### Key Formulas:
- `D7`: `=технолог!P27`
- `E7`: `=технолог!Q27`
- `H10`: `=технолог!E27`
- `I10`: `=технолог!G27`
- `J10`: `=технолог!H27`
- `K10`: `=технолог!I27`
- `L10`: `=технолог!S27`
- `M10`: `=технолог!P27`
- `N10`: `=технолог!U27`
- `O10`: `=технолог!T27`
- ... and 897 more formulas

### результат 
- Formulas: 29
- Data Cells: 33
- Merged Cells: 24

#### Key Formulas:
- `M25`: `=снабжение!F39`
- `E26`: `=IF(AND(технолог!P27=снабжение!D7),снабжение!D8,IF(AND(технолог!P27=снабжение!E7),снабжение!E8,IF(AN...`
- `F26`: `=снабжение!K14`
- `G26`: `=снабжение!G35+снабжение!M35`
- `H26`: `=снабжение!E8*снабжение!G78*снабжение!D14*снабжение!D14+технолог!V27*снабжение!H78*снабжение!D13`
- `I26`: `=снабжение!G22*2`
- `J26`: `=снабжение!M22*4`
- `K26`: `=снабжение!Q25`
- `L26`: `=снабжение!F38`
- `M26`: `=L26*M25`
- ... and 19 more formulas

## Cell Dependencies

- `технолог!N27` depends on: AI73
- `технолог!O27` depends on: AJ73
- `технолог!Q27` depends on: P27
- `технолог!AE60` depends on: AF61, $Z$60, $Z$68
- `технолог!AF60` depends on: $Z$60, $Z$68, AE60
- `технолог!AG60` depends on: AF60, $Z$60, $AA$68, $AA$69
- `технолог!AI60` depends on: AJ61, $Z$60, $Z$68
- `технолог!AJ60` depends on: $Z$60, $Z$68, AI60
- `технолог!AK60` depends on: AJ60, $Z$60, $AA$68, $AA$69
- `технолог!AF61` depends on: L27
- `технолог!AG61` depends on: AG62, AG60, AF62, AF60, AF61...
- `технолог!AJ61` depends on: M27
- `технолог!AK61` depends on: AK62, AK60, AJ62, AJ60, AJ61...
- `технолог!AE62` depends on: AE60
- `технолог!AF62` depends on: $Z$60, $Z$68, AE62
- `технолог!AG62` depends on: AF62, $Z$60, $AA$68, $AA$69
- `технолог!AI62` depends on: AI60
- `технолог!AJ62` depends on: $Z$60, $Z$68, AI62
- `технолог!AK62` depends on: AJ62, $Z$60, $AA$68, $AA$69
- `технолог!AC71` depends on: AC70, AA60, AF61
- ... and 938 more dependencies
