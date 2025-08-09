# Translation Analysis Report

Generated: 2025-08-09T08:37:03.984Z

## Summary

- **Total used keys**: 1015
- **Unique used keys**: 755
- **Available keys**: 609
- **Missing keys**: 283
- **Unused keys**: 137
- **Duplicate usage**: 157

## ❌ Missing Translation Keys

The following keys are used in code but missing from translation files:

### `calculation_performed`

Used in 1 location(s):

- **src/utils/monitoring.ts:196** - `this.trackEvent('calculation_performed', {`

### `data_exported`

Used in 1 location(s):

- **src/utils/monitoring.ts:204** - `this.trackEvent('data_exported', {`

### `EN`

Used in 2 location(s):

- **src/tools/translation-runtime-detector.ts:311** - `const langButton = await page.$('button:has-text("EN"), button:has-text("RU"), [aria-label*="language"]');`
- **src/tools/translation-runtime-detector.ts:311** - `const langButton = await page.$('button:has-text("EN"), button:has-text("RU"), [aria-label*="language"]');`

### `RU`

Used in 2 location(s):

- **src/tools/translation-runtime-detector.ts:311** - `const langButton = await page.$('button:has-text("EN"), button:has-text("RU"), [aria-label*="language"]');`
- **src/tools/translation-runtime-detector.ts:311** - `const langButton = await page.$('button:has-text("EN"), button:has-text("RU"), [aria-label*="language"]');`

### ` `

Used in 2 location(s):

- **src/tools/translation-runtime-detector.ts:342** - `const classes = el.className.split(' ').filter(c => c && !c.startsWith('mantine-'));`
- **src/tools/translation-runtime-detector.ts:371** - `return parent.tagName.toLowerCase() + (parent.className ? `.${parent.className.split(' ')[0]}` : '');`

### `.`

Used in 4 location(s):

- **src/tools/translation-auto-fixer.ts:163** - `const parts = key.split('.');`
- **src/tools/translation-auto-fixer.ts:271** - `const parts = key.split('.');`
- **src/tools/translation-auto-fixer.ts:454** - `const parts = key.split('.');`
- **src/tools/translation-analyzer.ts:235** - `const parts = key.split('.');`

### `\n`

Used in 1 location(s):

- **src/tools/translation-analyzer.ts:53** - `const lines = content.split('\n');`

### `key`

Used in 6 location(s):

- **src/tools/translation-analyzer.ts:57** - `// t('key')`
- **src/tools/translation-analyzer.ts:59** - `// t("key")`
- **src/tools/translation-analyzer.ts:59** - `// t("key")`
- **src/tools/translation-analyzer.ts:61** - `// t(`key`)`
- **src/tools/translation-analyzer.ts:61** - `// t(`key`)`
- **src/tools/translation-analyzer.ts:63** - `// t('key', options)`

### `AISI 316L`

Used in 2 location(s):

- **src/stores/materialStore.ts:22** - `materials.set('AISI 316L', {`
- **src/lib/calculation-engine/engine.ts:33** - `this.context.materials.set('AISI 316L', {`

### `AISI 304`

Used in 2 location(s):

- **src/stores/materialStore.ts:36** - `materials.set('AISI 304', {`
- **src/lib/calculation-engine/engine.ts:39** - `this.context.materials.set('AISI 304', {`

### `Ст3`

Used in 1 location(s):

- **src/stores/materialStore.ts:50** - `materials.set('Ст3', {`

### `Ст20`

Used in 1 location(s):

- **src/stores/materialStore.ts:56** - `materials.set('Ст20', {`

### `09Г2С`

Used in 1 location(s):

- **src/stores/materialStore.ts:62** - `materials.set('09Г2С', {`

### `12Х18Н10Т`

Used in 1 location(s):

- **src/stores/materialStore.ts:68** - `materials.set('12Х18Н10Т', {`

### `app.info`

Used in 1 location(s):

- **src/services/bitrix24.service.ts:61** - `const response = await this.makeRequest('app.info');`

### `crm.deal.add`

Used in 1 location(s):

- **src/services/bitrix24.service.ts:79** - `const response = await this.makeRequest('crm.deal.add', {`

### `crm.deal.update`

Used in 2 location(s):

- **src/services/bitrix24.service.ts:97** - `const response = await this.makeRequest('crm.deal.update', {`
- **src/services/bitrix24.service.ts:151** - `await this.makeRequest('crm.deal.update', {`

### `crm.deal.get`

Used in 1 location(s):

- **src/services/bitrix24.service.ts:112** - `const response = await this.makeRequest('crm.deal.get', { id: dealId });`

### `disk.folder.uploadfile`

Used in 1 location(s):

- **src/services/bitrix24.service.ts:138** - `const uploadResponse = await this.makeRequest('disk.folder.uploadfile', {`

### `supply.saveSuccess`

Used in 1 location(s):

- **src/pages/SupplyParameters.tsx:56** - `message: t('supply.saveSuccess'),`

### `supply.saveFailed`

Used in 1 location(s):

- **src/pages/SupplyParameters.tsx:62** - `message: t('supply.saveFailed'),`

### `supply.resetSuccess`

Used in 1 location(s):

- **src/pages/SupplyParameters.tsx:72** - `message: t('supply.resetSuccess'),`

### `supply.saveAndCalculate`

Used in 1 location(s):

- **src/pages/SupplyParameters.tsx:111** - `{t('supply.saveAndCalculate')}`

### `results.totalCost`

Used in 1 location(s):

- **src/pages/SavedCalculations.tsx:274** - `<Text size="sm" c="dimmed">{t('results.totalCost')}:</Text>`

### `calculation.calculation`

Used in 1 location(s):

- **src/pages/CalculationPage.tsx:51** - `calculationName: `${t('calculation.calculation')} - ${new Date().toLocaleDateString()}``

### `supply.title`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:100** - `<Title order={2} mb="md">{t('supply.title')}</Title>`

### `supply.warning`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:104** - `{t('supply.warning')}`

### `supply.sections.pricingPolicy`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:111** - `{t('supply.sections.pricingPolicy')}`

### `supply.readOnly`

Used in 3 location(s):

- **src/components/SupplyInputForm.tsx:112** - `{!canEditPricing && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}`
- **src/components/SupplyInputForm.tsx:248** - `{!canEditLogistics && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}`
- **src/components/SupplyInputForm.tsx:312** - `{!canEditCorrections && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}`

### `supply.fields.plateMaterialPrice`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:119** - `{t('supply.fields.plateMaterialPrice')}`

### `supply.fields.claddingMaterialPrice`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:137** - `{t('supply.fields.claddingMaterialPrice')}`

### `supply.fields.columnCoverMaterialPrice`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:155** - `{t('supply.fields.columnCoverMaterialPrice')}`

### `supply.fields.panelMaterialPrice`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:173** - `{t('supply.fields.panelMaterialPrice')}`

