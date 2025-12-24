import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Search,
  Briefcase,
  Users,
  Zap,
  ShieldCheck,
  Globe,
  Bell,
  Bookmark
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTheme from '../hooks/useTheme';
import useNotificationStore from '../store/notificationStore';
import { ROUTES } from '../config/constants';
import Button from './Button';
import MobileMenu from './MobileMenu';
import NotificationPanel from './NotificationPanel';

/**
 * Navigation Bar Component
 * Redesigned for a professional SaaS feel with dropdowns and user profiles
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Initial fetch for notifications
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUnreadCount(user.id);

      // Optional: Set up polling for notifications
      const interval = setInterval(() => {
        fetchUnreadCount(user.id);
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.id, fetchUnreadCount]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate(ROUTES.LOGIN);
  };

  const navLinkClass = (path) => `
    flex items-center gap-1.5 font-accent font-black text-xs uppercase tracking-widest transition-all duration-300 relative group py-2
    ${location.pathname === path ? 'text-secondary' : 'text-primary dark:text-gray-300 hover:text-secondary dark:hover:text-white'}
  `;

  const dropdownItemClass = "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/5 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary transition-all font-accent font-black text-[10px] uppercase tracking-wider";

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled
      ? 'bg-white/40 dark:bg-[#0B1C2D]/40 backdrop-blur-2xl shadow-2xl shadow-primary/5 border-b border-white/10 dark:border-white/5 py-4'
      : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo - Restored Original Branding */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-3 group relative z-10 transition-transform hover:scale-[1.02]">
            <img
              src="/image.png"
              alt="Etworks Logo"
              className="h-10 w-auto transition-transform duration-500 group-hover:rotate-6 shadow-sm  rounded-full"
            />
            <span className="text-2xl font-accent font-black text-primary dark:text-white tracking-tighter ">
              EtWorks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between ml-16" ref={dropdownRef}>
            <div className="flex items-center space-x-10">
              {/* Opportunities Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('opps')}
                  className={navLinkClass()}
                >
                  Find Work <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'opps' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'opps' && (
                  <div
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-[#0F2439] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 p-3 animate-fade-in"
                  >
                    <Link to="/jobs" className={dropdownItemClass}><Search size={18} /> Browse All Jobs</Link>
                    <Link to="/jobs/recommended" className={dropdownItemClass}><Zap size={18} /> Recommended for You</Link>
                    <Link to="/saved" className={dropdownItemClass}><Bookmark size={18} /> Saved Jobs</Link>
                    <Link to="/categories" className={dropdownItemClass}><Globe size={18} /> Job Categories</Link>
                  </div>
                )}
              </div>

              {/* Hiring Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('hiring')}
                  className={navLinkClass()}
                >
                  For Hiring <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'hiring' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'hiring' && (
                  <div
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-[#0F2439] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 p-3 animate-fade-in"
                  >
                    <Link to="/talent" className={dropdownItemClass}><Users size={18} /> Discover Talent</Link>
                    <Link to="/post-job" className={dropdownItemClass}><Briefcase size={18} /> Post a Job</Link>
                    <Link to="/enterprise" className={dropdownItemClass}><ShieldCheck size={18} /> Etworks Enterprise</Link>
                  </div>
                )}
              </div>

              <Link to="/resources" className={navLinkClass()}>
                Resources
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all active:scale-95"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all active:scale-95 relative"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-secondary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B1C2D]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>
              )}

              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to={ROUTES.LOGIN} className="font-bold text-primary dark:text-white hover:text-secondary transition-colors">
                    Log In
                  </Link>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    className="!bg-secondary hover:!bg-secondary-dark !text-white !px-10 !rounded-2xl shadow-xl shadow-secondary/30 transition-all hover:-translate-y-1 font-black uppercase text-xs tracking-widest"
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                    className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-indigo-600 flex items-center justify-center text-white font-black text-lg overflow-hidden border-2 border-transparent hover:border-secondary transition-all shadow-md">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === 'user' && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-[#0F2439] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 p-4 animate-fade-in z-50">
                      <div className="px-4 py-4 mb-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</div>
                        <div className="font-bold text-primary dark:text-white truncate">{user?.email}</div>
                      </div>

                      <div className="space-y-1">
                        <Link to={ROUTES.DASHBOARD} className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <LayoutDashboard size={18} /> My Dashboard
                        </Link>
                        {user?.userType === 'SEEKER' && (
                          <Link to={ROUTES.SEEKER.PROFILE} className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                            <User size={18} /> My Profile
                          </Link>
                        )}
                        {user?.userType === 'SEEKER' && (
                          <Link to="/saved" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                            <Bookmark size={18} /> Saved Jobs
                          </Link>
                        )}
                        <Link to="/settings" className={dropdownItemClass} onClick={() => setActiveDropdown(null)}>
                          <Settings size={18} /> Settings
                        </Link>
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-white/5 my-3 mx-2"></div>

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black uppercase text-xs tracking-wider"
                      >
                        <LogOut size={18} /> {isLoggingOut ? 'Signing out...' : 'Log Out'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary dark:text-white focus:outline-none p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
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
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </nav>
  );
};

export default Navbar;
