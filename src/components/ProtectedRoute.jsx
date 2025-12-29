import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../config/constants';

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  // Check role-based access
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userType = user?.userType;
    
    if (!userType || !roles.includes(userType)) {
      // User doesn't have required role - redirect to dashboard
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
