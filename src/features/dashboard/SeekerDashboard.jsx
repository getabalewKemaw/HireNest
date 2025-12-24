import { useState, useEffect } from 'react';
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
    MoreHorizontal,
    Sparkles,
    Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jobAlertService from '../../services/jobAlertService';
import applicationService from '../../services/applicationService';
import Button from '../../components/Button';

const SeekerDashboard = ({ user, profile }) => {
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [recentApps, setRecentApps] = useState([]);
    const [alertsCount, setAlertsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const stats = [
        { label: 'Active Applications', value: '12', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Upcoming Interviews', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Saved Opportunities', value: '24', icon: Bookmark, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Profile Visibility', value: 'High', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchedData, appsData, alertsData] = await Promise.all([
                    jobAlertService.getMatchedJobs(),
                    applicationService.getMyApplications(),
                    jobAlertService.getMyAlerts()
                ]);
                setMatchedJobs(matchedData || []);
                setRecentApps(appsData.content || []);
                setAlertsCount(alertsData?.length || 0);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            Welcome back, {profile?.firstName || user?.name?.split(' ')[0] || 'Seeker'}. We've found {matchedJobs.length} new job matches that align with your expertise.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/jobs" className="px-8 py-4 bg-white text-secondary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center">
                                Browse Jobs
                            </Link>
                            <Link to="/seeker/alerts" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center">
                                Job Alerts
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 w-64 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                                    <Award size={20} className="text-white" />
                                </div>
                                <div className="text-sm font-black">Top Talent</div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary w-[85%] rounded-full shadow-sm"></div>
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
                            <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
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
                            <Sparkles className="text-secondary" /> Premium Matches
                        </h2>
                        <div className="flex gap-2">
                            <Link to="/seeker/alerts" className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
                                Manage Alerts
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2].map(i => <div key={i} className="h-48 rounded-[2rem] bg-gray-100 dark:bg-white/5 animate-pulse" />)
                        ) : matchedJobs.length > 0 ? (
                            matchedJobs.map((job) => (
                                <div key={job.id} className="group bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-secondary/30 transition-all relative">
                                    <div className="absolute top-6 right-8 flex items-center gap-3">
                                        <div className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-secondary/10">
                                            Premium Match
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                                            <Bookmark size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-gray-300 border border-gray-100 dark:border-white/5">
                                            {job.companyName?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors mb-2 uppercase tracking-tight leading-tight">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-400 mb-6">
                                                <span className="flex items-center gap-1.5">
                                                    <Globe size={14} /> {job.companyName}
                                                </span>
                                                <span>•</span>
                                                <span>{job.addressCity || 'Remote'}</span>
                                                <span>•</span>
                                                <span>Est. Budget: <span className="text-secondary font-bold">{job.currency || '$'}{job.salaryMin?.toLocaleString()}</span></span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {job.jobType && (
                                                    <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {job.jobType.replace('_', ' ')}
                                                    </span>
                                                )}
                                                {job.workplaceType && (
                                                    <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {job.workplaceType.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Link to={`/jobs/${job.id}`} className="px-6 py-2.5 bg-secondary text-white text-xs font-black rounded-xl hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/10 uppercase tracking-widest">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                                <Sparkles size={40} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-black text-primary dark:text-white mb-2">No matches yet</h3>
                                <p className="text-gray-400 text-sm mb-8">Set up job alerts to see personalized recommendations here.</p>
                                <Link to="/seeker/alerts">
                                    <Button variant="outline" size="sm">Set Up Job Alerts</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Aside Section - Sidebar details */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                            <h3 className="font-black text-primary dark:text-white uppercase tracking-[0.15em] text-xs">Recent Applications</h3>
                            <button className="p-2 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-all"><MoreHorizontal size={18} className="text-gray-400" /></button>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/5">
                            {recentApps.slice(0, 5).map((app) => (
                                <div key={app.id} className="p-6 hover:bg-gray-50 dark:hover:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md overflow-hidden">
                                            {app.companyLogo ? <img src={app.companyLogo} className="w-full h-full object-cover" /> : app.companyName?.charAt(0)}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${app.status === 'INTERVIEWING' ? 'bg-secondary/10 text-secondary' :
                                            app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-gray-100 dark:bg-white/10 text-gray-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-primary dark:text-white group-hover:text-secondary transition-colors truncate">{app.jobTitle}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.companyName}</span>
                                        <span className="text-[10px] text-gray-300 italic">Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/seeker/applications" className="block w-full text-center p-5 bg-gray-50 dark:bg-white/5 text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all">
                            View All Tracking <ArrowUpRight size={14} className="inline ml-1 mb-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerDashboard;
