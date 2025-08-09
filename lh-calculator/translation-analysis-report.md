# Translation Analysis Report

Generated: 2025-08-09T09:50:09.249Z

## Summary

- **Total used keys**: 1015
- **Unique used keys**: 755
- **Available keys**: 899
- **Missing keys**: 1
- **Unused keys**: 145
- **Duplicate usage**: 157

## ❌ Missing Translation Keys

The following keys are used in code but missing from translation files:

### `.`

Used in 4 location(s):

- **src/tools/translation-auto-fixer.ts:163** - `const parts = key.split('.');`
- **src/tools/translation-auto-fixer.ts:271** - `const parts = key.split('.');`
- **src/tools/translation-auto-fixer.ts:454** - `const parts = key.split('.');`
- **src/tools/translation-analyzer.ts:235** - `const parts = key.split('.');`

## 🗑️ Unused Translation Keys

The following keys exist in translation files but are not used:

- `app.subtitle`
- `navigation.dashboard`
- `navigation.calculations`
- `navigation.components`
- `navigation.flanges`
- `navigation.materials`
- `navigation.savedCalculations`
- `navigation.reports`
- `navigation.settings`
- `navigation.referenceData`
- `common.edit`
- `common.create`
- `common.search`
- `common.filter`
- `common.export`
- `common.import`
- `common.loading`
- `common.noData`
- `common.confirmDelete`
- `common.warning`
- ... and 125 more

## 🔄 Keys with Multiple Usage

### `EN` (2 usages)

- **src/tools/translation-runtime-detector.ts:312**
- **src/tools/translation-runtime-detector.ts:312**

### `RU` (2 usages)

- **src/tools/translation-runtime-detector.ts:312**
- **src/tools/translation-runtime-detector.ts:312**

### ` ` (2 usages)

- **src/tools/translation-runtime-detector.ts:343**
- **src/tools/translation-runtime-detector.ts:372**

### `.` (4 usages)

- **src/tools/translation-auto-fixer.ts:163**
- **src/tools/translation-auto-fixer.ts:271**
- **src/tools/translation-auto-fixer.ts:454**
- **src/tools/translation-analyzer.ts:235**

### `key` (6 usages)

- **src/tools/translation-analyzer.ts:57**
- **src/tools/translation-analyzer.ts:59**
- **src/tools/translation-analyzer.ts:59**
- **src/tools/translation-analyzer.ts:61**
- **src/tools/translation-analyzer.ts:61**
- **src/tools/translation-analyzer.ts:63**

### `AISI 316L` (2 usages)

- **src/stores/materialStore.ts:22**
- **src/lib/calculation-engine/engine.ts:33**

### `AISI 304` (2 usages)

- **src/stores/materialStore.ts:36**
- **src/lib/calculation-engine/engine.ts:39**

### `crm.deal.update` (2 usages)

- **src/services/bitrix24.service.ts:97**
- **src/services/bitrix24.service.ts:151**

### `common.success` (2 usages)

- **src/pages/SupplyParameters.tsx:55**
- **src/pages/CalculationPage.tsx:60**

### `common.error` (2 usages)

- **src/pages/SupplyParameters.tsx:61**
- **src/pages/CalculationPage.tsx:66**

### `common.info` (2 usages)

- **src/pages/SupplyParameters.tsx:71**
- **src/pages/CalculationPage.tsx:76**

### `common.reset` (3 usages)

- **src/pages/SupplyParameters.tsx:90**
- **src/pages/CalculationPage.tsx:126**
- **src/components/TechnicalInputFormSimple.tsx:1567**

### `common.save` (4 usages)

- **src/pages/SupplyParameters.tsx:99**
- **src/pages/CalculationPage.tsx:134**
- **src/components/SaveCalculationModal.tsx:148**
- **src/components/Bitrix24Export.tsx:286**

### `storage.loadCalculation` (2 usages)

