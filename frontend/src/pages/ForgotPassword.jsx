import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import { forgotPassword } from '../services/auth.service';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await forgotPassword(email.trim());
      setIsSubmitting(false);
      setSentNotice(true);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to process request. Please try again.');
    }
  };

  return (
    <AuthLayout
      visualSlot={<PixelCollaborationVisual variant="forgot-password" />}
    >
      <AuthCard
        title="Forgot Your Password?"
        subtitle="No worries! Enter your email address and we'll send you a reset link."
      >
        {sentNotice ? (
          <div className="reset-sent-box">
            <div className="sent-icon font-pixel">✉</div>

            <h3 className="sent-title">
              Reset Link Sent!
            </h3>

            <p className="sent-desc">
              If an account exists for{' '}
              <strong className="text-white">{email}</strong>, password reset instructions have been sent.
              Please check your email inbox and click the link to reset your password.
            </p>

            <div className="sent-actions">
              <Link
                to="/login"
                className="back-login-link"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (

          <form
            onSubmit={handleSubmit}
            className="auth-form-inner"
            noValidate
          >
            <AuthInput
              id="forgot-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (error) {
                  setError('');
                }
              }}
              error={error}
              required
              autoComplete="email"
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />

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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              }
            >
              Send Reset Link
            </AuthButton>

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