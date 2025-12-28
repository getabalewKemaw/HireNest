import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
            setError('Failed to send reset email' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive a secure verification code"
            backButton={false}
        >
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start animate-fade-in shadow-sm">
                    <div className="flex-shrink-0 mr-3">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span>{error}</span>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    icon={Mail}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    size="lg"
                    className="!bg-secondary hover:!bg-secondary-dark !rounded-full shadow-lg shadow-secondary/20 transition-all font-bold"
                >
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                    {!isLoading && <ArrowRight size={18} className="ml-2 inline-block" />}
                </Button>

                <div className="text-center pt-2">
                    <Link to={ROUTES.LOGIN} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary-light transition-colors group">
                        <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
