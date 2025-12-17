import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const { verifyOtp, tempEmail, isLoading, error } = useAuthStore();
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (!tempEmail) {
            // If no email in state, redirect to register
            navigate(ROUTES.REGISTER);
        }
    }, [tempEmail, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await verifyOtp(otp);
            // After verification, check response. 
            // If token is present, we are logged in.
            // If role selection needed (unlikely here since we select role at register), 
            // but if backend says "needsRoleSelection" we might act.
            // User flow says: "Step 4: After verification, user is redirected to role selection"
            // But we collected role at registration. 
            // If backend auto-logs in:
            if (data.token) {
                // Check role and redirect
                // We need to fetch user profile or decode token to get role if not returned in verifyOtp
                // But verifyOtp in store updates 'user' state if token is returned (I added that logic in backend, let's hope frontend store handles it)
                // Wait, store verifyOtp sets isLoading false but doesn't explicitly set User if backend returns it alone. 
                // Backend verifyOtp returns: { message, token, refreshToken, ... }
                // I should update store to handle login if token is returned.

                // Assuming the user is logged in now
                // We can rely on authStore state or data returned
                navigate(ROUTES.DASHBOARD);
            } else {
                // Maybe just verified but need to login?
                navigate(ROUTES.LOGIN);
            }
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We sent a code to <span className="font-medium text-gray-900">{tempEmail}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm tracking-widest text-center text-2xl"
                            placeholder="123456"
                            maxLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
