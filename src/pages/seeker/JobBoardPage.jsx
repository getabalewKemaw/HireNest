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
        <div className="pb-20">
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

            {/* Desktop & Mobile Layout */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

                {/* Mobile Filter Overlay Background */}
                {showFilters && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setShowFilters(false)}
                    />
                )}

                {/* Sidebar Filters */}
                <aside className={`
                    fixed lg:sticky top-0 lg:top-28 left-0 bottom-0 w-[280px] lg:w-[300px] bg-white dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent
                    z-50 lg:z-30 p-6 lg:p-0 overflow-y-auto lg:overflow-visible transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
                    ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex lg:hidden justify-between items-center mb-6">
                        <h2 className="text-xl font-serif font-black text-primary dark:text-white">Filters</h2>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-6 lg:bg-white lg:dark:bg-gray-800 lg:p-6 lg:rounded-[2rem] lg:border lg:border-gray-100 lg:dark:border-gray-700 lg:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                        {/* Search Keyword */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Search</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={16} />
                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Job title or keyword"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-secondary/20 transition-all font-heading font-medium text-sm text-primary dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={16} />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City or Region"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-secondary/20 transition-all font-heading font-medium text-sm text-primary dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Job Type</label>
                            <div className="space-y-2">
                                {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'].map((type) => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 -mx-2 rounded-lg transition-colors">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.jobType === type ? 'border-secondary bg-secondary' : 'border-gray-300 dark:border-gray-600 group-hover:border-secondary'}`}>
                                            {filters.jobType === type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${filters.jobType === type ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {type.replace('_', ' ')}
                                        </span>
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={type}
                                            checked={filters.jobType === type}
                                            onChange={handleFilterChange}
                                            className="hidden"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Workplace Type */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Workplace</label>
                            <div className="flex flex-wrap gap-2">
                                {['ON_SITE', 'REMOTE', 'HYBRID'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilters({ ...filters, workplaceType: filters.workplaceType === type ? '' : type })}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${filters.workplaceType === type ? 'bg-primary dark:bg-white text-white dark:text-primary border-transparent shadow-lg shadow-primary/20' : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <Button variant="secondary" fullWidth size="md" onClick={applyFilters} className="shadow-xl shadow-secondary/20">
                                Apply Filters
                            </Button>
                            <button
                                onClick={clearFilters}
                                className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors py-2"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Job Listings Grid */}
                <div className="flex-grow min-w-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-[280px] rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse" />
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-3xl font-serif font-black text-primary dark:text-white mb-3">No jobs found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                                    We couldn't find any matches for your current filters. Try adjusting your search criteria or clearing filters.
                                </p>
                                <button onClick={clearFilters} className="mt-8 text-secondary font-black uppercase tracking-widest text-xs hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoardPage;
