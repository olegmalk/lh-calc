import { useTranslation } from 'react-i18next';
import { UserRole } from '../types/roles.types';

/**
 * Safe translation hook that provides fallbacks if translations are missing
 */
export function useSafeTranslation() {
  const { t, i18n } = useTranslation();

  const safeT = (key: string, fallback?: string): string => {
    try {
      const translated = t(key);
      // If translation key is returned as-is, it means translation is missing
      if (translated === key && fallback) {
        return fallback;
      }
      return translated;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  };

  // Role-specific safe translations with built-in fallbacks
  const getRoleName = (role: UserRole): string => {
    const fallbacks: Record<UserRole, string> = {
      'technologist': 'Technologist',
      'engineer': 'Design Engineer',
      'supply-manager': 'Supply Manager',
      'director': 'Director',
      'viewer': 'Viewer'
    };

    return safeT(`roles.names.${role}`, fallbacks[role]);
  };

  const getRoleDescription = (role: UserRole): string => {
    const fallbacks: Record<UserRole, string> = {
      'technologist': 'Technical specification and equipment configuration',
      'engineer': 'Engineering design and component specifications',
      'supply-manager': 'Cost management and supply chain parameters',
      'director': 'Executive decisions and final cost adjustments',
      'viewer': 'Read-only access to all calculations'
    };

    return safeT(`roles.descriptions.${role}`, fallbacks[role]);
  };

  return {
    t: safeT,
    i18n,
    getRoleName,
    getRoleDescription
  };
}