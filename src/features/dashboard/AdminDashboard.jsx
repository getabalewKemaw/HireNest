import React, { useState, useEffect } from 'react';
import {
    Shield,
    Users,
    Briefcase,
    TrendingUp,
    Activity,
    Server,
    AlertTriangle,
    Mail,
    MoreHorizontal,
    Download,
    ArrowUpRight,
    RefreshCw,
    PieChart as PieIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import AdminVerificationQueue from '../../components/dashboard/AdminVerificationQueue';
import adminAnalyticsService from '../../services/adminAnalyticsService';

const COLORS = ['#6366f1', '#10B981', '#F59E0B'];

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const data = await adminAnalyticsService.getDashboardStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch real-time analytics.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Format data for growth charts
    const growthData = stats ? Object.keys(stats.userGrowth).map(date => ({
        name: date,
        users: stats.userGrowth[date],
        jobs: stats.jobGrowth[date],
        revenue: stats.revenueGrowth[date]
    })) : [];

    // Format data for distribution chart
    const distributionData = stats ? Object.keys(stats.userTypeDistribution).map(type => ({
        name: type,
        value: stats.userTypeDistribution[type]
    })) : [];

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers?.toLocaleString() || '0',
            detail: 'Verified nodes in registry',
            icon: Users,
            color: 'text-secondary',
            bg: 'bg-secondary/10'
        },
        {
            label: 'Jobs Active',
            value: stats?.totalJobs?.toLocaleString() || '0',
            detail: 'Current market throughput',
            icon: Briefcase,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            label: 'Total Revenue',
            value: stats ? `ETB ${stats.totalRevenue.toLocaleString()}` : 'ETB 0',
            detail: 'Platform growth index',
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Clearance Queue',
            value: stats?.pendingVerifications || '0',
            detail: 'Pending security audit',
            icon: Shield,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
    ];

    const systemReports = [
        { id: '#ET-902', type: 'Security', message: 'Rate limit tripped: IP 192.x...', priority: 'High' },
        { id: '#ET-903', type: 'Moderation', message: 'Fake Job Listing: Tech CEO', priority: 'Medium' },
        { id: '#ET-904', type: 'System', message: 'Database backup successful', priority: 'Low' },
    ];

    if (isLoading && !stats) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="animate-spin text-secondary" size={40} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs italic">Syncing with Etworks Intelligence Node...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/10">
                        <Activity size={14} className="animate-pulse" /> Live Performance Monitor
                    </div>
                    <h1 className="text-4xl font-heading font-black text-primary dark:text-white leading-tight italic">
                        Command Center.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">
                        System integrity is <span className="text-emerald-500 font-bold">Optimal</span>. Database synchronization active.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={fetchStats}
                        disabled={isLoading}
                        className="px-6 py-4 bg-white dark:bg-[#151C26] rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh Intelligence
                    </button>
                    <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95">
                        <Download size={20} /> Export Audit Log
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#151C26] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-secondary transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={22} />
                            </div>
                            <div className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-gray-300">
                                <MoreHorizontal size={18} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-primary dark:text-white mb-1.5">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 leading-none">{stat.label}</div>
                        <div className={`text-[10px] font-black py-1 px-2 border rounded-lg inline-block font-mono ${stat.label === 'Clearance Queue' && stats?.pendingVerifications > 0 ? 'text-rose-500 border-rose-500/10 bg-rose-500/5' : 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5'
                            }`}>
                            {stat.detail}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Growth Chart */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white dark:bg-[#151C26] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                            <div>
                                <h3 className="text-xl font-black text-primary dark:text-white italic">Platform Trajectory</h3>
                                <p className="text-sm text-gray-400 font-medium">Activity levels over the last 7 cycles</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6366f1]">
                                    <div className="w-2 h-2 rounded-full bg-[#6366f1]" /> New Users
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                                    <div className="w-2 h-2 rounded-full bg-secondary" /> New Jobs
                                </span>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
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
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0B1C2D',
                                            border: 'none',
                                            borderRadius: '16px',
                                            color: '#fff',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                                    <Area type="monotone" dataKey="jobs" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorJobs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <AdminVerificationQueue />
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-4 space-y-10">
                    {/* User Distribution Pie */}
                    <div className="bg-white dark:bg-[#151C26] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <PieIcon size={20} className="text-primary dark:text-white" />
                            <h3 className="text-xl font-black text-primary dark:text-white italic">Node Distribution</h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0B1C2D', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {distributionData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{entry.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-primary dark:text-white">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue Bar Chart */}
                    <div className="bg-white dark:bg-[#151C26] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="text-xl font-black text-primary dark:text-white italic mb-8">Revenue Stream</h3>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthData}>
                                    <Bar dataKey="revenue" fill="#10B981" radius={[10, 10, 10, 10]} />
                                    <XAxis dataKey="name" hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#0B1C2D', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Total Payload</span>
                            <span className="text-2xl font-black text-primary dark:text-white leading-none">ETB {stats?.totalRevenue?.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* System Activity Logs */}
                    <div className="bg-[#0B1C2D] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={180} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-secondary flex items-center gap-2 relative z-10">
                            <Server size={14} /> Threat Intelligence
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {systemReports.map((log) => (
                                <div key={log.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group/log">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono text-gray-500">{log.id}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${log.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-gray-700 text-gray-300'
                                            }`}>{log.priority}</span>
                                    </div>
                                    <div className="font-bold text-sm mb-1 group-hover/log:text-secondary transition-colors">{log.type} Event</div>
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{log.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
