import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, User, MapPin, X, Sparkles } from 'lucide-react';
import * as seekerService from '../../services/seekerService';
import SeekerCard from '../../components/SeekerCard';
import Button from '../../components/Button';
import SeekerPublicProfileModal from '../../components/modals/SeekerPublicProfileModal';

const TalentPage = () => {
    const [seekers, setSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSeekerId, setSelectedSeekerId] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        fetchTalent();
    }, [page]);

    const fetchTalent = async (searchQuery = query) => {
        setLoading(true);
        try {
            const result = await seekerService.searchSeekers(searchQuery, page, 12);
            if (result.success) {
                setSeekers(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching talent:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchTalent();
    };

    const handleSeekerClick = (id) => {
        setSelectedSeekerId(id);
        setShowProfileModal(true);
    };

    return (
        <div className="pb-20 max-w-7xl mx-auto px-6">
            {/* Header Section */}
            <div className="mb-20 pt-16">
                <div className="max-w-2xl">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black text-primary dark:text-white mb-6 leading-[1.1]">
                        Discover <span className="italic font-medium text-secondary underline decoration-accent underline-offset-[12px]">top</span> talent.
                    </h1>
                    <p className="text-xl text-text-secondary dark:text-gray-400 font-heading font-light leading-relaxed">
                        Connect with the most qualified professionals and build your dream team with EtWorks.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-12">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="Search by name, title, or skills (e.g. React, UI Design)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-secondary focus:ring-0 transition-all font-heading font-bold text-lg text-primary dark:text-white placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                    <Button variant="secondary" size="lg" className="rounded-[2rem] px-10 shadow-xl shadow-secondary/20">
                        Search
                    </Button>
                </form>
            </div>

            {/* Talent Grid */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-[350px] rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse" />
                        ))}
                    </div>
                ) : seekers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {seekers.map((seeker) => (
                                <SeekerCard
                                    key={seeker.id}
                                    seeker={seeker}
                                    onClick={() => handleSeekerClick(seeker.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center gap-4">
                                <Button
                                    variant="ghost"
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center px-6 font-black text-primary dark:text-white bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    {page + 1} / {totalPages}
                                </div>
                                <Button
                                    variant="ghost"
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-32 text-center bg-white/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-gray-700 rounded-[3rem]">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                            <User size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-3xl font-serif font-black text-primary dark:text-white mb-4">No talent found</h3>
                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                            Try adjusting your search query to find more candidates.
                        </p>
                    </div>
                )}
            </div>

            {/* Public Profile Modal */}
            <SeekerPublicProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                seekerId={selectedSeekerId}
            />
        </div>
    );
};

export default TalentPage;
