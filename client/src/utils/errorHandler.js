/**
 * Error Handler Utility
 * Converts technical errors into user-friendly messages
 */

// Map of common error patterns to friendly messages
const errorMessages = {
    // Network errors
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
    'Failed to fetch': 'Unable to reach the server. Please check your internet connection and try again.',
    'ERR_NETWORK': 'Network connection lost. Please check your internet and try again.',
    'ERR_CONNECTION_REFUSED': 'Cannot connect to the server. Please try again later.',
    
    // Authentication errors
    'Unauthorized': 'Your session has expired. Please log in again.',
    'Invalid token': 'Your session has expired. Please log in again.',
    'Token expired': 'Your session has expired. Please log in again.',
    'Authentication failed': 'Invalid username or password. Please try again.',
    'Access denied': 'You do not have permission to perform this action.',
    
    // Validation errors
    'Validation failed': 'Please check your input and try again.',
    'Invalid email': 'Please enter a valid email address.',
    'Invalid phone': 'Please enter a valid phone number.',
    'Password too short': 'Password must be at least 6 characters long.',
    'Passwords do not match': 'The passwords you entered do not match.',
    'Required field': 'Please fill in all required fields.',
    'Email already exists': 'This email is already registered. Please use a different email.',
    'Username already exists': 'This username is already taken. Please choose another one.',
    
    // File upload errors
    'File too large': 'The file you selected is too large. Maximum size is 5MB.',
    'Invalid file type': 'This file type is not supported. Please upload an image (JPG, PNG, or GIF).',
    'Upload failed': 'Failed to upload file. Please try again.',
    
    // Database errors
    'Database error': 'A server error occurred. Please try again later.',
    'Duplicate entry': 'This record already exists in the system.',
    'Record not found': 'The requested item could not be found.',
    'Cannot delete': 'This item cannot be deleted because it is being used elsewhere.',
    
    // Server errors
    '500': 'A server error occurred. Our team has been notified. Please try again later.',
    '503': 'The server is temporarily unavailable. Please try again in a few minutes.',
    '404': 'The requested resource was not found.',
    '400': 'Invalid request. Please check your input and try again.',
    
    // Timeout errors
    'timeout': 'The request took too long. Please try again.',
    'ETIMEDOUT': 'Connection timed out. Please check your internet and try again.',
    
    // Permission errors
    'Forbidden': 'You do not have permission to access this resource.',
    'Not allowed': 'This action is not allowed.',
    
    // Default fallback
    'default': 'An unexpected error occurred. Please try again or contact support if the problem persists.'
};

/**
 * Convert technical error to user-friendly message
 * @param {Error|string|Object} error - The error to convert
 * @returns {string} User-friendly error message
 */
export const getFriendlyErrorMessage = (error) => {
    // If error is null or undefined
    if (!error) {
        return errorMessages.default;
    }

    // If error is a string
    if (typeof error === 'string') {
        return matchErrorMessage(error);
    }

    // If error is an Error object
    if (error instanceof Error) {
        return matchErrorMessage(error.message);
    }

    // If error is an object with message property
    if (error.message) {
        return matchErrorMessage(error.message);
    }

    // If error is an object with error property
    if (error.error) {
        return matchErrorMessage(error.error);
    }

    // If error has response (axios error)
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (message) {
            return matchErrorMessage(message);
        }
        
        if (status) {
            return matchErrorMessage(status.toString());
        }
    }

    // Default fallback
    return errorMessages.default;
};

/**
 * Match error message against known patterns
 * @param {string} message - Error message to match
 * @returns {string} Friendly error message
 */
const matchErrorMessage = (message) => {
    if (!message) return errorMessages.default;

    const messageStr = message.toString().toLowerCase();

    // Check for exact matches first
    for (const [key, value] of Object.entries(errorMessages)) {
        if (messageStr.includes(key.toLowerCase())) {
            return value;
        }
    }

    // Check for partial matches
    if (messageStr.includes('network') || messageStr.includes('connection')) {
        return errorMessages['Network Error'];
    }

    if (messageStr.includes('auth') || messageStr.includes('login') || messageStr.includes('token')) {
        return errorMessages['Unauthorized'];
    }

    if (messageStr.includes('validation') || messageStr.includes('invalid')) {
        return errorMessages['Validation failed'];
    }

    if (messageStr.includes('permission') || messageStr.includes('forbidden') || messageStr.includes('access')) {
        return errorMessages['Access denied'];
    }

    if (messageStr.includes('timeout') || messageStr.includes('timed out')) {
        return errorMessages['timeout'];
    }

    if (messageStr.includes('file') || messageStr.includes('upload')) {
        return errorMessages['Upload failed'];
    }

    if (messageStr.includes('database') || messageStr.includes('server')) {
        return errorMessages['Database error'];
    }

    // If no match found, return the original message if it's user-friendly
    // (doesn't contain technical jargon)
    if (!containsTechnicalJargon(messageStr)) {
        return message;
    }

    // Otherwise return default message
    return errorMessages.default;
};

/**
 * Check if message contains technical jargon
 * @param {string} message - Message to check
 * @returns {boolean} True if contains technical terms
 */
const containsTechnicalJargon = (message) => {
    const technicalTerms = [
        'undefined', 'null', 'exception', 'stack trace', 'errno',
        'econnrefused', 'enotfound', 'syntax error', 'reference error',
        'type error', 'range error', 'eval error', 'uri error',
        'internal server error', 'bad gateway', 'service unavailable',
        'mongoose', 'mongodb', 'sql', 'query', 'schema'
    ];

    return technicalTerms.some(term => message.includes(term));
};

/**
 * Display error in a toast/alert with friendly message
 * @param {Error|string|Object} error - The error to display
 * @param {string} context - Optional context (e.g., 'saving user', 'uploading file')
 */
export const showErrorAlert = (error, context = '') => {
    const friendlyMessage = getFriendlyErrorMessage(error);
    const fullMessage = context 
        ? `Error ${context}: ${friendlyMessage}`
        : friendlyMessage;
    
    alert(fullMessage);
};

/**
 * Display success message
 * @param {string} message - Success message to display
 */
export const showSuccessAlert = (message) => {
    alert(`✅ ${message}`);
};

/**
 * Validate form field and return friendly error
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @param {Object} rules - Validation rules
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, rules = {}) => {
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
        return `${fieldName} is required`;
    }

    // Email validation
    if (rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (rules.phone && value) {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number';
        }
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
        return `${fieldName} must not exceed ${rules.maxLength} characters`;
    }

    // URL validation
    if (rules.url && value) {
        try {
            new URL(value);
        } catch {
            return 'Please enter a valid URL';
        }
    }

    // Number validation
    if (rules.number && value && isNaN(value)) {
        return `${fieldName} must be a number`;
    }

    // Min value validation
    if (rules.min !== undefined && value < rules.min) {
        return `${fieldName} must be at least ${rules.min}`;
    }

    // Max value validation
    if (rules.max !== undefined && value > rules.max) {
        return `${fieldName} must not exceed ${rules.max}`;
    }

    return null;
};

/**
 * Validate entire form
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Object with errors for each field
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    for (const [fieldName, rules] of Object.entries(validationRules)) {
        const error = validateField(fieldName, formData[fieldName], rules);
        if (error) {
            errors[fieldName] = error;
        }
    }

    return errors;
};

export default {
    getFriendlyErrorMessage,
    showErrorAlert,
    showSuccessAlert,
    validateField,
    validateForm
};
