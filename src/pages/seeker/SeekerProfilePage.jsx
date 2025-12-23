import { useState, useEffect, useRef } from 'react';
import {
    User, Camera, MapPin, Phone, Calendar, Mail,
    Edit3, Trash2, CheckCircle2, AlertCircle, ChevronRight,
    Plus, Image as ImageIcon, Briefcase, GraduationCap
} from 'lucide-react';
import useSeekerStore from '../../store/seekerStore';
import useAuthStore from '../../store/authStore';
import BasicInfoForm from '../../components/seeker/BasicInfoForm';
import AddressForm from '../../components/seeker/AddressForm';
import BioSection from '../../components/seeker/details/BioSection';
import SkillSection from '../../components/seeker/details/SkillSection';
import ProjectSection from '../../components/seeker/details/ProjectSection';
import CVSection from '../../components/seeker/details/CVSection';
import SectorSection from '../../components/seeker/details/SectorSection';
import TagSection from '../../components/seeker/details/TagSection';
import SocialLinksSection from '../../components/seeker/details/SocialLinksSection';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import SeekerPublicProfileModal from '../../components/modals/SeekerPublicProfileModal';
import { Eye } from 'lucide-react';

const SeekerProfilePage = () => {
    const { user, isCheckingAuth, isAuthenticated } = useAuthStore();
    const {
        profile, skills, projects, isLoading, error, fetchAllProfileData,
        saveBasicInfo, uploadImage, removeImage,
        saveAddress, removeAddress
    } = useSeekerStore();

    const [editMode, setEditMode] = useState(null); // 'basic', 'address', null
    const [successMessage, setSuccessMessage] = useState('');
    const [showPublicPreview, setShowPublicPreview] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log('🔍 [PROFILE] Auth Check:', { isCheckingAuth, isAuthenticated, user: !!user });

        // CRITICAL FIX: Only fetch data after auth is initialized AND user is authenticated
        if (!isCheckingAuth && isAuthenticated && user) {
            console.log('🔍 [PROFILE] ✅ Auth complete, fetching profile data...');
            fetchAllProfileData();
        } else if (!isCheckingAuth && !isAuthenticated) {
            console.log('🔍 [PROFILE] ❌ Not authenticated, skipping data fetch');
        } else {
            console.log('🔍 [PROFILE] ⏳ Still checking auth, waiting...');
        }
    }, [isCheckingAuth, isAuthenticated, user, fetchAllProfileData]);

    const handleBasicInfoSave = async (data) => {
        try {
            await saveBasicInfo(data, !!profile);
            setSuccessMessage('Profile information updated successfully!');
            setEditMode(null);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            // Error managed by store
        }
    };

    const handleAddressSave = async (data) => {
        try {
            await saveAddress(data);
            setSuccessMessage('Address updated successfully!');
            setEditMode(null);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            // Error managed by store
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await uploadImage(file);
                setSuccessMessage('Profile image updated!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                // Error managed by store
            }
        }
    };

    const handleRemoveImage = async () => {
        if (window.confirm('Are you sure you want to remove your profile image?')) {
            await removeImage();
        }
    };

    const handleRemoveAddress = async () => {
        if (window.confirm('Are you sure you want to remove your address?')) {
            await removeAddress();
        }
    };

    if (isLoading && !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-secondary/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-t-secondary rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-500 font-medium animate-pulse">Preparing your profile...</p>
            </div>
        );
    }

    return (
        <div className="pb-12">
            <div className="max-w-5xl mx-auto">
                {/* Status Alerts */}
                {error && <Alert type="error" message={error} className="mb-6" />}
                {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-white dark:border-gray-700/30 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden mb-8 group">
                    <div className="h-32 bg-gradient-to-r from-secondary to-secondary-light relative">
                        <div className="absolute -bottom-16 left-8 sm:left-12 flex items-end">
                            <div className="relative group/avatar">
                                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-gray-700 p-1.5 shadow-2xl border-4 border-white dark:border-gray-800 overflow-hidden transform group-hover/avatar:scale-[1.02] transition-transform duration-500">
                                    {profile?.profileImageUrl ? (
                                        <img
                                            src={profile.profileImageUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                            <User size={64} />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-1.5 rounded-2xl bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <Camera size={24} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                {profile?.profileImageUrl && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shadow-lg opacity-0 group-hover/avatar:opacity-100 hover:scale-110 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="ml-6 mb-4 pb-2">
                                <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white tracking-tight">
                                    {profile ? `${profile.firstName} ${profile.lastName || ''}` : user?.name || 'Welcome!'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 mt-1">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                                        <Mail size={16} /> {profile?.email || user?.email}
                                    </p>
                                    <button
                                        onClick={() => setShowPublicPreview(true)}
                                        className="text-xs font-black uppercase tracking-widest text-secondary hover:text-secondary-dark flex items-center gap-2 transition-all"
                                    >
                                        <Eye size={14} /> View Public View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-8 px-8 sm:px-12">
                        <div className="flex flex-wrap items-center justify-end gap-4 mt-[-1rem]">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-black">Completion</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent transition-all duration-1000"
                                                style={{ width: profile?.profileCompletion || '20%' }}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-accent">{profile?.profileCompletion || '20%'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms/Infomation */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Information Section */}
                        <section className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/20 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-gray-200/40 dark:hover:shadow-none">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-primary dark:text-white">Basic Information</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your personal identity and contact info</p>
                                    </div>
                                </div>
                                {!editMode && (
                                    <Button
                                        variant="ghost"
                                        icon={<Edit3 size={18} />}
                                        onClick={() => setEditMode('basic')}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {editMode === 'basic' ? (
                                <BasicInfoForm
                                    initialData={profile}
                                    onSave={handleBasicInfoSave}
                                    onCancel={() => setEditMode(null)}
                                    isLoading={isLoading}
                                />
                            ) : profile ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                                        <p className="text-primary dark:text-white font-medium">
                                            {profile.firstName} {profile.middleName} {profile.lastName}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                                        <p className="text-primary dark:text-white font-medium flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400" /> {profile.phone}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</p>
                                        <p className="text-primary dark:text-white font-medium flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${profile.gender === 'MALE' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                                            {profile.gender}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p>
                                        <p className="text-primary dark:text-white font-medium flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" /> {profile.dateOfBirth}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/20 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <AlertCircle className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-primary dark:text-white">Profile setup needed</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Please complete your basic information to start applying for jobs.</p>
                                    <Button onClick={() => setEditMode('basic')} icon={<Plus size={18} />}>Setup Now</Button>
                                </div>
                            )}
                        </section>

                        {/* Address Section */}
                        <section className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/20 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-gray-200/40 dark:hover:shadow-none">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-primary dark:text-white">Address Details</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Where you are currently based</p>
                                    </div>
                                </div>
                                {!editMode && profile?.address && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            icon={<Trash2 size={16} />}
                                            onClick={handleRemoveAddress}
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<Edit3 size={16} />}
                                            onClick={() => setEditMode('address')}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {editMode === 'address' ? (
                                <AddressForm
                                    initialData={profile?.address}
                                    onSave={handleAddressSave}
                                    onCancel={() => setEditMode(null)}
                                    isLoading={isLoading}
                                />
                            ) : profile?.address ? (
                                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700 whitespace-pre-line leading-relaxed">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <MapPin size={20} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-black text-primary dark:text-white">{profile.address.country}, {profile.address.city}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                {profile.address.subCity && `${profile.address.subCity}, `}
                                                {profile.address.region && `${profile.address.region}, `}
                                                {profile.address.street}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/20 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <MapPin className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-primary dark:text-white">Add your address</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Helping employers find talents near them.</p>
                                    <Button onClick={() => setEditMode('address')} variant="outline" icon={<Plus size={18} />}>Add Address</Button>
                                </div>
                            )}
                        </section>

                        {/* Professional Details */}
                        <BioSection />
                        <TagSection />
                        <SectorSection />
                        <SkillSection />
                        <ProjectSection />
                        <SocialLinksSection />
                        <CVSection />
                    </div>

                    {/* Right Column - sidebar stuff */}
                    <div className="space-y-8">
                        {/* Profile Strength Card */}
                        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <CheckCircle2 size={120} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Profile Strength</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">A complete profile increases your chances of getting hired by 3x.</p>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between text-sm mb-1 font-bold">
                                    <span>Progress</span>
                                    <span>{profile?.profileCompletion || '20%'}</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <div
                                        className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                        style={{ width: profile?.profileCompletion || '20%' }}
                                    ></div>
                                </div>
                            </div>

                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-sm">
                                    <div className={`p-1 rounded-full ${profile ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={profile ? 'text-white' : 'text-white/40'}>Basic Identity</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className={`p-1 rounded-full ${profile?.profileImageUrl ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={profile?.profileImageUrl ? 'text-white' : 'text-white/40'}>Profile Image</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className={`p-1 rounded-full ${profile?.address ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={profile?.address ? 'text-white' : 'text-white/40'}>Location Details</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className={`p-1 rounded-full ${skills.length > 0 ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={skills.length > 0 ? 'text-white' : 'text-white/40'}>Technical Skills</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className={`p-1 rounded-full ${projects.length > 0 ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={projects.length > 0 ? 'text-white' : 'text-white/40'}>Portfolio Projects</span>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-secondary/5 dark:bg-secondary/10 border border-secondary/10 dark:border-secondary/20 rounded-[2rem] p-8">
                            <h3 className="text-secondary font-black text-lg mb-4 flex items-center gap-2">
                                <ImageIcon size={20} /> Pro Tips
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4 group/tip">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-center text-secondary shadow-sm group-hover/tip:scale-110 transition-transform">
                                        <Plus size={16} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Upload a professional headshot with a clean background.</p>
                                </li>
                                <li className="flex gap-4 group/tip">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-center text-secondary shadow-sm group-hover/tip:scale-110 transition-transform">
                                        <Plus size={16} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Keep your phone number up to date for interview calls.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <SeekerPublicProfileModal
                isOpen={showPublicPreview}
                onClose={() => setShowPublicPreview(false)}
                seekerId={user?.id}
            />
        </div>
    );
};

export default SeekerProfilePage;