- **src/pages/SavedCalculations.tsx:127**
- **src/pages/SavedCalculations.tsx:294**

### `common.delete` (3 usages)

- **src/pages/SavedCalculations.tsx:145**
- **src/pages/SavedCalculations.tsx:330**
- **src/pages/SavedCalculations.tsx:340**

### `storage.unknownError` (2 usages)

- **src/pages/SavedCalculations.tsx:153**
- **src/components/SaveCalculationModal.tsx:60**

### `storage.selectProject` (2 usages)

- **src/pages/SavedCalculations.tsx:211**
- **src/components/SaveCalculationModal.tsx:99**

### `common.cancel` (3 usages)

- **src/pages/SavedCalculations.tsx:337**
- **src/components/SaveCalculationModal.tsx:141**
- **src/components/Bitrix24Export.tsx:283**

### `projectDetails.sections.projectInfo` (2 usages)

- **src/pages/ProjectDetailsPage.tsx:32**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:15**

### `projectDetails.sections.documentation` (2 usages)

- **src/pages/ProjectDetailsPage.tsx:38**
- **src/components/ProjectDetails/DocumentationSection.tsx:15**

### `projectDetails.sections.logistics` (2 usages)

- **src/pages/ProjectDetailsPage.tsx:44**
- **src/components/ProjectDetails/LogisticsSection.tsx:40**

### `projectDetails.sections.spareParts` (2 usages)

- **src/pages/ProjectDetailsPage.tsx:50**
- **src/components/ProjectDetails/SparePartsSection.tsx:15**

### `projectDetails.sections.financialTerms` (2 usages)

- **src/pages/ProjectDetailsPage.tsx:56**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:33**

### `results.calculationError` (2 usages)

- **src/pages/Dashboard.tsx:75**
- **src/components/CalculationResults.tsx:47**

### `storage.saveCalculation` (2 usages)

- **src/pages/Dashboard.tsx:94**
- **src/components/SaveCalculationModal.tsx:83**

### `form.validation.pressurePositive` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:122**
- **src/components/TechnicalInputFormSimple.tsx:124**

### `form.validation.pressureMax` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:123**
- **src/components/TechnicalInputFormSimple.tsx:125**

### `form.validation.temperatureMin` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:127**
- **src/components/TechnicalInputFormSimple.tsx:129**

### `form.validation.temperatureMax` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:128**
- **src/components/TechnicalInputFormSimple.tsx:130**

### `common.placeholder.selectType` (3 usages)

- **src/components/TechnicalInputFormSimple.tsx:323**
- **src/components/TechnicalInputFormSimple.tsx:585**
- **src/components/TechnicalInputFormSimple.tsx:627**

### `form.placeholders.pressure` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:400**
- **src/components/TechnicalInputFormSimple.tsx:419**

### `common.placeholder.selectMaterial` (3 usages)

- **src/components/TechnicalInputFormSimple.tsx:525**
- **src/components/TechnicalInputFormSimple.tsx:565**
- **src/components/TechnicalInputFormSimple.tsx:607**

### `form.fields.pressure` (4 usages)

- **src/components/TechnicalInputFormSimple.tsx:718**
- **src/components/TechnicalInputFormSimple.tsx:754**
- **src/components/TechnicalInputFormSimple.tsx:795**
- **src/components/TechnicalInputFormSimple.tsx:831**

### `common.placeholder.select` (8 usages)

- **src/components/TechnicalInputFormSimple.tsx:725**
- **src/components/TechnicalInputFormSimple.tsx:743**
- **src/components/TechnicalInputFormSimple.tsx:761**
- **src/components/TechnicalInputFormSimple.tsx:779**
- **src/components/TechnicalInputFormSimple.tsx:802**
- **src/components/TechnicalInputFormSimple.tsx:820**
- **src/components/TechnicalInputFormSimple.tsx:838**
- **src/components/TechnicalInputFormSimple.tsx:856**

