import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User, Moon, Sun, ChevronDown, Settings, LogOut, Shield, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const DashboardNavbar = ({ onMenuClick, isSidebarOpen, isDesktopCollapsed }) => {
    const { user, logout } = useAuthStore();
    const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotificationStore();
    const [isDark, setIsDark] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const prevPendingCount = useRef(0);
    const prevStatus = useRef(null);
    const dropdownRef = useRef(null);

    // Dynamic Polling for both Admin and Employer
    useEffect(() => {
        if (!user) return;

        const runPoll = async () => {
            try {
                const { default: verificationService } = await import('../../services/verificationService');

                if (user.userType === 'ADMIN') {
                    const response = await verificationService.getPendingVerifications();
                    const currentCount = response.data?.length || 0;
                    if (currentCount > prevPendingCount.current) {
                        addNotification({
                            title: 'New Verification Request',
                            message: `${currentCount} company identity audits pending review.`,
                            type: 'info'
                        });
                    }
                    prevPendingCount.current = currentCount;
                } else if (user.userType === 'EMPLOYER') {
                    const response = await verificationService.getVerificationStatus();
                    const status = response.data?.status;

                    if (prevStatus.current && status !== prevStatus.current) {
                        if (status === 'APPROVED') {
                            addNotification({
                                title: 'Identity Audit Success!',
                                message: `Audit for ${response.data.companyName} is approved. Check your email ${user.email} for the 6-digit access code.`,
                                type: 'success'
                            });
                        } else if (status === 'BANNED') {
                            addNotification({
                                title: 'Identity Audit Rejected',
                                message: `Verification for ${response.data.companyName} was rejected: ${response.data.rejectionReason || 'Compliance issues detected.'}`,
                                type: 'error'
                            });
                        }
                    }
                    prevStatus.current = status;
                }
            } catch (err) {
                // Silently handle errors in background poll
            }
        };

        runPoll();
        const interval = setInterval(runPoll, 30000); // 30s polling
        return () => clearInterval(interval);
    }, [user, addNotification]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '?';
    const roleLabel = user?.userType?.charAt(0) + user?.userType?.slice(1).toLowerCase();

    return (
        <header className={`fixed top-0 right-0 left-0 ${isDesktopCollapsed ? 'lg:left-24' : 'lg:left-72'} bg-white/70 dark:bg-[#0B1C2D]/70 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 h-20 z-40 px-6 sm:px-10 transition-all duration-300 ease-in-out`}>
            <div className="h-full flex items-center justify-between gap-6">
                {/* Mobile Menu Toggle & Title Context */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={onMenuClick}
                        className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="lg:hidden flex items-center gap-2">
                        <img src="/image.png" alt="EtWorks" className="h-8 w-auto" />
                        <span className="text-lg font-black text-primary dark:text-white italic">EtWorks</span>
                    </div>
                </div>

                {/* Dynamic Search Bar - Upwork Style */}
                <div className="hidden md:flex flex-1 max-w-2xl relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary mb-0.5 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for jobs, talents, or articles..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white dark:focus:bg-[#0B1C2D] focus:border-secondary/30 transition-all dark:text-white placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>

                {/* Action Center */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleDarkMode}
                            className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all relative border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all relative group border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                        >
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            {unreadCount > 0 && (
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary rounded-full ring-4 ring-white dark:ring-[#0B1C2D] animate-pulse"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-24 mt-3 w-80 sm:w-96 bg-white dark:bg-[#0F2439] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 p-4 animate-fade-in z-[60] overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 mb-4">
                                    <h3 className="text-sm font-black text-primary dark:text-white uppercase tracking-widest italic">Notifications</h3>
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                </div>

                                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="py-10 text-center">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                <Bell size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => markAsRead(n.id)}
                                                className={`p-4 rounded-2xl flex gap-4 transition-all cursor-pointer ${n.read ? 'opacity-60 grayscale-[0.5]' : 'bg-gray-50 dark:bg-white/5 border border-transparent hover:border-secondary/20 hover:bg-secondary/5'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${n.type === 'success' ? 'bg-blue-500/10 text-blue-500' :
                                                    n.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {n.type === 'success' ? <CheckCircle2 size={18} /> :
                                                        n.type === 'error' ? <AlertCircle size={18} /> :
                                                            <Bell size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className="text-xs font-black text-primary dark:text-white leading-tight mb-1 uppercase tracking-tight">{n.title}</h4>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase whitespace-nowrap">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{n.message}</p>
                                                </div>
                                                {!n.read && <div className="w-2 h-2 rounded-full bg-secondary mt-1 flex-shrink-0 animate-pulse"></div>}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <button className="w-full mt-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">
                                        View All Notifications
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-10 w-px bg-gray-200 dark:bg-white/10"></div>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10 active:scale-95"
                        >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-secondary/20 relative overflow-hidden group">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="relative z-10">{userInitial}</span>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            <div className="hidden sm:block text-left">
                                <div className="text-sm font-black text-primary dark:text-white leading-none mb-1.5 flex items-center gap-1.5">
                                    {user?.name || 'My Account'}
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user?.userType === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div className="text-[10px] uppercase tracking-[0.15em] font-black text-gray-400">
                                        {roleLabel}
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-[#0F2439] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 p-3 animate-fade-in z-50 overflow-hidden">
                                <div className="px-5 py-4 mb-2 bg-gray-50 dark:bg-white/5 rounded-[1.5rem]">
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Account</div>
                                    <div className="font-bold text-primary dark:text-white truncate">{user?.email}</div>
                                </div>

                                <div className="space-y-1">
                                    <Link
                                        to={user?.userType === 'SEEKER' ? '/seeker/profile' : '/settings'}
                                        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl hover:bg-secondary/5 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary group transition-all"
                                    >
                                        <User size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-bold text-sm">My Profile</span>
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl hover:bg-secondary/5 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary group transition-all"
                                    >
                                        <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                        <span className="font-bold text-sm">Account Settings</span>
                                    </Link>
                                    {user?.userType === 'ADMIN' && (
                                        <Link
                                            to="/admin/safety"
                                            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl hover:bg-red-500/5 text-red-500 transition-all"
                                        >
                                            <Shield size={18} />
                                            <span className="font-bold text-sm">Safety Controls</span>
                                        </Link>
                                    )}
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-white/5 my-3 mx-2"></div>

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all mb-1 group"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                    <span className="font-black text-sm uppercase tracking-wider">Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
