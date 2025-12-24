import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import JobCard from '../JobCard';
import Button from '../Button';

const FeaturedJobsSection = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobService.getJobs({ page: 0, size: 6 }); // Fetch top 6 for a clean grid
                if (data && data.content) {
                    setJobs(data.content);
                } else if (Array.isArray(data)) {
                    setJobs(data.slice(0, 6)); // in case api returns array directly
                }
            } catch (error) {
                console.error('Failed to fetch featured jobs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (!loading && jobs.length === 0) return null; // Don't show if no jobs

    return (
        <section className="py-24 bg-white dark:bg-[#0B1C2D] relative overflow-hidden transition-colors duration-500">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                            <Briefcase size={14} /> Open Positions
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-primary dark:text-white mb-6 leading-tight animate-fade-in-up animation-delay-100">
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-indigo-600 italic">Featured Roles</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-heading font-light max-w-xl animate-fade-in-up animation-delay-200">
                            Discover career-defining opportunities at top-tier companies. Your next big move is just a click away.
                        </p>
                    </div>

                    <Link to="/jobs">
                        <Button variant="secondary" className="hidden md:flex animate-fade-in-right">
                            Browse All Jobs
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-64 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-300">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}

                <div className="mt-12 flex justify-center md:hidden">
                    <Link to="/jobs">
                        <Button variant="secondary" size="lg" className="w-full">
                            Browse All Jobs
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedJobsSection;
