import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldCheck,
    Clock,
    CheckCircle,
    XCircle,
    ExternalLink,
    Building2,
    User,
    AlertCircle,
    Loader2,
    Eye,
    X,
    MessageSquare,
    FileText
} from 'lucide-react';
import verificationService from '../../services/verificationService';
import useNotificationStore from '../../store/notificationStore';
import PdfViewerModal from '../modals/PdfViewerModal';

const AdminVerificationQueue = () => {
    const [verifications, setVerifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [viewMode, setViewMode] = useState('PENDING'); // 'PENDING' or 'HISTORY'
    const addNotification = useNotificationStore(state => state.addLocalNotification);
    const prevCountRef = useRef(0);
    const [userPdfPreview, setUserPdfPreview] = useState(null);

    const fetchVerifications = async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        try {
            const response = viewMode === 'PENDING'
                ? await verificationService.getPendingVerifications()
                : await verificationService.getAllVerifications();

            const data = response.data || [];

            // Sort by submittedAt DESC (newest first)
            data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

            // If new verifications arrived, notify the admin locally
            if (data.length > prevCountRef.current) {
                addNotification({
                    title: 'New Verification Request',
                    message: `${data.length - prevCountRef.current} new company identity ${data.length - prevCountRef.current > 1 ? 'audits' : 'audit'} pending review.`,
                    type: 'info'
                });
            }

            setVerifications(data);
            prevCountRef.current = data.length;
        } catch (err) {
            console.error('Failed to fetch pending verifications', err);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications(true);

        // Poll every 15 seconds for real-time responsiveness for the Admin (only in pending mode)
        let interval;
        if (viewMode === 'PENDING') {
            interval = setInterval(() => fetchVerifications(false), 15000);
        }
        return () => interval && clearInterval(interval);
    }, [viewMode]);

    const handleReview = async (id, action) => {
        if (action === 'REJECT' && !rejectionReason) {
            alert('Please provide a reason for rejection');
            return;
        }

        setIsReviewing(true);
        try {
            await verificationService.reviewVerification(id, action, rejectionReason);
            addNotification({
                title: action === 'APPROVE' ? 'Verification Approved' : 'Verification Rejected',
                message: `Successfully ${action === 'APPROVE' ? 'approved' : 'rejected'} company verification request.`,
                type: action === 'APPROVE' ? 'success' : 'info'
            });
            setSelectedVerification(null);
            setRejectionReason('');
            fetchVerifications(false);
        } catch (err) {
            alert('Failed to process review');
        } finally {
            setIsReviewing(false);
        }
    };

    if (isLoading && verifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-xs font-black uppercase tracking-widest italic">Syncing with Auth Servers...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01] flex items-center justify-between">
                <div className="flex flex-col">
                    <h3 className="text-xs font-black text-primary dark:text-white uppercase tracking-[0.2em] flex items-center gap-3 italic">
                        <ShieldCheck className="text-secondary" /> Auth Verification Queue
                    </h3>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setViewMode('PENDING')}
                            className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewMode === 'PENDING' ? 'border-secondary text-secondary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setViewMode('HISTORY')}
                            className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewMode === 'HISTORY' ? 'border-secondary text-secondary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Historical Audit
                        </button>
                    </div>
                </div>
                {viewMode === 'PENDING' && (
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                        {verifications.length} Incoming
                    </span>
                )}
            </div>

            {verifications.length === 0 ? (
                <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest text-sm italic">
                    Queue Clear. All identities validated.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-black/10">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Company</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {verifications.map((item) => (
                                <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary dark:text-white text-lg group-hover:text-secondary italic transition-colors leading-none mb-1">{item.companyName}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                                                <User size={10} /> {item.userEmail}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {item.status === 'PENDING' ? (
                                            <div className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/20 inline-flex items-center gap-2">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Pending Review</span>
                                            </div>
                                        ) : item.status === 'APPROVED' ? (
                                            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-2">
                                                <CheckCircle size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Approved</span>
                                            </div>
                                        ) : (
                                            <div className="bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-xl border border-rose-500/20 inline-flex items-center gap-2">
                                                <XCircle size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Rejected</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(item.submittedAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setSelectedVerification(item)}
                                                className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/10 flex items-center justify-center group/btn"
                                            >
                                                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Review Modal */}
            {selectedVerification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B1C2D]/80 backdrop-blur-xl transition-all animate-in fade-in">
                    <div className="bg-white dark:bg-[#151C26] w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shadow-inner">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-primary dark:text-white italic leading-tight">{selectedVerification.companyName}</h2>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Audit ID: {selectedVerification.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedVerification(null)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TIN Number</p>
                                    <p className="font-bold text-primary dark:text-white italic">{selectedVerification.tinNumber || 'NOT PROVIDED'}</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Website</p>
                                    <p className="font-bold text-primary dark:text-white italic truncate">
                                        {selectedVerification.website ? (
                                            <a href={selectedVerification.website} target="_blank" rel="noreferrer" className="text-secondary hover:underline flex items-center gap-1">
                                                Visit <ExternalLink size={12} />
                                            </a>
                                        ) : 'NOT PROVIDED'}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Compliance Document</p>
                                <button
                                    onClick={() => setUserPdfPreview({ url: selectedVerification.tradeLicenseUrl, title: selectedVerification.companyName + ' - Trade License' })}
                                    className="w-full text-left group"
                                >
                                    <div className="rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50 dark:bg-black/20 h-[200px] relative transition-all group-hover:border-secondary/30 group-hover:shadow-lg group-hover:shadow-secondary/5">
                                        {/* Mock Preview Background */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 group-hover:opacity-40 transition-opacity">
                                            <FileText size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                                            <p className="text-sm font-bold text-gray-400">PDF PREVIEW NOT AVAILABLE INLINE</p>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors flex items-center justify-center">
                                            <div className="px-6 py-3 bg-white dark:bg-[#151C26] rounded-2xl shadow-xl transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 flex items-center gap-3 border border-gray-100 dark:border-white/10">
                                                <Eye className="text-secondary" size={20} />
                                                <span className="font-bold text-primary dark:text-white text-sm">Open Full Preview</span>
                                            </div>
                                        </div>

                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                            PDF
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-3 mb-10">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Review Notes / Rejection Reason</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 text-gray-300" size={18} />
                                    <textarea
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-3xl focus:outline-none focus:border-secondary transition-all font-medium min-h-[100px]"
                                        placeholder="Add notes for the employer (Required for rejection)..."
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {selectedVerification.status === 'PENDING' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        disabled={isReviewing}
                                        onClick={() => handleReview(selectedVerification.id, 'REJECT')}
                                        className="py-5 bg-rose-500 text-white font-black rounded-3xl hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle size={20} /> Ban / Reject
                                    </button>
                                    <button
                                        disabled={isReviewing}
                                        onClick={() => handleReview(selectedVerification.id, 'APPROVE')}
                                        className="py-5 bg-emerald-500 text-white font-black rounded-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                                    >
                                        {isReviewing ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Approve License</>}
                                    </button>
                                </div>
                            )}
                            {selectedVerification.status !== 'PENDING' && (
                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">This request has already been processed</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 italic">Action recorded on {new Date(selectedVerification.reviewedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {userPdfPreview && (
                <PdfViewerModal
                    isOpen={!!userPdfPreview}
                    onClose={() => setUserPdfPreview(null)}
                    pdfUrl={userPdfPreview.url}
                    title={userPdfPreview.title}
                />
            )}
        </div>
    );
};

export default AdminVerificationQueue;
