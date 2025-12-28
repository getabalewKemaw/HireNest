import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    Clock,
    Upload,
    CheckCircle2,
    AlertCircle,
    Building2,
    Globe,
    FileText,
    ArrowRight,
    Loader2,
    X,
    Lock
} from 'lucide-react';
import verificationService from '../../services/verificationService';
import useNotificationStore from '../../store/notificationStore';

const CompanyVerificationWidget = ({ inline = false }) => {
    const [status, setStatus] = useState('LOADING'); // LOADING, NOT_SUBMITTED, PENDING, APPROVED, BANNED
    const [verificationData, setVerificationData] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const addNotification = useNotificationStore((state) => state.addLocalNotification);

    // Form states
    const [formData, setFormData] = useState({
        companyName: '',
        tinNumber: '',
        website: '',
        tradeLicense: null
    });

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await verificationService.getVerificationStatus();
            if (response.data) {
                setVerificationData(response.data);
                setStatus(response.data.status);

             
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setStatus('NOT_SUBMITTED');
            } else {
                setError('Failed to load verification status');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const data = new FormData();
        data.append('companyName', formData.companyName);
        data.append('tradeLicense', formData.tradeLicense);
        if (formData.tinNumber) data.append('tinNumber', formData.tinNumber);
        if (formData.website) data.append('website', formData.website);

        try {
            // Increase timeout for file upload
            await verificationService.submitVerification(data);
            addNotification({
                title: 'Verification Submitted',
                message: 'Your company verification request has been received and is under review.',
                type: 'info'
            });
            setShowSubmitModal(false);
            fetchStatus();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit verification. Please check your internet connection or try a smaller file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await verificationService.verifyCode(code);
            addNotification({
                title: 'Account Verified!',
                message: 'Your company has been successfully verified. Full features unlocked.',
                type: 'success'
            });
            setShowCodeModal(false);
            // Refresh to update status
            fetchStatus();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStatusBadge = () => {
        switch (status) {
            case 'PENDING':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} className="animate-spin-slow" /> Under Review
                    </div>
                );
            case 'APPROVED':
                if (verificationData?.codeUsed) {
                    return (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={12} /> Fully Verified
                        </div>
                    );
                }
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                        <Lock size={12} /> Code Required
                    </div>
                );
            case 'BANNED':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                        <ShieldAlert size={12} /> Verification Rejected
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20 text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle size={12} /> Unverified
                    </div>
                );
        }
    };

    if (status === 'LOADING') return null;

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Company Legal Name *</label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        required
                        type="text"
                        placeholder="e.g. Acme Corp LLC"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white dark:focus:bg-[#151C26] focus:border-secondary transition-all font-medium"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">TIN Number (Optional)</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Tax ID"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white dark:focus:bg-[#151C26] focus:border-secondary transition-all font-medium"
                            value={formData.tinNumber}
                            onChange={e => setFormData({ ...formData, tinNumber: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Website (Optional)</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="url"
                            placeholder="https://..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white dark:focus:bg-[#151C26] focus:border-secondary transition-all font-medium"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Trade License (PDF/DOC) *</label>
                <div className="relative group/upload">
                    <input
                        required
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setFormData({ ...formData, tradeLicense: e.target.files[0] })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full p-8 border-2 border-dashed ${formData.tradeLicense ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5'} rounded-3xl transition-all flex flex-col items-center justify-center gap-4 group-hover/upload:border-secondary/50 group-hover/upload:bg-secondary/5`}>
                        <div className={`p-4 rounded-2xl shadow-lg ${formData.tradeLicense ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/10 text-gray-400'}`}>
                            {formData.tradeLicense ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-primary dark:text-white">
                                {formData.tradeLicense ? formData.tradeLicense.name : 'Click or Drag trade license'}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Max file size: 10MB</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold animate-shake">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <button
                disabled={isLoading}
                type="submit"
                className=" w-[50%] py-5 bg-secondary text-white font-black rounded-3xl hover:bg-secondary-dark transition-all shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group   ml-50"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Submit for Audit <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
        </form>
    );

    return (
        <div className="bg-white dark:bg-[#151C26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-sm relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform blur-sm pointer-events-none">
                <ShieldCheck size={180} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    {renderStatusBadge()}
                </div>

                <h3 className="text-xl font-black text-primary dark:text-white mb-2 italic flex items-center gap-2">
                    Identity & Trust
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                    {status === 'NOT_SUBMITTED' && "Verification is required to post jobs and access talent databases. Upload your trade license to begin."}
                    {status === 'PENDING' && "Your documents are currently being audited by our trust and safety team. This usually takes 24-48 hours."}
                    {status === 'APPROVED' && !verificationData?.codeUsed && "Great! Your documents are approved. Check your email for a 6-digit verification code to complete the process."}
                    {status === 'APPROVED' && verificationData?.codeUsed && "Your company is fully verified. You have full access to all HireNest premium features."}
                    {status === 'BANNED' && (
                        <div className="space-y-2">
                            <p>Your verification request was rejected. Please review the reason below or contact support.</p>
                            {verificationData?.rejectionReason && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold italic">
                                    " {verificationData.rejectionReason} "
                                </div>
                            )}
                        </div>
                    )}
                </p>

                {verificationData && (
                    <div className="mb-8 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Company Name</span>
                            <span className="text-xs font-bold text-primary dark:text-white leading-none">{verificationData.companyName}</span>
                        </div>
                        {verificationData.website && (
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Website</span>
                                <a href={verificationData.website} target="_blank" rel="noreferrer" className="text-xs font-bold text-secondary hover:underline leading-none">{verificationData.website}</a>
                            </div>
                        )}
                        {verificationData.tinNumber && (
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">TIN Number</span>
                                <span className="text-xs font-bold text-primary dark:text-white leading-none">{verificationData.tinNumber}</span>
                            </div>
                        )}
                    </div>
                )}

                {(status === 'NOT_SUBMITTED' || status === 'PENDING') && inline && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 animate-fade-in-up">
                        {status === 'PENDING' && (
                            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-600 text-sm font-bold">
                                <AlertCircle size={20} />
                                Update your verification request below if needed.
                            </div>
                        )}
                        {renderForm()}
                    </div>
                )}

                {status === 'NOT_SUBMITTED' && !inline && (
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="w-full py-4 bg-secondary text-white font-black rounded-2xl hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        Begin Verification <ArrowRight size={18} />
                    </button>
                )}

                {status === 'PENDING' && !inline && (
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        Update Verification Request <ArrowRight size={18} />
                    </button>
                )}

                {status === 'APPROVED' && !verificationData?.codeUsed && (
                    <button
                        onClick={() => setShowCodeModal(true)}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        Enter 6-Digit Code <Lock size={18} />
                    </button>
                )}

                {status === 'APPROVED' && verificationData?.codeUsed && (
                    <button
                        className="w-full py-4 bg-gray-50 dark:bg-white/5 text-gray-400 font-black rounded-2xl cursor-default border border-gray-100 dark:border-white/10"
                    >
                        Profile Fully Unlocked
                    </button>
                )}
            </div>

            {/* Submission Modal - Only show if NOT inline (or if manually triggered somehow, but logic prevents valid trigger) */}
            {showSubmitModal && !inline && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-black/60 backdrop-blur-md transition-all animate-in fade-in">
                    <div className="bg-white dark:bg-[#151C26] w-full max-w-xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden ring-1 ring-black/5">
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-primary dark:text-white italic leading-tight">Identity Audit.</h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Submit your company credentials for review</p>
                                </div>
                                <button onClick={() => setShowSubmitModal(false)} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            {renderForm()}
                        </div>
                    </div>
                </div>
            )}

            {/* Verification Code Modal */}
            {showCodeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-all animate-in zoom-in">
                    <div className="bg-white dark:bg-[#151C26] w-full max-w-md rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 p-10 text-center relative overflow-hidden">
                        {/* Decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>

                        <button onClick={() => setShowCodeModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-primary transition-colors">
                            <X size={20} />
                        </button>

                        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary/30 rotate-3">
                            <Lock size={36} />
                        </div>

                        <h2 className="text-3xl font-black text-primary dark:text-white italic mb-2">Final Step.</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10">We've sent a 6-digit verification code to your email. Enter it below to unlock your profile.</p>

                        <form onSubmit={handleVerifyCode} className="space-y-8">
                            <input
                                required
                                type="text"
                                maxLength={6}
                                placeholder="0 0 0 0 0 0"
                                className="w-full text-center text-4xl font-black tracking-[0.5em] py-6 bg-gray-50 dark:bg-white/5 border-2 border-transparent dark:border-white/10 rounded-3xl focus:outline-none focus:border-secondary focus:ring-8 focus:ring-secondary/10 transition-all font-mono placeholder:opacity-20"
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            />

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 text-red-500 text-sm font-bold">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={isLoading || code.length !== 6}
                                type="submit"
                                className="w-full py-5 bg-secondary text-white font-black rounded-3xl hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:shadow-none"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Finalize Verification'}
                            </button>

                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Didn't receive code? <button type="button" className="text-secondary hover:underline">Resend Code</button>
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyVerificationWidget;