### `form.fields.diameter` (4 usages)

- **src/components/TechnicalInputFormSimple.tsx:736**
- **src/components/TechnicalInputFormSimple.tsx:772**
- **src/components/TechnicalInputFormSimple.tsx:813**
- **src/components/TechnicalInputFormSimple.tsx:849**

### `form.sections.projectInfo` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1422**
- **src/components/ProjectInfoSection.tsx:15**

### `form.sections.extendedSpecs` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1436**
- **src/components/ExtendedSpecsSection.tsx:30**

### `form.sections.processParameters` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1450**
- **src/components/ProcessParametersSection.tsx:15**

### `form.sections.fasteners` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1464**
- **src/components/FastenerSection.tsx:45**

### `form.sections.manufacturing` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1478**
- **src/components/ManufacturingSection.tsx:42**

### `form.sections.logistics` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1492**
- **src/components/LogisticsSection.tsx:47**

### `form.sections.documentation` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1506**
- **src/components/DocumentationSection.tsx:15**

### `form.sections.spareParts` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1520**
- **src/components/SparePartsSection.tsx:15**

### `form.sections.financial` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1534**
- **src/components/FinancialSection.tsx:31**

### `form.sections.additionalCosts` (2 usages)

- **src/components/TechnicalInputFormSimple.tsx:1548**
- **src/components/AdditionalCostsSection.tsx:24**

### `supply.readOnly` (3 usages)

- **src/components/SupplyInputForm.tsx:112**
- **src/components/SupplyInputForm.tsx:248**
- **src/components/SupplyInputForm.tsx:312**

### `supply.units.coefficient` (6 usages)

- **src/components/SupplyInputForm.tsx:331**
- **src/components/SupplyInputForm.tsx:350**
- **src/components/SupplyInputForm.tsx:369**
- **src/components/SupplyInputForm.tsx:388**
- **src/components/SupplyInputForm.tsx:407**
- **src/components/SupplyInputForm.tsx:426**

### `form.fields.sparePlates` (2 usages)

- **src/components/SparePartsSection.tsx:21**
- **src/components/ProjectDetails/SparePartsSection.tsx:21**

### `form.placeholders.enterQuantity` (7 usages)

- **src/components/SparePartsSection.tsx:23**
- **src/components/SparePartsSection.tsx:36**
- **src/components/SparePartsSection.tsx:49**
- **src/components/SparePartsSection.tsx:62**
- **src/components/FastenerSection.tsx:82**
- **src/components/FastenerSection.tsx:128**
- **src/components/FastenerSection.tsx:163**

### `sparePlates` (2 usages)

- **src/components/SparePartsSection.tsx:25**
- **src/components/ProjectDetails/SparePartsSection.tsx:24**

### `form.fields.spareGaskets` (2 usages)

- **src/components/SparePartsSection.tsx:34**
- **src/components/ProjectDetails/SparePartsSection.tsx:33**

### `spareGaskets` (2 usages)

- **src/components/SparePartsSection.tsx:38**
- **src/components/ProjectDetails/SparePartsSection.tsx:36**

### `form.fields.spareBolts` (2 usages)

- **src/components/SparePartsSection.tsx:47**
- **src/components/ProjectDetails/SparePartsSection.tsx:45**

### `spareBolts` (2 usages)

- **src/components/SparePartsSection.tsx:51**
- **src/components/ProjectDetails/SparePartsSection.tsx:48**

### `form.fields.spareNuts` (2 usages)

- **src/components/SparePartsSection.tsx:60**
- **src/components/ProjectDetails/SparePartsSection.tsx:57**

### `spareNuts` (2 usages)

- **src/components/SparePartsSection.tsx:64**
- **src/components/ProjectDetails/SparePartsSection.tsx:60**

### `form.fields.spareKit` (2 usages)

