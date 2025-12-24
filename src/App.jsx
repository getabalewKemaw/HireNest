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
import DashboardLayout from './components/dashboard/DashboardLayout';

// Auth Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import SelectRolePage from './pages/auth/SelectRolePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminVerifyOtpPage from './pages/admin/AdminVerifyOtpPage';
import ApprovalsPage from './pages/admin/ApprovalsPage';
import AdminCVTemplatesPage from './pages/admin/AdminCVTemplatesPage';
import UserManagementPage from './pages/admin/UserManagementPage';
// Seeker Pages
import SeekerProfilePage from './pages/seeker/SeekerProfilePage';
import JobBoardPage from './pages/seeker/JobBoardPage';
import JobDetailPage from './pages/seeker/JobDetailPage';
import MyApplicationsPage from './pages/seeker/MyApplicationsPage';
import SavedJobsPage from './pages/seeker/SavedJobsPage';
import JobAlertsPage from './pages/seeker/JobAlertsPage';
import CVBuilderPage from './pages/seeker/CVBuilderPage';
import PlaceholderPage from './pages/PlaceholderPage';

// Employer Pages
import PostJobPage from './pages/employer/PostJobPage';
import CompanyProfilePage from './pages/employer/CompanyProfilePage';
import ManageJobsPage from './pages/employer/ManageJobsPage';
import ApplicantsPage from './pages/employer/ApplicantsPage';

// Payment Pages
import PaymentCallbackPage from './pages/payment/PaymentCallbackPage';

import useAuthStore from './store/authStore';
import { ROUTES } from './config/constants';
import EmaChatWidget from './components/landing/EmaChatWidget';

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
      '/applications', // Seeker applications
      '/messages',
      '/saved',
      '/my-jobs',
      '/work-diary',
      '/stats',
      '/earnings',
      '/talent',
      '/contracts',
      '/reports',
      '/billing',
      '/settings',
      '/seeker/',
      '/employer/profile', // Employer profile uses DashboardLayout
      '/alerts', // Job alerts
      '/cv-builder'
    ];

    // Special handling: 
    // Seeker Job Board (/jobs) USES DashboardLayout -> Hide Main Navbar.
    // Employer Manage Jobs (/jobs/manage) USES Main Navbar -> Show Main Navbar.
    if (path === '/jobs' || (path.startsWith('/jobs/') && !path.includes('/manage'))) {
      return false; // Hide Main Navbar for Seeker Jobs
    }

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

          {/* Payment Routes */}
          <Route path="/payment/callback" element={<PaymentCallbackPage />} />

          {/* Protected Routes - General Dashboard */}
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PlaceholderPage title="Settings" /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><PlaceholderPage title="Messages" /></ProtectedRoute>} />

          {/* Seeker Dashboard Routes */}
          <Route path="/jobs" element={<ProtectedRoute allowedRoles="SEEKER"><DashboardLayout><JobBoardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><DashboardLayout><JobDetailPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute allowedRoles="SEEKER"><DashboardLayout><MyApplicationsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute allowedRoles="SEEKER"><DashboardLayout><SavedJobsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute allowedRoles="SEEKER"><DashboardLayout><JobAlertsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/cv-builder" element={<ProtectedRoute allowedRoles="SEEKER"><CVBuilderPage /></ProtectedRoute>} />
          <Route path={ROUTES.SEEKER.PROFILE} element={<ProtectedRoute allowedRoles="SEEKER"><DashboardLayout><SeekerProfilePage /></DashboardLayout></ProtectedRoute>} />

          {/* Employer Dashboard Routes */}
          <Route path="/post-job" element={<ProtectedRoute allowedRoles="EMPLOYER"><PostJobPage /></ProtectedRoute>} />
          <Route path="/employer/profile" element={<ProtectedRoute allowedRoles="EMPLOYER"><DashboardLayout><CompanyProfilePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/jobs/manage" element={<ProtectedRoute allowedRoles="EMPLOYER"><ManageJobsPage /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute allowedRoles="EMPLOYER"><ApplicantsPage /></ProtectedRoute>} />

          {/* Admin Dashboard Routes */}
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<ProtectedRoute allowedRoles="ADMIN"><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles="ADMIN"><ApprovalsPage /></ProtectedRoute>} />
          <Route path="/admin/cv-templates" element={<ProtectedRoute allowedRoles="ADMIN"><DashboardLayout><AdminCVTemplatesPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles="ADMIN"><PlaceholderPage title="Platform Analytics" /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles="ADMIN"><DashboardLayout><UserManagementPage /></DashboardLayout></ProtectedRoute>} />
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

      {/* Global Ema AI Assistant */}
      <EmaChatWidget />
    </div>
  );
}

export default App;
