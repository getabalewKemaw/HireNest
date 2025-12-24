import React from 'react';
import {
    BarChart3,
    Users,
    Briefcase,
    CheckSquare,
    Settings,
    Bell,
    LogOut,
    User,
    ShieldCheck,
    FileText,
    Bookmark,
    MessageSquare,
    Search,
    Zap,
    CreditCard,
    PieChart,
    HelpCircle,
    Clock,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ role, isCollapsed = false, toggleCollapse, isMobile = false }) => {
    const location = useLocation();
    const { logout } = useAuthStore();

    const menuGroups = {
        SEEKER: [
            {
                title: "Main Menu",
                items: [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                    { icon: Search, label: 'Find Work', path: '/jobs' },
                    { icon: Bell, label: 'Job Alerts', path: '/alerts' },
                    { icon: Bookmark, label: 'Saved Jobs', path: '/saved' },
                    { icon: MessageSquare, label: 'Messages', path: '/messages' },
                ]
            },
            {
                title: "Jobs & Applications",
                items: [
                    { icon: Briefcase, label: 'My Jobs', path: '/my-jobs' },
                    { icon: CheckSquare, label: 'Applications', path: '/applications' },
                    { icon: Clock, label: 'Work Diary', path: '/work-diary' },
                ]
            },
            {
                title: "Career & Growth",
                items: [
                    { icon: User, label: 'My Profile', path: '/seeker/profile' },
                    { icon: FileText, label: 'CV Builder', path: '/cv-builder' },
                    { icon: Zap, label: 'My Stats', path: '/stats' },
                    { icon: CreditCard, label: 'Earnings', path: '/earnings' },
                ]
            }
        ],
        EMPLOYER: [
            {
                title: "Recruitment",
                items: [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                    { icon: FileText, label: 'Post a Job', path: '/post-job' },
                    { icon: Briefcase, label: 'Manage Jobs', path: '/jobs/manage' },
                    { icon: Search, label: 'Discover Talent', path: '/talent' },
                ]
            },
            {
                title: "Candidate Management",
                items: [
                    { icon: Users, label: 'Applicants', path: '/applicants' },
                    { icon: MessageSquare, label: 'Messages', path: '/messages' },
                    { icon: CheckSquare, label: 'Contracts', path: '/contracts' },
                ]
            },
            {
                title: "Business Tools",
                items: [
                    { icon: User, label: 'Company Profile', path: '/employer/profile' },
                    { icon: PieChart, label: 'Hiring Reports', path: '/reports' },
                    { icon: CreditCard, label: 'Billing & Payments', path: '/billing' },
                ]
            }
        ],
        ADMIN: [
            {
                title: "System Control",
                items: [
                    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
                    { icon: ShieldCheck, label: 'Approvals', path: '/admin/approvals' },
                    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
                ]
            },
            {
                title: "User Management",
                items: [
                    { icon: Users, label: 'Manage Users', path: '/admin/users' },
                    { icon: Briefcase, label: 'Job Moderation', path: '/admin/jobs' },
                    { icon: Bell, label: 'Reports & Flags', path: '/admin/reports' },
                ]
            },
            {
                title: "Platform Admin",
                items: [
                    { icon: FileText, label: 'CV Templates', path: '/admin/cv-templates' },
                    { icon: CreditCard, label: 'Financials', path: '/admin/financials' },
                    { icon: HelpCircle, label: 'Support Tickets', path: '/admin/support' },
                    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
                ]
            }
        ]
    };

    const groups = menuGroups[role] || [];
    const isCondensed = isCollapsed && !isMobile;

    return (
        <div className={`${isCondensed ? 'w-24' : 'w-72'} bg-[#0B1C2D] text-white h-screen ${isMobile ? 'flex w-full' : 'hidden lg:flex fixed left-0 top-0 bottom-0'} flex-col border-r border-white/5 z-50 shadow-2xl transition-all duration-300 ease-in-out`}>

            {/* Desktop Toggle Button */}
            {!isMobile && (
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-20 bg-secondary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-50 border border-white/10"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            )}

            <div className={`px-6 py-8 flex items-center ${isCondensed ? 'justify-center' : 'justify-between'}`}>
                <Link to="/" className="flex items-center gap-3 group overflow-hidden">
                    <img
                        src="/image.png"
                        alt="EtWorks Logo"
                        className={`transition-all duration-500 ${isCondensed ? 'w-10 h-10' : 'w-10 h-10 group-hover:rotate-6'}`}
                    />
                    {!isCondensed && (
                        <span className="text-2xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic whitespace-nowrap">
                            EtWorks
                        </span>
                    )}
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-10 scrollbar-hide mt-4">
                {groups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                        {!isCondensed && (
                            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-4 animate-fade-in">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                                            ? 'bg-secondary text-white shadow-xl shadow-secondary/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            } ${isCondensed ? 'justify-center' : ''}`}
                                        title={isCondensed ? item.label : ''}
                                    >
                                        {isActive && !isCondensed && (
                                            <div className="absolute left-[-1rem] w-1.5 h-6 bg-secondary rounded-r-full" />
                                        )}
                                        <item.icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />

                                        {!isCondensed && (
                                            <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className={`p-4 mx-4 mb-6 rounded-2xl transition-all duration-300 ${isCondensed ? 'bg-transparent' : 'border-t border-white/5 bg-[#0D2136]'}`}>
                {!isCondensed ? (
                    <>
                        <div className="flex items-center gap-3 p-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold border border-secondary/20">
                                {role?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-bold text-white truncate">EtWorks Pro</div>
                                <div className="text-[10px] text-gray-400 truncate">Upgrade for more perks</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-3 w-full py-3 text-gray-400 hover:text-white hover:bg-error/10 hover:text-red-400 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={18} />
                            <span className="font-bold text-sm">Sign Out</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        className="flex items-center justify-center w-full py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
