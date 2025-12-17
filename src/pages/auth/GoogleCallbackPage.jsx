import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { socialLogin } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const userType = searchParams.get('userType');

        if (token && email) {
            // Successful login from Google
            socialLogin(token, email, userType);
            // Redirect based on role
            if (userType === 'ADMIN') navigate(ROUTES.ADMIN.DASHBOARD);
            else if (userType === 'EMPLOYER') navigate(ROUTES.EMPLOYER.DASHBOARD);
            else if (userType === 'SEEKER') navigate(ROUTES.SEEKER.DASHBOARD);
            else navigate(ROUTES.DASHBOARD);
        } else {
            // Error or invalid callback
            navigate(ROUTES.LOGIN);
        }
    }, [searchParams, setUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Processing login...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
