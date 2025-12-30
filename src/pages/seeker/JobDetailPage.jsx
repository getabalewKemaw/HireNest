import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin, Briefcase, Clock, Calendar,
    DollarSign, Building2, Share2, Bookmark,
    ArrowLeft, CheckCircle2, Send, ShieldCheck,
    GraduationCap, Users, ArrowRight, Star
} from 'lucide-react';
import jobService from '../../services/jobService';
import savedJobService from '../../services/savedJobService';
import applicationService from '../../services/applicationService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuthStore from '../../store/authStore';
import useSeekerStore from '../../store/seekerStore';
import CompanyPublicProfileModal from '../../components/modals/CompanyPublicProfileModal';

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
    const [showCompanyModal, setShowCompanyModal] = useState(false);

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

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = null;
        if (name === 'coverLetter' && !value.trim()) {
            error = 'Cover letter is required';
        }
        if (name === 'expectedSalary') {
            if (!value) {
                error = 'Expected salary is required';
            } else if (Number(value) < 0) {
                error = 'Salary cannot be negative';
            } else if (Number(value) === 0) {
                error = 'Salary must be greater than 0';
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleApply = async (e) => {
        e.preventDefault();

        // Validate all fields
        const isCoverLetterValid = validateField('coverLetter', formData.coverLetter);
        const isSalaryValid = validateField('expectedSalary', formData.expectedSalary);
        if (!isCoverLetterValid || !isSalaryValid) return;

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
        <div className="pb-20">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Header Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-700 shadow-[0_20px_60px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                            {/* Decorative background blob */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none -translate-x-10 -translate-y-10" />

                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10 mb-8">
                                <div
                                    className="flex gap-5 cursor-pointer group/company"
                                    onClick={() => setShowCompanyModal(true)}
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 overflow-hidden group-hover/company:shadow-lg transition-all group-hover/company:scale-105 shrink-0">
                                        {job.companyLogoUrl ? (
                                            <img
                                                src={job.companyLogoUrl}
                                                alt={job.companyName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl md:text-3xl font-serif font-black text-primary dark:text-gray-300">
                                                {job.companyName?.charAt(0) || 'J'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-serif font-black text-primary dark:text-white mb-2 leading-tight group-hover/company:text-secondary transition-colors">
                                            {job.title}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 text-sm font-heading font-medium text-text-secondary dark:text-gray-400">
                                            <Building2 size={16} className="text-gray-400" />
                                            <span className="font-bold border-b border-transparent group-hover/company:border-secondary transition-colors text-gray-700 dark:text-gray-300">
                                                {job.companyName}
                                            </span>
                                            {job.companyVerified && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        <ShieldCheck size={12} />
                                                        Verified
                                                    </div>
                                                </>
                                            )}
                                            {job.paymentVerified && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        <Star size={12} className="fill-secondary text-secondary" />
                                                        Payment Verified
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <button
                                        onClick={handleToggleSave}
                                        disabled={saving}
                                        className={`flex-1 md:flex-none h-12 w-12 flex items-center justify-center rounded-xl transition-all border ${isSaved ? 'bg-secondary text-white border-secondary' : 'bg-white dark:bg-gray-700/50 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-secondary hover:text-secondary'}`}
                                        title={isSaved ? "Remove from saved" : "Save this job"}
                                    >
                                        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                                    </button>
                                    <button className="flex-1 md:flex-none h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700/50 text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary transition-all">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 pt-8 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                        Location
                                    </span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <MapPin size={16} className="text-secondary shrink-0" />
                                        <span className="truncate">{job.addressCity || 'Remote'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                        Type
                                    </span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <Briefcase size={16} className="text-accent shrink-0" />
                                        <span className="truncate">{job.jobType.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                        Salary
                                    </span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <div className="text-[10px] font-black text-secondary px-1.5 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                                            {job.currency || 'USD'}
                                        </div>
                                        <span className="truncate">
                                            {job.salaryMin ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}` : 'Negotiable'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                        Posted
                                    </span>
                                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                                        <Clock size={16} className="text-gray-400 shrink-0" />
                                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                            <h2 className="text-2xl font-serif font-black text-primary dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Briefcase size={18} />
                                </div>
                                About the Role
                            </h2>
                            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-heading text-text-secondary dark:text-gray-400 leading-relaxed text-base md:text-lg">
                                {job.description?.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                                ))}
                            </div>

                            <div className="my-8 h-px w-full bg-gray-100 dark:bg-gray-700" />

                            <h3 className="text-xl font-serif font-black text-primary dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                    <CheckCircle2 size={18} />
                                </div>
                                Requirements
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Education</div>
                                    <div className="font-bold text-primary dark:text-white flex items-center gap-2">
                                        <GraduationCap size={16} className="text-purple-500" />
                                        {formatEducation(job.educationLevel)}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</div>
                                    <div className="font-bold text-primary dark:text-white flex items-center gap-2">
                                        <Briefcase size={16} className="text-orange-500" />
                                        {job.experienceLevel}
                                    </div>
                                </div>
                            </ul>

                            <div className="mt-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                                <span className="font-bold block mb-1">Note from Employer:</span>
                                {job.experienceDescription || "We are looking for a candidate who is passionate and ready to make an impact."}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Sidebar Area */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
                        {/* Quick Apply Card */}
                        <div className="bg-primary overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl transition-all duration-300 relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full -ml-12 -mb-12 blur-xl" />

                            <h3 className="text-2xl font-serif font-black mb-3 relative z-10">Interested?</h3>
                            <p className="text-blue-100/70 font-medium text-sm mb-8 font-heading leading-relaxed relative z-10">
                                Don't miss out on this opportunity. Applications are closing soon.
                            </p>

                            <div className="relative z-10">
                                {user?.userType === 'SEEKER' ? (
                                    hasApplied ? (
                                        <div className="w-full p-6 rounded-2xl bg-white/10 text-white text-center flex flex-col items-center gap-3 backdrop-blur-sm">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="font-serif font-bold text-lg">Applied</div>
                                                <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-wider">Application Sent</p>
                                            </div>
                                            <Link to="/applications" className="mt-2 w-full">
                                                <Button variant="outline" fullWidth size="sm" className="border-white/20 text-white hover:bg-white hover:text-primary h-10 text-xs">
                                                    View Status
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            size="lg"
                                            onClick={openApplyModal}
                                            className="shadow-xl shadow-secondary/20 h-14 text-base"
                                        >
                                            Apply Now
                                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )
                                ) : !user ? (
                                    <Link to="/auth/login" className="block">
                                        <Button variant="secondary" fullWidth size="lg" className="h-14">
                                            Sign in to Apply
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-white/10 text-white/60 text-center text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10">
                                        Seeker Access Only
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-blue-100/50 font-black uppercase tracking-widest relative z-10">
                                <span>{job.vacancyCount || 1} Positions</span>
                                <span>{job.applicantCount || 0} Applicants</span>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Job Overview</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</div>
                                        <div className="text-sm font-bold text-primary dark:text-white">{job.category}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                                        <Briefcase size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Workplace</div>
                                        <div className="text-sm font-bold text-primary dark:text-white">{job.workplaceType?.replace('_', ' ')}</div>
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
                                        name="coverLetter"
                                        required
                                        maxLength={10000}
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Tell the employer why you're a great fit..."
                                        className={`w-full h-48 p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-700/50 border ${errors.coverLetter ? 'border-red-500' : 'border-gray-100 dark:border-gray-600'} focus:ring-2 focus:ring-secondary/20 transition-all font-heading text-primary dark:text-white resize-none`}
                                    />
                                    {errors.coverLetter && <p className="mt-2 text-xs text-red-500 font-bold">{errors.coverLetter}</p>}
                                    <div className="text-right text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                                        {formData.coverLetter.length} / 10,000 characters
                                    </div>
                                </div>

                                <Input
                                    label={`Expected Salary (Monthly / ${job.currency || 'USD'})`}
                                    name="expectedSalary"
                                    placeholder="e.g. 5000"
                                    type="number"
                                    min="0"
                                    value={formData.expectedSalary}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={errors.expectedSalary}
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

            <CompanyPublicProfileModal
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
                companyId={job.companyProfileId}
            />
        </div>
    );
};

export default JobDetailPage;
