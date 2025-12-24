import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2, ArrowRight, Briefcase, MapPin,
    DollarSign, FileText, LayoutGrid, Calendar,
    ChevronRight, Sparkles, Building2, GraduationCap,
    Users, Info, X, Globe, Map, AlertCircle
} from 'lucide-react';
import jobService from '../../services/jobService';
import paymentService from '../../services/paymentService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PaymentModal from '../../components/PaymentModal';
import useAuthStore from '../../store/authStore';

const PostJobPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Payment state
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        jobType: 'FULL_TIME',
        workplaceType: 'ON_SITE',
        category: '',
        educationLevel: 'NOT_SPECIFIED',
        experienceLevel: '',
        experienceDescription: '',
        salaryMin: '',
        salaryMax: '',
        compensationType: 'MONTHLY',
        currency: 'USD',
        country: 'Ethiopia',
        region: '',
        vacancyCount: 1,
        genderRequirement: 'ANY',
        deadline: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState({});

    // Check payment requirement on mount
    useEffect(() => {
        checkPaymentRequirement();
    }, []);

    const checkPaymentRequirement = async () => {
        try {
            setCheckingPayment(true);
            const response = await paymentService.checkPaymentRequirement();
            console.log('💳 Payment Check Response:', response);
            setPaymentRequired(response.needsPayment);
            setPaymentInfo(response);
        } catch (error) {
            console.error('❌ Error checking payment requirement:', error);
        } finally {
            setCheckingPayment(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission unless we are on the final step
        if (step !== 3) return;

        // Check if payment is required
        if (paymentRequired) {
            setShowPaymentModal(true);
            return;
        }

        setLoading(true);

        // Clean data for backend
        const cleanedData = {
            ...formData,
            experienceDescription: tags.join(', '), // Send tags as comma separated string
            salaryMin: formData.salaryMin === '' ? null : parseFloat(formData.salaryMin),
            salaryMax: formData.salaryMax === '' ? null : parseFloat(formData.salaryMax),
            vacancyCount: parseInt(formData.vacancyCount) || 1,
            deadline: formData.deadline === '' ? null : formData.deadline,
        };

        try {
            await jobService.createJob(cleanedData);
            navigate('/jobs/manage');
        } catch (error) {
            console.error('Error posting job:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n');
                alert(`Please fix the following errors:\n${errorMessages}`);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred while posting the job. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = 'Job title is required';
            if (!formData.category) newErrors.category = 'Please select a category';
            if (!formData.country.trim()) newErrors.country = 'Country is required';
        }

        if (step === 2) {
            if (!formData.description.trim()) newErrors.description = 'Job description is required';
            else if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };
    const prevStep = () => setStep(step - 1);

    const preparedJobData = {
        ...formData,
        experienceDescription: tags.join(', '),
        salaryMin: formData.salaryMin === '' ? null : parseFloat(formData.salaryMin),
        salaryMax: formData.salaryMax === '' ? null : parseFloat(formData.salaryMax),
        vacancyCount: parseInt(formData.vacancyCount) || 1,
        deadline: formData.deadline === '' ? null : formData.deadline,
    };

    console.log('📦 Prepared Job Data for Payment:', preparedJobData);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-32 pb-40 px-6 font-sans">
            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={() => {
                    setPaymentRequired(false);
                    setShowPaymentModal(false);
                    checkPaymentRequirement();
                }}
                amount={paymentInfo?.price || 500}
                currency={paymentInfo?.currency || 'ETB'}
                userInfo={{
                    email: user?.email,
                    firstName: user?.firstName || user?.name?.split(' ')[0],
                    lastName: user?.lastName || user?.name?.split(' ')[1],
                    phoneNumber: user?.phoneNumber
                }}
                jobData={preparedJobData}
            />

            <div className="max-w-4xl mx-auto">
                {/* Header Phase */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-primary dark:text-white mb-6">
                        Post a <span className="text-secondary italic">Job</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-heading text-lg max-w-2xl mx-auto">
                        Find the perfect talent for your team. Just follow the steps to create a listing that stands out.
                    </p>
                </div>

                {/* Payment Required Banner */}
                {console.log('🔍 Banner Check - paymentRequired:', paymentRequired, 'showPaymentModal:', showPaymentModal)}
                {paymentRequired && !showPaymentModal && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-6 mb-8 max-w-2xl mx-auto">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-amber-900 dark:text-amber-100 text-lg mb-2">Payment Required</h4>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 font-medium">
                                    You need to pay <span className="font-black">{paymentInfo?.price} {paymentInfo?.currency}</span> to post this job.
                                    Your first job was free!
                                </p>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-all flex items-center gap-2"
                                >
                                    <DollarSign size={18} />
                                    Pay Now to Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex justify-between items-center max-w-2xl mx-auto mb-20 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-secondary -z-0 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>

                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`relative flex flex-col items-center gap-3 ${s <= step ? 'text-secondary' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all duration-500 ${s < step ? 'bg-secondary border-secondary text-white' :
                                s === step ? 'bg-white dark:bg-gray-900 border-secondary text-secondary scale-125 shadow-xl' :
                                    'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-300'
                                }`}>
                                {s < step ? <CheckCircle2 size={16} /> : s}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F8FAFC] dark:bg-gray-900 px-2">
                                {s === 1 ? 'Details' : s === 2 ? 'Description' : 'Compensation'}
                            </span>
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                        }
                    }}
                    className="space-y-12"
                >
                    {step === 1 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Basic Information</h2>
                                    <p className="text-gray-400 text-sm">Let's start with the core details of the position.</p>
                                </div>

                                <Input
                                    label="Job Title"
                                    name="title"
                                    placeholder="e.g. Senior Product Designer"
                                    value={formData.title}
                                    onChange={handleChange}
                                    error={errors.title}
                                    required
                                    className="!text-lg font-bold"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Category</label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 ${errors.category ? 'border-red-500' : 'border-transparent'} focus:border-secondary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all font-bold text-primary dark:text-white appearance-none cursor-pointer outline-none`}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="TECHNOLOGY">Technology & Software</option>
                                                <option value="MARKETING">Marketing & Sales</option>
                                                <option value="DESIGN">Creative & Design</option>
                                                <option value="HEALTHCARE">Healthcare & Medicine</option>
                                                <option value="FINANCE">Finance & Accounting</option>
                                                <option value="EDUCATION">Education & Training</option>
                                                <option value="ENGINEERING">Engineering</option>
                                                <option value="LOGISTICS">Logistics & Supply Chain</option>
                                                <option value="CUSTOMER_SERVICE">Customer Service</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                        {errors.category && <p className="text-red-500 text-sm mt-1 ml-2">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Workplace</label>
                                        <div className="flex bg-gray-50 dark:bg-gray-700/30 p-1.5 rounded-2xl">
                                            {['ON_SITE', 'REMOTE', 'HYBRID'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, workplaceType: type })}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.workplaceType === type ? 'bg-white dark:bg-gray-600 text-secondary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    {type.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        label="Location Country"
                                        name="country"
                                        placeholder="e.g. Ethiopia"
                                        value={formData.country}
                                        onChange={handleChange}
                                        icon={Globe}
                                        error={errors.country}
                                        required
                                    />
                                    <Input
                                        label="Region / State"
                                        name="region"
                                        placeholder="e.g. Addis Ababa"
                                        value={formData.region}
                                        onChange={handleChange}
                                        icon={MapPin}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Employment Type</label>
                                        <div className="relative">
                                            <select
                                                name="jobType"
                                                value={formData.jobType}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent focus:border-secondary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all font-bold text-primary dark:text-white appearance-none cursor-pointer outline-none"
                                            >
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="PART_TIME">Part Time</option>
                                                <option value="CONTRACT">Contract</option>
                                                <option value="FREELANCE">Freelance</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        label="Open Positions"
                                        name="vacancyCount"
                                        type="number"
                                        value={formData.vacancyCount}
                                        onChange={handleChange}
                                        icon={Users}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Role Details</h2>
                                    <p className="text-gray-400 text-sm">Describe the responsibilities and requirements.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4 ml-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={12}
                                        className={`w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-700/30 border-2 ${errors.description ? 'border-red-500' : 'border-transparent'} focus:border-secondary focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-primary dark:text-white resize-none leading-relaxed`}
                                        placeholder="Describe the role, responsibilities, and company culture..."
                                        required
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-2 ml-2">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Education</label>
                                        <div className="relative">
                                            <select
                                                name="educationLevel"
                                                value={formData.educationLevel}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent focus:border-secondary transition-all font-bold text-primary dark:text-white appearance-none outline-none"
                                            >
                                                <option value="NOT_SPECIFIED">Not Specified</option>
                                                <option value="SECONDARY_SCHOOL">Secondary School</option>
                                                <option value="TVET">TVET / Diploma</option>
                                                <option value="BACHELORS">Bachelor's Degree</option>
                                                <option value="MASTERS">Master's Degree</option>
                                                <option value="PHD">PhD / Doctorate</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        label="Years of Experience"
                                        name="experienceLevel"
                                        placeholder="e.g. 5+ years"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                        icon={Briefcase}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Skills & Keywords</label>
                                    <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-[1.5rem] border-2 border-transparent focus-within:border-secondary transition-all">
                                        <div className="flex flex-wrap gap-2 p-2">
                                            {tags.map(tag => (
                                                <span key={tag} className="px-4 py-2 bg-white dark:bg-gray-800 text-secondary text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={addTag}
                                                placeholder="Type skill & press Enter..."
                                                className="flex-1 bg-transparent px-4 py-2 outline-none font-medium text-primary dark:text-white min-w-[150px]"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 ml-2">Press Enter to add a tag</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Compensation</h2>
                                    <p className="text-gray-400 text-sm">Define the salary range and perks.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="Minimum"
                                        name="salaryMin"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        icon={DollarSign}
                                    />
                                    <Input
                                        label="Maximum"
                                        name="salaryMax"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        icon={DollarSign}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Frequency</label>
                                        <div className="relative">
                                            <select
                                                name="compensationType"
                                                value={formData.compensationType}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent focus:border-secondary transition-all font-bold text-primary dark:text-white appearance-none outline-none"
                                            >
                                                <option value="MONTHLY">Monthly</option>
                                                <option value="HOURLY">Hourly</option>
                                                <option value="FIXED">Fixed</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Currency</label>
                                        <div className="relative">
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent focus:border-secondary transition-all font-bold text-primary dark:text-white appearance-none outline-none"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="ETB">ETB (Br)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <Input
                                        label="Closing Date"
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        icon={Calendar}
                                    />
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Preferred Gender</label>
                                        <div className="relative">
                                            <select
                                                name="genderRequirement"
                                                value={formData.genderRequirement}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent focus:border-secondary transition-all font-bold text-primary dark:text-white appearance-none outline-none"
                                            >
                                                <option value="ANY">Any</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-6 z-40">
                        <div className="max-w-4xl mx-auto flex justify-between items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (step > 1) prevStep();
                                    else navigate('/jobs/manage');
                                }}
                                className="text-gray-500 hover:text-primary dark:hover:text-white"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>

                            <div className="flex gap-4">
                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            nextStep();
                                        }}
                                        className="shadow-xl shadow-secondary/30 rounded-xl px-12"
                                    >
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        type="submit"
                                        loading={loading}
                                        className="shadow-xl shadow-secondary/30 rounded-xl px-12"
                                    >
                                        Post Job Now
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Spacer for fixed footer */}
                    <div className="h-24"></div>
                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