- **src/components/SparePartsSection.tsx:73**
- **src/components/ProjectDetails/SparePartsSection.tsx:69**

### `form.descriptions.spareKit` (2 usages)

- **src/components/SparePartsSection.tsx:74**
- **src/components/ProjectDetails/SparePartsSection.tsx:70**

### `spareKit` (2 usages)

- **src/components/SparePartsSection.tsx:76**
- **src/components/ProjectDetails/SparePartsSection.tsx:72**

### `form.fields.projectName` (2 usages)

- **src/components/ProjectInfoSection.tsx:21**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:21**

### `form.placeholders.projectName` (2 usages)

- **src/components/ProjectInfoSection.tsx:22**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:22**

### `projectName` (2 usages)

- **src/components/ProjectInfoSection.tsx:24**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:24**

### `form.fields.orderNumber` (2 usages)

- **src/components/ProjectInfoSection.tsx:30**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:30**

### `form.placeholders.orderNumber` (2 usages)

- **src/components/ProjectInfoSection.tsx:31**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:31**

### `orderNumber` (2 usages)

- **src/components/ProjectInfoSection.tsx:33**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:33**

### `form.fields.clientName` (2 usages)

- **src/components/ProjectInfoSection.tsx:39**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:40**

### `form.placeholders.clientName` (2 usages)

- **src/components/ProjectInfoSection.tsx:40**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:41**

### `clientName` (2 usages)

- **src/components/ProjectInfoSection.tsx:42**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:43**

### `form.fields.deliveryDate` (2 usages)

- **src/components/ProjectInfoSection.tsx:50**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:51**

### `deliveryDate` (2 usages)

- **src/components/ProjectInfoSection.tsx:52**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:53**

### `form.fields.projectManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:59**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:60**

### `form.placeholders.projectManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:60**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:61**

### `projectManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:62**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:63**

### `form.fields.salesManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:69**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:70**

### `form.placeholders.salesManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:70**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:71**

### `salesManager` (2 usages)

- **src/components/ProjectInfoSection.tsx:72**
- **src/components/ProjectDetails/ProjectInfoSection.tsx:73**

### `form.placeholders.enterPressure` (4 usages)

- **src/components/ProcessParametersSection.tsx:27**
- **src/components/ProcessParametersSection.tsx:66**
- **src/components/ProcessParametersSection.tsx:87**
- **src/components/ProcessParametersSection.tsx:126**

### `form.placeholders.enterTemperature` (2 usages)

- **src/components/ProcessParametersSection.tsx:40**
- **src/components/ProcessParametersSection.tsx:100**

### `form.placeholders.enterFlowRate` (2 usages)

- **src/components/ProcessParametersSection.tsx:53**
- **src/components/ProcessParametersSection.tsx:113**

### `form.fields.qualityControl` (2 usages)

- **src/components/ManufacturingSection.tsx:102**
- **src/components/ProjectDetails/DocumentationSection.tsx:84**

### `qualityControl` (2 usages)

- **src/components/ManufacturingSection.tsx:105**
- **src/components/ProjectDetails/DocumentationSection.tsx:87**

### `form.fields.certificationRequired` (2 usages)

- **src/components/ManufacturingSection.tsx:111**
- **src/components/ProjectDetails/DocumentationSection.tsx:66**

### `certificationRequired` (2 usages)

- **src/components/ManufacturingSection.tsx:114**
- **src/components/ProjectDetails/DocumentationSection.tsx:68**

### `form.fields.inspectionLevel` (2 usages)

- **src/components/ManufacturingSection.tsx:120**
- **src/components/ProjectDetails/DocumentationSection.tsx:74**

### `inspectionLevel` (2 usages)

- **src/components/ManufacturingSection.tsx:124**
- **src/components/ProjectDetails/DocumentationSection.tsx:77**

### `form.fields.packagingType` (2 usages)

