import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Globe, MapPin, Briefcase,
    Link as LinkIcon, Edit3, Image as ImageIcon,
    CheckCircle2, AlertCircle, Save, ArrowLeft,
    Upload, Loader2, Info
} from 'lucide-react';
import companyService from '../../services/companyService';
import Button from '../../components/Button';
import Input from '../../components/Input';

const CompanyProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [logoLoading, setLogoLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        location: '',
        industry: '',
        legalStatus: '',
        socialLinks: '',
        logoUrl: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await companyService.getProfile();
            setProfile(data);
            setFormData({
                description: data.description || '',
                location: data.location || '',
                industry: data.industry || '',
                legalStatus: data.legalStatus || '',
                socialLinks: data.socialLinks || '',
                logoUrl: data.logoUrl || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // If profile doesn't exist, we might need to create it
            // But the backend usually handles approved employers automatically
            setIsEditing(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (profile && profile.id) {
                await companyService.updateProfile(formData);
            } else {
                await companyService.createProfile(formData);
            }
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLogoLoading(true);
        try {
            const response = await companyService.uploadLogo(file);
            setFormData(prev => ({ ...prev, logoUrl: response.logoUrl }));
            setProfile(response);
        } catch (error) {
            console.error('Error uploading logo:', error);
        } finally {
            setLogoLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">

            <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden relative">
                {/* Cover Area */}
                <div className="h-48 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary-light to-secondary opacity-30" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
                </div>

                <div className="px-10 lg:px-16 pb-16">
                    <div className="relative -mt-16 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="relative group/logo">
                                <div className={`w-32 h-32 rounded-[2.5rem] bg-white dark:bg-gray-700 border-8 border-white dark:border-gray-800 shadow-xl flex items-center justify-center overflow-hidden relative ${isEditing ? 'cursor-pointer' : ''}`}>
                                    {logoLoading ? (
                                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10">
                                            <Loader2 className="text-secondary animate-spin" size={32} />
                                        </div>
                                    ) : null}

                                    {formData.logoUrl ? (
                                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={48} className="text-gray-300" />
                                    )}

                                    {isEditing && (
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer z-20">
                                            <Upload size={24} className="mb-1" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="pb-4">
                                <h1 className="text-4xl font-serif font-black text-primary dark:text-white mb-2">
                                    {profile?.companyName || 'Set up your company'}
                                </h1>
                                <div className="flex items-center gap-4 text-sm font-heading font-medium text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <Globe size={16} className="text-secondary" />
                                        {profile?.website || 'Website not set'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 size={16} className="text-secondary" />
                                        Verified Organization
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                size="md"
                                className="mb-4"
                            >
                                <Edit3 size={18} className="mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-10 animate-fade-in">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-primary dark:text-gray-300 mb-4">Company Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={10}
                                            className="w-full p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-secondary/20 transition-all font-heading text-primary dark:text-white resize-none"
                                            placeholder="Tell seekers what makes your company unique..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Info size={16} className="text-blue-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">Logo Management</span>
                                        </div>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-300/60 font-medium leading-relaxed">
                                            Click on the logo circle above to upload a new brand asset. We support PNG, JPG, and WEBP.
                                        </p>
                                    </div>
                                    <Input
                                        label="Headquarters"
                                        name="location"
                                        icon={MapPin}
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, Country"
                                    />
                                    <Input
                                        label="Industry"
                                        name="industry"
                                        icon={Briefcase}
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        placeholder="e.g. Fintech, Healthcare"
                                    />
                                    <Input
                                        label="Legal Status"
                                        name="legalStatus"
                                        value={formData.legalStatus}
                                        onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })}
                                        placeholder="e.g. PLC, LLC"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-10 border-t border-gray-50 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    size="lg"
                                    loading={saving}
                                >
                                    <Save size={20} className="mr-2" />
                                    Save Profile Changes
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="ghost"
                                    size="lg"
                                >
                                    Discard Edits
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-16 animate-fade-in">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                <div className="lg:col-span-2">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">About the Organization</h3>
                                    <div className="prose prose-lg dark:prose-invert max-w-none font-heading text-text-secondary dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                        {profile?.description || 'No description provided yet.'}
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Company Meta</h4>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-secondary">
                                                    <MapPin size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Headquarters</div>
                                                    <div className="text-sm font-bold text-primary dark:text-white">{profile?.location || 'Not Specified'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-secondary">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry</div>
                                                    <div className="text-sm font-bold text-primary dark:text-white">{profile?.industry || 'Not Specified'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-primary">
                                                    <LinkIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Status</div>
                                                    <div className="text-sm font-bold text-primary dark:text-white">{profile?.legalStatus || 'Not Specified'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                {!isEditing && (
                    <div className="mt-12 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-xl">
                                    Deleting your account is permanent. All your data, including job postings and company profile, will be permanently removed.
                                </p>
                            </div>
                            <Button
                                onClick={async () => {
                                    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                                        try {
                                            setLoading(true);
                                            await companyService.deleteAccount();
                                            // Redirect will handle logout implicitly or we should force logout
                                            navigate('/login');
                                            window.location.reload(); // Force full reload to clear states
                                        } catch (err) {
                                            console.error(err);
                                            setLoading(false);
                                            alert('Failed to delete account.');
                                        }
                                    }
                                }}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            {!isEditing && (
                <div className="mt-12 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-xl">
                                Deleting your account is permanent. All your data, including job postings and company profile, will be permanently removed.
                            </p>
                        </div>
                        <Button
                            onClick={async () => {
                                if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                                    try {
                                        setLoading(true);
                                        await companyService.deleteAccount();
                                        // Redirect will handle logout implicitly or we should force logout
                                        navigate('/login');
                                        window.location.reload(); // Force full reload to clear states
                                    } catch (err) {
                                        console.error(err);
                                        setLoading(false);
                                        alert('Failed to delete account.');
                                    }
                                }
                            }}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyProfilePage;
