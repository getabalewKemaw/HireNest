import { VALIDATION_RULES } from '../config/constants';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return VALIDATION_RULES.EMAIL.MESSAGE;
  }
  
  return null;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  }
  
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return VALIDATION_RULES.PASSWORD.MESSAGE;
  }
  
  return null;
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validates OTP code
 * @param {string} otp - OTP to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateOTP = (otp) => {
  if (!otp || otp.trim() === '') {
    return 'OTP is required';
  }
  
  if (!VALIDATION_RULES.OTP.PATTERN.test(otp)) {
    return VALIDATION_RULES.OTP.MESSAGE;
  }
  
  return null;
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  
  return null;
};

export const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*#?&]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2) return 'medium';
  return 'strong';
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates form fields
 * @param {Object} fields - Object with field names and values
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} Object with field names and error messages
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((fieldName) => {
    const value = fields[fieldName];
    const rule = rules[fieldName];
    
    if (rule.required) {
      const error = validateRequired(value, rule.label || fieldName);
      if (error) {
        errors[fieldName] = error;
        return;
      }
    }
    
    if (rule.type === 'email') {
      const error = validateEmail(value);
      if (error) errors[fieldName] = error;
    }
    
    if (rule.type === 'password') {
      const error = validatePassword(value);
      if (error) errors[fieldName] = error;
    }
    
    if (rule.type === 'passwordConfirm') {
      const error = validatePasswordConfirmation(fields[rule.matchField], value);
      if (error) errors[fieldName] = error;
    }
    
    if (rule.type === 'otp') {
      const error = validateOTP(value);
      if (error) errors[fieldName] = error;
    }
    
    if (rule.custom) {
      const error = rule.custom(value, fields);
      if (error) errors[fieldName] = error;
    }
  });
  
  return errors;
};
