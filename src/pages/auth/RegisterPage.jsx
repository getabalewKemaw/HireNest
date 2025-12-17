import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'SEEKER', // Default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            await register({
                email: formData.email,
                password: formData.password,
                userType: formData.userType
            });
            // On success, redirect to OTP verification
            navigate(ROUTES.VERIFY_EMAIL);
        } catch (err) {
            // Error handled by store
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
                        Create an Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join HireNest today
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'SEEKER' })}
                                    className={`py-2 px-4 border rounded-lg text-sm font-medium focus:outline-none ${formData.userType === 'SEEKER'
                                        ? 'bg-secondary text-white border-secondary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: 'EMPLOYER' })}
                                    className={`py-2 px-4 border rounded-lg text-sm font-medium focus:outline-none ${formData.userType === 'EMPLOYER'
                                        ? 'bg-secondary text-white border-secondary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Employer
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
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
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
                            Google
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="font-medium text-secondary hover:text-secondary-dark">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
