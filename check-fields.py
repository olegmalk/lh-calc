import requests
import json

# Make request to upload endpoint
with open('/home/vmuser/dev/lh_calc/calc.xlsx', 'rb') as f:
    files = {'excel': ('calc.xlsx', f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    response = requests.post('http://localhost:3000/api/upload-prefill', files=files)

data = response.json()
fields = data.get('extracted_fields', {})

# Fields defined in app-sectioned.js (from our analysis)
expected_tech_fields = [
    'tech_D27_sequenceNumber',
    'tech_E27_customerOrderPosition',
    'tech_F27_deliveryType',
    'tech_G27_sizeTypeK4',
    'tech_H27_passes',
    'tech_I27_plateQuantity',
    'tech_J27_calcPressureHotSide',
    'tech_K27_calcPressureColdSide',
    'tech_L27_calcTempHotSide',
    'tech_M27_calcTempColdSide',
    'tech_P27_plateMaterial',
    'tech_Q27_materialType',
    'tech_R27_bodyMaterial',
    'tech_S27_plateSurfaceType',
    'tech_T27_drawDepth',
    'tech_U27_plateThickness',
    'tech_V27_claddingThickness'
]

print("=== Checking for mismatched fields ===")
print(f"Total extracted fields: {len(fields)}")
print(f"Expected tech fields: {len(expected_tech_fields)}")

# Check which expected fields are missing from extraction
missing_from_extraction = []
for field in expected_tech_fields:
    if field not in fields:
        missing_from_extraction.append(field)

if missing_from_extraction:
    print(f"\nMissing from extraction: {missing_from_extraction}")

# Check which extracted fields are not in expected list (might be extra)
extra_fields = []
for field_id in fields.keys():
    if field_id.startswith('tech_') and field_id not in expected_tech_fields:
        extra_fields.append(field_id)

if extra_fields:
    print(f"\nExtra tech fields extracted (might be skipped): {extra_fields[:10]}")

# Show some extracted fields that might not match
print("\nSample of extracted fields:")
for i, (field_id, value) in enumerate(fields.items()):
    if i < 5:
        print(f"  {field_id}: {value}")