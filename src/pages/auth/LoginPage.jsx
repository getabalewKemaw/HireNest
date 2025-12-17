import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService'; // Use named exports

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            // Determine redirection based on role
            const { role } = useAuthStore.getState();
            if (role === 'ADMIN') navigate(ROUTES.ADMIN.DASHBOARD);
            else if (role === 'EMPLOYER') navigate(ROUTES.EMPLOYER.DASHBOARD);
            else if (role === 'SEEKER') navigate(ROUTES.SEEKER.DASHBOARD);
            else navigate(ROUTES.DASHBOARD); // Fallback
        } catch (err) {
            // Error handled in store
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your HireNest account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-secondary hover:text-secondary-dark">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                        >
                            <img
                                className="h-5 w-5 mr-3"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                            />
                            Sign in with Google
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to={ROUTES.REGISTER} className="font-medium text-secondary hover:text-secondary-dark">
                            Sign up
                        </Link>
                    </p>
                    <div className="mt-2">
                        <Link to={ROUTES.ADMIN_LOGIN} className="text-xs text-gray-400 hover:text-gray-600">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
