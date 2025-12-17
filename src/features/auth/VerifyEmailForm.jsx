import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { verifyEmail } from '../../services/authService';
import { validateOTP } from '../../utils/validation';
import { ROUTES, ALERT_TYPES } from '../../config/constants';
import useAuthStore from '../../store/authStore';

/**
 * Verify Email Form Component
 */
const VerifyEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    
    if (error) setError(null);
    if (alert) setAlert(null);
  };
  
  const handleBlur = () => {
    setTouched(true);
    const validationError = validateOTP(otp);
    setError(validationError);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateOTP(otp);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }
    
    setIsSubmitting(true);
    setAlert(null);
    
    const result = await verifyEmail({
      email,
      otp,
      type: 'EMAIL_VERIFICATION',
    });
    
    if (result.success) {
      if (result.data.needsRoleSelection) {
        // Google OAuth user needs to select role
        navigate(ROUTES.REGISTER, {
          state: { 
            email: result.data.email,
            needsRoleSelection: true,
          },
        });
      } else {
        // Set user and navigate to dashboard
        setUser({
          email: result.data.email,
          userType: result.data.userType,
          role: `ROLE_${result.data.userType}`,
        });
        
        setAlert({
          type: ALERT_TYPES.SUCCESS,
          message: 'Email verified successfully! Redirecting...',
        });
        
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1500);
      }
    } else {
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: result.error.message || 'Verification failed. Please try again.',
      });
    }
    
    setIsSubmitting(false);
  };
  
  if (!email) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Alert
            type={ALERT_TYPES.ERROR}
            message="No email provided. Please register first."
            dismissible={false}
            className="mb-4"
          />
          <Link to={ROUTES.REGISTER}>
            <Button variant="primary">Go to Registration</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-heading font-bold text-primary mb-2">
            Verify Your Email
          </h2>
          <p className="text-text-secondary">
            We've sent a 6-digit code to
          </p>
          <p className="text-text-primary font-medium mt-1">
            {email}
          </p>
        </div>
        
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            name="otp"
            value={otp}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched ? error : null}
            placeholder="Enter 6-digit code"
            required
            disabled={isSubmitting}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting || otp.length !== 6}
          >
            Verify Email
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text-secondary">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-secondary hover:text-secondary-dark font-medium transition-colors"
            disabled={isSubmitting}
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
