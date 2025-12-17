import api, { handleApiError } from './api';
import { setAccessToken, clearAccessToken } from '../utils/tokenUtils';

/**
 * Authentication service for all auth-related API calls
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/api/v1/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Verify email with OTP
 * @param {Object} otpData - OTP verification data
 * @returns {Promise<Object>} Verification response
 */
export const verifyEmail = async (otpData) => {
  try {
    const response = await api.post('/api/v1/auth/verify-otp', otpData);
    
    // Store access token if provided
    if (response.data.token) {
      setAccessToken(response.data.token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login response
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/v1/auth/login', credentials);
    
    // Store access token
    if (response.data.token) {
      setAccessToken(response.data.token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    await api.post('/api/v1/auth/logout');
    clearAccessToken();
    return { success: true };
  } catch (error) {
    // Clear token even if API call fails
    clearAccessToken();
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Request password reset OTP
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/v1/auth/forgot-password', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Verify password reset OTP
 * @param {Object} otpData - OTP data
 * @returns {Promise<Object>} Response with reset token
 */
export const verifyResetOTP = async (otpData) => {
  try {
    const response = await api.post('/api/v1/auth/verify-reset-otp', otpData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Reset password data
 * @returns {Promise<Object>} Response
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/api/v1/auth/reset-password', resetData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Refresh access token
 * @returns {Promise<Object>} Response with new tokens
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/api/v1/auth/refresh');
    
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    clearAccessToken();
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Admin login
 * @param {Object} credentials - Admin credentials
 * @returns {Promise<Object>} Response with OTP token
 */
export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/api/v1/admin/auth/login', credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Verify admin OTP
 * @param {Object} otpData - Admin OTP data
 * @returns {Promise<Object>} Response with tokens
 */
export const verifyAdminOTP = async (otpData) => {
  try {
    const response = await api.post('/api/v1/admin/auth/verify-otp', otpData);
    
    if (response.data.token) {
      setAccessToken(response.data.token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Google OAuth success handler
 * @returns {Promise<Object>} Response
 */
export const handleGoogleOAuthSuccess = async () => {
  try {
    const response = await api.get('/api/v1/auth/oauth-success');
    
    if (response.data.token) {
      setAccessToken(response.data.token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

/**
 * Select role for Google OAuth user
 * @param {Object} roleData - Role selection data
 * @returns {Promise<Object>} Response
 */
export const selectRole = async (roleData) => {
  try {
    const response = await api.post('/api/v1/auth/select-role', null, {
      params: roleData,
    });
    
    if (response.data.token) {
      setAccessToken(response.data.token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};
