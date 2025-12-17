import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.forgotPassword(email);
            if (result.success) {
                setIsSent(true);
                useAuthStore.setState({ tempEmail: email });
                navigate(ROUTES.RESET_PASSWORD);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email to receive a reset code
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                    </button>

                    <div className="text-center">
                        <Link to={ROUTES.LOGIN} className="font-medium text-secondary hover:text-secondary-dark text-sm">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