- **src/components/LogisticsSection.tsx:53**
- **src/components/ProjectDetails/LogisticsSection.tsx:46**

### `packagingType` (2 usages)

- **src/components/LogisticsSection.tsx:57**
- **src/components/ProjectDetails/LogisticsSection.tsx:50**

### `form.fields.packagingMaterial` (2 usages)

- **src/components/LogisticsSection.tsx:64**
- **src/components/ProjectDetails/LogisticsSection.tsx:57**

### `packagingMaterial` (2 usages)

- **src/components/LogisticsSection.tsx:68**
- **src/components/ProjectDetails/LogisticsSection.tsx:60**

### `form.fields.crateRequired` (2 usages)

- **src/components/LogisticsSection.tsx:75**
- **src/components/ProjectDetails/LogisticsSection.tsx:66**

### `crateRequired` (2 usages)

- **src/components/LogisticsSection.tsx:78**
- **src/components/ProjectDetails/LogisticsSection.tsx:68**

### `form.fields.shippingMethod` (2 usages)

- **src/components/LogisticsSection.tsx:84**
- **src/components/ProjectDetails/LogisticsSection.tsx:90**

### `shippingMethod` (2 usages)

- **src/components/LogisticsSection.tsx:88**
- **src/components/ProjectDetails/LogisticsSection.tsx:94**

### `form.fields.deliveryTerms` (2 usages)

- **src/components/LogisticsSection.tsx:95**
- **src/components/ProjectDetails/LogisticsSection.tsx:101**

### `deliveryTerms` (2 usages)

- **src/components/LogisticsSection.tsx:99**
- **src/components/ProjectDetails/LogisticsSection.tsx:105**

### `form.fields.insuranceRequired` (2 usages)

- **src/components/LogisticsSection.tsx:106**
- **src/components/ProjectDetails/LogisticsSection.tsx:74**

### `insuranceRequired` (2 usages)

- **src/components/LogisticsSection.tsx:109**
- **src/components/ProjectDetails/LogisticsSection.tsx:76**

### `form.fields.customsClearance` (2 usages)

- **src/components/LogisticsSection.tsx:115**
- **src/components/ProjectDetails/LogisticsSection.tsx:82**

### `customsClearance` (2 usages)

- **src/components/LogisticsSection.tsx:118**
- **src/components/ProjectDetails/LogisticsSection.tsx:84**

### `form.fields.paymentTerms` (2 usages)

- **src/components/FinancialSection.tsx:37**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:39**

### `paymentTerms` (2 usages)

- **src/components/FinancialSection.tsx:41**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:43**

### `form.placeholders.enterPercent` (2 usages)

- **src/components/FinancialSection.tsx:50**
- **src/components/FinancialSection.tsx:64**

### `form.fields.taxRate` (2 usages)

- **src/components/FinancialSection.tsx:62**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:74**

### `taxRate` (2 usages)

- **src/components/FinancialSection.tsx:66**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:77**

### `form.fields.currencyType` (2 usages)

- **src/components/FinancialSection.tsx:76**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:50**

### `currencyType` (2 usages)

- **src/components/FinancialSection.tsx:80**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:54**

### `form.fields.exchangeRate` (2 usages)

- **src/components/FinancialSection.tsx:86**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:61**

### `exchangeRate` (2 usages)

- **src/components/FinancialSection.tsx:90**
- **src/components/ProjectDetails/FinancialTermsSection.tsx:64**

### `materials.steel3` (2 usages)

- **src/components/FastenerSection.tsx:23**
- **src/components/ExtendedSpecsSection.tsx:12**

### `materials.steel20` (2 usages)

- **src/components/FastenerSection.tsx:24**
- **src/components/ExtendedSpecsSection.tsx:13**

### `materials.steel09G2S` (2 usages)

- **src/components/FastenerSection.tsx:25**
- **src/components/ExtendedSpecsSection.tsx:14**

