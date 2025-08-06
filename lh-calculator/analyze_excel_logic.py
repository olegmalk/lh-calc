#!/usr/bin/env python3
"""
Analyze Excel formulas to understand calculation logic and create domain model
"""

import json
import re
from collections import defaultdict
from pathlib import Path

def load_excel_data():
    """Load the extracted Excel data"""
    with open('excel_formulas.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def analyze_sheet_relationships(data):
    """Analyze relationships between sheets"""
    
    print("=== SHEET RELATIONSHIPS ===")
    cross_sheet_refs = defaultdict(list)
    
    for sheet_name, sheet_data in data['sheets'].items():
        for cell_ref, formula in sheet_data['formulas'].items():
            # Find cross-sheet references (e.g., технолог!P27)
            pattern = r'([\w\s]+)![A-Z]+[0-9]+'
            matches = re.findall(pattern, formula)
            for match in matches:
                if match != sheet_name:
                    cross_sheet_refs[f"{sheet_name} → {match}"].append(cell_ref)
    
    for relationship, cells in cross_sheet_refs.items():
        print(f"{relationship}: {len(cells)} references")
    
    return cross_sheet_refs

def identify_calculation_blocks(data):
    """Identify major calculation blocks/areas"""
    
    print("\n=== CALCULATION BLOCKS ===")
    
    # Analyze 'технолог' sheet
    tech_sheet = data['sheets'].get('технолог', {})
    if tech_sheet:
        print("\nТехнолог sheet (Technical specifications):")
        print("- Cells N27, O27: Calculated pressure values")
        print("- Cells AF60-AK62: Lookup and interpolation calculations")
        print("- Cells AI73, AJ73: Final pressure calculations")
        print("- Cell Q27: Material specification")
    
    # Analyze 'снабжение' sheet
    supply_sheet = data['sheets'].get('снабжение', {})
    if supply_sheet:
        print("\nСнабжение sheet (Supply/Procurement):")
        # Group formulas by row ranges
        formula_groups = defaultdict(list)
        for cell_ref in supply_sheet['formulas'].keys():
            row = int(re.findall(r'[0-9]+', cell_ref)[0])
            if row < 20:
                formula_groups['Header and main parameters'].append(cell_ref)
            elif 20 <= row < 40:
                formula_groups['Components calculations'].append(cell_ref)
            elif 40 <= row < 60:
                formula_groups['Materials and fasteners'].append(cell_ref)
            elif 60 <= row < 90:
                formula_groups['Cost calculations'].append(cell_ref)
            elif 90 <= row < 130:
                formula_groups['Detailed component calculations'].append(cell_ref)
            else:
                formula_groups['Additional calculations'].append(cell_ref)
        
        for group, cells in formula_groups.items():
            print(f"- {group}: {len(cells)} formulas")
    
    # Analyze 'результат' sheet
    result_sheet = data['sheets'].get('результат ', {})
    if result_sheet:
        print("\nРезультат sheet (Results):")
        print("- Final cost calculations")
        print("- Summary totals")
        print("- References to снабжение sheet for aggregation")

def extract_key_parameters(data):
    """Extract key parameters and constants used in calculations"""
    
    print("\n=== KEY PARAMETERS ===")
    
    # Extract named ranges
    if data['named_ranges']:
        print("\nNamed Ranges (important parameters):")
        for name, coord in data['named_ranges'].items():
            print(f"- {name}: {coord}")
    
    # Find constants in formulas
    constants = set()
    for sheet_data in data['sheets'].values():
        for formula in sheet_data['formulas'].values():
            # Extract numeric constants
            numbers = re.findall(r'\b\d+\.?\d*\b', formula)
            constants.update(numbers)
    
    print(f"\nFound {len(constants)} unique numeric constants in formulas")
    
    # Key multipliers and factors
    important_constants = ['1.25', '0.001', '1000', '10^6', '7880', '8080']
    print("\nImportant multipliers/factors found:")
    for const in important_constants:
        if any(const in str(formula) for sheet in data['sheets'].values() 
               for formula in sheet['formulas'].values()):
            print(f"- {const}")

def create_calculation_flow(data):
    """Create a simplified calculation flow diagram"""
    
    print("\n=== CALCULATION FLOW ===")
    print("""
    1. ТЕХНОЛОГ (Technical Input)
       ├─ Equipment specifications (type, size, materials)
       ├─ Pressure parameters (L27, M27)
       └─ Material specifications (P27, Q27)
              ↓
    2. СНАБЖЕНИЕ (Supply/Procurement)
       ├─ Component calculations
       │   ├─ Covers (КРЫШКА)
       │   ├─ Columns (КОЛОННА)
       │   ├─ Panels A & B (ПАНЕЛЬ А/Б)
       │   └─ Fasteners (КРЕПЕЖ)
       ├─ Material requirements
       │   ├─ Base materials
       │   ├─ Flanges (ФЛАНЦЫ)
       │   └─ Gaskets (ПРОКЛАДКИ)
       └─ Cost calculations (rows 78+)
              ↓
    3. РЕЗУЛЬТАТ (Results)
       ├─ Total costs aggregation
       ├─ Component summaries
       └─ Final pricing
    """)

def extract_business_entities(data):
    """Extract business entities from the Excel structure"""
    
    print("\n=== BUSINESS ENTITIES ===")
    
    entities = {
        'Heat Exchanger Assembly': {
            'fields': ['Type (типоразмер)', 'Plate count', 'Pressure A/B', 'Temperature A/B', 'Materials'],
            'sheet': 'технолог'
        },
        'Components': {
            'types': ['Covers (Крышка)', 'Columns (Колонна)', 'Panels A/B (Панели)', 'Fasteners (Крепеж)'],
            'sheet': 'снабжение'
        },
        'Flanges': {
            'params': ['Diameter (Ду)', 'Pressure class (Ру)', 'Material', 'Coating'],
            'sheet': 'снабжение'
        },
        'Materials': {
            'types': ['Plate material', 'Body material', 'Gaskets', 'Additional materials'],
            'sheet': 'снабжение'
        },
        'Calculations': {
            'outputs': ['Component costs', 'Material costs', 'Total cost', 'Cost breakdown'],
            'sheet': 'результат'
        }
    }
    
    for entity, details in entities.items():
        print(f"\n{entity}:")
        for key, value in details.items():
            if isinstance(value, list):
                print(f"  {key}:")
                for item in value:
                    print(f"    - {item}")
            else:
                print(f"  {key}: {value}")

def save_analysis(data, cross_sheet_refs):
    """Save detailed analysis to markdown"""
    
    output_path = Path("EXCEL_ANALYSIS.md")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Heat Exchanger Calculator - Formula Analysis\n\n")
        
        f.write("## Overview\n")
        f.write(f"- Total Sheets: {len(data['sheets'])}\n")
        f.write(f"- Total Formulas: {data['summary']['total_formulas']}\n")
        f.write(f"- Named Ranges: {len(data['named_ranges'])}\n\n")
        
        f.write("## Named Ranges (Configuration Parameters)\n")
        for name, coord in data['named_ranges'].items():
            # Clean the coordinate string
            coord_str = str(coord).split("attr_text='")[-1].rstrip("'")
            f.write(f"- **{name}**: `{coord_str}`\n")
        f.write("\n")
        
        f.write("## Cross-Sheet Dependencies\n")
        for relationship, cells in cross_sheet_refs.items():
            f.write(f"- **{relationship}**: {len(cells)} references\n")
        f.write("\n")
        
        f.write("## Calculation Logic\n\n")
        f.write("### Input Sheet (технолог)\n")
        f.write("Contains technical specifications and parameters:\n")
        f.write("- Equipment type and size\n")
        f.write("- Pressure and temperature parameters\n")
        f.write("- Material specifications\n\n")
        
        f.write("### Processing Sheet (снабжение)\n")
        f.write("Main calculation engine with:\n")
        f.write("- Component dimensioning (rows 18-40)\n")
        f.write("- Material calculations (rows 40-60)\n")
        f.write("- Cost calculations (rows 78+)\n")
        f.write("- Detailed component specifications (rows 110-122)\n\n")
        
        f.write("### Output Sheet (результат)\n")
        f.write("Aggregates results:\n")
        f.write("- Total costs per component\n")
        f.write("- Material summaries\n")
        f.write("- Final pricing\n\n")
        
        f.write("## Key Formulas\n\n")
        
        # Extract some important formulas
        important_cells = {
            'технолог': ['N27', 'O27', 'AI73', 'AJ73'],
            'снабжение': ['K14', 'G22', 'M22', 'E78', 'Q78'],
            'результат ': ['N26', 'V26']
        }
        
        for sheet_name, cells in important_cells.items():
            if sheet_name in data['sheets']:
                f.write(f"### {sheet_name}\n")
                sheet_formulas = data['sheets'][sheet_name]['formulas']
                for cell in cells:
                    if cell in sheet_formulas:
                        formula = sheet_formulas[cell]
                        f.write(f"- `{cell}`: `{formula[:100]}{'...' if len(formula) > 100 else ''}`\n")
                f.write("\n")
    
    print(f"\nAnalysis saved to: {output_path}")

if __name__ == "__main__":
    # Load data
    data = load_excel_data()
    
    # Perform analysis
    cross_sheet_refs = analyze_sheet_relationships(data)
    identify_calculation_blocks(data)
    extract_key_parameters(data)
    create_calculation_flow(data)
    extract_business_entities(data)
    
    # Save comprehensive analysis
    save_analysis(data, cross_sheet_refs)
    
    print("\n=== ANALYSIS COMPLETE ===")
    print("Check EXCEL_ANALYSIS.md for detailed documentation")