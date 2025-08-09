/**
 * Basic Input Sanitizer
 * Simple validation without heavy security processing
 */
export declare class SecuritySanitizer {
    /**
     * Basic string sanitization - trim and limit length only
     */
    sanitizeString(input: string, _fieldName: string): {
        sanitized: string;
        threatsDetected: never[];
        modified: boolean;
    };
    /**
     * Basic numeric sanitization
     */
    sanitizeNumber(input: any, _fieldName: string): {
        sanitized: number;
        threats: any[];
    };
    /**
     * Basic Excel formula validation
     */
    validateForExcel(input: string): {
        safe: boolean;
        issues: string[];
    };
    /**
     * Stub method for compatibility
     */
    createSecurityError(threat: any): any;
}
//# sourceMappingURL=security-sanitizer.d.ts.map