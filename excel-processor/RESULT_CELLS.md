# Complete List of Result Cells from "результат " Sheet

## Summary
The "результат " sheet contains calculation results organized in specific sections.

## Main Result Cells (28 cells with values)

### Section Headers
| Cell | Description |
|------|-------------|
| результат !F18 | СВОДНЫЙ РЕЗУЛЬТАТ (Summary Result) |
| результат !F23 | РАБОТЫ (Works) |
| результат !G23 | КОРПУС (Corpus) |

### Corpus Components (Row 24)
| Cell | Description | Formula/Value |
|------|-------------|--------------|
| результат !G24 | панели (материал+обработка, патрубки, фланцы) | Header |
| результат !H24 | плакировка панелей (материал + раскрой) | Header |
| результат !I24 | крышки (материал + обработка) | Header |
| результат !J24 | стойки (материал + обработка) | Header |

### Material Prices (Row 25-26)
| Cell | Description | Current Value |
|------|-------------|---------------|
| результат !E25 | цена за 1 кг материала проточной части | Label |
| результат !E26 | Material price | 700 |
| результат !F26 | Calculated value | 0 |
| результат !G26 | Calculated value | 0 |
| результат !H26 | Calculated value | 0 |
| результат !I26 | Calculated value | 0 |
| результат !J26 | Calculated value | 0 |

### Cost Breakdown (Rows 30-36)
| Cell | Description | Current Value |
|------|-------------|---------------|
| результат !I30 | РАБОТЫ (Works) | Label |
| результат !J30 | Works cost | 0 |
| результат !I31 | КОРПУС (Corpus) | Label |
| результат !J31 | Corpus cost | 0 |
| результат !I32 | СЕРДЕЧНИК (Core) | Label |
| результат !J32 | Core cost | 1,356,336.64 |
| результат !I33 | СОЕДИНЕНИЯ (Connections) | Label |
| результат !J33 | Connections cost | 0 |
| результат !I34 | ПРОЧЕЕ (Other) | Label |
| результат !J34 | Other costs | 194,700 |
| результат !I35 | КОФ (Coefficient) | Label |
| результат !J35 | Coefficient value | 0 |
| результат !I36 | ЗИП (Spare parts) | Label |
| результат !J36 | Spare parts cost | 58,100 |

## Key Result Cells for API Output

### Primary Results to Extract
```typescript
// Main cost components
const primaryResults = {
  'результат !J30': 'works_cost',        // Работы
  'результат !J31': 'corpus_cost',       // Корпус  
  'результат !J32': 'core_cost',         // Сердечник (1,356,336.64)
  'результат !J33': 'connections_cost',  // Соединения
  'результат !J34': 'other_costs',       // Прочее (194,700)
  'результат !J35': 'coefficient',       // КОФ
  'результат !J36': 'spare_parts_cost'   // ЗИП (58,100)
};

// Material component values
const materialComponents = {
  'результат !E26': 'material_price_base',  // 700
  'результат !F26': 'component_1',          // 0
  'результат !G26': 'component_2',          // 0  
  'результат !H26': 'component_3',          // 0
  'результат !I26': 'component_4',          // 0
  'результат !J26': 'component_5'           // 0
};
```

## Total Calculation
Based on current values:
- **Core (Сердечник)**: 1,356,336.64 ₽
- **Other (Прочее)**: 194,700 ₽
- **Spare Parts (ЗИП)**: 58,100 ₽
- **Total**: 1,609,136.64 ₽

## Important Notes

1. The sheet name includes a trailing space: `'результат '` not `'результат'`
2. Most values are currently 0 because input cells are empty
3. Main calculation appears in J32 (Core cost)
4. Results are in Russian Rubles (₽)

## API Response Mapping

For the Node.js endpoint, these cells should map to:

```json
{
  "results": {
    "summary": {
      "total": "=SUM(J30:J36)",
      "works": "J30",
      "corpus": "J31",
      "core": "J32",
      "connections": "J33",
      "other": "J34",
      "coefficient": "J35",
      "spareParts": "J36"
    },
    "materials": {
      "basePrice": "E26",
      "components": ["F26", "G26", "H26", "I26", "J26"]
    }
  }
}
```

## Missing Expected Results

Based on the API contract, the following expected result sections are NOT present in the current "результат " sheet:
- Detailed labor costs
- Overhead costs
- VAT calculations
- Margin calculations
- Final price with markup

These may be calculated elsewhere or in different sheets.