### `form.placeholders.selectMaterial` (3 usages)

- **src/components/FastenerSection.tsx:71**
- **src/components/FastenerSection.tsx:117**
- **src/components/ExtendedSpecsSection.tsx:91**

### `form.placeholders.enterValue` (4 usages)

- **src/components/ExtendedSpecsSection.tsx:55**
- **src/components/ExtendedSpecsSection.tsx:67**
- **src/components/ExtendedSpecsSection.tsx:79**
- **src/components/ExtendedSpecsSection.tsx:102**

### `form.fields.drawingsIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:21**
- **src/components/ProjectDetails/DocumentationSection.tsx:21**

### `drawingsIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:24**
- **src/components/ProjectDetails/DocumentationSection.tsx:23**

### `form.fields.manualsIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:30**
- **src/components/ProjectDetails/DocumentationSection.tsx:29**

### `manualsIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:33**
- **src/components/ProjectDetails/DocumentationSection.tsx:31**

### `form.fields.certificatesIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:39**
- **src/components/ProjectDetails/DocumentationSection.tsx:37**

### `certificatesIncluded` (2 usages)

- **src/components/DocumentationSection.tsx:42**
- **src/components/ProjectDetails/DocumentationSection.tsx:39**

### `form.fields.warrantyPeriod` (2 usages)

- **src/components/DocumentationSection.tsx:48**
- **src/components/ProjectDetails/DocumentationSection.tsx:45**

### `warrantyPeriod` (2 usages)

- **src/components/DocumentationSection.tsx:52**
- **src/components/ProjectDetails/DocumentationSection.tsx:48**

### `form.fields.serviceContract` (2 usages)

- **src/components/DocumentationSection.tsx:61**
- **src/components/ProjectDetails/DocumentationSection.tsx:58**

### `serviceContract` (2 usages)

- **src/components/DocumentationSection.tsx:64**
- **src/components/ProjectDetails/DocumentationSection.tsx:60**

### `ru-RU` (3 usages)

- **src/components/CalculationResults.tsx:24**
- **src/components/CalculationResults.tsx:33**
- **src/components/AdditionalCostsSection.tsx:12**

### `supply.units.bar` (2 usages)

- **src/components/CalculationResults.tsx:105**
- **src/components/CalculationResults.tsx:114**

### `form.placeholders.materialName` (3 usages)

- **src/components/AdditionalCostsSection.tsx:37**
- **src/components/AdditionalCostsSection.tsx:57**
- **src/components/AdditionalCostsSection.tsx:77**

### `form.placeholders.enterCost` (9 usages)

- **src/components/AdditionalCostsSection.tsx:45**
- **src/components/AdditionalCostsSection.tsx:65**
- **src/components/AdditionalCostsSection.tsx:85**
- **src/components/AdditionalCostsSection.tsx:115**
- **src/components/AdditionalCostsSection.tsx:135**
- **src/components/AdditionalCostsSection.tsx:155**
- **src/components/AdditionalCostsSection.tsx:185**
- **src/components/AdditionalCostsSection.tsx:205**
- **src/components/AdditionalCostsSection.tsx:225**

### `form.placeholders.laborDescription` (3 usages)

- **src/components/AdditionalCostsSection.tsx:107**
- **src/components/AdditionalCostsSection.tsx:127**
- **src/components/AdditionalCostsSection.tsx:147**

### `form.placeholders.serviceDescription` (3 usages)

- **src/components/AdditionalCostsSection.tsx:177**
- **src/components/AdditionalCostsSection.tsx:197**
- **src/components/AdditionalCostsSection.tsx:217**

### `I_BaseDimension` (13 usages)

