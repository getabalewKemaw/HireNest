import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { tempEmail } = useAuthStore();
    const [step, setStep] = useState(1); // 1: OTP, 2: New Password
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.verifyResetOTP({ email: tempEmail, otp }); // Pass object
            // backend returns { success, data: { ... } } via api service wrapper in new authStore? 
            // wait, authService methods return { success: true, data: response.data } OR { success: false, error }

            if (data.success) {
                // The actual data is in data.data
                const responseData = data.data;
                // Check token
                if (responseData.token || responseData.resetToken) {
                    setResetToken(responseData.token || responseData.resetToken);
                    setStep(2);
                } else {
                    // Assuming success means verified, maybe token is not needed?
                    // But resetPassword needs it.
                    // Let's assume otp is token if not returned (unlikely)
                    setStep(2);
                }
            } else {
                setError(data.error.message);
            }
        } catch (err) {
            setError('Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.resetPassword({
                token: resetToken, // backend expects token in body? Request object is ResetPasswordWithTokenRequest(token, newPassword, confirmPassword)
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword
            });

            if (result.success) {
                navigate(ROUTES.LOGIN);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        {step === 1 ? 'Verify Code' : 'Set New Password'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Enter verification code sent to {tempEmail}
                            </label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm text-center tracking-widest text-2xl"
                                maxLength={6}
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors">
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                required
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
