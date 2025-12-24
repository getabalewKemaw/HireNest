import React, { useState, useEffect } from 'react';
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
import jobService from '../../services/jobService';

const EmployerDashboard = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await jobService.getMyJobs();
            // Handle paginated response
            setJobs(data?.content || data || []);
        } catch (error) {
            console.error('Error fetching employer jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeJobsCount = jobs.filter(j => j.isActive).length;
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
    const pausedJobs = jobs.filter(j => !j.isActive).length;

    const stats = [
        { label: 'Active Jobs', value: activeJobsCount.toString(), icon: FileText, color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Total Applicants', value: totalApplicants.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Total Jobs', value: jobs.length.toString(), icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Paused Jobs', value: pausedJobs.toString(), icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Employer Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-4 border border-secondary/20">
                        <Zap size={14} /> Hiring High Priority
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white leading-tight">
                        Good morning, <span className="italic font-medium text-secondary underline decoration-accent underline-offset-[8px]">{user?.name?.split(' ')[0] || 'EtWorks Partner'}</span>.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-heading font-light text-lg max-w-lg mt-4">
                        {totalApplicants > 0 ? `Managing ${activeJobsCount} active job${activeJobsCount !== 1 ? 's' : ''} with ${totalApplicants} total applicants.` : 'Start posting jobs to attract top talent.'}
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
                                                <p className="text-sm text-gray-400 font-medium">Loading jobs...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <FileText size={48} className="text-gray-300" />
                                                <h3 className="text-lg font-bold text-primary dark:text-white">No jobs posted yet</h3>
                                                <p className="text-sm text-gray-400">Start by posting your first job to attract talent.</p>
                                                <Link to="/post-job" className="mt-4 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-all">
                                                    Post Your First Job
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : jobs.slice(0, 5).map((job) => (
                                    <tr key={job.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1.5">{job.category || 'General'}</span>
                                                <span className="font-bold text-lg text-primary dark:text-white group-hover:text-secondary transition-colors italic">{job.title}</span>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock size={12} className="text-gray-300" />
                                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-primary dark:text-white leading-none">{job.applicantCount || 0}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${job.isActive ? 'bg-secondary/5 text-secondary border-secondary/20' : 'bg-gray-100 dark:bg-white/10 text-gray-400 border-transparent'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${job.isActive ? 'bg-secondary animate-ping' : 'bg-gray-400'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{job.isActive ? 'Active' : 'Paused'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors">
                                            <Link to={`/jobs/manage`}>
                                                <MoreVertical size={20} className="ml-auto" />
                                            </Link>
                                        </td>
                                    </tr>
                                )}
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
                            Quick Stats <Users2 size={24} className="text-secondary" />
                        </h3>

                        <div className="space-y-8 relative z-10">
                            <div className="group/stage">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Active Postings</span>
                                    <span className="font-black text-xl leading-none">{activeJobsCount}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-[2s] group-hover/stage:opacity-80"
                                        style={{ width: `${jobs.length > 0 ? (activeJobsCount / jobs.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="group/stage">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Total Applicants</span>
                                    <span className="font-black text-xl leading-none">{totalApplicants}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-[2s] group-hover/stage:opacity-80"
                                        style={{ width: `${Math.min(100, totalApplicants)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="group/stage">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Paused Jobs</span>
                                    <span className="font-black text-xl leading-none">{pausedJobs}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-[2s] group-hover/stage:opacity-80"
                                        style={{ width: `${jobs.length > 0 ? (pausedJobs / jobs.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <Link to="/jobs/manage" className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            Manage All Jobs <ArrowUpRight size={14} />
                        </Link>
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
