import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../config/constants';
import Button from './Button';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout(); // Store action
    setIsLoggingOut(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold text-white">
              HireNest
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to={ROUTES.HOME} className="text-white hover:text-accent transition-colors">
                  Home
                </Link>
                <Link to={ROUTES.LOGIN} className="text-white hover:text-accent transition-colors">
                  Login
                </Link>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.DASHBOARD} className="text-white hover:text-accent transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">
                    {user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    loading={isLoggingOut}
                    className="!text-white !border-white hover:!bg-white hover:!text-primary"
                  >
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-light border-t border-primary-dark">
          <div className="px-4 py-3 space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.HOME}
                  className="block text-white hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="block text-white hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Button
                  variant="success"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    navigate(ROUTES.REGISTER);
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="block text-white hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="text-white text-sm py-2 border-t border-primary-dark">
                  {user?.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={handleLogout}
                  loading={isLoggingOut}
                  className="!text-white !border-white hover:!bg-white hover:!text-primary"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
