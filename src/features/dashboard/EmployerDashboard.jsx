import React from 'react';
import {
    Users,
    FileText,
    CheckCircle2,
    AlertCircle,
    Plus,
    MoreVertical,
    TrendingUp,
    Users2,
    Zap,
    Clock,
    BarChart3,
    Search,
    ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyVerificationWidget from '../../components/dashboard/CompanyVerificationWidget';

const EmployerDashboard = ({ user }) => {
    const stats = [
        { label: 'Active Jobs', value: '8', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Applicants', value: '456', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Interviews', value: '14', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Urgent Tasks', value: '2', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    const candidatePipeline = [
        { stage: 'Portfolio Review', count: 120, trend: '+12%', color: 'from-blue-500 to-indigo-500' },
        { stage: 'Tech Assessment', count: 85, trend: '+5%', color: 'from-amber-500 to-orange-500' },
        { stage: 'Face to Face', count: 32, trend: '-2%', color: 'from-emerald-500 to-teal-500' },
        { stage: 'Offer Stage', count: 8, trend: '+8%', color: 'from-rose-500 to-pink-500' },
    ];

    const activeJobs = [
        { title: 'Senior Brand Designer', applicants: 45, new: 12, status: 'Active', posted: '3d ago', category: 'Creative' },
        { title: 'Fullstack Node Developer', applicants: 28, new: 3, status: 'Active', posted: '1w ago', category: 'Engineering' },
        { title: 'Product Growth Lead', applicants: 156, new: 0, status: 'Paused', posted: '2w ago', category: 'Marketing' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Employer Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
                        <Zap size={14} /> Hiring High Priority
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white leading-tight">
                        Good morning, <span className="italic font-medium text-secondary underline decoration-accent underline-offset-[8px]">{user?.name?.split(' ')[0] || 'HireNest Partner'}</span>.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-heading font-light text-lg max-w-lg mt-4">
                        You have 12 new applications for the <span className="text-secondary font-bold">Senior Brand Designer</span> role.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/talent" className="flex-1 sm:flex-none px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-primary dark:text-white font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm flex items-center justify-center gap-3">
                        <Search size={20} /> Browse Talent
                    </Link>
                    <Link to="/post-job" className="flex-1 sm:flex-none px-8 py-4 bg-secondary text-white font-black rounded-2xl hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 active:scale-95">
                        <Plus size={20} /> Post New Job
                    </Link>
                </div>
            </div>

            {/* Modern High-Impact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#151C26] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 uppercase tracking-widest">
                                Live
                            </div>
                        </div>
                        <div className="relative z-10 text-4xl font-black text-primary dark:text-white mb-2">{stat.value}</div>
                        <div className="relative z-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>

                        <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-110 transition-transform">
                            <stat.icon size={120} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active Jobs Modern Table */}
                <div className="lg:col-span-8 bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
                        <div>
                            <h3 className="font-black text-primary dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                                <BarChart3 className="text-secondary" size={16} /> Job Performance
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Updated 2 minutes ago</p>
                        </div>
                        <button className="text-secondary text-xs font-black hover:underline uppercase tracking-wider">Report Analytics</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-white/5">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Job Details</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applicants</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {activeJobs.map((job, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1.5">{job.category}</span>
                                                <span className="font-bold text-lg text-primary dark:text-white group-hover:text-secondary transition-colors italic">{job.title}</span>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock size={12} className="text-gray-300" />
                                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Posted {job.posted}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-primary dark:text-white leading-none">{job.applicants}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
                                                </div>
                                                {job.new > 0 && (
                                                    <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse shadow-lg shadow-emerald-500/20">
                                                        +{job.new} NEW
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${job.status === 'Active' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-gray-100 dark:bg-white/10 text-gray-400 border-transparent'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{job.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors">
                                            <MoreVertical size={20} className="ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Verification Widget */}
                    <CompanyVerificationWidget />

                    <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform blur-md">
                            <TrendingUp size={240} />
                        </div>

                        <h3 className="text-xl font-black mb-10 flex items-center justify-between relative z-10 italic">
                            Hiring Funnel <Users2 size={24} className="text-secondary" />
                        </h3>

                        <div className="space-y-8 relative z-10">
                            {candidatePipeline.map((stage, idx) => (
                                <div key={idx} className="group/stage">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">{stage.stage}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-xl leading-none">{stage.count}</span>
                                            <span className={`text-[10px] font-black font-mono leading-none ${stage.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {stage.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${stage.color} rounded-full transition-all duration-[2s] group-hover/stage:opacity-80`}
                                            style={{ width: `${(stage.count / 120) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            Deep Insights <ArrowUpRight size={14} />
                        </button>
                    </div>

                    {/* Quick Announcement / Tip */}
                    <div className="bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-sm">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-black text-primary dark:text-white mb-2 italic">Pro Tip: Assessments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Enabling technical assessments for "Developer" roles is currently reducing hiring time by up to <span className="text-secondary font-black">40%</span>.
                        </p>
                        <button className="mt-6 text-xs font-black text-secondary hover:text-secondary-dark uppercase tracking-widest">Setup Assessment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
