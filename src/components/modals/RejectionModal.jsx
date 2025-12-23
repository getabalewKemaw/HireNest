import { useState } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';
import Button from '../Button';

const RejectionModal = ({ isOpen, onClose, onConfirm, applicantName }) => {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setIsLoading(true);
        try {
            await onConfirm(reason);
            setReason('');
            onClose();
        } catch (error) {
            console.error('Error in rejection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-red-50 dark:bg-red-950/20 px-8 py-10 flex items-center gap-6 border-b border-red-100 dark:border-red-900/30">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-red-200/50 dark:shadow-none translate-y-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black text-primary dark:text-white uppercase tracking-tight">Reject Candidate</h2>
                        <p className="text-sm text-red-600/70 dark:text-red-400 font-bold tracking-wide italic leading-snug">
                            {applicantName} will be notified.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 pt-12">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-2">
                                Rejection Reason (Required)
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide specific feedback to help the candidate improve..."
                                className="w-full min-h-[150px] p-6 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-500/30 rounded-3xl outline-none text-primary dark:text-white transition-all shadow-inner resize-none font-heading leading-relaxed"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400 italic bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl">
                            <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0">
                                <AlertCircle size={14} />
                            </div>
                            <span>
                                Professional feedback is highly encouraged in our community to support seeker growth.
                            </span>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={onClose}
                                type="button"
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                                icon={<Send size={18} />}
                                type="submit"
                                isLoading={isLoading}
                                disabled={!reason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RejectionModal;
