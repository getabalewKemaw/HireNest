import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';
import * as authService from '../../services/authService';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  validateOTP,
  validatePassword,
  validatePasswordConfirmation,
} from '../../utils/validation';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { tempEmail } = useAuthStore();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    otp: null,
    newPassword: null,
    confirmPassword: null,
  });

  const [touched, setTouched] = useState({
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------- VALIDATION HELPERS -------------------- */

  const validateOtpField = (value) => {
    const err = validateOTP(value);
    setErrors((prev) => ({ ...prev, otp: err }));
    return err;
  };

  const validatePasswordField = (value) => {
    const err = validatePassword(value);
    setErrors((prev) => ({ ...prev, newPassword: err }));
    return err;
  };

  const validateConfirmPasswordField = (value) => {
    const err = validatePasswordConfirmation(passwords.newPassword, value);
    setErrors((prev) => ({ ...prev, confirmPassword: err }));
    return err;
  };

  /* -------------------- OTP SUBMIT -------------------- */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpError = validateOtpField(otp);
    if (otpError) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.verifyResetOTP({
        email: tempEmail,
        otp,
      });

      if (data.success) {
        const responseData = data.data;
        setResetToken(responseData.token || responseData.resetToken);
        setStep(2);
      } else {
        setError(data.error.message);
      }
    } catch {
      setError('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- PASSWORD SUBMIT -------------------- */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const pwdErr = validatePasswordField(passwords.newPassword);
    const confirmErr = validateConfirmPasswordField(
      passwords.confirmPassword
    );

    if (pwdErr || confirmErr) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.resetPassword({
        resetToken,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });

      if (result.success) {
        navigate(ROUTES.LOGIN);
      } else {
        setError(result.error.message);
      }
    } catch {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <AuthLayout
      title={step === 1 ? 'Verify Code' : 'Set New Password'}
      subtitle={
        <span className="dark:text-gray-400">
          {step === 1
            ? `Enter the secure code we've sent to your email ${tempEmail}`
            : 'Almost there! Create a strong new password for your account'}
        </span>
      }
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* ---------------- OTP STEP ---------------- */}
      {step === 1 ? (
        <form className="space-y-8" onSubmit={handleVerifyOtp}>
          <div>
            <label className="block text-sm font-semibold text-center mb-4">
              Verification Code
            </label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              placeholder="000000"
              onChange={(e) => {
                setOtp(e.target.value);
                if (touched.otp) validateOtpField(e.target.value);
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, otp: true }));
                validateOtpField(otp);
              }}
              className="block w-full px-4 py-5 text-center text-4xl tracking-[0.5em] rounded-3xl border"
            />

            {touched.otp && errors.otp && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.otp}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
          >
            Verify Code <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
      ) : (
        /* ---------------- PASSWORD STEP ---------------- */
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            value={passwords.newPassword}
            error={touched.newPassword && errors.newPassword}
            onChange={(e) => {
              const value = e.target.value;
              setPasswords((p) => ({ ...p, newPassword: value }));
              if (touched.newPassword) validatePasswordField(value);
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, newPassword: true }));
              validatePasswordField(passwords.newPassword);
            }}
            placeholder="Enter your new password"
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={CheckCircle}
            value={passwords.confirmPassword}
            error={touched.confirmPassword && errors.confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setPasswords((p) => ({ ...p, confirmPassword: value }));
              if (touched.confirmPassword)
                validateConfirmPasswordField(value);
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, confirmPassword: true }));
              validateConfirmPasswordField(passwords.confirmPassword);
            }}
            placeholder="Re-enter your new password"

          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
          >
            Reset Password <Key size={18} className="ml-2" />
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
