import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';

import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const handleSubmit = (e) => {
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

    // Provide friendly UI response
    setTimeout(() => {
      setIsSubmitting(false);
      setSentNotice(true);
    }, 600);
  };

  return (
    <AuthLayout
      headline={['Ideas', 'Never']}
      highlightWord="Get Lost."
      subtext="Enter your email address and we'll send you a link to reset your access."
      topQuote="IDEAS NEVER GET LOST."
      bottomLeftTag="IDEAS NEVER GET LOST."
      bottomRightTag="GET BACK TO BUILDING SOON."
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
              We've dispatched password reset instructions to{' '}
              <strong className="text-white">{email}</strong>.
              Please check your inbox.
            </p>

            <div className="sent-actions">
              <Link
                to="/reset-password"
                className="continue-reset-link"
              >
                Proceed to Reset Password →
              </Link>

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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2-2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
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