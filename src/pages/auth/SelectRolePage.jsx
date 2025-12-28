import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Briefcase, Check } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import AuthLayout from '../../components/AuthLayout';

const SelectRolePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { selectRoleAction, completeRegistrationAction, isLoading, error, tempToken, tempEmail } = useAuthStore();

    // Get params from URL (from Google redirect)
    const googleEmail = searchParams.get('email');
    const name = searchParams.get('name');
    const googleId = searchParams.get('googleId');

    const isGoogleFlow = !!googleId;
    // For standard flow, use tempEmail from store. for Google, use param.
    const displayEmail = isGoogleFlow ? googleEmail : (tempEmail || 'User');

    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        // Condition: Either Google params exist, OR tempToken exists
        if (!isGoogleFlow && !tempToken) {
            navigate(ROUTES.LOGIN);
        }
    }, [isGoogleFlow, tempToken, navigate]);

    const handleRoleSelect = async (role) => {
        setSelectedRole(role);
        try {
            if (isGoogleFlow) {
                await selectRoleAction({
                    email: googleEmail,
                    name,
                    googleId,
                    userType: role
                });
            } else {
                await completeRegistrationAction({
                    token: tempToken,
                    userType: role
                });
            }

            if (role === 'EMPLOYER') navigate('/employer/verify');
            else navigate(ROUTES.SEEKER.DASHBOARD);
        } catch (err) {
            // Error
        }
    };

    return (
        <AuthLayout
            title="Complete Registration"
            subtitle={`Hello ${name || displayEmail || 'there'}, please select your role to continue your journey with HireNest`}
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

            <div className="grid grid-cols-1 gap-6">
                <button
                    onClick={() => handleRoleSelect('SEEKER')}
                    disabled={isLoading}
                    className={`w-full group relative flex items-center p-8 border-2 rounded-[2rem] transition-all duration-500 ease-out text-left focus:outline-none ${selectedRole === 'SEEKER'
                        ? 'border-secondary bg-secondary/5 dark:bg-secondary/10 shadow-xl shadow-secondary/10'
                        : 'border-gray-100 dark:border-gray-700 hover:border-secondary/40 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center mr-6 transition-all duration-500 ${selectedRole === 'SEEKER' ? 'bg-secondary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                        <User size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-xl font-bold transition-colors ${selectedRole === 'SEEKER' ? 'text-secondary dark:text-secondary-light' : 'text-primary dark:text-white'}`}>Job Seeker</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Discover your next career milestone through smart matching.</p>
                    </div>
                    {selectedRole === 'SEEKER' && (
                        <div className="h-4 w-4 rounded-full bg-secondary animate-pulse ml-2" />
                    )}
                </button>

                <button
                    onClick={() => handleRoleSelect('EMPLOYER')}
                    disabled={isLoading}
                    className={`w-full group relative flex items-center p-8 border-2 rounded-[2rem] transition-all duration-500 ease-out text-left focus:outline-none ${selectedRole === 'EMPLOYER'
                        ? 'border-secondary bg-secondary/5 dark:bg-secondary/10 shadow-xl shadow-secondary/10'
                        : 'border-gray-100 dark:border-gray-700 hover:border-secondary/40 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center mr-6 transition-all duration-500 ${selectedRole === 'EMPLOYER' ? 'bg-secondary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                        <Briefcase size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-xl font-bold transition-colors ${selectedRole === 'EMPLOYER' ? 'text-secondary dark:text-secondary-light' : 'text-primary dark:text-white'}`}>Employer</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Build your powerhouse team by hiring world-class talent.</p>
                    </div>
                    {selectedRole === 'EMPLOYER' && (
                        <div className="h-4 w-4 rounded-full bg-secondary animate-pulse ml-2" />
                    )}
                </button>
            </div>

            {isLoading && (
                <div className="mt-10 text-center animate-bounce">
                    <div className="inline-flex items-center gap-3 text-secondary dark:text-secondary-light text-base font-bold">
                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting up your dashboard...
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default SelectRolePage;
