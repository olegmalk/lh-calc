import { v4 as uuidv4 } from 'uuid';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import type { CalculationResult } from '../lib/calculation-engine/types';

const STORAGE_KEY = 'lh-calc-v2-data';
const STORAGE_VERSION = '2.0';
const LEGACY_KEYS = ['lh-calculator-data', 'lh-calculations', 'lh-projects'];

export interface SavedCalculation {
  id: string;
  name: string;
  projectId: string;
  inputs: HeatExchangerInput;
  results: CalculationResult;
  savedAt: string;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  calculationCount?: number;
}

export interface StorageData {
  calculations: Record<string, SavedCalculation>;
  projects: Record<string, Project>;
  settings: {
    lastProjectId?: string;
    locale?: string;
  };
  version: string;
}

class StorageService {
  private static instance: StorageService;
  private data: StorageData;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private loadFromStorage(): StorageData {
    try {
      // Clean up legacy keys
      this.cleanupLegacyStorage();
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as StorageData;
        // Validate data structure
        if (this.validateStorageData(data) && data.version === STORAGE_VERSION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to load storage data:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }

    // Return default data structure
    const defaultProject = this.createDefaultProject();
    return {
      calculations: {},
      projects: {
        [defaultProject.id]: defaultProject
      },
      settings: {
        lastProjectId: defaultProject.id
      },
      version: STORAGE_VERSION
    };
  }
  
  private cleanupLegacyStorage(): void {
    // Remove old localStorage keys to prevent conflicts
    LEGACY_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`Removing legacy storage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }
  
  private validateStorageData(data: unknown): boolean {
    // Basic validation to ensure data structure is correct
    const storageData = data as Record<string, unknown>;
    if (!storageData || typeof storageData !== 'object') return false;
    if (!storageData.calculations || typeof storageData.calculations !== 'object') return false;
    if (!storageData.projects || typeof storageData.projects !== 'object') return false;
    if (!storageData.settings || typeof storageData.settings !== 'object') return false;
    if (!storageData.version || typeof storageData.version !== 'string') return false;
    
    // Validate each calculation has required fields
    const calculations = storageData.calculations as Record<string, Record<string, unknown>>;
    for (const calc of Object.values(calculations)) {
      if (!calc.id || !calc.inputs || !calc.results) return false;
    }
    
    return true;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some old calculations.');
      }
      throw error;
    }
  }

  private createDefaultProject(): Project {
    return {
      id: 'default',
      name: 'Основной проект',
      createdAt: new Date().toISOString()
    };
  }

  // Calculation methods
  saveCalculation(
    name: string,
    inputs: HeatExchangerInput,
    results: CalculationResult,
    projectId?: string
  ): string {
    const id = uuidv4();
    const calculation: SavedCalculation = {
      id,
      name: name || `Расчет ${new Date().toLocaleDateString()}`,
      projectId: projectId || this.data.settings.lastProjectId || 'default',
      inputs,
      results,
      savedAt: new Date().toISOString(),
      version: STORAGE_VERSION
    };

    this.data.calculations[id] = calculation;
    this.data.settings.lastProjectId = calculation.projectId;
    this.saveToStorage();

    return id;
  }

  loadCalculation(id: string): SavedCalculation | null {
    return this.data.calculations[id] || null;
  }

  updateCalculation(id: string, updates: Partial<SavedCalculation>): boolean {
    if (!this.data.calculations[id]) {
      return false;
    }

    this.data.calculations[id] = {
      ...this.data.calculations[id],
      ...updates,
      id // Prevent ID changes
    };

    this.saveToStorage();
    return true;
  }

  deleteCalculation(id: string): boolean {
    if (!this.data.calculations[id]) {
      return false;
    }

    delete this.data.calculations[id];
    this.saveToStorage();
    return true;
  }

  listCalculations(projectId?: string): SavedCalculation[] {
    const calculations = Object.values(this.data.calculations);
    
    if (projectId) {
      return calculations.filter(calc => calc.projectId === projectId);
    }
    
    return calculations.sort((a, b) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }

  searchCalculations(query: string): SavedCalculation[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.data.calculations).filter(calc =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.inputs.equipmentType?.toLowerCase().includes(lowerQuery)
    );
  }

  // Project methods
  createProject(name: string): string {
    const id = uuidv4();
    const project: Project = {
      id,
      name,
      createdAt: new Date().toISOString()
    };

    this.data.projects[id] = project;
    this.saveToStorage();
    return id;
  }

  updateProject(id: string, updates: Partial<Project>): boolean {
    if (!this.data.projects[id]) {
      return false;
    }

    this.data.projects[id] = {
      ...this.data.projects[id],
      ...updates,
      id // Prevent ID changes
    };

    this.saveToStorage();
    return true;
  }

  deleteProject(id: string): boolean {
    if (id === 'default' || !this.data.projects[id]) {
      return false;
    }

    // Move calculations to default project
    Object.values(this.data.calculations)
      .filter(calc => calc.projectId === id)
      .forEach(calc => {
        calc.projectId = 'default';
      });

    delete this.data.projects[id];
    this.saveToStorage();
    return true;
  }

  listProjects(): Project[] {
    const projects = Object.values(this.data.projects);
    
    // Add calculation count
    return projects.map(project => ({
      ...project,
      calculationCount: this.listCalculations(project.id).length
    })).sort((a, b) => 
      a.id === 'default' ? -1 : 
      b.id === 'default' ? 1 : 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getProject(id: string): Project | null {
    return this.data.projects[id] || null;
  }

  // Storage management
  getStorageSize(): number {
    try {
      const data = JSON.stringify(this.data);
      return new Blob([data]).size;
    } catch {
      return 0;
    }
  }

  getStorageInfo(): {
    calculationCount: number;
    projectCount: number;
    sizeInBytes: number;
    sizeInMB: number;
    percentUsed: number;
  } {
    const sizeInBytes = this.getStorageSize();
    const maxSize = 5 * 1024 * 1024; // 5MB localStorage limit
    
    return {
      calculationCount: Object.keys(this.data.calculations).length,
      projectCount: Object.keys(this.data.projects).length,
      sizeInBytes,
      sizeInMB: sizeInBytes / (1024 * 1024),
      percentUsed: (sizeInBytes / maxSize) * 100
    };
  }

  clearOldCalculations(keepCount: number = 100): number {
    const calculations = this.listCalculations();
    
    if (calculations.length <= keepCount) {
      return 0;
    }

    const toDelete = calculations.slice(keepCount);
    toDelete.forEach(calc => {
      delete this.data.calculations[calc.id];
    });

    this.saveToStorage();
    return toDelete.length;
  }

  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as StorageData;
      
      if (imported.version !== STORAGE_VERSION) {
        throw new Error('Incompatible data version');
      }

      this.data = imported;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAll(): void {
    const defaultProject = this.createDefaultProject();
    this.data = {
      calculations: {},
      projects: {
        [defaultProject.id]: defaultProject
      },
      settings: {
        lastProjectId: defaultProject.id
      },
      version: STORAGE_VERSION
    };
    this.saveToStorage();
  }
}

export const storageService = StorageService.getInstance();