### `supply.fields.laborRate`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:191** - `{t('supply.fields.laborRate')}`

### `supply.fields.cuttingCost`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:209** - `{t('supply.fields.cuttingCost')}`

### `supply.fields.laborRateD12`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:227** - `{t('supply.fields.laborRateD12')}`

### `supply.sections.logistics`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:247** - `{t('supply.sections.logistics')}`

### `supply.fields.internalLogistics`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:255** - `{t('supply.fields.internalLogistics')}`

### `supply.fields.standardLaborHours`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:273** - `{t('supply.fields.standardLaborHours')}`

### `supply.units.hours`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:284** - `<Text size="xs" c="dimmed">{t('supply.units.hours')}</Text>`

### `supply.fields.panelFastenerQuantity`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:291** - `{t('supply.fields.panelFastenerQuantity')}`

### `supply.units.pieces`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:302** - `<Text size="xs" c="dimmed">{t('supply.units.pieces')}</Text>`

### `supply.sections.corrections`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:311** - `{t('supply.sections.corrections')}`

### `supply.fields.claddingCorrection`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:319** - `{t('supply.fields.claddingCorrection')}`

### `supply.units.coefficient`

Used in 6 location(s):

- **src/components/SupplyInputForm.tsx:331** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`
- **src/components/SupplyInputForm.tsx:350** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`
- **src/components/SupplyInputForm.tsx:369** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`
- **src/components/SupplyInputForm.tsx:388** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`
- **src/components/SupplyInputForm.tsx:407** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`
- **src/components/SupplyInputForm.tsx:426** - `<Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>`

### `supply.fields.columnCorrection`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:338** - `{t('supply.fields.columnCorrection')}`

### `supply.fields.coverCorrection`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:357** - `{t('supply.fields.coverCorrection')}`

### `supply.fields.panelCorrection`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:376** - `{t('supply.fields.panelCorrection')}`

### `supply.fields.laborCoefficientD13`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:395** - `{t('supply.fields.laborCoefficientD13')}`

### `supply.fields.materialCoefficientD14`

Used in 1 location(s):

- **src/components/SupplyInputForm.tsx:414** - `{t('supply.fields.materialCoefficientD14')}`

### `sparePlates`

Used in 2 location(s):

- **src/components/SparePartsSection.tsx:25** - `onChange={(value) => updateInput('sparePlates', Number(value) || 0)}`
- **src/components/ProjectDetails/SparePartsSection.tsx:24** - `onChange={(value) => updateInput('sparePlates', Number(value) || 0, true)}`

### `spareGaskets`

Used in 2 location(s):

- **src/components/SparePartsSection.tsx:38** - `onChange={(value) => updateInput('spareGaskets', Number(value) || 0)}`
- **src/components/ProjectDetails/SparePartsSection.tsx:36** - `onChange={(value) => updateInput('spareGaskets', Number(value) || 0, true)}`

### `spareBolts`

Used in 2 location(s):

- **src/components/SparePartsSection.tsx:51** - `onChange={(value) => updateInput('spareBolts', Number(value) || 0)}`
- **src/components/ProjectDetails/SparePartsSection.tsx:48** - `onChange={(value) => updateInput('spareBolts', Number(value) || 0, true)}`

### `spareNuts`

Used in 2 location(s):

- **src/components/SparePartsSection.tsx:64** - `onChange={(value) => updateInput('spareNuts', Number(value) || 0)}`
- **src/components/ProjectDetails/SparePartsSection.tsx:60** - `onChange={(value) => updateInput('spareNuts', Number(value) || 0, true)}`

### `spareKit`

Used in 2 location(s):

- **src/components/SparePartsSection.tsx:76** - `onChange={(event) => updateInput('spareKit', event.currentTarget.checked)}`
- **src/components/ProjectDetails/SparePartsSection.tsx:72** - `onChange={(event) => updateInput('spareKit', event.currentTarget.checked, true)}`

### `projectName`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:24** - `onChange={(event) => updateInput('projectName', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:24** - `onChange={(event) => updateInput('projectName', event.currentTarget.value, true)}`

### `orderNumber`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:33** - `onChange={(event) => updateInput('orderNumber', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:33** - `onChange={(event) => updateInput('orderNumber', event.currentTarget.value, true)}`

### `clientName`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:42** - `onChange={(event) => updateInput('clientName', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:43** - `onChange={(event) => updateInput('clientName', event.currentTarget.value, true)}`

### `deliveryDate`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:52** - `onChange={(event) => updateInput('deliveryDate', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:53** - `onChange={(event) => updateInput('deliveryDate', event.currentTarget.value, true)}`

### `projectManager`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:62** - `onChange={(event) => updateInput('projectManager', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:63** - `onChange={(event) => updateInput('projectManager', event.currentTarget.value, true)}`

### `salesManager`

Used in 2 location(s):

- **src/components/ProjectInfoSection.tsx:72** - `onChange={(event) => updateInput('salesManager', event.currentTarget.value)}`
- **src/components/ProjectDetails/ProjectInfoSection.tsx:73** - `onChange={(event) => updateInput('salesManager', event.currentTarget.value, true)}`

### `operatingPressureA`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:29** - `onChange={(value) => updateInput('operatingPressureA', Number(value) || 0)}`

### `designTemperatureA`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:42** - `onChange={(value) => updateInput('designTemperatureA', Number(value) || 0)}`

### `flowRateA`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:55** - `onChange={(value) => updateInput('flowRateA', Number(value) || 0)}`

### `pressureDropA`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:68** - `onChange={(value) => updateInput('pressureDropA', Number(value) || 0)}`

### `operatingPressureB`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:89** - `onChange={(value) => updateInput('operatingPressureB', Number(value) || 0)}`

### `designTemperatureB`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:102** - `onChange={(value) => updateInput('designTemperatureB', Number(value) || 0)}`

### `flowRateB`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:115** - `onChange={(value) => updateInput('flowRateB', Number(value) || 0)}`

### `pressureDropB`

Used in 1 location(s):

- **src/components/ProcessParametersSection.tsx:128** - `onChange={(value) => updateInput('pressureDropB', Number(value) || 0)}`

### `weldingMethod`

Used in 1 location(s):

- **src/components/ManufacturingSection.tsx:52** - `onChange={(value) => updateInput('weldingMethod', value || '')}`

### `weldingMaterial`

Used in 1 location(s):

- **src/components/ManufacturingSection.tsx:62** - `onChange={(event) => updateInput('weldingMaterial', event.currentTarget.value)}`

### `surfaceTreatment`

Used in 1 location(s):

- **src/components/ManufacturingSection.tsx:72** - `onChange={(value) => updateInput('surfaceTreatment', value || '')}`

### `paintType`

Used in 1 location(s):

- **src/components/ManufacturingSection.tsx:83** - `onChange={(value) => updateInput('paintType', value || '')}`

### `paintThickness`

Used in 1 location(s):

- **src/components/ManufacturingSection.tsx:93** - `onChange={(value) => updateInput('paintThickness', Number(value) || 0)}`

### `qualityControl`

Used in 2 location(s):

- **src/components/ManufacturingSection.tsx:105** - `onChange={(event) => updateInput('qualityControl', event.currentTarget.value)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:87** - `onChange={(event) => updateInput('qualityControl', event.currentTarget.value, true)}`

### `certificationRequired`

Used in 2 location(s):

- **src/components/ManufacturingSection.tsx:114** - `onChange={(event) => updateInput('certificationRequired', event.currentTarget.checked)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:68** - `onChange={(event) => updateInput('certificationRequired', event.currentTarget.checked, true)}`

### `inspectionLevel`

Used in 2 location(s):

- **src/components/ManufacturingSection.tsx:124** - `onChange={(value) => updateInput('inspectionLevel', value || '')}`
- **src/components/ProjectDetails/DocumentationSection.tsx:77** - `onChange={(event) => updateInput('inspectionLevel', event.currentTarget.value, true)}`

### `packagingType`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:57** - `onChange={(value) => updateInput('packagingType', value || '')}`
- **src/components/ProjectDetails/LogisticsSection.tsx:50** - `onChange={(value) => updateInput('packagingType', value || '', true)}`

### `packagingMaterial`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:68** - `onChange={(value) => updateInput('packagingMaterial', value || '')}`
- **src/components/ProjectDetails/LogisticsSection.tsx:60** - `onChange={(event) => updateInput('packagingMaterial', event.currentTarget.value, true)}`

### `crateRequired`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:78** - `onChange={(event) => updateInput('crateRequired', event.currentTarget.checked)}`
- **src/components/ProjectDetails/LogisticsSection.tsx:68** - `onChange={(event) => updateInput('crateRequired', event.currentTarget.checked, true)}`

### `shippingMethod`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:88** - `onChange={(value) => updateInput('shippingMethod', value || '')}`
- **src/components/ProjectDetails/LogisticsSection.tsx:94** - `onChange={(value) => updateInput('shippingMethod', value || '', true)}`

### `deliveryTerms`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:99** - `onChange={(value) => updateInput('deliveryTerms', value || '')}`
- **src/components/ProjectDetails/LogisticsSection.tsx:105** - `onChange={(value) => updateInput('deliveryTerms', value || '', true)}`

### `insuranceRequired`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:109** - `onChange={(event) => updateInput('insuranceRequired', event.currentTarget.checked)}`
- **src/components/ProjectDetails/LogisticsSection.tsx:76** - `onChange={(event) => updateInput('insuranceRequired', event.currentTarget.checked, true)}`

### `customsClearance`

Used in 2 location(s):

- **src/components/LogisticsSection.tsx:118** - `onChange={(event) => updateInput('customsClearance', event.currentTarget.checked)}`
- **src/components/ProjectDetails/LogisticsSection.tsx:84** - `onChange={(event) => updateInput('customsClearance', event.currentTarget.checked, true)}`

### `paymentTerms`

Used in 2 location(s):

- **src/components/FinancialSection.tsx:41** - `onChange={(value) => updateInput('paymentTerms', value || '')}`
- **src/components/ProjectDetails/FinancialTermsSection.tsx:43** - `onChange={(value) => updateInput('paymentTerms', value || '', true)}`

### `discountPercent`

Used in 1 location(s):

- **src/components/FinancialSection.tsx:52** - `onChange={(value) => updateInput('discountPercent', Number(value) || 0)}`

### `taxRate`

Used in 2 location(s):

- **src/components/FinancialSection.tsx:66** - `onChange={(value) => updateInput('taxRate', Number(value) || 0)}`
- **src/components/ProjectDetails/FinancialTermsSection.tsx:77** - `onChange={(value) => updateInput('taxRate', Number(value) || 20, true)}`

### `currencyType`

Used in 2 location(s):

- **src/components/FinancialSection.tsx:80** - `onChange={(value) => updateInput('currencyType', value || '')}`
- **src/components/ProjectDetails/FinancialTermsSection.tsx:54** - `onChange={(value) => updateInput('currencyType', value || 'RUB', true)}`

### `exchangeRate`

Used in 2 location(s):

- **src/components/FinancialSection.tsx:90** - `onChange={(value) => updateInput('exchangeRate', Number(value) || 0)}`
- **src/components/ProjectDetails/FinancialTermsSection.tsx:64** - `onChange={(value) => updateInput('exchangeRate', Number(value) || 1, true)}`

### `boltType`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:63** - `onChange={(value) => updateInput('boltType', value || '')}`

### `boltMaterial`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:74** - `onChange={(value) => updateInput('boltMaterial', value || '')}`

### `boltQuantity`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:84** - `onChange={(value) => updateInput('boltQuantity', Number(value) || 0)}`

### `nutType`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:109** - `onChange={(value) => updateInput('nutType', value || '')}`

### `nutMaterial`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:120** - `onChange={(value) => updateInput('nutMaterial', value || '')}`

### `nutQuantity`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:130** - `onChange={(value) => updateInput('nutQuantity', Number(value) || 0)}`

### `washerType`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:155** - `onChange={(value) => updateInput('washerType', value || '')}`

### `washerQuantity`

Used in 1 location(s):

- **src/components/FastenerSection.tsx:165** - `onChange={(value) => updateInput('washerQuantity', Number(value) || 0)}`

### `channelHeight`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:57** - `onChange={(value) => updateInput('channelHeight', Number(value) || 0)}`

### `channelWidth`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:69** - `onChange={(value) => updateInput('channelWidth', Number(value) || 0)}`

### `frameThickness`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:81** - `onChange={(value) => updateInput('frameThickness', Number(value) || 0)}`

### `frameMaterial`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:94** - `onChange={(value) => updateInput('frameMaterial', value || '')}`

### `insulationThickness`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:104** - `onChange={(value) => updateInput('insulationThickness', Number(value) || 0)}`

### `insulationType`

Used in 1 location(s):

- **src/components/ExtendedSpecsSection.tsx:117** - `onChange={(value) => updateInput('insulationType', value || '')}`

### `drawingsIncluded`

Used in 2 location(s):

- **src/components/DocumentationSection.tsx:24** - `onChange={(event) => updateInput('drawingsIncluded', event.currentTarget.checked)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:23** - `onChange={(event) => updateInput('drawingsIncluded', event.currentTarget.checked, true)}`

### `manualsIncluded`

Used in 2 location(s):

- **src/components/DocumentationSection.tsx:33** - `onChange={(event) => updateInput('manualsIncluded', event.currentTarget.checked)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:31** - `onChange={(event) => updateInput('manualsIncluded', event.currentTarget.checked, true)}`

### `certificatesIncluded`

Used in 2 location(s):

- **src/components/DocumentationSection.tsx:42** - `onChange={(event) => updateInput('certificatesIncluded', event.currentTarget.checked)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:39** - `onChange={(event) => updateInput('certificatesIncluded', event.currentTarget.checked, true)}`

### `warrantyPeriod`

Used in 2 location(s):

- **src/components/DocumentationSection.tsx:52** - `onChange={(value) => updateInput('warrantyPeriod', Number(value) || 0)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:48** - `onChange={(value) => updateInput('warrantyPeriod', Number(value) || 12, true)}`

### `serviceContract`

Used in 2 location(s):

- **src/components/DocumentationSection.tsx:64** - `onChange={(event) => updateInput('serviceContract', event.currentTarget.checked)}`
- **src/components/ProjectDetails/DocumentationSection.tsx:60** - `onChange={(event) => updateInput('serviceContract', event.currentTarget.checked, true)}`

### `ru-RU`

Used in 3 location(s):

- **src/components/CalculationResults.tsx:24** - `return new Intl.NumberFormat('ru-RU', {`
- **src/components/CalculationResults.tsx:33** - `return new Intl.NumberFormat('ru-RU', {`
- **src/components/AdditionalCostsSection.tsx:12** - `//   return new Intl.NumberFormat('ru-RU', {`

### `supply.units.bar`

Used in 2 location(s):

- **src/components/CalculationResults.tsx:105** - `{formatNumber(result.pressureTestHot)} {t('supply.units.bar')}`
- **src/components/CalculationResults.tsx:114** - `{formatNumber(result.pressureTestCold)} {t('supply.units.bar')}`

### `supply.units.kg`

Used in 1 location(s):

- **src/components/CalculationResults.tsx:373** - `{key.includes('Mass') ? t('supply.units.kg') : t('supply.units.cubicMeter')}`

### `supply.units.cubicMeter`

Used in 1 location(s):

- **src/components/CalculationResults.tsx:373** - `{key.includes('Mass') ? t('supply.units.kg') : t('supply.units.cubicMeter')}`

### `bitrix24.export.dealCreatedTitle`

Used in 1 location(s):

- **src/components/CalculationResults.tsx:412** - `title={t('bitrix24.export.dealCreatedTitle')}`

### `bitrix24.export.dealCreatedMessage`

Used in 1 location(s):

- **src/components/CalculationResults.tsx:416** - `{t('bitrix24.export.dealCreatedMessage', { id: bitrixDealId })}`

### `bitrix24.export.success`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:94** - `title: t('bitrix24.export.success'),`

### `bitrix24.export.dealCreated`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:95** - `message: t('bitrix24.export.dealCreated', { id: deal.id, title: deal.title }),`

### `bitrix24.export.unknownError`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:102** - `const errorMessage = error instanceof Error ? error.message : t('bitrix24.export.unknownError');`

### `bitrix24.export.error`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:105** - `title: t('bitrix24.export.error'),`

### `bitrix24.connection.success`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:121** - `title: connected ? t('bitrix24.connection.success') : t('bitrix24.connection.failed'),`

### `bitrix24.connection.failed`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:121** - `title: connected ? t('bitrix24.connection.success') : t('bitrix24.connection.failed'),`

### `bitrix24.connection.successMessage`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:122** - `message: connected ? t('bitrix24.connection.successMessage') : t('bitrix24.connection.failedMessage'),`

### `bitrix24.connection.failedMessage`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:122** - `message: connected ? t('bitrix24.connection.successMessage') : t('bitrix24.connection.failedMessage'),`

### `bitrix24.exportToBitrix24`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:151** - `{t('bitrix24.exportToBitrix24')}`

### `bitrix24.configure`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:155** - `<Tooltip label={t('bitrix24.configure')}>`

### `bitrix24.viewHistory`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:167** - `<Tooltip label={t('bitrix24.viewHistory')}>`

### `bitrix24.configuration.title`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:183** - `<Text fw={500}>{t('bitrix24.configuration.title')}</Text>`

### `bitrix24.connection.connected`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:194** - `title={isConnected ? t('bitrix24.connection.connected') : t('bitrix24.connection.disconnected')}`

### `bitrix24.connection.disconnected`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:194** - `title={isConnected ? t('bitrix24.connection.connected') : t('bitrix24.connection.disconnected')}`

### `bitrix24.connection.lastTest`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:196** - `{connectionError || t('bitrix24.connection.lastTest', {`

### `bitrix24.configuration.method`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:204** - `label={t('bitrix24.configuration.method')}`

### `bitrix24.configuration.methodDescription`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:205** - `description={t('bitrix24.configuration.methodDescription')}`

### `bitrix24.configuration.webhook`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:209** - `{ value: 'webhook', label: t('bitrix24.configuration.webhook') },`

### `bitrix24.configuration.oauth2`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:210** - `{ value: 'oauth2', label: t('bitrix24.configuration.oauth2') }`

### `bitrix24.configuration.webhookUrl`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:218** - `label={t('bitrix24.configuration.webhookUrl')}`

### `bitrix24.configuration.webhookUrlDescription`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:219** - `description={t('bitrix24.configuration.webhookUrlDescription')}`

### `bitrix24.configuration.portalUrl`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:232** - `label={t('bitrix24.configuration.portalUrl')}`

### `bitrix24.configuration.portalUrlDescription`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:233** - `description={t('bitrix24.configuration.portalUrlDescription')}`

### `bitrix24.configuration.clientId`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:242** - `label={t('bitrix24.configuration.clientId')}`

### `bitrix24.configuration.clientSecret`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:248** - `label={t('bitrix24.configuration.clientSecret')}`

### `bitrix24.configuration.accessToken`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:257** - `label={t('bitrix24.configuration.accessToken')}`

### `bitrix24.configuration.accessTokenDescription`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:258** - `description={t('bitrix24.configuration.accessTokenDescription')}`

### `bitrix24.configuration.testConnection`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:277** - `{t('bitrix24.configuration.testConnection')}`

### `bitrix24.history.title`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:299** - `<Text fw={500}>{t('bitrix24.history.title')}</Text>`

### `bitrix24.history.total`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:301** - `<Badge variant="light">{t('bitrix24.history.total', { count: stats.total })}</Badge>`

### `bitrix24.history.successful`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:302** - `<Badge variant="light" color="green">{t('bitrix24.history.successful', { count: stats.successful })}</Badge>`

### `bitrix24.history.failed`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:304** - `<Badge variant="light" color="red">{t('bitrix24.history.failed', { count: stats.failed })}</Badge>`

### `bitrix24.history.statistics`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:315** - `<Text size="sm" c="dimmed">{t('bitrix24.history.statistics')}</Text>`

### `bitrix24.history.last24h`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:317** - `<Text size="sm">{t('bitrix24.history.last24h', { count: stats.last24h })}</Text>`

### `bitrix24.history.clearAll`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:325** - `{t('bitrix24.history.clearAll')}`

### `bitrix24.history.openInBitrix24`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:353** - `<Tooltip label={t('bitrix24.history.openInBitrix24')}>`

### `bitrix24.history.empty`

Used in 1 location(s):

- **src/components/Bitrix24Export.tsx:409** - `{t('bitrix24.history.empty')}`

### `additionalMaterial1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:39** - `onChange={(event) => updateInput('additionalMaterial1', event.currentTarget.value)}`

### `additionalMaterialCost1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:47** - `onChange={(value) => updateInput('additionalMaterialCost1', Number(value) || 0)}`

### `additionalMaterial2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:59** - `onChange={(event) => updateInput('additionalMaterial2', event.currentTarget.value)}`

### `additionalMaterialCost2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:67** - `onChange={(value) => updateInput('additionalMaterialCost2', Number(value) || 0)}`

### `additionalMaterial3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:79** - `onChange={(event) => updateInput('additionalMaterial3', event.currentTarget.value)}`

### `additionalMaterialCost3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:87** - `onChange={(value) => updateInput('additionalMaterialCost3', Number(value) || 0)}`

### `additionalLabor1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:109** - `onChange={(event) => updateInput('additionalLabor1', event.currentTarget.value)}`

### `additionalLaborCost1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:117** - `onChange={(value) => updateInput('additionalLaborCost1', Number(value) || 0)}`

### `additionalLabor2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:129** - `onChange={(event) => updateInput('additionalLabor2', event.currentTarget.value)}`

### `additionalLaborCost2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:137** - `onChange={(value) => updateInput('additionalLaborCost2', Number(value) || 0)}`

### `additionalLabor3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:149** - `onChange={(event) => updateInput('additionalLabor3', event.currentTarget.value)}`

### `additionalLaborCost3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:157** - `onChange={(value) => updateInput('additionalLaborCost3', Number(value) || 0)}`

### `additionalService1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:179** - `onChange={(event) => updateInput('additionalService1', event.currentTarget.value)}`

### `additionalServiceCost1`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:187** - `onChange={(value) => updateInput('additionalServiceCost1', Number(value) || 0)}`

### `additionalService2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:199** - `onChange={(event) => updateInput('additionalService2', event.currentTarget.value)}`

### `additionalServiceCost2`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:207** - `onChange={(value) => updateInput('additionalServiceCost2', Number(value) || 0)}`

### `additionalService3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:219** - `onChange={(event) => updateInput('additionalService3', event.currentTarget.value)}`

### `additionalServiceCost3`

Used in 1 location(s):

- **src/components/AdditionalCostsSection.tsx:227** - `onChange={(value) => updateInput('additionalServiceCost3', Number(value) || 0)}`

### `I_BaseDimension`

Used in 13 location(s):

- **src/lib/calculation-engine/formula-library.ts:81** - `const baseValue = ctx.intermediateValues.get('I_BaseDimension') || 40;`
- **src/lib/calculation-engine/formula-library.ts:104** - `const baseValue = ctx.intermediateValues.get('I_BaseDimension') || 40;`
- **src/lib/calculation-engine/formula-library.ts:130** - `const I110 = ctx.intermediateValues.get('I_BaseDimension') || 40;`
- **src/lib/calculation-engine/formula-library.ts:141** - `const I110 = ctx.intermediateValues.get('I_BaseDimension') || 40;`
- **src/lib/calculation-engine/formula-library.ts:215** - `ctx.intermediateValues.set('I_BaseDimension', 40); // Base value, varies by equipment`
- **src/lib/calculation-engine/formula-library-complete.ts:163** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:187** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:211** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:220** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:430** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:441** - `const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:1637** - `ctx.intermediateValues.set('I_BaseDimension', I);`
- **src/lib/calculation-engine/formula-library-complete.ts:1638** - `results.set('I_BaseDimension', I);`

### `J_DimensionPlus20`

Used in 6 location(s):

- **src/lib/calculation-engine/formula-library.ts:94** - `const J = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);`
- **src/lib/calculation-engine/formula-library.ts:164** - `const J110 = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);`
- **src/lib/calculation-engine/formula-library.ts:220** - `results.set('J_DimensionPlus20', calc_J_DimensionPlus20(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:176** - `const J = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:386** - `const J = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);`
- **src/lib/calculation-engine/engine-v2.ts:347** - `dimensions.set('panelWidth', calculations.get('J_DimensionPlus20') || 0);`

### `K_ColumnHeightBase`

Used in 4 location(s):

- **src/lib/calculation-engine/formula-library.ts:95** - `const K = ctx.intermediateValues.get('K_ColumnHeightBase') || calc_K_ColumnHeightBase(ctx);`
- **src/lib/calculation-engine/formula-library.ts:221** - `results.set('K_ColumnHeightBase', calc_K_ColumnHeightBase(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:177** - `const K = ctx.intermediateValues.get('K_ColumnHeightBase') || calc_K_ColumnHeightBase(ctx);`
- **src/lib/calculation-engine/engine-v2.ts:346** - `dimensions.set('columnHeight', calculations.get('K_ColumnHeightBase') || 0);`

### `M_DimensionPlus10`

Used in 4 location(s):

- **src/lib/calculation-engine/formula-library.ts:116** - `const M = ctx.intermediateValues.get('M_DimensionPlus10') || calc_M_DimensionPlus10(ctx);`
- **src/lib/calculation-engine/formula-library.ts:223** - `results.set('M_DimensionPlus10', calc_M_DimensionPlus10(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:198** - `const M = ctx.intermediateValues.get('M_DimensionPlus10') || calc_M_DimensionPlus10(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:392** - `const M = ctx.intermediateValues.get('M_DimensionPlus10') || calc_M_DimensionPlus10(ctx);`

### `N_ColumnHeightRepeat`

Used in 4 location(s):

- **src/lib/calculation-engine/formula-library.ts:117** - `const N = ctx.intermediateValues.get('N_ColumnHeightRepeat') || calc_N_ColumnHeightRepeat(ctx);`
- **src/lib/calculation-engine/formula-library.ts:224** - `results.set('N_ColumnHeightRepeat', calc_N_ColumnHeightRepeat(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:199** - `const N = ctx.intermediateValues.get('N_ColumnHeightRepeat') || calc_N_ColumnHeightRepeat(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:393** - `const N = ctx.intermediateValues.get('N_ColumnHeightRepeat') || calc_N_ColumnHeightRepeat(ctx);`

### `P_WidthCalculation`

Used in 5 location(s):

- **src/lib/calculation-engine/formula-library.ts:149** - `const P = ctx.intermediateValues.get('P_WidthCalculation') || calc_P_WidthCalculation(ctx);`
- **src/lib/calculation-engine/formula-library.ts:226** - `results.set('P_WidthCalculation', calc_P_WidthCalculation(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:227** - `const P = ctx.intermediateValues.get('P_WidthCalculation') || calc_P_WidthCalculation(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:398** - `const P = ctx.intermediateValues.get('P_WidthCalculation') || calc_P_WidthCalculation(ctx);`
- **src/lib/calculation-engine/engine-v2.ts:344** - `dimensions.set('coverWidth', calculations.get('P_WidthCalculation') || 0);`

### `Q_HeightCalculation`

Used in 5 location(s):

- **src/lib/calculation-engine/formula-library.ts:150** - `const Q = ctx.intermediateValues.get('Q_HeightCalculation') || calc_Q_HeightCalculation(ctx);`
- **src/lib/calculation-engine/formula-library.ts:227** - `results.set('Q_HeightCalculation', calc_Q_HeightCalculation(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:228** - `const Q = ctx.intermediateValues.get('Q_HeightCalculation') || calc_Q_HeightCalculation(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:399** - `const Q = ctx.intermediateValues.get('Q_HeightCalculation') || calc_Q_HeightCalculation(ctx);`
- **src/lib/calculation-engine/engine-v2.ts:345** - `dimensions.set('coverHeight', calculations.get('Q_HeightCalculation') || 0);`

### `G_ComponentsCount`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library.ts:218** - `results.set('G_ComponentsCount', calc_G_ComponentsCount(ctx));`

### `H_CoverArea`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library.ts:219** - `results.set('H_CoverArea', calc_H_CoverArea(ctx));`

### `L_ComponentVolume`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library.ts:222** - `results.set('L_ComponentVolume', calc_L_ComponentVolume(ctx));`
- **src/lib/calculation-engine/engine-v2.ts:101** - `this.context.dependencies.set('L_ComponentVolume', ['J_DimensionPlus20', 'K_ColumnHeightBase']);`

### `O_SecondaryVolume`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library.ts:225** - `results.set('O_SecondaryVolume', calc_O_SecondaryVolume(ctx));`
- **src/lib/calculation-engine/engine-v2.ts:102** - `this.context.dependencies.set('O_SecondaryVolume', ['M_DimensionPlus10', 'N_ColumnHeightRepeat']);`

### `R_AreaCalculation`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library.ts:228** - `results.set('R_AreaCalculation', calc_R_AreaCalculation(ctx));`
- **src/lib/calculation-engine/engine-v2.ts:103** - `this.context.dependencies.set('R_AreaCalculation', ['P_WidthCalculation', 'Q_HeightCalculation']);`

### `AL_LengthCalculation`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library.ts:232** - `results.set('AL_LengthCalculation', calc_AL_LengthCalculation(ctx));`

### `BA_MaterialTotal`

Used in 3 location(s):

- **src/lib/calculation-engine/formula-library.ts:233** - `results.set('BA_MaterialTotal', calc_BA_MaterialTotal(ctx));`
- **src/lib/calculation-engine/formula-library-complete.ts:555** - `const BA = ctx.intermediateValues.get('BA_MaterialTotal') || 0;`
- **src/lib/calculation-engine/engine-v2.ts:104** - `this.context.dependencies.set('BA_MaterialTotal', [`

### `BB_CostComponents`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library.ts:234** - `results.set('BB_CostComponents', calc_BB_CostComponents(ctx));`
- **src/lib/calculation-engine/engine-v2.ts:319** - `const additionalCosts = calculations.get('BB_CostComponents') || 0;`

### `S_AdditionalDimension`

Used in 14 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:249** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:268** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:276** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:285** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:292** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:300** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:318** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:325** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:341** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:351** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:371** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:404** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:411** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:417** - `const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);`

### `Z_SimpleOffset`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:309** - `const Z = ctx.intermediateValues.get('Z_SimpleOffset') || calc_Z_SimpleOffset(ctx);`

### `AA_Perimeter`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:310** - `const AA = ctx.intermediateValues.get('AA_Perimeter') || calc_AA_Perimeter(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:410** - `const AA = ctx.intermediateValues.get('AA_Perimeter') || calc_AA_Perimeter(ctx);`

### `AC_Dimension`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:333** - `const AC = ctx.intermediateValues.get('AC_Dimension') || calc_AC_Dimension(ctx);`

### `AD_Perimeter2`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:334** - `const AD = ctx.intermediateValues.get('AD_Perimeter2') || calc_AD_Perimeter2(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:416** - `const AD = ctx.intermediateValues.get('AD_Perimeter2') || calc_AD_Perimeter2(ctx);`

### `AF_ComplexDimension`

Used in 3 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:357** - `const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:473** - `const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:489** - `const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);`

### `AG_WidthComplex`

Used in 3 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:358** - `const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:474** - `const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:490** - `const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);`

### `AI_ComplexDimension2`

Used in 3 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:377** - `const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:481** - `const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:496** - `const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);`

### `AJ_HeightComplex`

Used in 3 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:378** - `const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:482** - `const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);`
- **src/lib/calculation-engine/formula-library-complete.ts:497** - `const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);`

### `T_DimensionPlusOffset`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:405** - `const T = ctx.intermediateValues.get('T_DimensionPlusOffset') || calc_T_DimensionPlusOffset(ctx);`

### `/`

Used in 4 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:427** - `const [num] = ctx.inputs.plateConfiguration.split('/').map(Number);`
- **src/lib/calculation-engine/formula-library-complete.ts:438** - `const [, denom] = ctx.inputs.plateConfiguration.split('/').map(Number);`
- **src/lib/calculation-engine/formula-library-complete.ts:449** - `const [num] = ctx.inputs.plateConfiguration.split('/').map(Number);`
- **src/lib/calculation-engine/formula-library-complete.ts:459** - `const [, denom] = ctx.inputs.plateConfiguration.split('/').map(Number);`

### `AY_ComplexCalc5`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:475** - `const AY = ctx.intermediateValues.get('AY_ComplexCalc5') || 1.044;`

### `AZ_ComplexCalc6`

Used in 2 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:483** - `const AZ = ctx.intermediateValues.get('AZ_ComplexCalc6') || 1.044;`
- **src/lib/calculation-engine/formula-library-complete.ts:554** - `const AZ = ctx.intermediateValues.get('AZ_ComplexCalc6') || 0;`

### `BC_MaterialTotal2`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:561** - `const BC = ctx.intermediateValues.get('BC_MaterialTotal2') || 0;`

### `BD_AdditionalMaterials`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:562** - `const BD = ctx.intermediateValues.get('BD_AdditionalMaterials') || 0;`

### `BE_FinalSum1`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:578** - `const BE = ctx.intermediateValues.get('BE_FinalSum1') || 0;`

### `BF_FinalSum2`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:579** - `const BF = ctx.intermediateValues.get('BF_FinalSum2') || 0;`

### `plateWeight`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:869** - `materialBreakdown.set('plateWeight', plateWeight);`

### `claddingWeight`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:870** - `materialBreakdown.set('claddingWeight', coverWeight);`

### `columnWeight`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:871** - `materialBreakdown.set('columnWeight', columnWeight);`

### `panelWeight`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:872** - `materialBreakdown.set('panelWeight', panelWeight);`

### `materialMultiplier`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:873** - `materialBreakdown.set('materialMultiplier', materialMultiplier);`

### `equipmentMultiplier`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:874** - `materialBreakdown.set('equipmentMultiplier', equipmentMultiplier);`

### `Fasteners`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1255** - `materialBreakdown.set('Fasteners', { weight: fastenerWeight, cost: fastenerCost });`

### `Gaskets`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1256** - `materialBreakdown.set('Gaskets', { weight: gasketWeight, cost: gasketCost });`

### `Work`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1290** - `costPercentages.set('Work', (costBreakdown.J30_WorkTotal / finalTotalCost) * 100);`

### `Corpus`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1291** - `costPercentages.set('Corpus', (costBreakdown.J31_CorpusCategory / finalTotalCost) * 100);`

### `Core`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1292** - `costPercentages.set('Core', (costBreakdown.J32_CoreCategory / finalTotalCost) * 100);`

### `Connections`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1293** - `costPercentages.set('Connections', (costBreakdown.J33_ConnectionsCategory / finalTotalCost) * 100);`

### `Other`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1294** - `costPercentages.set('Other', (costBreakdown.J34_OtherCategory / finalTotalCost) * 100);`

### `COF`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1295** - `costPercentages.set('COF', (costBreakdown.J35_COFCategory / finalTotalCost) * 100);`

### `Spare`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1296** - `costPercentages.set('Spare', (costBreakdown.J36_SpareCategory / finalTotalCost) * 100);`

### `baseLaborHours`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1341** - `laborBreakdown.set('baseLaborHours', baseLaborHours);`

### `assemblyHours`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1342** - `laborBreakdown.set('assemblyHours', assemblyHours);`

### `testingHours`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1343** - `laborBreakdown.set('testingHours', testingHours);`

### `totalLaborHours`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1344** - `laborBreakdown.set('totalLaborHours', baseLaborHours + assemblyHours + testingHours);`

### `specialGaskets`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1439** - `additionalCosts.set('specialGaskets', 5000);`

### `gasketThickness`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1441** - `materialAdjustments.set('gasketThickness', 1.2);`

### `reinforcedColumns`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1446** - `additionalCosts.set('reinforcedColumns', 8000);`

### `columnThickness`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1448** - `materialAdjustments.set('columnThickness', 1.15);`

### `additionalPanels`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1453** - `additionalCosts.set('additionalPanels', 12000);`

### `panelCount`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1455** - `materialAdjustments.set('panelCount', 1.25);`

### `largeEquipmentSurcharge`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1467** - `additionalCosts.set('largeEquipmentSurcharge', 15000);`

### `structuralReinforcement`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1469** - `materialAdjustments.set('structuralReinforcement', 1.1);`

### `materialUpgrade`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1476** - `materialAdjustments.set('materialUpgrade', 1.05);`

### `pressureLimit`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1539** - `validationDetails.set('pressureLimit', pressureValid);`

### `temperatureLimit`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1546** - `validationDetails.set('temperatureLimit', temperatureValid);`

### `plateCountLimit`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1554** - `validationDetails.set('plateCountLimit', plateCountValid);`

### `thicknessRange`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1563** - `validationDetails.set('thicknessRange', thicknessValid);`

### `materialCompatibility`

Used in 1 location(s):

- **src/lib/calculation-engine/formula-library-complete.ts:1570** - `validationDetails.set('materialCompatibility', compatibilityValid);`

### `coverWidth`

Used in 4 location(s):

- **src/lib/calculation-engine/engine.ts:144** - `dimensions.set('coverWidth', coverWidth);`
- **src/lib/calculation-engine/engine.ts:178** - `(dimensions.get('coverWidth')! / 1000) *`
- **src/lib/calculation-engine/engine.ts:205** - `covers: dimensions.get('coverWidth')! * dimensions.get('coverHeight')! * 0.15,`
- **src/lib/calculation-engine/engine-v2.ts:344** - `dimensions.set('coverWidth', calculations.get('P_WidthCalculation') || 0);`

### `coverHeight`

Used in 4 location(s):

- **src/lib/calculation-engine/engine.ts:145** - `dimensions.set('coverHeight', coverHeight);`
- **src/lib/calculation-engine/engine.ts:179** - `(dimensions.get('coverHeight')! / 1000) *`
- **src/lib/calculation-engine/engine.ts:205** - `covers: dimensions.get('coverWidth')! * dimensions.get('coverHeight')! * 0.15,`
- **src/lib/calculation-engine/engine-v2.ts:345** - `dimensions.set('coverHeight', calculations.get('Q_HeightCalculation') || 0);`

### `columnHeight`

Used in 4 location(s):

- **src/lib/calculation-engine/engine.ts:149** - `dimensions.set('columnHeight', columnHeight);`
- **src/lib/calculation-engine/engine.ts:188** - `(dimensions.get('columnHeight')! / 1000) * 0.5 * 0.01; // Simplified`
- **src/lib/calculation-engine/engine.ts:206** - `columns: dimensions.get('columnHeight')! * 12,`
- **src/lib/calculation-engine/engine-v2.ts:346** - `dimensions.set('columnHeight', calculations.get('K_ColumnHeightBase') || 0);`

### `panelAWidth`

Used in 2 location(s):

- **src/lib/calculation-engine/engine.ts:154** - `dimensions.set('panelAWidth', panelAWidth);`
- **src/lib/calculation-engine/engine.ts:207** - `panelsA: dimensions.get('panelAWidth')! * plateCount * 8,`

### `panelBWidth`

Used in 2 location(s):

- **src/lib/calculation-engine/engine.ts:155** - `dimensions.set('panelBWidth', panelBWidth);`
- **src/lib/calculation-engine/engine.ts:208** - `panelsB: dimensions.get('panelBWidth')! * plateCount * 8,`

### `plateMass`

Used in 3 location(s):

- **src/lib/calculation-engine/engine.ts:184** - `requirements.set('plateMass', plateMass);`
- **src/lib/calculation-engine/engine.ts:212** - `materials: materials.get('plateMass')! * 850 + materials.get('bodyMass')! * 750,`
- **src/lib/calculation-engine/engine-v2.ts:394** - `materials.set('plateMass', plateMass);`

### `bodyMass`

Used in 3 location(s):

- **src/lib/calculation-engine/engine.ts:190** - `requirements.set('bodyMass', bodyMass);`
- **src/lib/calculation-engine/engine.ts:212** - `materials: materials.get('plateMass')! * 850 + materials.get('bodyMass')! * 750,`
- **src/lib/calculation-engine/engine-v2.ts:398** - `materials.set('bodyMass', bodyMass);`

### `totalCost`

Used in 1 location(s):

- **src/lib/calculation-engine/engine.ts:270** - `totalCost: this.context.intermediateValues.get('totalCost') || 0,`

### `panelWidth`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:347** - `dimensions.set('panelWidth', calculations.get('J_DimensionPlus20') || 0);`

### `plateVolume`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:395** - `materials.set('plateVolume', plateVolume);`

### `totalMaterial`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:396** - `materials.set('totalMaterial', plateVolume);`

### `bodyVolume`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:397** - `materials.set('bodyVolume', housingVolume);`

### `totalComponentMass`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:418** - `materials.set('totalComponentMass', totalComponentMass);`

### `Plate Package`

Used in 1 location(s):

- **src/lib/calculation-engine/engine-v2.ts:421** - `materials.set('Plate Package', plateMass);`

### `F78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:15** - `const F78_PlateMass = ctx.intermediateValues.get('F78') || 1820.5952;`

### `J78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:24** - `const J78_AdditionalMass = ctx.intermediateValues.get('J78') || 31.2384;`

### `E78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:67** - `const E78_ComponentFactor = ctx.intermediateValues.get('E78') || 118.68414720000001;`

### `D78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:73** - `const D78_AdditionalComponent = ctx.intermediateValues.get('D78') || 3;`

### `I78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:76** - `const I78_SecondaryFactor = ctx.intermediateValues.get('I78') || 0;`

### `G78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:98** - `const G78_PanelMaterialFactor = ctx.intermediateValues.get('G78') || 184.22491248;`

### `H78`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:107** - `const H78_PanelSecondaryFactor = ctx.intermediateValues.get('H78') || 31.2384;`

### `K14`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:126** - `const K14_WorkCost = ctx.intermediateValues.get('K14') || 0;`

### `N26`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:184** - `differences.set('N26', Math.abs(calculated.N26_PlatePackageCost - expected.N26));`

### `P26`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:187** - `differences.set('P26', Math.abs(calculated.P26_EquipmentCost - expected.P26));`

### `O26`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:190** - `differences.set('O26', Math.abs(calculated.O26_ComponentCost - expected.O26));`

### `H26`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:193** - `differences.set('H26', Math.abs(calculated.H26_PanelMaterialCost - expected.H26));`

### `F26`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:196** - `differences.set('F26', Math.abs(calculated.F26_PlateWorkCost - expected.F26));`

### `J32`

Used in 1 location(s):

- **src/lib/calculation-engine/cost-calculations.ts:199** - `differences.set('J32', Math.abs(calculated.J32_GrandTotal - expected.J32));`

### `form.placeholders.sparePlates`

Used in 1 location(s):

- **src/components/ProjectDetails/SparePartsSection.tsx:22** - `placeholder={t('form.placeholders.sparePlates')}`

### `form.placeholders.spareGaskets`

Used in 1 location(s):

- **src/components/ProjectDetails/SparePartsSection.tsx:34** - `placeholder={t('form.placeholders.spareGaskets')}`

### `form.placeholders.spareBolts`

Used in 1 location(s):

- **src/components/ProjectDetails/SparePartsSection.tsx:46** - `placeholder={t('form.placeholders.spareBolts')}`

### `form.placeholders.spareNuts`

Used in 1 location(s):

- **src/components/ProjectDetails/SparePartsSection.tsx:58** - `placeholder={t('form.placeholders.spareNuts')}`

### `form.placeholders.packagingType`

Used in 1 location(s):

- **src/components/ProjectDetails/LogisticsSection.tsx:47** - `placeholder={t('form.placeholders.packagingType')}`

### `form.placeholders.packagingMaterial`

Used in 1 location(s):

- **src/components/ProjectDetails/LogisticsSection.tsx:58** - `placeholder={t('form.placeholders.packagingMaterial')}`

### `form.placeholders.shippingMethod`

Used in 1 location(s):

- **src/components/ProjectDetails/LogisticsSection.tsx:91** - `placeholder={t('form.placeholders.shippingMethod')}`

### `form.placeholders.deliveryTerms`

Used in 1 location(s):

- **src/components/ProjectDetails/LogisticsSection.tsx:102** - `placeholder={t('form.placeholders.deliveryTerms')}`

### `form.placeholders.paymentTerms`

Used in 1 location(s):

- **src/components/ProjectDetails/FinancialTermsSection.tsx:40** - `placeholder={t('form.placeholders.paymentTerms')}`

### `form.placeholders.currencyType`

Used in 1 location(s):

- **src/components/ProjectDetails/FinancialTermsSection.tsx:51** - `placeholder={t('form.placeholders.currencyType')}`

### `form.placeholders.exchangeRate`

Used in 1 location(s):

- **src/components/ProjectDetails/FinancialTermsSection.tsx:62** - `placeholder={t('form.placeholders.exchangeRate')}`

### `form.placeholders.taxRate`

Used in 1 location(s):

- **src/components/ProjectDetails/FinancialTermsSection.tsx:75** - `placeholder={t('form.placeholders.taxRate')}`

### `form.placeholders.warrantyPeriod`

Used in 1 location(s):

- **src/components/ProjectDetails/DocumentationSection.tsx:46** - `placeholder={t('form.placeholders.warrantyPeriod')}`

### `form.placeholders.inspectionLevel`

Used in 1 location(s):

- **src/components/ProjectDetails/DocumentationSection.tsx:75** - `placeholder={t('form.placeholders.inspectionLevel')}`

### `form.placeholders.qualityControl`

Used in 1 location(s):

- **src/components/ProjectDetails/DocumentationSection.tsx:85** - `placeholder={t('form.placeholders.qualityControl')}`

### `engineering.selectMaterial`

Used in 1 location(s):

- **src/components/Calculation/EngineeringSection.tsx:139** - `placeholder={t('engineering.selectMaterial')}`

### `roleChanged`

Used in 1 location(s):

- **src/components/Navigation/RoleSelector.tsx:81** - `window.dispatchEvent(new CustomEvent('roleChanged', {`

### `roles.selectRole`

Used in 1 location(s):

- **src/components/Navigation/RoleSelector.tsx:127** - `{t('roles.selectRole', 'Select Role')}`

### `roles.hierarchy`

Used in 1 location(s):

- **src/components/Navigation/RoleSelector.tsx:160** - `{t('roles.hierarchy', 'Level')}: {definition.hierarchy}`

### `roles.permissions`

Used in 1 location(s):

- **src/components/Navigation/RoleSelector.tsx:163** - `• {t('roles.permissions', 'Editable Fields')}: {Object.values(definition.permissions).filter(p => p === 'full').length}`

### `roles.currentPermissions`

Used in 1 location(s):

- **src/components/Navigation/RoleSelector.tsx:175** - `{t('roles.currentPermissions', 'Current Permissions')}:`

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
- ... and 117 more

## 🔄 Keys with Multiple Usage

### `EN` (2 usages)

- **src/tools/translation-runtime-detector.ts:311**
- **src/tools/translation-runtime-detector.ts:311**

### `RU` (2 usages)

- **src/tools/translation-runtime-detector.ts:311**
- **src/tools/translation-runtime-detector.ts:311**

### ` ` (2 usages)

- **src/tools/translation-runtime-detector.ts:342**
- **src/tools/translation-runtime-detector.ts:371**

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

