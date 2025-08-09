/**
 * Enhanced Field Validation Framework
 * Comprehensive validation for all Excel API edge cases
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    sanitizedData?: any;
}
export interface ValidationError {
    field: string;
    value: any;
    message: string;
    code: string;
}
export interface ValidationWarning {
    field: string;
    message: string;
}
export declare class FieldValidator {
    private schema;
    private validationRules;
    constructor();
    /**
     * Build Joi schema from validation rules
     */
    private buildJoiSchema;
    /**
     * Validate request data
     */
    validate(data: any): ValidationResult;
    /**
     * Sanitize input data
     */
    private sanitizeInput;
    /**
     * Validate business rules
     */
    private validateBusinessRules;
    /**
     * Check for edge cases
     */
    private checkEdgeCases;
    /**
     * Get required fields list
     */
    getRequiredFields(): string[];
    /**
     * Get field metadata
     */
    getFieldMetadata(fieldName: string): any;
}
//# sourceMappingURL=field-validator.d.ts.map