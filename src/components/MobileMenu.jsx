import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { LayoutDashboard, User, LogOut, Search, Users, Briefcase, Globe, Bookmark } from 'lucide-react';
import Button from './Button';

const MobileMenu = ({
    isOpen,
    setIsOpen,
    isAuthenticated,
    user,
    handleLogout,
    isLoggingOut
}) => {
    const navigate = useNavigate();

    const menuLinkClass = "flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-black italic text-primary dark:text-white hover:bg-secondary/10 hover:text-secondary dark:hover:text-secondary transition-all";

    return (
        <div
            className={`md:hidden fixed inset-x-0 top-20 z-[90] bg-white/95 dark:bg-[#0B1C2D]/95 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 shadow-2xl transition-all duration-500 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
        >
            <div className="px-6 py-8 space-y-2 overflow-y-auto max-h-[80vh]">
                {!isAuthenticated ? (
                    <>
                        <Link to="/jobs" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <Search size={20} /> Find Work
                        </Link>
                        <Link to="/talent" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <Users size={20} /> Hire Talent
                        </Link>
                        <a href="#how-it-works" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <Rocket size={20} /> How It Works
                        </a>
                        <a href="#contact" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <Globe size={20} /> Contact Us
                        </a>
                        <div className="h-px bg-gray-100 dark:bg-white/5 my-4"></div>
                        <Link
                            to={ROUTES.LOGIN}
                            className="block text-center font-bold text-primary dark:text-white py-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Log In
                        </Link>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => {
                                navigate(ROUTES.REGISTER);
                                setIsOpen(false);
                            }}
                            className="!bg-secondary !rounded-[1.5rem] !py-5 font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20"
                        >
                            Create Account
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to={ROUTES.DASHBOARD} className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>

                        {user?.userType === 'SEEKER' && (
                            <Link to={ROUTES.SEEKER.PROFILE} className={menuLinkClass} onClick={() => setIsOpen(false)}>
                                <User size={20} /> My Profile
                            </Link>
                        )}
                        {user?.userType === 'SEEKER' && (
                            <Link to="/saved" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                                <Bookmark size={20} /> Saved Jobs
                            </Link>
                        )}

                        <Link to="/jobs" className={menuLinkClass} onClick={() => setIsOpen(false)}>
                            <Briefcase size={20} /> Browse Jobs
                        </Link>

                        <div className="py-6 border-t border-gray-100 dark:border-white/5 mt-6">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white font-black text-xl">
                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated</div>
                                    <div className="font-bold text-primary dark:text-white truncate">{user?.email}</div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={handleLogout}
                                loading={isLoggingOut}
                                className="!rounded-2xl !py-4 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 dark:border-white/10 dark:text-gray-400 font-black uppercase tracking-widest text-xs"
                            >
                                <LogOut size={16} className="inline mr-2" /> {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileMenu;
