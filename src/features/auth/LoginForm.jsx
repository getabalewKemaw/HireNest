import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { login } from '../../services/authService';
import { validateEmail, validateRequired } from '../../utils/validation';
import { ROUTES, ALERT_TYPES } from '../../config/constants';
import useAuthStore from '../../store/authStore';


const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        error = validateRequired(value, 'Password');
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
    newErrors.password = validateRequired(formData.password, 'Password');
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    return !Object.values(newErrors).some(error => error !== null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setAlert(null);
    
    const result = await login(formData);
    
    if (result.success) {
      // Set user in store
      setUser({
        email: result.data.email,
        userType: result.data.userType,
        role: `ROLE_${result.data.userType}`,
      });
      
      // Navigate to dashboard
      navigate(ROUTES.DASHBOARD);
    } else {
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: result.error.message || 'Login failed. Please try again.',
      });
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-heading font-bold text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary mb-6">
          Sign in to your account to continue
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
            placeholder="Enter your password"
            required
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between text-sm">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-secondary hover:text-secondary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-secondary hover:text-secondary-dark font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
