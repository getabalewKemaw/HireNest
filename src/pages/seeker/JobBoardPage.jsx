import { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import jobService from '../../services/jobService';
import JobCard from '../../components/JobCard';
import Button from '../../components/Button';
import Input from '../../components/Input';

const JobBoardPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        jobType: '',
        workplaceType: '',
        city: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const clearFilters = () => {
        const resetFilters = {
            category: '',
            jobType: '',
            workplaceType: '',
            city: ''
        };
        setFilters(resetFilters);
        fetchJobs(resetFilters);
    };

    const fetchJobs = async (fetchFilters = filters) => {
        setLoading(true);
        try {
            console.log('Fetching jobs with filters:', fetchFilters);
            const data = await jobService.getJobs(fetchFilters);
            setJobs(data.content || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Could not fetch jobs. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchJobs();
        if (window.innerWidth < 1024) setShowFilters(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-24 pb-20 px-6 lg:px-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl lg:text-7xl font-serif font-black text-primary dark:text-white mb-6 leading-[1.1]">
                            Explore your <span className="italic font-medium text-secondary underline decoration-accent underline-offset-[12px]">next</span> career move.
                        </h1>
                        <p className="text-xl text-text-secondary dark:text-gray-400 font-heading font-light leading-relaxed">
                            Browse thousands of opportunities across technology, design, and business sectors.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-primary dark:text-white flex items-center gap-2 font-bold shadow-sm"
                        >
                            <SlidersHorizontal size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                {/* Sidebar Filters - Desktop */}
                <aside className={`
          fixed inset-0 z-50 lg:static lg:z-0 lg:block lg:w-80 
          transform ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          transition-transform duration-300 ease-in-out
          bg-white dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0
          overflow-y-auto
        `}>
                    <div className="flex lg:hidden justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-black text-primary dark:text-white">Filters</h2>
                        <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700">
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="sticky top-28 space-y-8 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_rgba(11,28,45,0.03)] dark:shadow-none">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City or Region"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-secondary/20 transition-all font-heading font-medium text-sm text-primary dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Job Type</label>
                            <div className="space-y-3">
                                {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'].map((type) => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={type}
                                            checked={filters.jobType === type}
                                            onChange={handleFilterChange}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters.jobType === type ? 'border-secondary bg-secondary shadow-lg shadow-secondary/20' : 'border-gray-200 dark:border-gray-600 group-hover:border-secondary'}`}>
                                            {filters.jobType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        <span className={`text-sm font-heading font-medium transition-colors ${filters.jobType === type ? 'text-primary dark:text-white' : 'text-text-secondary dark:text-gray-400 group-hover:text-primary'}`}>
                                            {type.replace('_', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Workplace</label>
                            <div className="flex flex-wrap gap-2">
                                {['ON_SITE', 'REMOTE', 'HYBRID'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilters({ ...filters, workplaceType: filters.workplaceType === type ? '' : type })}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${filters.workplaceType === type ? 'bg-primary dark:bg-primary-light text-white border-primary border-none shadow-md' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 border-gray-100 dark:border-gray-700 hover:border-secondary'}`}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="primary" fullWidth size="md" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                        <button
                            onClick={clearFilters}
                            className="w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors py-2"
                        >
                            Reset All
                        </button>
                    </div>
                </aside>

                {/* Job Listings Grid */}
                <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-[320px] rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse shadow-sm" />
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Briefcase size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-serif font-black text-primary dark:text-white mb-2">No jobs found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to find more opportunities.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoardPage;
