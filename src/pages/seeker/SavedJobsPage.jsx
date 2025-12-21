import { useState, useEffect } from 'react';
import { Bookmark, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import savedJobService from '../../services/savedJobService';
import JobCard from '../../components/JobCard';
import Button from '../../components/Button';

const SavedJobsPage = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchSavedJobs();
    }, [currentPage]);

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const data = await savedJobService.getSavedJobs(currentPage);
            setSavedJobs(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-8 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-primary dark:text-white mb-4">
                            Saved <span className="text-secondary italic">Jobs</span>
                        </h1>
                        <p className="text-text-secondary dark:text-gray-400 font-heading max-w-lg">
                            Keep track of the positions you're interested in. You can apply to them whenever you're ready.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent shadow-xl"></div>
                    </div>
                ) : savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                        {savedJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-16 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Bookmark size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-serif font-black text-primary dark:text-white mb-4">No saved jobs yet</h3>
                        <p className="text-text-secondary dark:text-gray-400 font-heading mb-10 max-w-md mx-auto">
                            Start exploring the job board and bookmark roles that catch your eye.
                        </p>
                        <Link to="/jobs">
                            <Button variant="secondary" size="lg">
                                Browse Jobs
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-16 gap-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i
                                        ? 'bg-secondary text-white shadow-xl shadow-secondary/20 scale-110'
                                        : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-primary dark:hover:text-white border border-gray-100 dark:border-gray-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobsPage;
