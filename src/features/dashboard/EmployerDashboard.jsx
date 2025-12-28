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
    ArrowUpRight,
    RefreshCw,
    PieChart as PieIcon,
    ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import CompanyVerificationWidget from '../../components/dashboard/CompanyVerificationWidget';
import jobService from '../../services/jobService';
import employerAnalyticsService from '../../services/employerAnalyticsService';

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const EmployerDashboard = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsData, statsData] = await Promise.all([
                jobService.getMyJobs(),
                employerAnalyticsService.getDashboardStats()
            ]);

            setJobs(jobsData?.content || jobsData || []);
            setStats(statsData);
            setError(null);
        } catch (error) {
            console.error('Error fetching employer dashboard data:', error);
            setError('We encountered a synchronization error while fetching your intelligence data. Please verify your connection or try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Format data for growth chart
    const growthData = stats?.applicationGrowth ? Object.keys(stats.applicationGrowth).map(date => ({
        name: date,
        applicants: stats.applicationGrowth[date] || 0
    })) : [];

    // Format data for status distribution
    const statusData = stats?.statusDistribution ? Object.keys(stats.statusDistribution)
        .filter(status => stats.statusDistribution[status] > 0)
        .map(status => ({
            name: status.charAt(0) + status.slice(1).toLowerCase(),
            value: stats.statusDistribution[status]
        })) : [];

    // Format data for category distribution
    const categoryData = stats?.categoryDistribution ? Object.keys(stats.categoryDistribution).map(cat => ({
        name: cat.split(' ')[0], // Short name for chart
        fullName: cat,
        value: stats.categoryDistribution[cat]
    })) : [];

    const statCards = [
        {
            label: 'Active Jobs',
            value: stats?.activeJobs?.toLocaleString() || '0',
            icon: FileText,
            color: 'text-secondary',
            bg: 'bg-secondary/10',
            detail: 'Market live postings'
        },
        {
            label: 'Total Applicants',
            value: stats?.totalApplicants?.toLocaleString() || '0',
            icon: Users,
            color: 'text-primary',
            bg: 'bg-primary/10',
            detail: 'Lifetime pipeline'
        },
        {
            label: 'Hired Candidates',
            value: stats?.hiredApplicants?.toLocaleString() || '0',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            detail: 'Success operations'
        },
        {
            label: 'Closed Nodes',
            value: ((stats?.totalJobs || 0) - (stats?.activeJobs || 0)).toLocaleString() || '0',
            icon: AlertCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            detail: 'Deactivated jobs'
        },
    ];

    if (error) {
        return (
            <div className="h-full min-h-[500px] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-[#151C26] p-12 rounded-[3rem] border border-red-100 dark:border-red-900/20 shadow-2xl max-w-xl text-center space-y-8">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <ShieldAlert size={48} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-primary dark:text-white italic">Intelligence Sync Failed</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{error}</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="w-full py-5 bg-primary dark:bg-white text-white dark:text-primary font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        <RefreshCw size={20} /> Attempt Resync
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !stats) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={24} className="text-secondary animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-primary dark:text-white italic">Syncing Intelligence...</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Etworks Command Center v2.0</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Employer Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-4 border border-secondary/20">
                        <Zap size={14} className="animate-pulse" /> Platform Active
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white leading-tight">
                        Welcome back, <span className="italic font-medium text-secondary underline decoration-accent underline-offset-[8px]">{user?.name?.split(' ')[0] || user?.companyName || 'Partner'}</span>.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-heading font-light text-lg max-w-lg mt-4 leading-relaxed">
                        Your recruitment intelligence is <span className="text-emerald-500 font-bold">Live</span>. Currently monitoring <span className="font-bold text-primary dark:text-white">{stats?.totalApplicants?.toLocaleString()}</span> candidates across <span className="font-bold text-primary dark:text-white">{stats?.totalJobs}</span> postings.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-primary dark:text-white font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link to="/post-job" className="px-8 py-4 bg-secondary text-white font-black rounded-2xl hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 active:scale-95">
                        <Plus size={20} /> Post New Job
                    </Link>
                </div>
            </div>

            {/* Modern High-Impact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#151C26] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 uppercase tracking-widest">
                                real-time
                            </div>
                        </div>
                        <div className="relative z-10 text-4xl font-black text-primary dark:text-white mb-1 leading-none">{stat.value}</div>
                        <div className="relative z-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                        <div className="relative z-10 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded italic w-fit">
                            {stat.detail}
                        </div>

                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <stat.icon size={120} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Application Trends Chart */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-[#151C26] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-primary dark:text-white italic flex items-center gap-2">
                                    <TrendingUp className="text-secondary" size={20} /> Pipeline Velocity
                                </h3>
                                <p className="text-sm text-gray-400 font-medium lowercase italic">Application volume tracking (last 7 days)</p>
                            </div>
                        </div>

                        {(growthData.length > 0 && stats?.totalApplicants > 0) ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData}>
                                        <defs>
                                            <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0B1C2D', border: 'none', borderRadius: '16px', color: '#fff' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                        />
                                        <Area type="monotone" dataKey="applicants" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorApplicants)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] w-full flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.01] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                <TrendingUp size={40} className="text-gray-200 mb-4" />
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic text-center">
                                    Awaiting initial candidate interactions<br />
                                    <span className="text-[10px] font-normal lowercase">Trends will appear once applications start flowing</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Active Jobs Modern Table */}
                    <div className="bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
                            <div>
                                <h3 className="font-black text-primary dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                                    <BarChart3 className="text-secondary" size={16} /> Nodes Management
                                </h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Live Posting Performance</p>
                            </div>
                            <Link to="/jobs/manage" className="text-secondary text-xs font-black hover:underline uppercase tracking-wider">Expand Full Grid</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-white/5">
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Details</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Volume</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {jobs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <FileText size={40} />
                                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">No active nodes detected in the cloud.</p>
                                                    <Link to="/post-job" className="text-secondary text-[10px] font-black hover:underline uppercase">Deploy first job node</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : jobs.slice(0, 5).map((job) => (
                                        <tr key={job.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1.5">{job.category || 'General'}</span>
                                                    <span className="font-bold text-lg text-primary dark:text-white group-hover:text-secondary transition-colors italic leading-tight">{job.title}</span>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Clock size={12} className="text-gray-300" />
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                            Deployed {new Date(job.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-primary dark:text-white leading-none">{job.applicantCount || 0}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">Candidates</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${job.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${job.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{job.isActive ? 'Active' : 'Paused'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <Link to={`/jobs/${job.id}`} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-primary dark:hover:bg-white hover:text-white dark:hover:text-primary rounded-2xl transition-all inline-block group/btn shadow-sm">
                                                    <ArrowUpRight size={18} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status Distribution Pie */}
                    <div className="bg-white dark:bg-[#151C26] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <PieIcon size={20} className="text-secondary" />
                            <h3 className="text-xl font-black text-primary dark:text-white italic leading-none">Stage Analysis</h3>
                        </div>

                        {statusData.length > 0 ? (
                            <>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0B1C2D', border: 'none', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ fontSize: '10px', fontWeight: 900 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-6 space-y-3">
                                    {statusData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-white/[0.01] hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{entry.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-primary dark:text-white leading-none">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 opacity-40">
                                <PieIcon size={40} className="mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest italic">Grid Stage Empty</p>
                                <p className="text-[10px] font-medium mt-2">Pipeline distribution requires active applications.</p>
                            </div>
                        )}
                    </div>

                    {/* Category Distribution Bar */}
                    <div className="bg-[#0B1C2D] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                            <BarChart3 size={150} />
                        </div>
                        <h3 className="text-xl font-black mb-8 italic relative z-10 flex items-center gap-2">
                            <BarChart3 size={20} className="text-secondary" /> Spread Analysis
                        </h3>

                        {categoryData.length > 0 ? (
                            <div className="h-[150px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData}>
                                        <XAxis
                                            dataKey="name"
                                            hide={false}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }}
                                            labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}
                                        />
                                        <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 6, 6]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[150px] w-full relative z-10 flex flex-col items-center justify-center opacity-30">
                                <BarChart3 size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Market Map Empty</p>
                            </div>
                        )}

                        <div className="mt-8 relative z-10">
                            <Link to="/post-job" className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                Expand Talent Search <Plus size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Verification Widget */}
                    <CompanyVerificationWidget />

                    {/* Pro Tip */}
                    <div className="bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="font-black text-primary dark:text-white mb-2 italic">Intelligence Insight</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium italic">
                            Employers who respond to applicants within <span className="text-secondary font-black">24 hours</span> are <span className="text-secondary font-black">3x</span> more likely to secure top-tier talent.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
