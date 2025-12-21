import React from 'react';
import {
    Briefcase,
    CheckCircle2,
    Bookmark,
    Clock,
    ArrowUpRight,
    TrendingUp,
    Search,
    Zap,
    Globe,
    Award,
    MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SeekerDashboard = ({ user, profile }) => {
    const stats = [
        { label: 'Active Applications', value: '12', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Upcoming Interviews', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Saved Opportunities', value: '24', icon: Bookmark, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Profile Visibility', value: 'High', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ];

    const recentApps = [
        { id: 1, company: 'Google', role: 'Staff Frontend Engineer', status: 'In Review', date: '2h ago', logo: 'G' },
        { id: 2, company: 'Stripe', role: 'Senior Product Designer', status: 'Interviewing', date: '5h ago', logo: 'S' },
        { id: 3, company: 'Airbnb', role: 'Full Stack Developer', status: 'Submitted', date: '1d ago', logo: 'A' },
    ];

    const recommendations = [
        {
            id: 1,
            title: 'Senior Software Architect',
            company: 'Netflix',
            location: 'Remote, US',
            salary: '$190k - $250k',
            match: '98%',
            tags: ['React', 'System Design', 'Node.js']
        },
        {
            id: 2,
            title: 'Global Design Lead',
            company: 'Figma',
            location: 'London, UK / Remote',
            salary: '£140k - £180k',
            match: '94%',
            tags: ['UX', 'Product Strategy', 'UI']
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Premium Welcome Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-8 sm:p-12 text-white shadow-2xl shadow-secondary/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-20 -mb-20 blur-3xl animate-blob animation-delay-2000"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                            <Zap size={14} className="text-amber-400" /> Account Active
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-serif font-black mb-6 leading-[1.1]">
                            Find your next <br /> <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white/60 underline decoration-indigo-400 underline-offset-[12px]">dream role</span> today.
                        </h1>
                        <p className="text-white/70 text-lg font-heading font-light mb-10 leading-relaxed">
                            Welcome back, {profile?.firstName || user?.name?.split(' ')[0] || 'Seeker'}. We've found new job matches that align with your expertise.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/jobs" className="px-8 py-4 bg-white text-secondary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center">
                                Browse Jobs
                            </Link>
                            <Link to="/seeker/profile" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center">
                                My Profile
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 w-64 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Award size={20} className="text-white" />
                                </div>
                                <div className="text-sm font-black">Top Talent</div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-sm"></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                    <span>Profile Completion</span>
                                    <span>{profile?.profileCompletion || '20%'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="group bg-white dark:bg-white/5 p-7 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-secondary transition-all hover:shadow-2xl hover:shadow-secondary/5 cursor-pointer">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={22} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <TrendingUp size={12} /> +8.4%
                            </div>
                        </div>
                        <div className="text-3xl font-black text-primary dark:text-white mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Section - Upwork Style Job Feed */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-primary dark:text-white flex items-center gap-3">
                            <Globe className="text-secondary" /> Jobs you might like
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-colors">
                                <Search size={18} />
                            </button>
                            <Link to="/jobs" className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
                                View All
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recommendations.map((job) => (
                            <div key={job.id} className="group bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all relative">
                                <div className="absolute top-6 right-8 flex items-center gap-3">
                                    <div className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-secondary/10">
                                        {job.match} Match
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                                        <Bookmark size={20} />
                                    </button>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-gray-300 border border-gray-100 dark:border-white/5">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors mb-2 uppercase tracking-tight leading-tight">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-400 mb-6">
                                            <span className="flex items-center gap-1.5">
                                                <Globe size={14} /> {job.company}
                                            </span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>Est. Budget: <span className="text-emerald-500 font-bold">{job.salary}</span></span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {job.tags.map((tag, tIdx) => (
                                                <span key={tIdx} className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link to="/jobs" className="px-6 py-2.5 bg-secondary text-white text-xs font-black rounded-xl hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/10 uppercase tracking-widest">
                                                Explore Jobs
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aside Section - Sidebar details */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                            <h3 className="font-black text-primary dark:text-white uppercase tracking-[0.15em] text-xs">Recent Activity</h3>
                            <button className="p-2 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-all"><MoreHorizontal size={18} className="text-gray-400" /></button>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/5">
                            {recentApps.map((app) => (
                                <div key={app.id} className="p-6 hover:bg-gray-50 dark:hover:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">{app.logo}</div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${app.status === 'Interviewing' ? 'bg-secondary/10 text-secondary' :
                                            app.status === 'In Review' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-gray-100 dark:bg-white/10 text-gray-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-primary dark:text-white group-hover:text-secondary transition-colors truncate">{app.role}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.company}</span>
                                        <span className="text-[10px] text-gray-300">{app.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/applications" className="block w-full text-center p-5 bg-gray-50 dark:bg-white/5 text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all">
                            View All Tracking <ArrowUpRight size={14} className="inline ml-1 mb-1" />
                        </Link>
                    </div>

                    {/* Quick Tips or Upsell */}
                    <div className="bg-gradient-to-br from-[#0B1C2D] to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4 leading-tight">Unlock direct <br /> interview invites.</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                Verified profiles receive 4x more direct invitations from top companies.
                            </p>
                            <Link to="/seeker/profile">
                                <button className="w-full py-4 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-400 transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-xs">
                                    Complete Profile
                                </button>
                            </Link>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerDashboard;
