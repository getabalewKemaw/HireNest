import { create } from 'zustand';
import { getUserFromToken, getAccessToken, clearAccessToken, setAccessToken } from '../utils/tokenUtils';
import * as authService from '../services/authService';

/**
 * Zustand store for authentication state management
 */
const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tempEmail: null, // For OTP flows

  /**
   * Set temp email for OTP
   */
  setTempEmail: (email) => set({ tempEmail: email }),

  /**
   * Set user and authentication status
   */
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    error: null,
  }),

  /**
   * Set loading state
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Set error
   */
  setError: (error) => set({ error }),

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Initialize auth state
   * Tries to get token from memory or refresh it from backend cookie
   */
  initializeAuth: async () => {
    // 1. Check memory token
    let token = getAccessToken();

    // 2. If no memory token, try silent refresh (cookie)
    if (!token) {
      try {
        const refreshResult = await authService.refreshToken();
        if (refreshResult.success && refreshResult.data.accessToken) {
          token = refreshResult.data.accessToken;
          // setAccessToken is already called in authService.refreshToken
        }
      } catch (err) {
        // Failed to refresh, user is not logged in
      }
    }

    if (token) {
      const user = getUserFromToken(token);
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // --- Async Actions ---

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    const result = await authService.login(credentials);
    if (result.success) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    const result = await authService.register(userData);
    if (result.success) {
      set({ tempEmail: userData.email, isLoading: false });
      // Optionally auto-login if token returned, but usually verify first
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  verifyOtp: async (otp) => {
    set({ isLoading: true, error: null });
    const { tempEmail } = get();
    // authService.verifyEmail expects otpData object
    const result = await authService.verifyEmail({ email: tempEmail, otp });
    if (result.success) {
      if (result.data.token) {
        const user = getUserFromToken(result.data.token);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  adminLogin: async (credentials) => {
    set({ isLoading: true, error: null });
    const result = await authService.adminLogin(credentials);
    if (result.success) {
      set({ tempEmail: credentials.email, isLoading: false });
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  adminVerifyOtp: async (otp) => {
    set({ isLoading: true, error: null });
    const { tempEmail } = get();
    const result = await authService.verifyAdminOTP({ email: tempEmail, otp });
    if (result.success && result.data.token) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false });
      return result.data;
    } else {
      set({ error: result.error?.message || 'Verification failed', isLoading: false });
      throw new Error(result.error?.message || 'Verification failed');
    }
  },

  selectRole: async (role) => {
    set({ isLoading: true, error: null });
    const { tempEmail, user } = get();
    // Data needed: email, googleId, name, userType (role)
    // If we came from Google callback, user might not be fully in state yet or we have temp data
    // We assume the component might pass necessary data OR we stored it

    // If we are strictly using the service:
    // authService.selectRole expects roleData

    // We need to support passing more data to selectRole if needed
    // But for now, let's assume `user` object in store has the google details if partially logged in?
    // Or we rely on the component to pass { email, googleId, name, userType }

    // Let's make this action accept the full object if needed, or merge with state
  },

  // Overloaded select role to be flexible
  selectRoleAction: async (roleData) => {
    set({ isLoading: true, error: null });
    const result = await authService.selectRole(roleData);
    if (result.success && result.data.token) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false });
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  socialLogin: (token, email, role) => {
    setAccessToken(token); // Store in memory
    const user = getUserFromToken(token); // Verify validity and get full claims
    // Standardize user object
    const userObj = user || { email, role, userType: role };
    set({ user: userObj, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      tempEmail: null
    });
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role) => {
    const { user } = get();
    if (!user || !user.role) return false;
    // user.role from token: ROLE_ADMIN, ROLE_SEEKER, etc.
    // Argument role: ADMIN, SEEKER
    return user.role === `ROLE_${role}` || user.role === role;
  },

  /**
   * Get user type
   */
  getUserType: () => {
    const { user } = get();
    return user?.userType || null;
  },
}));

export default useAuthStore;
