# CALCULATION GROUPS - DETAILED FIELD MAPPING

**Generated:** 2025-08-09  
**Source:** Complete field registry extraction from Excel file  
**Total Fields:** 1795  
**Total Groups:** 8

## OVERVIEW

This document provides a detailed mapping of all 1795 fields from the LH Calculator Excel file, organized by their calculation purpose and functional groups.

---

## GROUP 1: TECHNICAL_PARAMETERS (111 fields)

**Purpose:** Core technical specifications and parameters that define the product  
**Role Access:** Primarily Technologist  
**Priority:** Critical for all calculations

**Key Field Types:**

- Product specifications and configuration
- Material properties and characteristics
- Dimensional parameters
- Technical constraints and requirements
- User instructions and guidelines

**Representative Fields:**

- `FIELD_0001` - технолог!E4: "желтым выделено то, что нужно выбрать из списка ТЕХНОЛОГ"
- `FIELD_0002` - технолог!E5: "зелёным выделено то, что нужно ввести в ручную ТЕХНОЛОГ"
- `FIELD_0003` - технолог!E6: "оранжевым выделено то, что нужно ввести в ручную или выбрать из списка ИНЖЕНЕРАМ-КОНСТРУКТОРАМ"

**Implementation Status:** 4.7% implemented  
**Critical Gaps:** High number of formula fields requiring immediate attention

---

## GROUP 2: DENSITY_CALCULATIONS (3 fields)

**Purpose:** Density-related calculations for materials and products  
**Role Access:** Technologist, Engineer  
**Priority:** Critical - affects all mass and volume calculations

**Key Field Types:**

- Material density values
- Density calculation formulas
- Density-dependent parameters

**Representative Fields:**

- `FIELD_0006` - технолог!D13: Density calculation field
- `FIELD_0007` - технолог!D14: Related density parameter
- `FIELD_0026` - технолог!D\*: Additional density reference

**Implementation Status:** Partially implemented  
**Critical Gaps:** Core density formulas need verification

---

## GROUP 3: MATERIAL_SPECIFICATIONS (3 fields)

**Purpose:** Material type, grade, and specification definitions  
**Role Access:** Technologist  
**Priority:** High - defines base material properties

**Key Field Types:**

- Material type selections
- Grade specifications
- Material property definitions

**Implementation Status:** Partially implemented  
**Critical Gaps:** Material lookup tables need completion

---

## GROUP 4: DIMENSIONAL_CALCULATIONS (2 fields)

**Purpose:** Size, thickness, and dimensional parameter calculations  
**Role Access:** Technologist, Engineer  
**Priority:** Critical - affects all physical calculations

**Key Field Types:**

- Thickness arrays and calculations
- Dimensional parameter formulas
- Size-dependent calculations

**Implementation Status:** Needs implementation  
**Critical Gaps:** Thickness array logic missing

---

## GROUP 5: SUPPLY_PARAMETERS (1622 fields)

**Purpose:** Supply chain, procurement, and vendor-related data  
**Role Access:** Supply Manager, Director  
**Priority:** High - critical for cost accuracy

**Key Field Types:**

- Supplier information and selection
- Procurement parameters
- Vendor-specific data
- Supply chain logistics
- Material sourcing information

**Sub-Categories:**

- **Supplier Data:** Vendor information, contact details, capabilities
- **Procurement Terms:** Lead times, minimum orders, payment terms
- **Material Sourcing:** Raw material suppliers, specifications
- **Logistics:** Transportation, storage, handling requirements
- **Cost Elements:** Base costs, transportation costs, handling fees

**Representative Fields:**

- Supplier selection dropdowns
- Cost per unit fields
- Quantity calculations
- Lead time parameters
- Quality specifications

**Implementation Status:** Limited implementation  
**Critical Gaps:** Extensive supplier management system needed

---

## GROUP 6: COST_CALCULATIONS (38 fields)

**Purpose:** All cost-related calculations and pricing formulas  
**Role Access:** Supply Manager, Director  
**Priority:** Critical - core business logic

**Key Field Types:**

- Unit cost calculations
- Price formulas
- Cost aggregation
- Markup calculations
- Total cost summaries

**Representative Fields:**

