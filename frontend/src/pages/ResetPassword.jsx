import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // On successful validation and submission, navigate to /reset-success
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/reset-success');
    }, 600);
  };

  return (
    <AuthLayout
      headline={['New', 'Password', 'New']}
      highlightWord="Possibilities."
      subtext="Create a strong password to protect your collaborative ideas and projects."
      topQuote="NEW PASSWORD. NEW POSSIBILITIES."
      bottomLeftTag="SECURE TODAY."
      bottomRightTag="GREATER TOMORROW."
      visualSlot={<PixelCollaborationVisual variant="reset-password" />}
    >
      <AuthCard
        title="Reset Your Password"
        subtitle="Enter your new password below."
      >
        <form
          onSubmit={handleSubmit}
          className="auth-form-inner"
          noValidate
        >
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
      </AuthCard>
    </AuthLayout>
  );
}