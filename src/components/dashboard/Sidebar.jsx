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
    LayoutDashboard
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ role }) => {
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

    return (
        <div className="w-72 bg-[#0B1C2D] text-white h-screen fixed left-0 top-0 hidden lg:flex flex-col border-r border-white/5 z-50 shadow-2xl">
            <div className="px-8 py-10">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center font-bold text-white text-xl italic shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">H</div>
                    <span className="text-2xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">HireNest</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-10 scrollbar-hide">
                {groups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                        <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-4">{group.title}</h3>
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
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-[-1rem] w-1.5 h-6 bg-secondary rounded-r-full" />
                                        )}
                                        <item.icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                                        <span className="font-semibold text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 bg-[#0D2136] mx-4 mb-6 rounded-2xl">
                <div className="flex items-center gap-3 p-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold border border-secondary/20">
                        C
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">HireNest Pro</div>
                        <div className="text-[10px] text-gray-400">Upgrade for more perks</div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-3 w-full py-3 text-gray-400 hover:text-white hover:bg-error/10 hover:text-red-400 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="font-bold text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