- **src/lib/calculation-engine/formula-library.ts:81**
- **src/lib/calculation-engine/formula-library.ts:104**
- **src/lib/calculation-engine/formula-library.ts:130**
- **src/lib/calculation-engine/formula-library.ts:141**
- **src/lib/calculation-engine/formula-library.ts:215**
- **src/lib/calculation-engine/formula-library-complete.ts:163**
- **src/lib/calculation-engine/formula-library-complete.ts:187**
- **src/lib/calculation-engine/formula-library-complete.ts:211**
- **src/lib/calculation-engine/formula-library-complete.ts:220**
- **src/lib/calculation-engine/formula-library-complete.ts:430**
- **src/lib/calculation-engine/formula-library-complete.ts:441**
- **src/lib/calculation-engine/formula-library-complete.ts:1637**
- **src/lib/calculation-engine/formula-library-complete.ts:1638**

### `J_DimensionPlus20` (6 usages)

- **src/lib/calculation-engine/formula-library.ts:94**
- **src/lib/calculation-engine/formula-library.ts:164**
- **src/lib/calculation-engine/formula-library.ts:220**
- **src/lib/calculation-engine/formula-library-complete.ts:176**
- **src/lib/calculation-engine/formula-library-complete.ts:386**
- **src/lib/calculation-engine/engine-v2.ts:347**

### `K_ColumnHeightBase` (4 usages)

- **src/lib/calculation-engine/formula-library.ts:95**
- **src/lib/calculation-engine/formula-library.ts:221**
- **src/lib/calculation-engine/formula-library-complete.ts:177**
- **src/lib/calculation-engine/engine-v2.ts:346**

### `M_DimensionPlus10` (4 usages)

- **src/lib/calculation-engine/formula-library.ts:116**
- **src/lib/calculation-engine/formula-library.ts:223**
- **src/lib/calculation-engine/formula-library-complete.ts:198**
- **src/lib/calculation-engine/formula-library-complete.ts:392**

### `N_ColumnHeightRepeat` (4 usages)

- **src/lib/calculation-engine/formula-library.ts:117**
- **src/lib/calculation-engine/formula-library.ts:224**
- **src/lib/calculation-engine/formula-library-complete.ts:199**
- **src/lib/calculation-engine/formula-library-complete.ts:393**

### `P_WidthCalculation` (5 usages)

- **src/lib/calculation-engine/formula-library.ts:149**
- **src/lib/calculation-engine/formula-library.ts:226**
- **src/lib/calculation-engine/formula-library-complete.ts:227**
- **src/lib/calculation-engine/formula-library-complete.ts:398**
- **src/lib/calculation-engine/engine-v2.ts:344**

### `Q_HeightCalculation` (5 usages)

- **src/lib/calculation-engine/formula-library.ts:150**
- **src/lib/calculation-engine/formula-library.ts:227**
- **src/lib/calculation-engine/formula-library-complete.ts:228**
- **src/lib/calculation-engine/formula-library-complete.ts:399**
- **src/lib/calculation-engine/engine-v2.ts:345**

### `L_ComponentVolume` (2 usages)

- **src/lib/calculation-engine/formula-library.ts:222**
- **src/lib/calculation-engine/engine-v2.ts:101**

### `O_SecondaryVolume` (2 usages)

- **src/lib/calculation-engine/formula-library.ts:225**
- **src/lib/calculation-engine/engine-v2.ts:102**

### `R_AreaCalculation` (2 usages)

- **src/lib/calculation-engine/formula-library.ts:228**
- **src/lib/calculation-engine/engine-v2.ts:103**

### `BA_MaterialTotal` (3 usages)

- **src/lib/calculation-engine/formula-library.ts:233**
- **src/lib/calculation-engine/formula-library-complete.ts:555**
- **src/lib/calculation-engine/engine-v2.ts:104**

### `BB_CostComponents` (2 usages)

- **src/lib/calculation-engine/formula-library.ts:234**
- **src/lib/calculation-engine/engine-v2.ts:319**

