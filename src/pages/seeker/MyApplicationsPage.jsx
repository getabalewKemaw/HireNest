import { useState, useEffect } from 'react';
import {
    Briefcase, Building2, MapPin, Clock,
    ArrowUpRight, Search, Filter, XCircle,
    CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import Button from '../../components/Button';

const ICON_MAP = {
    PENDING: <Clock className="text-blue-500" size={16} />,
    APPROVED: <CheckCircle2 className="text-emerald-500" size={16} />,
    REJECTED: <XCircle className="text-red-500" size={16} />,
};

const STATUS_STYLE = {
    PENDING: "bg-blue-50 text-blue-600 border-blue-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
};

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await applicationService.getMyApplications();
            setApplications(data.content || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-6xl font-serif font-black text-primary dark:text-white mb-4 leading-tight">
                            My <span className="italic text-secondary underline decoration-accent underline-offset-[10px]">Applied</span> Jobs
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-heading">Track the status of your applications and manage your career journey.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-[2.5rem] bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700" />
                        ))}
                    </div>
                ) : applications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {applications.map((app) => (
                            <div key={app.id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                                {/* Status Badge */}
                                <div className="absolute top-8 right-8">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[app.status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                        {ICON_MAP[app.status] || <Info size={14} />}
                                        {app.status}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 mb-6 group-hover:border-secondary transition-colors">
                                        <Briefcase className="text-secondary" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-black text-primary dark:text-white italic group-hover:text-secondary transition-colors mb-2">
                                        {app.jobTitle}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 font-heading">
                                        Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-6">
                                    {app.notes && (
                                        <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-2xl relative">
                                            <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-gray-800 text-[9px] font-black text-secondary uppercase tracking-widest">Feedback</div>
                                            <p className="text-xs text-text-secondary dark:text-gray-400 font-medium italic leading-relaxed">
                                                "{app.notes}"
                                            </p>
                                        </div>
                                    )}

                                    {app.status === 'REJECTED' && app.rejectionReason && (
                                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl relative mt-2">
                                            <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-gray-800 text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                <XCircle size={10} /> Rejection Reason
                                            </div>
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium italic leading-relaxed pt-1">
                                                "{app.rejectionReason}"
                                            </p>
                                        </div>
                                    )}

                                    <Link to={`/jobs/${app.jobId}`}>
                                        <Button variant="outline" fullWidth size="md">
                                            View Position Details
                                            <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white/50 dark:bg-gray-800/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <Briefcase size={40} />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-primary dark:text-white mb-4">No applications yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-heading mb-10 max-w-sm mx-auto">
                            Start exploring opportunities and apply for jobs that match your skills.
                        </p>
                        <Link to="/jobs">
                            <Button variant="primary" size="lg">
                                Explore Open Jobs
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
