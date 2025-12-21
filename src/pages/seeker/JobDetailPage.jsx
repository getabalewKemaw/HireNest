import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin, Briefcase, Clock, Calendar,
    DollarSign, Building2, Share2, Bookmark,
    ArrowLeft, CheckCircle2, Send, ShieldCheck,
    GraduationCap, Users
} from 'lucide-react';
import jobService from '../../services/jobService';
import savedJobService from '../../services/savedJobService';
import applicationService from '../../services/applicationService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuthStore from '../../store/authStore';
import useSeekerStore from '../../store/seekerStore';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { profile, fetchProfile, isInitialized } = useSeekerStore();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applying, setApplying] = useState(false);
    const [formData, setFormData] = useState({
        coverLetter: '',
        expectedSalary: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const data = await jobService.getJob(id);
                setJob(data);

                // Check if already applied if user is a seeker
                if (user?.userType === 'SEEKER') {
                    const [applied, saved] = await Promise.all([
                        applicationService.checkApplication(id),
                        savedJobService.isSaved(id)
                    ]);
                    setHasApplied(applied);
                    setIsSaved(saved);
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };

        if (user?.userType === 'SEEKER' && !isInitialized) {
            fetchProfile();
        }

        fetchJobData();
    }, [id, navigate, user, isInitialized, fetchProfile]);

    const openApplyModal = () => {
        if (!profile) {
            if (window.confirm('You need to complete your profile at least with basic info before applying. Go to profile?')) {
                navigate('/seeker/profile');
            }
            return;
        }
        setShowApplyModal(true);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        setError('');
        try {
            await applicationService.applyForJob({
                jobId: id,
                ...formData
            });
            setSuccess(true);
            setHasApplied(true);
            setTimeout(() => {
                setShowApplyModal(false);
                navigate('/applications');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application. Have you already applied?');
        } finally {
            setApplying(false);
        }
    };

    const handleToggleSave = async () => {
        if (!user) {
            navigate('/auth/login');
            return;
        }
        if (user.userType !== 'SEEKER') return;

        setSaving(true);
        try {
            const result = await savedJobService.toggleSave(id);
            setIsSaved(result.saved);
        } catch (err) {
            console.error('Error toggling save:', err);
        } finally {
            setSaving(false);
        }
    };

    const formatEducation = (level) => {
        if (!level) return 'N/A';
        return level.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent"></div>
        </div>
    );

    if (!job) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-24 pb-20 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-primary dark:hover:text-white mb-10 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:bg-gray-50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase">Back to listings</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Main Header Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-[0_30px_60px_rgba(0,0,0,0.02)] relative overflow-hidden">
                            {/* Decorative background blob */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 overflow-hidden">
                                        {job.companyLogoUrl ? (
                                            <img
                                                src={job.companyLogoUrl}
                                                alt={job.companyName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-serif font-black text-primary dark:text-gray-300">
                                                {job.companyName?.charAt(0) || 'J'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white mb-3">
                                            {job.title}
                                        </h1>
                                        <div className="flex items-center gap-2 text-sm font-heading font-medium text-secondary">
                                            <Building2 size={18} />
                                            <span className="font-bold">{job.companyName}</span>
                                            <span className="mx-2 text-gray-300">•</span>
                                            <ShieldCheck size={18} className="text-accent" />
                                            <span className="text-accent text-xs font-black uppercase">Verified Employer</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={handleToggleSave}
                                        disabled={saving}
                                        className={`flex-1 md:flex-none p-4 rounded-2xl transition-all ${isSaved ? 'bg-secondary text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-primary'}`}
                                        title={isSaved ? "Remove from saved" : "Save this job"}
                                    >
                                        <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
                                    </button>
                                    <button className="flex-1 md:flex-none p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-primary transition-all">
                                        <Share2 size={22} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <MapPin size={16} className="text-secondary" />
                                        {job.addressCity || 'Remote'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <Briefcase size={16} className="text-secondary" />
                                        {job.jobType.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Salary</span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <DollarSign size={16} className="text-secondary" />
                                        {job.salaryMin ? (
                                            <>
                                                {job.currency || '$'} {job.salaryMin.toLocaleString()}
                                                {job.salaryMax && ` - ${job.salaryMax.toLocaleString()}`}
                                                <span className="text-[10px] text-gray-400 font-medium ml-1">/{job.compensationType?.toLowerCase()}</span>
                                            </>
                                        ) : 'Negotiable'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Closing</span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <Calendar size={16} className="text-secondary" />
                                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h2 className="text-2xl font-serif font-black text-primary dark:text-white mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                                About the Position
                            </h2>
                            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-heading text-text-secondary dark:text-gray-400 space-y-6">
                                {job.description?.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>

                            <h3 className="text-xl font-serif font-black text-primary dark:text-white mt-12 mb-6">
                                Key Requirements
                            </h3>
                            <ul className="space-y-4 font-heading text-text-secondary dark:text-gray-400">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={24} className="text-accent mt-0.5 flex-shrink-0" />
                                    <span>{job.experienceLevel} Experience Level: {job.experienceDescription}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={24} className="text-accent mt-0.5 flex-shrink-0" />
                                    <span>Education: {formatEducation(job.educationLevel)}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={24} className="text-accent mt-0.5 flex-shrink-0" />
                                    <span>Gender Preference: {job.genderRequirement || 'Any'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Quick Apply Card */}
                        <div className="bg-primary hover:bg-primary-dark rounded-[2.5rem] p-10 text-white shadow-2xl transition-all duration-300 group">
                            <h3 className="text-2xl font-serif font-black mb-4">Ready to apply?</h3>
                            <p className="text-blue-100/70 font-light mb-8 font-heading leading-relaxed">
                                Take the first step towards your dream role. It only takes 2 minutes.
                            </p>

                            {user?.userType === 'SEEKER' ? (
                                hasApplied ? (
                                    <div className="w-full p-6 rounded-2xl bg-white/10 text-white text-center flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-serif font-black text-xl italic uppercase tracking-wider">Already Applied</div>
                                            <p className="text-blue-100/50 text-[10px] font-bold uppercase tracking-[0.2em]">Application is being reviewed</p>
                                        </div>
                                        <Link to="/applications" className="mt-2 w-full">
                                            <Button variant="outline" fullWidth size="md" className="border-white/30 text-white hover:bg-white hover:text-primary">
                                                Track Status
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        size="lg"
                                        onClick={openApplyModal}
                                        className="shadow-xl shadow-secondary/20"
                                    >
                                        Apply Now
                                        <Send size={18} className="ml-2" />
                                    </Button>
                                )
                            ) : !user ? (
                                <Link to="/auth/login" className="block">
                                    <Button variant="secondary" fullWidth size="lg">
                                        Sign in to Apply
                                    </Button>
                                </Link>
                            ) : (
                                <div className="p-4 rounded-2xl bg-white/10 text-white/60 text-center text-sm font-bold uppercase tracking-widest">
                                    Restricted to Seekers
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-blue-100/50 font-bold uppercase tracking-widest">
                                <span>{job.vacancyCount || 1} open positions</span>
                                <span>{job.applicantCount || 0} applied</span>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                            <h4 className="text-sm font-black text-primary dark:text-white uppercase tracking-widest">Overview</h4>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry</div>
                                        <div className="text-sm font-bold text-primary dark:text-white">{job.category}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Education</div>
                                        <div className="text-sm font-bold text-primary dark:text-white">{formatEducation(job.educationLevel)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</div>
                                        <div className="text-sm font-bold text-primary dark:text-white">{job.experienceLevel}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={() => !applying && setShowApplyModal(false)} />
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[3rem] p-10 lg:p-14 relative z-10 shadow-3xl animate-fade-in-up">
                        <button
                            className="absolute top-8 right-8 text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                            onClick={() => !applying && setShowApplyModal(false)}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-4xl font-serif font-black text-primary dark:text-white mb-4">Complete Application</h2>
                        <p className="text-text-secondary dark:text-gray-400 font-heading mb-10">
                            Applying for <span className="text-secondary font-bold">{job.title}</span> at {job.companyName}
                        </p>

                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck size={40} className="text-accent" />
                                </div>
                                <h3 className="text-2xl font-serif font-black text-primary dark:text-white mb-2">Application Sent!</h3>
                                <p className="text-gray-500">Redirecting you to your applications...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleApply} className="space-y-8">
                                {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-4">Cover Letter (Required)</label>
                                    <textarea
                                        required
                                        maxLength={10000}
                                        value={formData.coverLetter}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                        placeholder="Tell the employer why you're a great fit..."
                                        className="w-full h-48 p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-secondary/20 transition-all font-heading text-primary dark:text-white resize-none"
                                    />
                                    <div className="text-right text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                                        {formData.coverLetter.length} / 10,000 characters
                                    </div>
                                </div>

                                <Input
                                    label="Expected Salary (Monthly / USD)"
                                    placeholder="e.g. 5000"
                                    type="number"
                                    value={formData.expectedSalary}
                                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                                />

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        fullWidth
                                        size="lg"
                                        loading={applying}
                                    >
                                        Submit Application
                                    </Button>
                                    {!applying && (
                                        <Button
                                            onClick={() => setShowApplyModal(false)}
                                            variant="outline"
                                            size="lg"
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;
