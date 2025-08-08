import { describe, it, expect } from 'vitest';
import en from './locales/en.json';
import ru from './locales/ru.json';

describe('Localization', () => {
  it('should have all keys in both English and Russian', () => {
    const compareKeys = (obj1: any, obj2: any, path = ''): void => {
      for (const key in obj1) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
          expect(obj2).toHaveProperty(key);
          expect(typeof obj2[key]).toBe('object');
          compareKeys(obj1[key], obj2[key], currentPath);
        } else {
          expect(obj2).toHaveProperty(key);
          expect(typeof obj2[key]).toBe('string');
        }
      }
    };
    
    // Check all English keys exist in Russian
    compareKeys(en, ru);
    
    // Check all Russian keys exist in English
    compareKeys(ru, en);
  });
  
  it('should have non-empty translation strings', () => {
    const checkNonEmpty = (obj: any, path = ''): void => {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkNonEmpty(obj[key], currentPath);
        } else if (typeof obj[key] === 'string') {
          expect(obj[key].trim(), `Empty translation at ${currentPath}`).not.toBe('');
        }
      }
    };
    
    checkNonEmpty(en);
    checkNonEmpty(ru);
  });
  
  it('should have proper interpolation syntax', () => {
    const checkInterpolation = (obj: any, path = ''): void => {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkInterpolation(obj[key], currentPath);
        } else if (typeof obj[key] === 'string') {
          // Check for valid interpolation syntax {{variable}}
          const matches = obj[key].match(/\{\{[^}]+\}\}/g);
          if (matches) {
            matches.forEach((match: string) => {
              expect(match).toMatch(/^\{\{[a-zA-Z_][a-zA-Z0-9_]*\}\}$/);
            });
          }
        }
      }
    };
    
    checkInterpolation(en);
    checkInterpolation(ru);
  });
  
  it('should have matching interpolation variables between languages', () => {
    const getInterpolations = (str: string): string[] => {
      const matches = str.match(/\{\{([^}]+)\}\}/g);
      return matches ? matches.map(m => m.slice(2, -2).trim()).sort() : [];
    };
    
    const compareInterpolations = (obj1: any, obj2: any, path = ''): void => {
      for (const key in obj1) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
          if (obj2[key] && typeof obj2[key] === 'object') {
            compareInterpolations(obj1[key], obj2[key], currentPath);
          }
        } else if (typeof obj1[key] === 'string' && typeof obj2[key] === 'string') {
          const vars1 = getInterpolations(obj1[key]);
          const vars2 = getInterpolations(obj2[key]);
          
          expect(vars1, `Interpolation mismatch at ${currentPath}`).toEqual(vars2);
        }
      }
    };
    
    compareInterpolations(en, ru);
  });
});