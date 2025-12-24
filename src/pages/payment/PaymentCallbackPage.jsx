import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import paymentService from '../../services/paymentService';
import Button from '../../components/Button';

const PaymentCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [payment, setPayment] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');
        const statusParam = searchParams.get('status');

        if (!txRef) {
            setStatus('failed');
            setError('No transaction reference found');
            return;
        }

        verifyPayment(txRef, statusParam);
    }, [searchParams]);

    const verifyPayment = async (txRef, statusParam) => {
        try {
            setStatus('verifying');

            // Wait a moment for Chapa to process
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await paymentService.verifyPayment(txRef);
            setPayment(response);

            if (response.status === 'SUCCESS') {
                setStatus('success');
                // Redirect to manage jobs page after 3 seconds
                setTimeout(() => {
                    navigate('/jobs/manage', {
                        state: {
                            paymentSuccess: true,
                            txRef: response.txRef
                        }
                    });
                }, 3000);
            } else {
                setStatus('failed');
                setError('Payment verification failed');
            }
        } catch (err) {
            console.error('Payment verification error:', err);
            setStatus('failed');
            setError(err.response?.data?.message || 'Failed to verify payment');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
                    {/* Status Icon */}
                    <div className={`p-12 text-center ${status === 'verifying' ? 'bg-blue-50 dark:bg-blue-900/20' :
                        status === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                            'bg-red-50 dark:bg-red-900/20'
                        }`}>
                        {status === 'verifying' && (
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-6">
                                <Loader2 size={48} className="text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full mb-6 animate-bounce">
                                <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
                            </div>
                        )}
                        {status === 'failed' && (
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/40 rounded-full mb-6">
                                <XCircle size={48} className="text-red-600 dark:text-red-400" />
                            </div>
                        )}

                        <h1 className="text-3xl font-black text-primary dark:text-white mb-4">
                            {status === 'verifying' && 'Verifying Payment...'}
                            {status === 'success' && 'Payment Successful!'}
                            {status === 'failed' && 'Payment Failed'}
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {status === 'verifying' && 'Please wait while we confirm your payment with Chapa.'}
                            {status === 'success' && 'Your payment has been processed successfully and your job has been posted! Redirecting you to manage your jobs...'}
                            {status === 'failed' && (error || 'Your payment could not be processed. Please try again.')}
                        </p>
                    </div>

                    {/* Payment Details */}
                    {payment && status === 'success' && (
                        <div className="p-8 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                                Payment Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Amount</span>
                                    <span className="text-lg font-black text-primary dark:text-white">
                                        {payment.amount} {payment.currency}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Transaction ID</span>
                                    <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                                        {payment.txRef?.substring(0, 20)}...
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Purpose</span>
                                    <span className="text-sm font-bold text-secondary">Job Posting</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-8 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                        {status === 'success' && (
                            <Button
                                onClick={() => navigate('/jobs/manage')}
                                variant="secondary"
                                className="w-full"
                            >
                                View My Jobs <ArrowRight size={20} className="ml-2" />
                            </Button>
                        )}
                        {status === 'failed' && (
                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate('/post-job')}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => navigate('/dashboard')}
                                    variant="ghost"
                                    className="w-full"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCallbackPage;
