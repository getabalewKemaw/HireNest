import { useState, useEffect } from 'react';
import {
    Plus, Search, Briefcase, Users,
    MoreHorizontal, Eye, Edit2, Power,
    Trash2, Filter, ArrowUpRight, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import Button from '../../components/Button';

const ManageJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const data = await jobService.getMyJobs();
            setJobs(data.content || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleJobStatus = async (jobId) => {
        try {
            // Simplified: Just deactivating for now
            await jobService.deactivateJob(jobId);
            fetchMyJobs();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-24 pb-20 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-6xl font-serif font-black text-primary dark:text-white mb-4">
                            Manage <span className="italic text-secondary underline decoration-accent underline-offset-[10px]">Your</span> Listings
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-heading">Monitor performance and track applicants for all active postings.</p>
                    </div>
                    <Link to="/post-job">
                        <Button variant="primary" size="lg">
                            <Plus size={20} className="mr-2" />
                            Post New Position
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Position Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Applicants</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">posted Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-10 h-24 bg-gray-50/30 dark:bg-white/5"></td>
                                        </tr>
                                    ))
                                ) : jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-8">
                                                <div>
                                                    <div className="text-sm font-black text-secondary uppercase tracking-widest mb-1">{job.category}</div>
                                                    <div className="text-lg font-bold text-primary dark:text-white italic">{job.title}</div>
                                                    <div className="text-xs text-gray-400 mt-1 font-heading">{job.workplaceType} • {job.jobType}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <Link to={`/applicants?jobId=${job.id}`} className="group/link">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl font-black text-primary dark:text-white">{job.applicantCount || 0}</span>
                                                        <div className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black rounded-lg">
                                                            VIEW ALL
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${job.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${job.isActive ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{job.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                                                    <Clock size={14} />
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/jobs/${job.id}`} className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-primary dark:hover:text-white rounded-xl transition-all">
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleJobStatus(job.id)}
                                                        className="p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                                    >
                                                        <Power size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                                <Briefcase size={32} />
                                            </div>
                                            <h3 className="text-xl font-serif font-black text-primary dark:text-white">No active jobs found</h3>
                                            <p className="text-gray-500 mt-2">Start hiring by creating your first job posting.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageJobsPage;