### `S_AdditionalDimension` (14 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:249**
- **src/lib/calculation-engine/formula-library-complete.ts:268**
- **src/lib/calculation-engine/formula-library-complete.ts:276**
- **src/lib/calculation-engine/formula-library-complete.ts:285**
- **src/lib/calculation-engine/formula-library-complete.ts:292**
- **src/lib/calculation-engine/formula-library-complete.ts:300**
- **src/lib/calculation-engine/formula-library-complete.ts:318**
- **src/lib/calculation-engine/formula-library-complete.ts:325**
- **src/lib/calculation-engine/formula-library-complete.ts:341**
- **src/lib/calculation-engine/formula-library-complete.ts:351**
- **src/lib/calculation-engine/formula-library-complete.ts:371**
- **src/lib/calculation-engine/formula-library-complete.ts:404**
- **src/lib/calculation-engine/formula-library-complete.ts:411**
- **src/lib/calculation-engine/formula-library-complete.ts:417**

### `AA_Perimeter` (2 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:310**
- **src/lib/calculation-engine/formula-library-complete.ts:410**

### `AD_Perimeter2` (2 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:334**
- **src/lib/calculation-engine/formula-library-complete.ts:416**

### `AF_ComplexDimension` (3 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:357**
- **src/lib/calculation-engine/formula-library-complete.ts:473**
- **src/lib/calculation-engine/formula-library-complete.ts:489**

### `AG_WidthComplex` (3 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:358**
- **src/lib/calculation-engine/formula-library-complete.ts:474**
- **src/lib/calculation-engine/formula-library-complete.ts:490**

### `AI_ComplexDimension2` (3 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:377**
- **src/lib/calculation-engine/formula-library-complete.ts:481**
- **src/lib/calculation-engine/formula-library-complete.ts:496**

### `AJ_HeightComplex` (3 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:378**
- **src/lib/calculation-engine/formula-library-complete.ts:482**
- **src/lib/calculation-engine/formula-library-complete.ts:497**

### `/` (4 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:427**
- **src/lib/calculation-engine/formula-library-complete.ts:438**
- **src/lib/calculation-engine/formula-library-complete.ts:449**
- **src/lib/calculation-engine/formula-library-complete.ts:459**

### `AZ_ComplexCalc6` (2 usages)

- **src/lib/calculation-engine/formula-library-complete.ts:483**
- **src/lib/calculation-engine/formula-library-complete.ts:554**

### `coverWidth` (4 usages)

- **src/lib/calculation-engine/engine.ts:144**
- **src/lib/calculation-engine/engine.ts:178**
- **src/lib/calculation-engine/engine.ts:205**
- **src/lib/calculation-engine/engine-v2.ts:344**

### `coverHeight` (4 usages)

- **src/lib/calculation-engine/engine.ts:145**
- **src/lib/calculation-engine/engine.ts:179**
- **src/lib/calculation-engine/engine.ts:205**
- **src/lib/calculation-engine/engine-v2.ts:345**

### `columnHeight` (4 usages)

- **src/lib/calculation-engine/engine.ts:149**
- **src/lib/calculation-engine/engine.ts:188**
- **src/lib/calculation-engine/engine.ts:206**
- **src/lib/calculation-engine/engine-v2.ts:346**

### `panelAWidth` (2 usages)

- **src/lib/calculation-engine/engine.ts:154**
- **src/lib/calculation-engine/engine.ts:207**

### `panelBWidth` (2 usages)

- **src/lib/calculation-engine/engine.ts:155**
- **src/lib/calculation-engine/engine.ts:208**

### `plateMass` (3 usages)

- **src/lib/calculation-engine/engine.ts:184**
- **src/lib/calculation-engine/engine.ts:212**
- **src/lib/calculation-engine/engine-v2.ts:394**

### `bodyMass` (3 usages)

- **src/lib/calculation-engine/engine.ts:190**
- **src/lib/calculation-engine/engine.ts:212**
- **src/lib/calculation-engine/engine-v2.ts:398**

