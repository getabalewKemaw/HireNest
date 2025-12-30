import axios from 'axios';
import { API_CONFIG, HTTP_STATUS } from '../config/constants';
import { getAccessToken, setAccessToken, clearAccessToken, isTokenExpired } from '../utils/tokenUtils';

/**
 * Axios instance with interceptors for authentication
 */
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {},
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    console.log('=== API Request ===');
    console.log('🌐 URL:', config.url);
    console.log('📤 Method:', config.method?.toUpperCase());
    console.log('🔑 Token exists:', !!token);

    if (token) {
      const isCloudinary = config.url && config.url.includes('cloudinary.com');
      if (!isTokenExpired(token) && !isCloudinary) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request');
        console.log('🔐 Token preview:', token.substring(0, 20) + '...');
      } else if (isCloudinary) {
        console.log('ℹ️ Cloudinary URL - skipping Authorization header');
      } else {
        console.warn('⚠️ Token is expired!');
        console.warn('⚠️ This request will likely fail with 401');
      }
    } else {
      // Don't warn for refresh endpoint or public endpoints
      const isPublic = [
        '/api/v1/auth/refresh',
        '/api/v1/auth/login',
        '/api/v1/auth/register',
        '/api/v1/public/'
      ].some(path => config.url && config.url.includes(path));

      if (!isPublic) {
        console.error('❌ No token found for protected endpoint:', config.url);
        console.error('⚠️ This will result in 401 Unauthorized!');
        console.error('💡 Check if auth is initialized before calling this endpoint');
      } else {
        console.log('ℹ️ Public endpoint - no auth required');
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and token refresh
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        console.log('🔄 [API] Attempting token refresh...');
        let accessToken = null;

        // 1. Try regular user refresh
        try {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/auth/refresh`, {}, { withCredentials: true });
          accessToken = response.data.accessToken;
        } catch (e) {
          if (e.response?.status !== 401) throw e;
        }

        // 2. Try admin refresh if regular failed
        if (!accessToken) {
          try {
            const adminResponse = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/admin/auth/refresh`, {}, { withCredentials: true });
            accessToken = adminResponse.data.accessToken;
          } catch (e) {
            // Both failed
            console.error('❌ [API] Both refresh attempts failed');
            throw e;
          }
        }

        if (accessToken) {
          console.log('✅ [API] Token refreshed successfully');
          setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ [API] Token refresh failed permanently');
        clearAccessToken();
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API error handler
 * @param {Error} error - Axios error object
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors || null,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: null,
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
    };
  }
};

export default api;
