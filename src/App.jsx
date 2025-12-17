import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import DashboardPage from './pages/DashboardPage';

// Auth Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import SelectRolePage from './pages/auth/SelectRolePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminVerifyOtpPage from './pages/admin/AdminVerifyOtpPage';

import useAuthStore from './store/authStore';
import { ROUTES } from './config/constants';

/**
 * Main App Component
 */
function App() {
  const { initializeAuth } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyOtpPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

            <Route path={ROUTES.GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />
            <Route path={ROUTES.SELECT_ROLE} element={<SelectRolePage />} />

            <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
            <Route path={ROUTES.ADMIN_VERIFY_OTP} element={<AdminVerifyOtpPage />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path={ROUTES.ADMIN.DASHBOARD}
              element={
                <ProtectedRoute allowedRoles="ADMIN">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Employer Routes */}
            <Route
              path={ROUTES.EMPLOYER.DASHBOARD}
              element={
                <ProtectedRoute allowedRoles="EMPLOYER">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Seeker Routes */}
            <Route
              path={ROUTES.SEEKER.DASHBOARD}
              element={
                <ProtectedRoute allowedRoles="SEEKER">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
