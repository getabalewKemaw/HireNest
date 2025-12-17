import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const SelectRolePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { selectRoleAction, isLoading, error } = useAuthStore();

    // Get params from URL (from Google redirect)
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const googleId = searchParams.get('googleId');

    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        if (!email || !googleId) {
            navigate(ROUTES.LOGIN);
        }
    }, [email, googleId, navigate]);

    const handleRoleSelect = async (role) => {
        setSelectedRole(role);
        try {
            await selectRoleAction({
                email,
                name,
                googleId,
                userType: role
            });

            if (role === 'EMPLOYER') navigate(ROUTES.EMPLOYER.DASHBOARD);
            else navigate(ROUTES.SEEKER.DASHBOARD);
        } catch (err) {
            // Error
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 font-heading">
                        Complete Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Hello {name}, please select your role to continue
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => handleRoleSelect('SEEKER')}
                        disabled={isLoading}
                        className={`w-full group relative flex items-center justify-center py-4 px-4 border-2 rounded-xl transition-all ${selectedRole === 'SEEKER'
                            ? 'border-secondary bg-blue-50'
                            : 'border-gray-200 hover:border-secondary hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Job Seeker</h3>
                            <p className="text-sm text-gray-500">I'm looking for a job</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('EMPLOYER')}
                        disabled={isLoading}
                        className={`w-full group relative flex items-center justify-center py-4 px-4 border-2 rounded-xl transition-all ${selectedRole === 'EMPLOYER'
                            ? 'border-secondary bg-blue-50'
                            : 'border-gray-200 hover:border-secondary hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">Employer</h3>
                            <p className="text-sm text-gray-500">I want to hire talent</p>
                        </div>
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center text-secondary">
                        Processing...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectRolePage;
