import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import { resetPassword, verifyResetToken } from '../services/auth.service';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    token: tokenFromUrl,
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(Boolean(tokenFromUrl));
  const [isTokenValid, setIsTokenValid] = useState(null);

  useEffect(() => {
    if (tokenFromUrl) {
      setFormData((prev) => ({ ...prev, token: tokenFromUrl }));
      setIsCheckingToken(true);
      verifyResetToken(tokenFromUrl)
        .then((res) => {
          setIsTokenValid(res.data?.valid ?? false);
          if (!res.data?.valid) {
            setGeneralError('This password reset link is invalid or has expired.');
          }
        })
        .catch(() => {
          setIsTokenValid(false);
          setGeneralError('Failed to verify reset link.');
        })
        .finally(() => {
          setIsCheckingToken(false);
        });
    }
  }, [tokenFromUrl]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.token.trim()) {
      nextErrors.token = 'Reset token is required.';
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 6) {
      nextErrors.newPassword = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your new password.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError('');

    try {
      await resetPassword({
        token: formData.token.trim(),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setIsSubmitting(false);
      navigate('/reset-success');
    } catch (err) {
      setIsSubmitting(false);
      setGeneralError(err.message || 'Failed to reset password. Please check your reset link and try again.');
    }
  };

  return (
    <AuthLayout
      visualSlot={<PixelCollaborationVisual variant="reset-password" />}
    >
      <AuthCard
        title="Reset Your Password"
        subtitle="Enter your new password below to reset your account credentials."
      >
        {isCheckingToken ? (
          <div className="text-center py-6 text-slate-300">
            Verifying reset token...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="auth-form-inner"
            noValidate
          >
            {generalError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}
              >
                {generalError}
              </div>
            )}

            {!tokenFromUrl && (
              <AuthInput
                id="reset-token"
                name="token"
                type="text"
                label="Reset Token"
                placeholder="Enter reset token"
                value={formData.token}
                onChange={handleChange}
                error={errors.token}
                required
              />
            )}

            {/* New Password */}
            <PasswordInput
              id="reset-new-password"
              name="newPassword"
              label="New Password"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
              autoComplete="new-password"
            />

            {/* Confirm New Password */}
            <PasswordInput
              id="reset-confirm-password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Submit Button */}
            <AuthButton
              type="submit"
              loading={isSubmitting}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              }
            >
              Update Password
            </AuthButton>

            {/* Back to Login */}
            <div className="auth-footer-link-wrap">
              <Link
                to="/login"
                className="back-login-link"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}