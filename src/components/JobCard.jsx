import { MapPin, Clock, Briefcase, DollarSign, ArrowRight, Heart, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';
import savedJobService from '../services/savedJobService';
import useAuthStore from '../store/authStore';

const JobCard = ({ job }) => {
    const {
        id,
        title,
        companyName,
        city,
        jobType,
        workplaceType,
        salaryMin,
        salaryMax,
        createdAt
    } = job;

    const { isAuthenticated } = useAuthStore();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isAuthenticated && id) {
            checkLikeStatus();
            fetchLikeCount();
            checkSaveStatus();
        }
    }, [isAuthenticated, id]);

    const checkLikeStatus = async () => {
        try {
            const data = await jobService.hasLiked(id);
            setIsLiked(data.liked);
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const fetchLikeCount = async () => {
        try {
            const data = await jobService.getLikeCount(id);
            setLikeCount(data.count);
        } catch (error) {
            console.error('Error fetching like count:', error);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;

        // Optimistic UI update
        const newStatus = !isLiked;
        setIsLiked(newStatus);
        setLikeCount(prev => newStatus ? prev + 1 : prev - 1);

        try {
            await jobService.toggleLike(id);
        } catch (error) {
            // Revert on error
            setIsLiked(!newStatus);
            setLikeCount(prev => !newStatus ? prev + 1 : prev - 1);
            console.error('Error toggling like:', error);
        }
    };

    const checkSaveStatus = async () => {
        try {
            const saved = await savedJobService.isSaved(id);
            setIsSaved(saved);
        } catch (error) {
            console.error('Error checking save status:', error);
        }
    };

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;

        setSaving(true);
        const oldStatus = isSaved;
        setIsSaved(!oldStatus); // Optimistic

        try {
            const data = await savedJobService.toggleSave(id);
            setIsSaved(data.saved);
        } catch (error) {
            setIsSaved(oldStatus);
            console.error('Error toggling save:', error);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return (
        <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-6 rounded-2xl hover:shadow-[0_20px_50px_rgba(11,28,45,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            {/* Decorative Gradient on Hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 blur-2xl" />

            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 group-hover:border-secondary transition-colors overflow-hidden">
                        {job.companyLogoUrl ? (
                            <img
                                src={job.companyLogoUrl}
                                alt={companyName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-serif text-xl font-bold text-primary dark:text-gray-300 group-hover:text-secondary transition-colors">
                                {companyName?.charAt(0) || 'J'}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-xl text-primary dark:text-white group-hover:text-secondary transition-colors leading-tight mb-1">
                            {title}
                        </h3>
                        <p className="text-sm font-heading font-medium text-text-secondary dark:text-gray-400">
                            {companyName}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={handleLike}
                            className={`p-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 ${isLiked ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 scale-105' : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 hover:text-rose-400'}`}
                        >
                            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                            {likeCount > 0 && <span className="text-[10px] font-black">{likeCount}</span>}
                        </button>
                        <button
                            onClick={handleToggleSave}
                            disabled={saving}
                            className={`p-2 rounded-xl transition-all duration-300 ${isSaved ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 hover:text-primary'}`}
                        >
                            <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase rounded-full border border-blue-100 dark:border-blue-800/50">
                        {jobType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        Posted {formatDate(createdAt)}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-y-3 gap-x-6 mb-8 mt-auto">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin size={16} className="text-secondary" />
                    <span className="text-xs font-semibold">{city || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Briefcase size={16} className="text-accent" />
                    <span className="text-xs font-semibold">{workplaceType}</span>
                </div>
                {(salaryMin || salaryMax) && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <DollarSign size={16} className="text-warning" />
                        <span className="text-xs font-bold text-primary dark:text-gray-200">
                            {job.currency || '$'}
                            {salaryMin && salaryMin.toLocaleString()}
                            {salaryMin && salaryMax && ' - '}
                            {salaryMax && salaryMax.toLocaleString()}
                            <span className="ml-1 text-[10px] text-gray-400 font-medium">/ {job.compensationType?.toLowerCase() || 'monthly'}</span>
                        </span>
                    </div>
                )}
            </div>

            <Link
                to={`/jobs/${id}`}
                className="w-full py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-primary dark:hover:bg-primary text-primary dark:text-white hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-heading font-bold text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-600 hover:border-primary group/btn"
            >
                View Details
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};

export default JobCard;
