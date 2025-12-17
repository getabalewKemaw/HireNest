import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { register } from '../../services/authService';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../../utils/validation';
import { ROUTES, ALERT_TYPES, USER_TYPES } from '../../config/constants';

/**
 * Register Form Component
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: USER_TYPES.SEEKER,
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear alert
    if (alert) setAlert(null);
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };
  
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validatePasswordConfirmation(formData.password, value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    
    setErrors(newErrors);
    setTouched({ email: true, password: true, confirmPassword: true });
    
    return !Object.values(newErrors).some(error => error !== null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setAlert(null);
    
    const result = await register({
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
    });
    
    if (result.success) {
      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: 'Registration successful! Please check your email for verification code.',
      });
      
      // Navigate to verify email page after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.VERIFY_EMAIL, {
          state: { email: formData.email, otpToken: result.data.otpToken },
        });
      }, 2000);
    } else {
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: result.error.message || 'Registration failed. Please try again.',
      });
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-heading font-bold text-primary mb-2">
          Create Account
        </h2>
        <p className="text-text-secondary mb-6">
          Join HireNest and start your journey
        </p>
        
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              I am a <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: USER_TYPES.SEEKER }))}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.userType === USER_TYPES.SEEKER
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-gray-300 hover:border-secondary'
                }`}
                disabled={isSubmitting}
              >
                <div className="font-semibold">Job Seeker</div>
                <div className="text-xs text-text-secondary mt-1">Looking for opportunities</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: USER_TYPES.EMPLOYER }))}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.userType === USER_TYPES.EMPLOYER
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-gray-300 hover:border-secondary'
                }`}
                disabled={isSubmitting}
              >
                <div className="font-semibold">Employer</div>
                <div className="text-xs text-text-secondary mt-1">Hiring talent</div>
              </button>
            </div>
          </div>
          
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : null}
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : null}
            placeholder="At least 8 characters"
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : null}
            placeholder="Re-enter your password"
            required
            disabled={isSubmitting}
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-secondary hover:text-secondary-dark font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
