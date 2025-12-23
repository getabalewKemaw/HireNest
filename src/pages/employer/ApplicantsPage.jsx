import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FileText, DollarSign,
    User, CheckCircle2, XCircle, ExternalLink, Download
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import jobAlertService from '../../services/jobAlertService';
import Button from '../../components/Button';
import SeekerPublicProfileModal from '../../components/modals/SeekerPublicProfileModal';
import PdfViewerModal from '../../components/modals/PdfViewerModal';
import RejectionModal from '../../components/modals/RejectionModal';
import { downloadFile } from '../../utils/downloadUtils';

const ApplicantsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const jobId = searchParams.get('jobId');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedSeekerId, setSelectedSeekerId] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [cvUrl, setCvUrl] = useState(null);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionTarget, setRejectionTarget] = useState(null);
    const [recommendedCandidates, setRecommendedCandidates] = useState([]);
    const [activeTab, setActiveTab] = useState('applied'); // 'applied' or 'recommended'
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        if (jobId) fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        try {
            const data = await applicationService.getApplicationsByJob(jobId);
            setApplications(data.content || []);

            // Fetch recommendations too
            setLoadingRecommendations(true);
            const recommendations = await jobAlertService.getRecommendedCandidates(jobId);
            setRecommendedCandidates(recommendations || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
            setLoadingRecommendations(false);
        }
    };

    const updateStatus = async (appId, status, rejectionReason = '', notes = '') => {
        try {
            await applicationService.updateStatus(appId, { status, notes, rejectionReason });
            fetchApplications();
            if (selectedApp?.id === appId) setSelectedApp(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDownloadCV = (url, name) => {
        downloadFile(url, `${name.replace(/\s+/g, '_')}_CV.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pt-32 pb-40 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/jobs/manage')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-primary dark:hover:text-white mb-10 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Back to Listings
                </button>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Applicants List */}
                    <div className="lg:w-1/3 space-y-4">
                        <div className="flex bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 mb-8">
                            <button
                                onClick={() => setActiveTab('applied')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'applied' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                            >
                                Applied ({applications.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('recommended')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'recommended' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
                            >
                                Recommended ({recommendedCandidates.length})
                            </button>
                        </div>

                        <div className="space-y-3">
                            {activeTab === 'applied' ? (
                                applications.length > 0 ? applications.map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedApp?.id === app.id ? 'bg-white dark:bg-gray-800 border-secondary ring-4 ring-secondary/5' : 'bg-white/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-secondary/30'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl font-serif font-black text-gray-400 border border-gray-100 dark:border-gray-600">
                                                {app.seekerName.charAt(0)}
                                            </div>
                                            <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : app.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {app.status}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-primary dark:text-white mb-1">{app.seekerName}</h3>
                                        <div className="text-xs text-gray-400 font-medium">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold italic">No candidates yet.</p>
                                    </div>
                                )
                            ) : (
                                loadingRecommendations ? (
                                    <div className="animate-pulse space-y-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-3xl" />)}
                                    </div>
                                ) : recommendedCandidates.length > 0 ? recommendedCandidates.map((candidate) => (
                                    <div
                                        key={candidate.basicInfo.id}
                                        onClick={() => {
                                            setSelectedSeekerId(candidate.basicInfo.id);
                                            setShowProfileModal(true);
                                        }}
                                        className="p-6 rounded-3xl border bg-white/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-secondary transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-xl font-serif font-black text-secondary border border-secondary/20 overflow-hidden">
                                                {candidate.basicInfo.profileImageUrl ? <img src={candidate.basicInfo.profileImageUrl} className="w-full h-full object-cover" /> : candidate.basicInfo.firstName.charAt(0)}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                High Match
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-primary dark:text-white mb-1 group-hover:text-secondary transition-colors">{candidate.basicInfo.firstName} {candidate.basicInfo.lastName}</h3>
                                        <div className="text-xs text-gray-400 font-medium truncate">{candidate.bio?.title || 'Professional'}</div>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold italic">No recommendations found.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Details View */}
                    <div className="flex-grow">
                        {selectedApp ? (
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center text-3xl font-serif font-black text-secondary border border-secondary/10">
                                            {selectedApp.seekerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-serif font-black text-primary dark:text-white mb-2">{selectedApp.seekerName}</h2>
                                            <div className="flex gap-3">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedApp.status} Candidate</span>
                                                <button
                                                    onClick={() => {
                                                        setSelectedSeekerId(selectedApp.seekerId);
                                                        setShowProfileModal(true);
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-secondary hover:text-secondary-dark transition-colors"
                                                >
                                                    <ExternalLink size={12} /> View Full Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="md" onClick={() => {
                                            setRejectionTarget(selectedApp);
                                            setShowRejectionModal(true);
                                        }}>
                                            <XCircle size={18} className="mr-2 text-red-500" /> Reject
                                        </Button>
                                        <Button variant="secondary" size="md" onClick={() => updateStatus(selectedApp.id, 'APPROVED')}>
                                            <CheckCircle2 size={18} className="mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Candidate Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApp.skills?.map(skill => (
                                                    <span key={skill} className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-xs font-bold text-primary dark:text-gray-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Financial Expectations</h4>
                                            <div className="flex items-center gap-2 text-xl font-bold text-primary dark:text-white">
                                                <DollarSign size={20} className="text-emerald-500" />
                                                {selectedApp.expectedSalary || 'Negotiable'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Documents</h4>
                                            {selectedApp.cvUrl ? (
                                                <div className="flex flex-col gap-3">
                                                    <div
                                                        onClick={() => {
                                                            setCvUrl(selectedApp.cvUrl);
                                                            setShowPdfViewer(true);
                                                        }}
                                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-secondary transition-all cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <FileText size={20} className="text-secondary" />
                                                            <span className="text-sm font-bold text-primary dark:text-white">View Professional CV</span>
                                                        </div>
                                                        <ExternalLink size={16} className="text-gray-300 group-hover:text-secondary" />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        fullWidth
                                                        icon={<Download size={14} />}
                                                        onClick={() => handleDownloadCV(selectedApp.cvUrl, selectedApp.seekerName)}
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-400 italic">No CV uploaded.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-gray-100 dark:border-gray-700">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Cover Letter</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-8 rounded-[2rem] font-heading text-text-secondary dark:text-gray-400 leading-relaxed italic whitespace-pre-line border border-dashed border-gray-200 dark:border-gray-700">
                                        "{selectedApp.coverLetter}"
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 py-32">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                    <User size={32} />
                                </div>
                                <h3 className="text-2xl font-serif font-black text-primary dark:text-white">Select a candidate</h3>
                                <p className="text-gray-500 mt-2">Click on an applicant to view their full profile and take action.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SeekerPublicProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                seekerId={selectedSeekerId}
            />

            <PdfViewerModal
                isOpen={showPdfViewer}
                onClose={() => setShowPdfViewer(false)}
                pdfUrl={cvUrl}
                title={`${selectedApp?.seekerName}'s CV`}
            />

            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                applicantName={rejectionTarget?.seekerName}
                onConfirm={(reason) => updateStatus(rejectionTarget.id, 'REJECTED', reason)}
            />
        </div>
    );
};

export default ApplicantsPage;
