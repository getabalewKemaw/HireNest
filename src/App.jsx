import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
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
import ApprovalsPage from './pages/admin/ApprovalsPage';
// Seeker Pages
import SeekerProfilePage from './pages/seeker/SeekerProfilePage';
import PlaceholderPage from './pages/PlaceholderPage';

import useAuthStore from './store/authStore';
import { ROUTES } from './config/constants';

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { initializeAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Determine if Navbar and Footer should be shown
  const shouldShowLayout = useMemo(() => {
    const path = location.pathname;

    // Hide layout for Auth pages
    if (path.startsWith('/auth') || path.startsWith('/admin/auth')) {
      return false;
    }

    // Hide layout for Dashboard and related pages
    const dashboardPaths = [
      '/dashboard',
      '/admin/',
      '/jobs',
      '/applications',
      '/messages',
      '/saved',
      '/my-jobs',
      '/work-diary',
      '/stats',
      '/earnings',
      '/post-job',
      '/talent',
      '/contracts',
      '/reports',
      '/billing',
      '/settings'
    ];

    return !dashboardPaths.some(p => path.includes(p));
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent shadow-xl"></div>
          <div className="text-secondary font-black text-xl italic animate-pulse">Initializing HireNest...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowLayout && <Navbar />}

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

          {/* Protected Routes - General Dashboard */}
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PlaceholderPage title="Settings" /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><PlaceholderPage title="Messages" /></ProtectedRoute>} />

          {/* Seeker Dashboard Routes */}
          <Route path="/jobs" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="Find Work" /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="Saved Jobs" /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="My Applications" /></ProtectedRoute>} />
          <Route path="/my-jobs" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="Current Jobs" /></ProtectedRoute>} />
          <Route path="/work-diary" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="Work Diary" /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="My Statistics" /></ProtectedRoute>} />
          <Route path="/earnings" element={<ProtectedRoute allowedRoles="SEEKER"><PlaceholderPage title="My Earnings" /></ProtectedRoute>} />
          <Route path={ROUTES.SEEKER.PROFILE} element={<ProtectedRoute allowedRoles="SEEKER"><SeekerProfilePage /></ProtectedRoute>} />

          {/* Employer Dashboard Routes */}
          <Route path="/post-job" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Post a Job" /></ProtectedRoute>} />
          <Route path="/jobs/manage" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Manage Jobs" /></ProtectedRoute>} />
          <Route path="/talent" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Discover Talent" /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Applicant Tracking" /></ProtectedRoute>} />
          <Route path="/contracts" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Candidate Contracts" /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Hiring Analytics" /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles="EMPLOYER"><PlaceholderPage title="Billing & Invoices" /></ProtectedRoute>} />

          {/* Admin Dashboard Routes */}
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<ProtectedRoute allowedRoles="ADMIN"><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles="ADMIN"><ApprovalsPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="Platform Analytics" /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="User Management" /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="Job Moderation" /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="System Flags" /></ProtectedRoute>} />
          <Route path="/admin/financials" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="Platform Revenue" /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="Customer Support" /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="System Config" /></ProtectedRoute>} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>

      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;
