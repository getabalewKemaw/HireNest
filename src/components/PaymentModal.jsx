import { useState } from 'react';
import { X, CreditCard, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import paymentService from '../services/paymentService';
import Button from './Button';

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, currency = 'ETB', userInfo, jobData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: userInfo?.email || '',
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        phoneNumber: userInfo?.phoneNumber || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const paymentData = {
                amount: amount,
                currency: currency,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                metadata: {
                    purpose: 'job_posting',
                    jobData: jobData, // Include the actual job details
                    timestamp: new Date().toISOString()
                }
            };

            const response = await paymentService.initiateJobPostingPayment(paymentData);

            if (response.checkoutUrl) {
                // Redirect to Chapa checkout page
                window.location.href = response.checkoutUrl;
            } else {
                setError('Failed to initialize payment. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] max-w-lg w-full shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <CreditCard size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Payment Required</h2>
                            <p className="text-white/80 text-sm font-medium mt-1">Complete payment to post your job</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Amount Display */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Amount to Pay</span>
                            <div className="text-right">
                                <div className="text-3xl font-black text-primary dark:text-white">{amount} {currency}</div>
                                <div className="text-xs text-gray-400 font-medium mt-1">One-time payment</div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-primary dark:text-white"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-primary dark:text-white"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-primary dark:text-white"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-primary dark:text-white"
                                placeholder="+251912345678"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700 dark:text-blue-400">
                                <p className="font-bold mb-1">Secure Payment via Chapa</p>
                                <p className="text-xs font-medium opacity-80">You'll be redirected to Chapa's secure payment page to complete your transaction.</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="ghost"
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="secondary"
                                className="flex-1"
                                loading={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2" size={20} />
                                        Proceed to Payment
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
