import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  getPasswordStrength,
} from '../../utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) clearError();

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      let fieldError = null;

      if (name === 'email') fieldError = validateEmail(value);

      if (name === 'password') {
        fieldError = validatePassword(value);
        return {
          ...prev,
          password: fieldError,
          confirmPassword: validatePasswordConfirmation(
            value,
            formData.confirmPassword
          ),
        };
      }

      if (name === 'confirmPassword') {
        fieldError = validatePasswordConfirmation(formData.password, value);
      }

      return { ...prev, [name]: fieldError };
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    let fieldError = null;

    if (name === 'email') fieldError = validateEmail(value);
    if (name === 'password') fieldError = validatePassword(value);
    if (name === 'confirmPassword') {
      fieldError = validatePasswordConfirmation(
        formData.password,
        value
      );
    }

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validatePasswordConfirmation(
        formData.password,
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        userType: null,
      });

      navigate(ROUTES.VERIFY_EMAIL);
    } catch {
      // handled in store
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  };

  // Password Strength
  const passwordStrength =
    formData.password && getPasswordStrength(formData.password);

  // =======================
  // Render
  // =======================
  return (
    <AuthLayout
      title="Join HireNest"
      subtitle="Create your account and unlock a world of professional opportunities"
    >
      {/* Backend / Server Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 animate-fade-in">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <Input
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          placeholder="you@example.com"
          required
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          placeholder="Create a strong password"
          required
        />

        {/* Password Strength */}
        {passwordStrength && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength === 'weak'
                    ? 'bg-red-500 w-1/3'
                    : passwordStrength === 'medium'
                    ? 'bg-yellow-500 w-2/3'
                    : 'bg-green-500 w-full'
                }`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Password strength:{' '}
              <span className="font-semibold capitalize">
                {passwordStrength}
              </span>
            </p>
          </div>
        )}

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          placeholder="Repeat your password"
          required
        />

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          size="lg"
          className="mt-6 group !bg-secondary hover:!bg-secondary-dark !rounded-full shadow-lg shadow-secondary/20 transition-all"
        >
          Create Account
          {!isLoading && (
            <ArrowRight
              size={18}
              className="ml-2 inline-block transition-transform group-hover:translate-x-1"
            />
          )}
        </Button>
      </form>

      {/* OAuth */}
      <div className="mt-10">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase">
              Or sign up with
            </span>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm bg-white dark:bg-gray-800 text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <img
              className="h-6 w-6 mr-3"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Login Link */}
      <div className="mt-10 text-center">
        <p className="text-base text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-bold text-secondary hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
