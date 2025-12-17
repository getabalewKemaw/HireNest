import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const AdminVerifyOtpPage = () => {
    const navigate = useNavigate();
    const { adminVerifyOtp, tempEmail, isLoading, error } = useAuthStore();
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (!tempEmail) {
            navigate(ROUTES.ADMIN_LOGIN);
        }
    }, [tempEmail, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminVerifyOtp(otp);
            navigate(ROUTES.ADMIN.DASHBOARD);
        } catch (err) {
            // Error
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Admin Verification
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the code sent to {tempEmail}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center tracking-widest text-2xl"
                            placeholder="OTP Code"
                            maxLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Access'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminVerifyOtpPage;
