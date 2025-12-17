import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { adminLogin, isLoading, error } = useAuthStore();
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
            await adminLogin(formData);
            // Admin login step 1 success -> redirect to verify OTP
            navigate(ROUTES.ADMIN_VERIFY_OTP);
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Authorized personnel only
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
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Admin Login'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to={ROUTES.LOGIN} className="text-xs text-gray-400 hover:text-gray-600">
                            User Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
