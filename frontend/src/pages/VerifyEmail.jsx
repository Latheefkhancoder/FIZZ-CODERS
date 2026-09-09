import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import { verifyEmail, resendVerification } from '../services/auth.service';

import './VerifyEmail.css';

export default function VerifyEmail() {
  const location = useLocation();


  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('Verification code must be 6 digits.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setResendStatus('');

    try {
      await verifyEmail({
        email: email.trim(),
        otp: otp.trim(),
      });

      setIsSubmitting(false);
      setIsVerified(true);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Verification failed. Please check the code and try again.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    if (!email.trim()) {
      setError('Please provide your email address to resend code.');
      return;
    }

    setIsResending(true);
    setError('');
    setResendStatus('');

    try {
      const res = await resendVerification(email.trim());
      setIsResending(false);
      setResendStatus(res.message || 'A new verification code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setIsResending(false);
      setError(err.message || 'Failed to resend verification code.');
    }
  };

  return (
    <AuthLayout
      visualSlot={<PixelCollaborationVisual variant="create-account" />}
    >
      <AuthCard
        title="Verify Your Email"
        subtitle="Enter the 6-digit code sent to your email address to complete registration."
      >
        {isVerified ? (
          <div className="verify-success-box">
            <div className="verify-success-icon font-pixel">✓</div>
            <h3 className="verify-success-title">Email Verified!</h3>
            <p className="verify-success-desc">
              Your email address <strong className="text-white">{email}</strong> has been successfully verified. You can now log in to your FIZZ-CONNECT account.
            </p>
            <div className="sent-actions" style={{ width: '100%', marginTop: '14px' }}>
              <Link
                to="/login"
                className="continue-reset-link"
                style={{ textDecoration: 'none' }}
              >
                Proceed to Login →
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleVerify}
            className="auth-form-inner"
            noValidate
          >
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                }}
              >
                {error}
              </div>
            )}

            {resendStatus && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                }}
              >
                {resendStatus}
              </div>
            )}

            {/* Email Address Display / Input if not passed */}
            {initialEmail ? (
              <div className="verify-email-info">
                Code sent to: <strong>{email}</strong>
              </div>
            ) : (
              <AuthInput
                id="verify-email-input"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
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
            )}

            {/* OTP Input */}
            <AuthInput
              id="verify-otp-input"
              name="otp"
              type="text"
              label="6-Digit Verification Code"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="otp-input-field"
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            {/* Resend OTP Row */}
            <div className="resend-row">
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Didn't receive the code?
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="resend-btn"
              >
                {isResending
                  ? 'Sending...'
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
              </button>
            </div>

            {/* Verify Email Submit Button */}
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            >
              Verify Email
            </AuthButton>

            {/* Footer Back to Login / Register */}
            <div className="auth-footer-link-wrap">
              <Link to="/login" className="back-login-link">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
