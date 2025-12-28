// Brand Colors - Centralized color definitions
export const COLORS = {
  // Primary - Deep Navy (Trust & Authority)
  primary: {
    DEFAULT: '#0B1C2D',
    light: '#1a2f45',
    dark: '#050e17',
  },

  // Secondary - Royal Blue (Action & Tech)
  secondary: {
    DEFAULT: '#2563EB',
    light: '#3b82f6',
    dark: '#1d4ed8',
  },

  // Accent - Emerald Green (Success & Hiring)
  accent: {
    DEFAULT: '#10B981',
    light: '#34d399',
    dark: '#059669',
  },

  // Warning - Amber
  warning: {
    DEFAULT: '#F59E0B',
    light: '#fbbf24',
    dark: '#d97706',
  },

  // Error - Soft Red
  error: {
    DEFAULT: '#EF4444',
    light: '#f87171',
    dark: '#dc2626',
  },

  // Background
  background: {
    DEFAULT: '#F8FAFC',
    white: '#FFFFFF',
    gray: '#F3F4F6',
  },

  // Text
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    white: '#FFFFFF',
  },
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Auth Configuration
export const AUTH_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_BUFFER: 60000, // 1 minute before expiry
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYER: 'EMPLOYER',
  JOB_SEEKER: 'SEEKER',
};

// User Types (for registration)
export const USER_TYPES = {
  SEEKER: 'SEEKER',
  EMPLOYER: 'EMPLOYER',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',         // Updated path
  REGISTER: '/auth/register',   // Updated path
  VERIFY_EMAIL: '/auth/verify-otp', // Updated path
  FORGOT_PASSWORD: '/auth/forgot-password', // Updated path
  RESET_PASSWORD: '/auth/reset-password',   // Updated path

  // Google Auth
  GOOGLE_CALLBACK: '/auth/google-callback',
  SELECT_ROLE: '/auth/select-role',

  // Admin Auth
  ADMIN_LOGIN: '/admin/auth/login',
  ADMIN_VERIFY_OTP: '/admin/auth/verify-otp',

  // Public Pages
  CONTACT: '/contact',
  HOW_IT_WORKS: '/how-it-works',

  // Protected Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Role-specific Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    JOBS: '/admin/jobs',
  },
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    POST_JOB: '/employer/post-job',
    MY_JOBS: '/employer/my-jobs',
    APPLICATIONS: '/employer/applications',
  },
  SEEKER: {
    DASHBOARD: '/seeker/dashboard',
    JOBS: '/seeker/jobs',
    APPLICATIONS: '/seeker/applications',
    PROFILE: '/seeker/profile',
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    MESSAGE: 'Password must be at least 8 characters with at least 1 letter and 1 number',
  },
  OTP: {
    LENGTH: 6,
    PATTERN: /^\d{6}$/,
    MESSAGE: 'OTP must be 6 digits',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Toast/Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
