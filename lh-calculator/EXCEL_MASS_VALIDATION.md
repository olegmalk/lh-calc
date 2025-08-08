# Excel Mass Validation - Screenshot Analysis

## Screenshot Data (К4-750 Configuration)

### Component Parts Breakdown

| Part Name (Russian)    | Part Name (English)  | Quantity | Mass (kg)       |
| ---------------------- | -------------------- | -------- | --------------- |
| Гребенка 4шт           | Comb/Grate           | 4 pcs    | 29.625648       |
| Полоса гребенки 4шт    | Comb Strip           | 4 pcs    | 27.346752       |
| Лист концевой 2шт      | End Sheet            | 2 pcs    | 43.6640256      |
| Зеркало лист 8шт       | Mirror Sheet         | 8 pcs    | -               |
| Зеркало А 4шт          | Mirror A             | 4 pcs    | 9.0266976       |
| Зеркало Б 4шт          | Mirror B             | 4 pcs    | 9.021024        |
| Лист плакирующий А 2шт | Cladding Sheet A     | 2 pcs    | 92.22890688     |
| Лист плакирующий Б 2шт | Cladding Sheet B     | 2 pcs    | 91.9960056      |
| **ИТОГО**              | **Total Components** | -        | **118.6841472** |

### Main Plate Mass

| Equipment | Mass (kg)     |
| --------- | ------------- |
| К4-750    | 1820.5952     |
| **ИТОГО** | **1820.5952** |

### Material Properties

- Плотность пакета (Package density): 0.00788 кг/мм³
- Плотность плакировки (Cladding density): 0.00788 кг/мм³
- Высота пластин (Plate height): 6.0 mm
- Высота пакета пластин (Plate package height): 2400 mm

## Comparison with Our Calculator

### Current Calculator Output (К4-750, 400 plates, 1mm thickness)

- Plate Mass: 1124.74 kg
- Body Mass: 54.64 kg
- Total: 1179.38 kg

### Excel Expected Output

- Plate Mass: 1820.59 kg
- Component Parts: 118.68 kg
- Total: 1939.27 kg

## Discrepancy Analysis

### Plate Mass Difference

- Excel: 1820.59 kg
- Calculator: 1124.74 kg
- **Ratio: 1.62x (Excel is 62% higher)**

### Possible Causes:

1. **Different plate count or dimensions**
   - We're using 400 plates
   - Excel might be using different count
2. **Material density differences**
   - Both use 0.00788 (7880 kg/m³) ✓
3. **Volume calculation differences**
   - Our volume: 0.1392 m³
   - Excel implied volume: 1820.59 / 7880 = 0.231 m³
   - **Excel volume is 66% higher**

4. **Missing calculations**
   - Excel has detailed component breakdown
   - We're oversimplifying with just "body mass"

## Required Actions

1. **Verify plate count** - Check if Excel is using 400 or different number
2. **Check plate dimensions** - Verify К4-750 dimensions (600x580mm)
3. **Review thickness** - Confirm if 1mm or different value
4. **Add component calculations** - Implement detailed part calculations:
   - Гребенка (Comb/Grate)
   - Полоса (Strips)
   - Зеркало (Mirrors)
   - Плакирующий лист (Cladding sheets)
   - Концевой лист (End sheets)

## Formula Location in Excel

Based on our analysis, these calculations are in:

- **снабжение sheet, rows 93-105**
- Using VLOOKUP against master table B110:AK122
- Column indices for different components
- Equipment type from технолог!G27

## Next Steps

1. Request client to provide exact input values used for this screenshot
2. Get the specific формулы (formulas) for component calculations
3. Implement detailed component breakdown instead of simplified "body mass"
4. Validate against multiple test cases from client
