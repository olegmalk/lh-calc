# LibreOffice Formula Recalculation Research Report

## Executive Summary

This report provides comprehensive research on reliable methods for forcing formula recalculation in LibreOffice when processing Excel files programmatically. The research covers command-line options, Python UNO API methods, format conversion strategies, and XLSX-specific properties.

## Key Findings

### 1. Command-Line Options for LibreOffice (`soffice --convert-to`)

**Current Status**: Limited direct support for formula recalculation
- Basic `soffice --convert-to` command has no built-in flag for forcing recalculation
- Simple formulas are usually recalculated automatically during conversion
- External references and complex formulas may not recalculate properly
- No documented command-line parameters specifically for recalculation control

**Recommendation**: Command-line conversion alone is insufficient for reliable formula recalculation.

### 2. Python UNO API Methods for Recalculation

**Most Reliable Approach**: UNO API with proper version

**Working Solution Pattern**:
```python
import uno
from com.sun.star.beans import PropertyValue

# Connect to headless LibreOffice
local = uno.getComponentContext()
resolver = local.ServiceManager.createInstanceWithContext(
    "com.sun.star.bridge.UnoUrlResolver", local)
context = resolver.resolve(
    "uno:socket,host=localhost,port=2002;urp;StarOffice.ServiceManager")
remoteContext = context.getPropertyValue("DefaultContext")
desktop = context.createInstanceWithContext(
    "com.sun.star.frame.Desktop", remoteContext)

# Load document
document = desktop.loadComponentFromURL(inputFile, "_blank", 0, ())

# Force recalculation
document.calculateAll()

# Save as XLSX
pv_filtername = PropertyValue()
pv_filtername.Name = "FilterName"
pv_filtername.Value = "Calc MS Excel 2007 XML"
document.storeAsURL(outputFile, (pv_filtername,))

# Cleanup
document.dispose()
```

**Critical Requirements**:
- LibreOffice 6.2+ (versions 5.x had known issues with calculateAll() not saving results)
- Proper process management (may need to kill hanging soffice processes)
- Start LibreOffice headless: `soffice --accept="socket,host=localhost,port=2002;urp;" --headless`

**Known Issues**:
- Python may freeze after UNO operations (solution: kill LibreOffice process)
- Direct soffice binary recommended over wrapper scripts

### 3. Format Conversion Strategy (XLSX → ODS → XLSX)

**Approach**: Convert Excel files to LibreOffice native format, then back to Excel

