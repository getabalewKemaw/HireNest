import { MapPin, Clock, Briefcase, DollarSign, ArrowRight, Heart, Bookmark, CheckCircle2, Star } from 'lucide-react';
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
        createdAt,
        description,
        skills = [] // Assuming skills/tags might be available or passed
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
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now - date) / 36e5;

        if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Mock description if missing for preview
    const displayDescription = description || "We are looking for a talented professional to join our team. This role requires strong problem-solving skills and a passion for excellence...";

    return (
        <div className="group bg-white dark:bg-gray-800 border-b last:border-b-0 sm:border sm:rounded-2xl border-gray-100 dark:border-gray-700/50 p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200 relative">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <Link to={`/jobs/${id}`} className="block">
                        <h3 className="font-serif font-black text-xl text-primary dark:text-white group-hover:text-secondary group-hover:underline decoration-2 underline-offset-2 transition-colors mb-1">
                            {title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                        <span className="flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                            {companyName}
                            <CheckCircle2 size={12} className="text-secondary" />
                        </span>
                        <span>•</span>
                        <span>{formatDate(createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <MapPin size={12} /> {city || 'Remote'}
                        </span>
                    </div>

                    <Link to={`/jobs/${id}`} className="block mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-heading">
                            {displayDescription}
                        </p>
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Mock Tags if none exist yet - replace with real tags later */}
                        {['Remote', 'Full-time'].map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-default">
                                {tag}
                            </span>
                        ))}
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-full border border-blue-100 dark:border-blue-800/50 capitalize">
                            {jobType?.replace('_', ' ').toLowerCase()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center text-primary dark:text-white font-bold">
                            <Star size={12} className="text-secondary fill-secondary mr-1" />
                            Payment Verified
                        </div>
                        <span className="mx-2">•</span>
                        <span className="flex items-center gap-1">
                            <DollarSign size={12} className="text-gray-400" />
                            {salaryMin ? `${salaryMin.toLocaleString()} - ${salaryMax?.toLocaleString()}` : 'Budget Confidential'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleToggleSave}
                        disabled={saving}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isSaved
                            ? 'bg-secondary text-white border-secondary'
                            : 'bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-secondary hover:text-secondary'}`}
                        title={isSaved ? "Unsave Job" : "Save Job"}
                    >
                        <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={handleLike}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isLiked
                            ? 'bg-rose-50 text-rose-500 border-rose-200'
                            : 'bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-rose-500 hover:text-rose-500'}`}
                        title="Like"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
