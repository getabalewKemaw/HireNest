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

export const logout = async () => {
  try {
    // 1. Try regular logout
    try {
      await api.post('/api/v1/auth/logout');
    } catch (e) {
      console.warn('Regular logout failed or already logged out'+ e.message);
    }

    // 2. Try admin logout
    try {
      await api.post('/api/v1/admin/auth/logout');
    } catch (e) {
      console.warn('Admin logout failed or already logged out' + e.message);
    }

    clearAccessToken();
    return { success: true };
  } catch (error) {
    // Clear token even if API calls fail
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

export const refreshToken = async () => {
  try {
    // 1. Try regular user refresh
    try {
      const response = await api.post('/api/v1/auth/refresh');
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        return { success: true, data: response.data };
      }
    } catch (e) {
      // If 401, it might be an admin, continue to next try
      if (e.response?.status !== 401) throw e;
    }

    // 2. Try admin refresh
    const adminResponse = await api.post('/api/v1/admin/auth/refresh');
    if (adminResponse.data.accessToken) {
      setAccessToken(adminResponse.data.accessToken);
      return { success: true, data: adminResponse.data };
    }

    return { success: false, error: { message: 'Refresh failed' } };
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

/**
 * Complete registration with role selection (for standard auth)
 * @param {Object} data - { token, userType }
 * @returns {Promise<Object>} Response
 */
export const completeRegistration = async (data) => {
  try {
    const response = await api.post('/api/v1/auth/complete-registration', data);

    if (response.data.token) {
      setAccessToken(response.data.token);
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};
