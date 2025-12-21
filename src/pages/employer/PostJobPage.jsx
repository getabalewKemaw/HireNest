import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, ArrowRight, Briefcase, MapPin,
    DollarSign, FileText, LayoutGrid, Calendar,
    ChevronRight, Sparkles, Building2, GraduationCap,
    Users, Info, X, Globe, Map
} from 'lucide-react';
import jobService from '../../services/jobService';
import Button from '../../components/Button';
import Input from '../../components/Input';

const PostJobPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-24 pb-20 px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-white shadow-xl shadow-secondary/20">
                            <Plus size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white">Post a New Job</h1>
                            <p className="text-text-secondary dark:text-gray-400 font-heading">Complete the details below to find your next great hire.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-3 rounded-full transition-all duration-500 ${s <= step ? 'bg-secondary' : 'bg-gray-100 dark:bg-gray-800'}`}
                            />
                        ))}
                    </div>
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
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50 dark:border-gray-700">
                                <LayoutGrid className="text-secondary" />
                                <h2 className="text-2xl font-serif font-black text-primary dark:text-white">Basic Information</h2>
                            </div>

                            <div className="space-y-8">
                                <Input
                                    label="Job Title"
                                    name="title"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Job Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
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
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Workplace Type</label>
                                        <div className="flex gap-2">
                                            {['ON_SITE', 'REMOTE', 'HYBRID'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, workplaceType: type })}
                                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${formData.workplaceType === type ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 border-gray-100 dark:border-gray-700'}`}
                                                >
                                                    {type.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        label="Country"
                                        name="country"
                                        placeholder="e.g. Ethiopia"
                                        value={formData.country}
                                        onChange={handleChange}
                                        icon={Globe}
                                        required
                                    />
                                    <Input
                                        label="Region / State"
                                        name="region"
                                        placeholder="e.g. Addis Ababa"
                                        value={formData.region}
                                        onChange={handleChange}
                                        icon={Map}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Job Type</label>
                                        <select
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
                                        >
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="CONTRACT">Contract</option>
                                            <option value="FREELANCE">Freelance</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Number of Vacancies"
                                        name="vacancyCount"
                                        type="number"
                                        value={formData.vacancyCount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50 dark:border-gray-700">
                                <Sparkles className="text-secondary" />
                                <h2 className="text-2xl font-serif font-black text-primary dark:text-white">Requirements & description</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-4">Job Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={8}
                                        className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 transition-all font-heading text-primary dark:text-white resize-none"
                                        placeholder="Describe the role, responsibilities, and company culture..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Education Level</label>
                                        <select
                                            name="educationLevel"
                                            value={formData.educationLevel}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
                                        >
                                            <option value="NOT_SPECIFIED">Not Specified</option>
                                            <option value="SECONDARY_SCHOOL">Secondary School</option>
                                            <option value="TVET">TVET / Diploma</option>
                                            <option value="BACHELORS">Bachelor's Degree</option>
                                            <option value="MASTERS">Master's Degree</option>
                                            <option value="PHD">PhD / Doctorate</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Experience Level"
                                        name="experienceLevel"
                                        placeholder="e.g. 5+ years"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Experience Details (Keywords)</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tags.map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-secondary/10 text-secondary text-xs font-bold rounded-full flex items-center gap-2 border border-secondary/20">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)}>
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                        placeholder="Type a skill and press Enter (e.g. React, Logistics, Project Management)"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50 dark:border-gray-700">
                                <DollarSign className="text-secondary" />
                                <h2 className="text-2xl font-serif font-black text-primary dark:text-white">Salary & Final Details</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-1">
                                        <Input
                                            label="Min Salary"
                                            name="salaryMin"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.salaryMin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <Input
                                            label="Max Salary"
                                            name="salaryMax"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.salaryMax}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Pay Type</label>
                                        <select
                                            name="compensationType"
                                            value={formData.compensationType}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
                                        >
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="HOURLY">Hourly</option>
                                            <option value="FIXED">Fixed Project</option>
                                        </select>
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Currency</label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="ETB">ETB (Br)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        label="Application Deadline"
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-3">Gender Requirement</label>
                                        <select
                                            name="genderRequirement"
                                            value={formData.genderRequirement}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 font-heading font-medium text-primary dark:text-white appearance-none"
                                        >
                                            <option value="ANY">Any</option>
                                            <option value="MALE">Male Only</option>
                                            <option value="FEMALE">Female Only</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-secondary shadow-sm">
                                        <Info size={20} />
                                    </div>
                                    <p className="text-sm font-heading text-blue-800 dark:text-blue-300 leading-relaxed">
                                        By posting this job, you agree to our fair hiring practices and platform terms.
                                        The job will be published immediately for all active seekers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-6">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    prevStep();
                                }}
                            >
                                Previous Step
                            </Button>
                        )}

                        {step < 3 ? (
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth={step === 1}
                                size="lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    nextStep();
                                }}
                                className="lg:w-auto ml-auto"
                            >
                                Next Step
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                fullWidth
                                size="lg"
                                type="submit"
                                loading={loading}
                            >
                                Verify & Publish Job
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
