import { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, MapPin, ExternalLink, Download, User, Briefcase, Cpu, Globe, Award, FileText } from 'lucide-react';
import * as seekerService from '../../services/seekerService';
import Button from '../Button';
import PdfViewerModal from './PdfViewerModal';
import { downloadFile } from '../../utils/downloadUtils';

const SeekerPublicProfileModal = ({ isOpen, onClose, seekerId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);

    useEffect(() => {
        if (isOpen && seekerId) {
            fetchSeekerProfile();
        }
    }, [isOpen, seekerId]);

    const fetchSeekerProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await seekerService.getFullProfile(seekerId);
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(res.error?.message || 'Failed to fetch seeker profile');
            }
        } catch (err) {
            console.error('Error fetching seeker profile:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCV = (url, name) => {
        downloadFile(url, `${name.replace(/\s+/g, '_')}_CV.pdf`);
    };

    if (!isOpen) return null;

    const { basicInfo, bio, skills, projects, tags, socialLinks, cv } = profile || {};

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <div className="absolute inset-0 bg-[#0B1C2D]/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-[#F8FAFC] dark:bg-[#0B1C2D] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/10 flex flex-col max-h-[90vh]">
                {/* Header Section */}
                <div className="bg-white dark:bg-[#111820] border-b border-gray-100 dark:border-white/5 px-8 sm:px-12 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gray-50 dark:bg-gray-800 p-1 border-2 border-secondary/20 overflow-hidden flex-shrink-0">
                            {basicInfo?.profileImageUrl ? (
                                <img src={basicInfo.profileImageUrl} alt={basicInfo.firstName} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white leading-tight">
                                {basicInfo ? `${basicInfo.firstName} ${basicInfo.lastName || ''}` : 'Applicant Profile'}
                            </h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags?.map((tag, idx) => (
                                    <span key={idx} className="text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary rounded-full uppercase tracking-wider">
                                        {tag.tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all text-gray-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white dark:bg-[#111820] rounded-[2rem] border border-red-100 dark:border-red-900/20">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <X size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{error}</h3>
                            <Button variant="outline" onClick={onClose} size="sm">Close Profile</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column: Info Cards */}
                            <div className="space-y-6">
                                {/* Contact Info */}
                                <div className="bg-white dark:bg-[#111820] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                                    <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-6 font-heading">Contact & Details</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                                                <Mail size={18} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email</p>
                                                <p className="text-sm font-bold text-primary dark:text-white truncate">{basicInfo?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Phone</p>
                                                <p className="text-sm font-bold text-primary dark:text-white">{basicInfo?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Location</p>
                                                <p className="text-sm font-bold text-primary dark:text-white">
                                                    {basicInfo?.address ? `${basicInfo.address.city}, ${basicInfo.address.country}` : 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-white dark:bg-[#111820] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                                    <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-6 font-heading">Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills?.map((skill, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-primary dark:text-white rounded-xl border border-gray-100 dark:border-white/5">
                                                {skill.skill}
                                                <span className="ml-2 text-[10px] text-gray-400">({skill.proficiency})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CV Viewer & Download */}
                                {cv && (
                                    <div className="flex flex-col gap-3">
                                        <div
                                            onClick={() => setShowPdfViewer(true)}
                                            className="flex items-center justify-between p-6 bg-gradient-to-r from-secondary to-secondary-light rounded-[2rem] text-white group hover:shadow-xl hover:shadow-secondary/20 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">View Professional CV</p>
                                                    <p className="text-[10px] opacity-70">PDF Document</p>
                                                </div>
                                            </div>
                                            <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="md"
                                            fullWidth
                                            className="rounded-[2rem] border-secondary/20 text-secondary hover:bg-secondary/5"
                                            icon={<Download size={18} />}
                                            onClick={() => handleDownloadCV(cv.cvUrl, basicInfo?.firstName)}
                                        >
                                            Download for Offline
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Center/Right Column: Bio, Projects, Social */}
                            <div className="lg:col-span-2 space-y-10">
                                {/* About/Bio */}
                                {bio?.bio && (
                                    <section className="bg-white dark:bg-[#111820] rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                                <Award size={20} />
                                            </div>
                                            <h2 className="text-xl font-bold text-primary dark:text-white">Professional Summary</h2>
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-wrap font-heading italic">
                                            "{bio.bio}"
                                        </div>
                                    </section>
                                )}

                                {/* Projects Portfolio */}
                                <section>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                                            <Briefcase size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-primary dark:text-white">Featured Projects</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {projects?.map((project, idx) => (
                                            <div key={idx} className="bg-white dark:bg-[#111820] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 group shadow-sm hover:shadow-xl transition-all duration-500">
                                                <div className="h-44 relative bg-gray-100 dark:bg-gray-800">
                                                    {project.imageUrl || (project.imageUrls && project.imageUrls[0]) ? (
                                                        <img
                                                            src={project.imageUrl || project.imageUrls[0]}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Cpu size={48} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="font-bold text-primary dark:text-white mb-2 line-clamp-1">{project.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                                                    {project.projectUrl && (
                                                        <a
                                                            href={project.projectUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] font-black uppercase text-secondary tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all"
                                                        >
                                                            View Project <ExternalLink size={10} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {(!projects || projects.length === 0) && (
                                        <div className="text-center py-12 bg-white dark:bg-[#111820] rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                                            <p className="text-gray-400 text-sm italic font-medium">No projects showcase available.</p>
                                        </div>
                                    )}
                                </section>

                                {/* Social Links */}
                                {socialLinks && socialLinks.length > 0 && (
                                    <section className="flex flex-wrap gap-4">
                                        {socialLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#111820] border border-gray-100 dark:border-white/5 rounded-2xl hover:border-secondary transition-all"
                                            >
                                                <Globe size={20} className="text-secondary" />
                                                <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-white">{link.platform}</span>
                                            </a>
                                        ))}
                                    </section>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="bg-white dark:bg-[#111820] border-t border-gray-100 dark:border-white/5 px-8 sm:px-12 py-6 flex items-center justify-end gap-4 flex-shrink-0">
                    <Button variant="ghost" onClick={onClose} size="sm">Close Profile</Button>
                    <Button variant="primary" size="sm" onClick={() => window.location.href = `mailto:${basicInfo?.email}`}>Contact Applicant</Button>
                </div>
            </div>

            <PdfViewerModal
                isOpen={showPdfViewer}
                onClose={() => setShowPdfViewer(false)}
                pdfUrl={cv?.cvUrl}
                title={`${basicInfo?.firstName}'s CV`}
            />
        </div>
    );
};

export default SeekerPublicProfileModal;
