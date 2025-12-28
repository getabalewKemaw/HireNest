import { create } from 'zustand';
import { getUserFromToken, getAccessToken, clearAccessToken, setAccessToken } from '../utils/tokenUtils';
import * as authService from '../services/authService';
import * as seekerService from '../services/seekerService';

/**
 * Zustand store for authentication state management
 */
const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,
  tempEmail: null, // For OTP flows
  tempToken: null, // For role selection flow

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
   * Sync profile info (name, image) from backend
   */
  syncProfile: async () => {
    const { user, isAuthenticated } = get();
    if (!isAuthenticated || !user) return;

    try {
      if (user.userType === 'SEEKER') {
        const result = await seekerService.getBasicInfo();
        if (result.success && result.data) {
          const profile = result.data;
          set((state) => ({
            user: {
              ...state.user,
              name: `${profile.firstName} ${profile.lastName}`.trim() || state.user.email?.split('@')[0],
              firstName: profile.firstName,
              lastName: profile.lastName,
              profileImage: profile.profileImageUrl,
              profileImageUrl: profile.profileImageUrl,
              phone: profile.phone,
              gender: profile.gender,
            }
          }));
          console.log('👤 [AUTH] Seeker profile synced successfully');
        }
      } else if (user.userType === 'EMPLOYER') {
        try {
          const response = await api.get('/api/v1/company-profile/me');
          if (response.data) {
            set((state) => ({
              user: {
                ...state.user,
                name: response.data.companyName || state.user.email?.split('@')[0],
                companyName: response.data.companyName,
                logoUrl: response.data.logoUrl
              }
            }));
            console.log('👤 [AUTH] Employer profile synced successfully');
          }
        } catch (e) {
          console.warn('👤 [AUTH] Employer profile sync skipped - profile may not exist yet');
        }
      }
    } catch (err) {
      console.error('👤 [AUTH] Profile sync failed:', err.message);
    }
  },

  /**
   * Initialize auth state
   * Tries to get token from memory or refresh it from backend cookie
   */
  initializeAuth: async () => {
    console.log('🔐 [AUTH] Initializing authentication...');

    // 1. Check memory token
    let token = getAccessToken();
    console.log('🔐 [AUTH] Memory token exists:', !!token);

    // 2. If no memory token, try silent refresh (cookie)
    if (!token) {
      console.log('🔐 [AUTH] No memory token, attempting refresh from cookie...');
      try {
        const refreshResult = await authService.refreshToken();
        console.log('🔐 [AUTH] Refresh result:', refreshResult.success ? 'SUCCESS' : 'FAILED');

        if (refreshResult.success && refreshResult.data.accessToken) {
          token = refreshResult.data.accessToken;
          console.log('🔐 [AUTH] ✅ Token refreshed successfully');
        } else {
          console.log('🔐 [AUTH] ❌ Refresh failed - no accessToken in response');
        }
      } catch (err) {
        console.error('🔐 [AUTH] ❌ Refresh error:', err.message);
      }
    }

    if (!token) {
      token = getAccessToken();
    }

    if (token) {
      const user = getUserFromToken(token);
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isCheckingAuth: false
        });
        // Start profile sync in background
        get().syncProfile();
        return;
      }
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: false
    });
  },

  // --- Async Actions ---

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    const result = await authService.login(credentials);
    if (result.success) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false });
      // Sync profile after login
      get().syncProfile();
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
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  verifyOtp: async (otp) => {
    set({ isLoading: true, error: null });
    const { tempEmail } = get();
    const result = await authService.verifyEmail({ email: tempEmail, otp });
    if (result.success) {
      if (result.data.token) {
        const user = getUserFromToken(result.data.token);
        set({ user, isAuthenticated: true, isLoading: false });
        get().syncProfile();
      } else if (result.data.needsRoleSelection && result.data.tempToken) {
        set({ tempToken: result.data.tempToken, isLoading: false });
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

  selectRoleAction: async (roleData) => {
    set({ isLoading: true, error: null });
    const result = await authService.selectRole(roleData);
    if (result.success && result.data.token) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false });
      get().syncProfile();
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  completeRegistrationAction: async (roleData) => {
    set({ isLoading: true, error: null });
    const result = await authService.completeRegistration(roleData);
    if (result.success && result.data.token) {
      const user = getUserFromToken(result.data.token);
      set({ user, isAuthenticated: true, isLoading: false, tempToken: null });
      get().syncProfile();
      return result.data;
    } else {
      set({ error: result.error.message, isLoading: false });
      throw new Error(result.error.message);
    }
  },

  socialLogin: (token, email, role) => {
    setAccessToken(token);
    const user = getUserFromToken(token);
    const userObj = user || { email, role, userType: role };
    set({ user: userObj, isAuthenticated: true, isLoading: false });
    get().syncProfile();
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