**Current Implementation Analysis**:
```typescript
// From existing libreoffice-processor.ts
const convertToOdsCmd = `timeout 10 soffice --headless --convert-to ods --outdir "${path.dirname(inputPath)}" "${inputPath}"`;
const convertToXlsxCmd = `timeout 10 soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${path.dirname(outputPath)}" "${tempOdsPath}"`;
```

**Effectiveness**: Moderate success, but not guaranteed
- LibreOffice native ODS format may better preserve and recalculate formulas
- Double conversion adds processing time and potential data loss
- Format-specific features may be lost in translation

### 4. XLSX-Specific Properties for Recalculation

**fullCalcOnLoad Attribute**:
- Located in `xl/workbook.xml` within XLSX files
- XML structure: `<calcPr calcId="999999" calcMode="auto" fullCalcOnLoad="1" calcCompleted="0"/>`
- Tells Excel and compatible applications to recalculate all formulas on open

**ExcelJS Implementation**:
```javascript
workbook.calcProperties = {
    fullCalcOnLoad: true
};
```

**Compatibility**:
- ✅ Excel (reliably respects this flag)
- ❌ LibreOffice (inconsistent behavior, may ignore the flag)
- ✅ Google Sheets, OpenOffice (generally compatible)

**Alternative XLSX Strategies**:
1. Set formula cell `<v>` values to 0 and enable fullCalcOnLoad
2. Omit `<v>` elements entirely to force recalculation
3. Set calcMode to "automatic" in workbook properties

### 5. LibreOffice Configuration Options

**System-Level Settings**:
- Tools → Options → Formula → LibreOffice Calc
- "Recalculation on file load" settings:
  - Excel 2007 and newer: Set to "Always recalculate"
  - ODF Spreadsheet: Set to "Always recalculate"

**Programmatic Recalculation Commands**:
- `F9`: Recalculate selected formulas
- `Shift+Ctrl+F9`: Recalculate all formulas including non-volatile functions
- "Recalculate Hard": Forces recalculation of all formula cells

## Recommended Implementation Strategy

### Primary Method: Enhanced UNO API Approach

1. **Prerequisites**:
   - LibreOffice 7.4+ (confirmed working version)
   - Python UNO bridge properly configured
   - Dedicated LibreOffice instance for headless operations

2. **Implementation Steps**:
   ```python
   # 1. Start LibreOffice headless with UNO bridge
   # 2. Connect via UNO API
   # 3. Load Excel file
   # 4. Call document.calculateAll()
   # 5. Verify calculation completion
   # 6. Save with proper XLSX filter
   # 7. Clean up processes
   ```

3. **Error Handling**:
   - Timeout protection (10-15 seconds per operation)
   - Process cleanup on failure
   - Fallback to alternative methods

### Secondary Method: ExcelJS with fullCalcOnLoad

1. **For Excel-Compatible Applications**:
   ```javascript
   workbook.calcProperties = {
       fullCalcOnLoad: true,
       calcMode: 'auto'
   };
   ```

2. **Set Formula Results to Undefined**:
   ```javascript
   // Force Excel recalculation
   formulaCell.result = undefined;
   ```

### Fallback Method: Hybrid Approach

1. Use ExcelJS to set input values and configure recalculation properties
2. Apply UNO API for forced recalculation if needed
3. Validate results and retry with different methods if necessary

## Testing and Validation

### Verification Steps

1. **Pre-Recalculation Snapshot**: Capture formula cell values before processing
2. **Post-Recalculation Validation**: Verify formula results have changed appropriately
3. **Cross-Platform Testing**: Test results in Excel, LibreOffice, and Google Sheets
4. **Performance Monitoring**: Track processing times for different methods

### Test Cases

1. Simple arithmetic formulas
2. Cross-sheet references
3. Complex nested functions
4. Array formulas
5. Volatile functions (NOW(), RAND(), etc.)
6. External data references

## Current Codebase Analysis

### Existing Implementation Issues

1. **LibreOffice Processor** (`libreoffice-processor.ts`):
   - Uses format conversion approach (XLSX → ODS → XLSX)
   - Limited error handling for recalculation failures
   - No verification that formulas actually recalculated

2. **Excel Processor** (`excel-processor.ts`):
   - Relies on ExcelJS library only
   - Sets `fullCalcOnLoad: true` but no fallback for LibreOffice compatibility
   - No UNO API integration

### Recommended Improvements

1. **Implement UNO API Integration**:
   - Add Python UNO bridge functionality
   - Create robust process management
   - Add recalculation verification

2. **Enhanced Error Detection**:
   - Detect when formulas haven't recalculated (all zeros, unchanged values)
   - Implement multiple recalculation strategies
   - Provide detailed logging for troubleshooting

3. **Cross-Platform Compatibility**:
   - Test and optimize for different LibreOffice versions
   - Implement version-specific workarounds
   - Graceful degradation for unsupported features

## Conclusion

The most reliable approach for forcing formula recalculation in LibreOffice when processing Excel files is a **multi-layered strategy**:

1. **Primary**: UNO API with `calculateAll()` (LibreOffice 6.2+)
2. **Secondary**: ExcelJS with `fullCalcOnLoad` properties
3. **Fallback**: Format conversion with validation

**Critical Success Factors**:
- Use recent LibreOffice versions (7.4+)
- Implement proper process lifecycle management
- Include recalculation verification steps
- Provide fallback mechanisms for edge cases

**Avoid**:
- Relying solely on command-line conversion
- Assuming fullCalcOnLoad works universally
- Using outdated LibreOffice versions without testing

This research provides a foundation for implementing robust, reliable formula recalculation in the existing codebase.