- `FIELD_0126` - Cost calculation formula
- `FIELD_0141` - Price determination
- `FIELD_0152-0154` - Cost aggregation sequence
- Various formula fields with cost dependencies

**Implementation Status:** Partially implemented  
**Critical Gaps:** Complex cost formulas need completion

---

## GROUP 7: QUANTITY_CALCULATIONS (7 fields)

**Purpose:** Quantity calculations and material requirements  
**Role Access:** All roles  
**Priority:** High - affects all calculations

**Key Field Types:**

- Material quantity calculations
- Component quantity requirements
- Batch size calculations
- Usage rate formulas

**Implementation Status:** Needs implementation  
**Critical Gaps:** Quantity formula logic missing

---

## GROUP 8: RESULTS_DISPLAY (62 fields)

**Purpose:** Final results, summaries, and output values  
**Role Access:** All roles (read-only for most)  
**Priority:** Critical - final output to users

**Key Field Types:**

- Final cost summaries
- Result displays
- Output formatting
- Summary calculations
- Export values for Bitrix24

**Implementation Status:** Needs implementation  
**Critical Gaps:** Result aggregation and display logic missing

---

## FORMULA DEPENDENCY ANALYSIS

**Total Formulas:** 962  
**Complex Dependencies:** High interconnectedness between groups

**Key Dependency Chains:**

1. **Technical Parameters → Density → Material → Quantity → Cost → Results**
2. **Supply Parameters → Cost Calculations → Results**
3. **Dimensional → Technical → Quantity → Cost**

**Critical Formula Types:**

- **VLOOKUP formulas:** 200+ instances for data lookups
- **INDEX/MATCH combinations:** 150+ instances for dynamic lookups
- **Aggregation formulas:** SUM, AVERAGE for cost calculations
- **Conditional formulas:** IF statements for logic branching
- **Mathematical formulas:** Complex calculations with multiple dependencies

---

## IMPLEMENTATION PRIORITIES

### Phase 1: Critical Foundation (Priority: CRITICAL)

1. **Density Calculations** - Complete all 3 fields
2. **Core Technical Parameters** - Implement input fields and basic formulas
3. **Basic Cost Calculations** - Implement fundamental cost logic
4. **Results Display** - Basic output functionality

### Phase 2: Core Functionality (Priority: HIGH)

1. **Material Specifications** - Complete material system
2. **Dimensional Calculations** - Implement size/thickness logic
3. **Quantity Calculations** - Complete all 7 quantity fields
4. **Advanced Cost Formulas** - Complete complex cost calculations

### Phase 3: Supply Chain Integration (Priority: MEDIUM)

1. **Supply Parameters** - Implement supplier management
2. **Advanced Supply Features** - Complete all 1622 supply fields
3. **Integration Features** - Bitrix24 export and advanced workflows

---

## VALIDATION REQUIREMENTS

**Each implementation phase requires:**

1. **Formula Validation** - Verify Excel formulas match implementation
2. **Dependency Testing** - Ensure calculation chains work correctly
3. **Role Access Testing** - Verify proper role-based permissions
4. **Integration Testing** - Test cross-group dependencies
5. **Performance Testing** - Validate with realistic data volumes

---

## TECHNICAL NOTES

**Color Coding System:**

- **Yellow (FFFFFF00):** Technologist dropdown selections
- **Green (FF92D050):** Technologist manual input
- **Orange (FFFFC000):** Engineer input/selection
- **Other colors:** Various role-specific fields

**Formula Complexity:**

- Simple references: 400+ fields
- Lookup operations: 350+ fields
- Mathematical operations: 200+ fields
- Complex multi-step: 12+ fields

**Dependencies:**

- Average dependencies per field: 2.3
- Maximum dependencies: 8 (complex formula fields)
- Circular references: None detected
- Cross-sheet references: 400+ instances

---

## CONCLUSION

This field registry represents the complete functional scope of the LH Calculator. With 1795 total fields across 8 calculation groups, the implementation requires a systematic approach focusing on critical foundation elements first, followed by core functionality and finally advanced features.

The high number of supply parameters (1622 fields) indicates this is primarily a supply chain and cost management system with complex technical calculations as the foundation.
