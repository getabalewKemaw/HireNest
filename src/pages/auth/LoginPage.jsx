import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserCheck, ArrowRight } from 'lucide-react';

import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { validateEmail, validatePassword } from '../../utils/validation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  /* =========================
     LIVE CHANGE HANDLER
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) clearError();

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]:
          name === 'email'
            ? validateEmail(value)
            : validatePassword(value),
      }));
    }
  };

  /* =========================
     BLUR VALIDATION
  ========================== */
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]:
        name === 'email'
          ? validateEmail(value)
          : validatePassword(value),
    }));
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setFieldErrors(errors);
    setTouched({ email: true, password: true });

    if (Object.values(errors).some(Boolean)) return;

    try {
      await login(formData);

      const { role } = useAuthStore.getState();

      if (role === 'ADMIN') navigate(ROUTES.ADMIN.DASHBOARD);
      else if (role === 'EMPLOYER') navigate(ROUTES.EMPLOYER.DASHBOARD);
      else if (role === 'SEEKER') navigate(ROUTES.SEEKER.DASHBOARD);
      else navigate(ROUTES.DASHBOARD);
    } catch {
      // handled in store
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your HireNest account and continue your journey"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start shadow-sm">
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          required
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? fieldErrors.email : null}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          required
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? fieldErrors.password : null}
          placeholder="••••••••"
        />


 

  <Link to={ROUTES.FORGOT_PASSWORD} className="text-secondary hover:underline  mt-10 text-end">
    Forgot Password?
  </Link>
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          size="lg"
          className="mt-4 group !bg-secondary hover:!bg-secondary-dark !rounded-full shadow-lg shadow-secondary/20"
        >
          Sign in
          {!isLoading && (
            <ArrowRight
              size={18}
              className="ml-2 inline-block transition-transform group-hover:translate-x-1"
            />
          )}
        </Button>
      </form>

      <div className="mt-10 text-center space-y-6">
        <p className="text-base text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-bold text-secondary hover:underline"
          >
            Sign up for free
          </Link>
        </p>

        <Link
          to={ROUTES.ADMIN_LOGIN}
          className="inline-flex items-center text-sm text-gray-400 hover:text-secondary transition-all"
        >
          <UserCheck size={16} className="mr-2" />
          Admin Portal
        </Link>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm bg-white dark:bg-gray-800 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <img
            className="h-6 w-6 mr-3"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
