import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Mail, Lock, ShieldAlert } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/validation';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  /* ---------------- VALIDATION HELPERS ---------------- */

  const validateEmailField = (value) => {
    const err = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: err }));
    return err;
  };

  const validatePasswordField = (value) => {
    const err = validatePassword(value);
    setErrors((prev) => ({ ...prev, password: err }));
    return err;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!touched[name]) return;

    if (name === 'email') validateEmailField(value);
    if (name === 'password') validatePasswordField(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmailField(formData.email);
    const passwordErr = validatePasswordField(formData.password);

    if (emailErr || passwordErr) return;

    try {
      await adminLogin(formData);
      navigate(ROUTES.ADMIN_VERIFY_OTP);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <AuthLayout
      title="Admin Access"
      subtitle="Secure portal for HireNest administrators and moderators"
    >
      <div className="flex items-center justify-center mb-8 px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-full w-fit mx-auto animate-pulse">
        <ShieldAlert size={16} className="text-red-600 dark:text-red-400 mr-2" />
        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
          Restricted Zone
        </span>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Admin Email"
          name="email"
          type="email"
          icon={Mail}
          required
          value={formData.email}
          error={touched.email && errors.email}
          onChange={handleChange}
          onBlur={() => {
            setTouched((t) => ({ ...t, email: true }));
            validateEmailField(formData.email);
          }}
          placeholder="admin@hirenest.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          required
          value={formData.password}
          error={touched.password && errors.password}
          onChange={handleChange}
          onBlur={() => {
            setTouched((t) => ({ ...t, password: true }));
            validatePasswordField(formData.password);
          }}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          size="lg"
          disabled={Boolean(errors.email || errors.password)}
          className="!bg-primary hover:!bg-primary-dark !rounded-full shadow-lg shadow-primary/20 font-bold py-4"
        >
          {isLoading ? 'Decrypting...' : 'Secure Authorization'}
        </Button>

        <div className="text-center pt-4">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-bold text-gray-500 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary-light underline underline-offset-4"
          >
            Return to Public Portal
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminLoginPage;
