[2025-08-08] DEEP DIVE: Component mass formulas G94-G104 analysis requested. Task was to extract EXACT formulas for cells G94, G95, G97, G98, G100, G101, G103 from снабжение sheet and complete VLOOKUP table B110:AK122. 

CRITICAL FINDING: The requested cells G94, G97, G100, G101, G103 DO NOT EXIST as formulas in the Excel file. Only G95 ("плотность плакировки,кг/мм3") and G98 ("Высота пластины") exist as text headers.

ACTUAL COMPONENT MASS FORMULAS FOUND:
- E93: =VLOOKUP(D104,B110:L122,11,0) → 29.625648 (Гребенка 4шт)
- E94: =VLOOKUP(D104,B110:O122,14,0) → 27.346752 (Полоса гребенки 4шт) 
- E95: =VLOOKUP(D104,B110:R122,17,0) → 43.6640256 (Лист концевой 2шт)
- E97: =VLOOKUP(D104,B110:AB122,27,0) → 9.0266976 (Зеркало А 4шт)
- E98: =VLOOKUP(D104,B110:AE122,30,0) → 9.021024 (Зеркало Б 4шт)
- E99: =VLOOKUP(D104,B110:AH122,33,0) → 92.22890688 (Лист плакирующий А 2шт)
- E100: =VLOOKUP(D104,B110:AK122,36,0) → 91.9960056 (Лист плакирующий Б 2шт)
- E101: =SUM(E93:E98) → 118.684147 (ИТОГО)
- G93: =VLOOKUP(технолог!P27,AS47:AT53,2,) → 0.00788 (Плотность пластин)
- G96: =VLOOKUP(технолог!Q27,AS47:AT53,2,) → 0.00788 (Плотность плакировки)
- G99: =технолог!T27+технолог!U27 → 6 (Высота пластины)

VLOOKUP TABLE B110:AK122: К4-750 found in row 118 with component masses in columns L, O, R, AB, AE, AH, AK.

Used Python openpyxl to extract formulas directly from Excel file for accuracy. Analysis showed component mass calculations are in column E, not G as originally requested.