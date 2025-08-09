/**
 * Security Sanitization Utilities
 * Handles SQL injection, XSS, and other security threats
 */

import { 
  SecurityError,
  XSSAttemptError,
  SQLInjectionError,
  ErrorFactory,
  ErrorType
} from '../errors/custom-errors';

export interface SanitizationResult {
  sanitized: string;
  threatsDetected: SecurityThreat[];
  modified: boolean;
}

export interface SecurityThreat {
  type: 'sql_injection' | 'xss' | 'control_chars' | 'unicode_attack' | 'path_traversal' | 'command_injection';
  field: string;
  originalValue: string;
  sanitizedValue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export class SecuritySanitizer {
  private readonly SQL_INJECTION_PATTERNS = [
    // Classic SQL injection patterns
    /('|(\\-\\-)|(;)|(\\|)|(\\*)|(%7C))/gi,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi,
    /(script|javascript|vbscript|onload|onerror)/gi,
    // Advanced patterns
    /\\b(OR|AND)\\b.*(=|LIKE|IN|EXISTS)/gi,
    /\\b(WAITFOR|DELAY)\\b/gi,
    /(xp_|sp_)/gi,
    /\/\*.*\*\//g,
    /;\\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/gi
  ];

  private readonly XSS_PATTERNS = [
    // Basic XSS patterns
    /<[^>]*>/g,
    /javascript:/gi,
    /vbscript:/gi,
    /on\\w+\\s*=/gi,
    // Advanced XSS patterns
    /&lt;|&gt;|&quot;|&#x|&#\\d+/gi,
    /%3C|%3E|%22|%27/gi,
    /\\u[0-9a-fA-F]{4}/g,
    /data:text\/html/gi,
    /data:image\/svg/gi,
    // Event handlers
    /(onabort|onblur|onchange|onclick|ondblclick|onerror|onfocus)/gi,
    /(onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove)/gi,
    /(onmouseout|onmouseover|onmouseup|onreset|onresize|onselect)/gi,
    /(onsubmit|onunload)/gi
  ];

  private readonly COMMAND_INJECTION_PATTERNS = [
    // Command injection patterns
    /[;&|`$()\\\\]/g,
    /\\b(cmd|powershell|bash|sh|exec|eval)\\b/gi,
    /\\$\\{.*\\}/g,
    /\.\.\//g,
    /%2e%2e%2f|%2e%2e%5c/gi
  ];

  private readonly UNICODE_THREATS = [
    // Zero-width characters
    /[\\u200B-\\u200F]/g,
    // Line separators
    /[\\u2028-\\u202E]/g,
    // Word joiners
    /[\\u2060-\\u206F]/g,
    // RTL/LTR overrides
    /[\\u202A-\\u202E]/g,
    // Invisible characters
    /[\\u00AD\\u061C\\u115F\\u1160\\u17B4\\u17B5]/g
  ];

  private readonly CONTROL_CHARS = /[\\x00-\\x1F\\x7F-\\x9F]/g;

  /**
   * Comprehensive sanitization of input string
   */
  sanitizeString(input: string, fieldName: string): SanitizationResult {
    if (typeof input !== 'string') {
      return {
        sanitized: String(input),
        threatsDetected: [],
        modified: false
      };
    }

    let sanitized = input;
    const threats: SecurityThreat[] = [];
    let modified = false;

    // 1. Detect and handle SQL injection
    if (this.containsSQLInjection(input)) {
      const originalLength = sanitized.length;
      sanitized = this.sanitizeSQLInjection(sanitized);
      modified = true;
      
      threats.push({
        type: 'sql_injection',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'critical',
        description: 'SQL injection attempt detected and neutralized'
      });
    }

    // 2. Detect and handle XSS
    if (this.containsXSS(input)) {
      sanitized = this.sanitizeXSS(sanitized);
      modified = true;
      
      threats.push({
        type: 'xss',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'high',
        description: 'XSS attempt detected and neutralized'
      });
    }

    // 3. Detect and handle command injection
    if (this.containsCommandInjection(input)) {
      sanitized = this.sanitizeCommandInjection(sanitized);
      modified = true;
      
      threats.push({
        type: 'command_injection',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'critical',
        description: 'Command injection attempt detected and neutralized'
      });
    }

    // 4. Handle control characters
    if (this.CONTROL_CHARS.test(input)) {
      sanitized = sanitized.replace(this.CONTROL_CHARS, '');
      modified = true;
      
      threats.push({
        type: 'control_chars',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'medium',
        description: 'Control characters removed'
      });
    }

    // 5. Handle Unicode threats
    if (this.containsUnicodeThreats(input)) {
      sanitized = this.sanitizeUnicodeThreats(sanitized);
      modified = true;
      
      threats.push({
        type: 'unicode_attack',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'medium',
        description: 'Dangerous Unicode sequences neutralized'
      });
    }

    // 6. Handle path traversal
    if (this.containsPathTraversal(input)) {
      sanitized = this.sanitizePathTraversal(sanitized);
      modified = true;
      
      threats.push({
        type: 'path_traversal',
        field: fieldName,
        originalValue: input,
        sanitizedValue: sanitized,
        severity: 'high',
        description: 'Path traversal attempt neutralized'
      });
    }

    // 7. Final normalization
    sanitized = sanitized.normalize('NFC').trim();

    // 8. Length limiting
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
      modified = true;
    }

    return {
      sanitized,
      threatsDetected: threats,
      modified
    };
  }

  /**
   * Sanitize numeric values with overflow protection
   */
  sanitizeNumber(input: any, fieldName: string): { sanitized: number; threats: SecurityThreat[] } {
    const threats: SecurityThreat[] = [];
    
    if (typeof input === 'string') {
      // Check for code injection in numeric strings
      if (this.containsSQLInjection(input) || this.containsXSS(input)) {
        threats.push({
          type: 'sql_injection',
          field: fieldName,
          originalValue: input,
          sanitizedValue: '0',
          severity: 'critical',
          description: 'Malicious code in numeric field, replaced with 0'
        });
        return { sanitized: 0, threats };
      }
    }

    const num = Number(input);
    
    if (isNaN(num)) {
      return { sanitized: 0, threats };
    }
    
    if (!isFinite(num)) {
      threats.push({
        type: 'unicode_attack', // Using as general category
        field: fieldName,
        originalValue: String(input),
        sanitizedValue: '0',
        severity: 'medium',
        description: 'Non-finite number (Infinity/NaN) replaced with 0'
      });
      return { sanitized: 0, threats };
    }
    
    // Overflow protection
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
      const sanitized = Math.sign(num) * Number.MAX_SAFE_INTEGER;
      threats.push({
        type: 'unicode_attack', // Using as general category
        field: fieldName,
        originalValue: String(input),
        sanitizedValue: String(sanitized),
        severity: 'medium',
        description: 'Number overflow protected'
      });
      return { sanitized, threats };
    }
    
    return { sanitized: num, threats };
  }

  /**
   * Detection methods
   */
  private containsSQLInjection(input: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  private containsXSS(input: string): boolean {
    return this.XSS_PATTERNS.some(pattern => pattern.test(input));
  }

  private containsCommandInjection(input: string): boolean {
    return this.COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  private containsUnicodeThreats(input: string): boolean {
    return this.UNICODE_THREATS.some(pattern => pattern.test(input)) ||
           input !== input.normalize('NFC');
  }

  private containsPathTraversal(input: string): boolean {
    return /(\.\.|%2e%2e)/gi.test(input);
  }

  /**
   * Sanitization methods
   */
  private sanitizeSQLInjection(input: string): string {
    let sanitized = input;
    
    // Remove dangerous SQL keywords and characters
    sanitized = sanitized.replace(/['\"\\\\;\\-\\-\\/\\*\\*\\/]/g, '');
    sanitized = sanitized.replace(/(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi, '');
    sanitized = sanitized.replace(/(xp_|sp_|sys\\.)/gi, '');
    sanitized = sanitized.replace(/\\b(OR|AND)\\b.*(=|LIKE|IN|EXISTS)/gi, '');
    sanitized = sanitized.replace(/\\b(WAITFOR|DELAY)\\b/gi, '');
    
    return sanitized;
  }

  private sanitizeXSS(input: string): string {
    let sanitized = input;
    
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    // Remove javascript: and vbscript: protocols
    sanitized = sanitized.replace(/(javascript|vbscript|data):/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/on\\w+\\s*=/gi, '');
    
    // HTML entity decode and re-encode
    sanitized = sanitized
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#x[0-9a-fA-F]+;/g, '')
      .replace(/&#\\d+;/g, '');
    
    // Remove any remaining HTML-like structures
    sanitized = sanitized.replace(/[<>]/g, '');
    
    return sanitized;
  }

  private sanitizeCommandInjection(input: string): string {
    let sanitized = input;
    
    // Remove command injection characters
    sanitized = sanitized.replace(/[;&|`$()\\\\]/g, '');
    
    // Remove command keywords
    sanitized = sanitized.replace(/\\b(cmd|powershell|bash|sh|exec|eval)\\b/gi, '');
    
    // Remove variable substitution patterns
    sanitized = sanitized.replace(/\\$\\{.*\\}/g, '');
    
    return sanitized;
  }

  private sanitizeUnicodeThreats(input: string): string {
    let sanitized = input;
    
    // Remove dangerous Unicode characters
    this.UNICODE_THREATS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Normalize Unicode
    sanitized = sanitized.normalize('NFC');
    
    return sanitized;
  }

  private sanitizePathTraversal(input: string): string {
    let sanitized = input;
    
    // Remove path traversal sequences
    sanitized = sanitized.replace(/\.\./g, '');
    sanitized = sanitized.replace(/%2e%2e/gi, '');
    
    return sanitized;
  }

  /**
   * Create security error from threat detection
   */
  createSecurityError(threat: SecurityThreat): SecurityError {
    const errorType = threat.type === 'sql_injection' ? ErrorType.SQL_INJECTION_ATTEMPT :
                     threat.type === 'xss' ? ErrorType.XSS_ATTEMPT :
                     ErrorType.UNICODE_ERROR;
    
    return ErrorFactory.create(
      errorType,
      `Security threat detected in field '${threat.field}': ${threat.description}`,
      { 
        field: threat.field, 
        threatType: threat.type,
        severity: threat.severity,
        description: threat.description
      }
    ) as SecurityError;
  }

  /**
   * Validate if string is safe for Excel processing
   */
  validateForExcel(input: string): { safe: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for Excel formula injection
    if (/^[=@+\\-]/.test(input.trim())) {
      issues.push('Potential Excel formula injection');
    }
    
    // Check for cell references that could cause issues
    if (/[A-Z]+[0-9]+/.test(input)) {
      issues.push('Contains cell reference patterns');
    }
    
    // Check for Excel functions
    if (/(SUM|COUNT|VLOOKUP|INDEX|MATCH)\s*\(/i.test(input)) {
      issues.push('Contains Excel function calls');
    }
    
    return {
      safe: issues.length === 0,
      issues
    };
  }

  /**
   * Get sanitization statistics
   */
  getSanitizationStats(threats: SecurityThreat[]): {
    totalThreats: number;
    threatsByType: Record<string, number>;
    criticalThreats: number;
    highThreats: number;
  } {
    const threatsByType: Record<string, number> = {};
    let criticalThreats = 0;
    let highThreats = 0;
    
    threats.forEach(threat => {
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
      
      if (threat.severity === 'critical') {
        criticalThreats++;
      } else if (threat.severity === 'high') {
        highThreats++;
      }
    });
    
    return {
      totalThreats: threats.length,
      threatsByType,
      criticalThreats,
      highThreats
    };
  }
}