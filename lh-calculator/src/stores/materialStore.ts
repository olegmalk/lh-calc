import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MaterialProperties } from '../lib/calculation-engine/types';
import { MATERIAL_DENSITIES, NAMED_RANGES } from '../lib/calculation-engine/constants';

interface MaterialState {
  materials: Map<string, MaterialProperties>;
  availableMaterials: {
    plate: string[];
    body: string[];
  };
  
  getMaterial: (name: string) => MaterialProperties | undefined;
  updateMaterialPrice: (name: string, pricePerKg: number) => void;
  addMaterial: (material: MaterialProperties) => void;
}

const initializeMaterials = (): Map<string, MaterialProperties> => {
  const materials = new Map<string, MaterialProperties>();
  
  // Initialize default materials
  materials.set('AISI 316L', {
    name: 'AISI 316L',
    density: MATERIAL_DENSITIES['AISI 316L'],
    pricePerKg: 850,
    temperatureStressMatrix: new Map([
      [20, 170],
      [100, 160],
      [150, 154],
      [200, 150],
      [250, 145],
      [300, 140],
    ]),
  });
  
  materials.set('AISI 304', {
    name: 'AISI 304',
    density: MATERIAL_DENSITIES['AISI 304'],
    pricePerKg: 750,
    temperatureStressMatrix: new Map([
      [20, 165],
      [100, 155],
      [150, 150],
      [200, 145],
      [250, 140],
      [300, 135],
    ]),
  });
  
  materials.set('Ст3', {
    name: 'Ст3',
    density: MATERIAL_DENSITIES.STEEL,
    pricePerKg: 120,
  });
  
  materials.set('Ст20', {
    name: 'Ст20',
    density: MATERIAL_DENSITIES.STEEL,
    pricePerKg: 150,
  });
  
  materials.set('09Г2С', {
    name: '09Г2С',
    density: MATERIAL_DENSITIES.STEEL,
    pricePerKg: 180,
  });
  
  materials.set('12Х18Н10Т', {
    name: '12Х18Н10Т',
    density: MATERIAL_DENSITIES.STAINLESS_STEEL,
    pricePerKg: 900,
  });
  
  return materials;
};

export const useMaterialStore = create<MaterialState>()(
  devtools(
    (set, get) => ({
      materials: initializeMaterials(),
      availableMaterials: {
        plate: NAMED_RANGES.материал_пластин,
        body: NAMED_RANGES.материал_корпуса,
      },
      
      getMaterial: (name) => {
        return get().materials.get(name);
      },
      
      updateMaterialPrice: (name, pricePerKg) =>
        set((state) => {
          const material = state.materials.get(name);
          if (material) {
            const updated = new Map(state.materials);
            updated.set(name, { ...material, pricePerKg });
            return { materials: updated };
          }
          return state;
        }),
      
      addMaterial: (material) =>
        set((state) => {
          const updated = new Map(state.materials);
          updated.set(material.name, material);
          return { materials: updated };
        }),
    })
  )
);