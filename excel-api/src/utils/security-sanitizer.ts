/**
 * Basic Input Sanitizer
 * Simple validation without heavy security processing
 */

export class SecuritySanitizer {

  /**
   * Basic string sanitization - trim and limit length only
   */
  sanitizeString(input: string, _fieldName: string) {
    if (typeof input !== 'string') {
      return {
        sanitized: String(input),
        threatsDetected: [],
        modified: false
      };
    }

    let sanitized = input.trim();
    let modified = false;

    // Length limiting only
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
      modified = true;
    }

    return {
      sanitized,
      threatsDetected: [],
      modified
    };
  }

  /**
   * Basic numeric sanitization
   */
  sanitizeNumber(input: any, _fieldName: string): { sanitized: number; threats: any[] } {
    const num = Number(input);
    
    if (isNaN(num) || !isFinite(num)) {
      return { sanitized: 0, threats: [] };
    }
    
    // Basic overflow protection
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
      return { sanitized: Math.sign(num) * Number.MAX_SAFE_INTEGER, threats: [] };
    }
    
    return { sanitized: num, threats: [] };
  }

  /**
   * Basic Excel formula validation
   */
  validateForExcel(input: string): { safe: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Basic Excel formula injection check only
    if (/^[=@+\-]/.test(input.trim())) {
      issues.push('Potential Excel formula injection');
    }
    
    return {
      safe: issues.length === 0,
      issues
    };
  }

  /**
   * Stub method for compatibility 
   */
  createSecurityError(threat: any): any {
    return new Error('Security error: ' + threat.description);
  }
}