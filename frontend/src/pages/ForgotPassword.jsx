import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';

export default function ForgotPassword() {
  const navigate = useNavigate();
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

    // Provide friendly UI response and transition capability
    setTimeout(() => {
      setIsSubmitting(false);
      setSentNotice(true);
    }, 600);
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
            <h3 className="sent-title">Reset Link Sent!</h3>
            <p className="sent-desc">
              We've dispatched password reset instructions to{' '}
              <strong className="text-white">{email}</strong>. Please check your inbox.
            </p>
            <div className="sent-actions">
              <Link to="/reset-password" className="continue-reset-link">
                Proceed to Reset Password →
              </Link>
              <Link to="/login" className="back-login-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form-inner" noValidate>
            <AuthInput
              id="forgot-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              required
              autoComplete="email"
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />

            <AuthButton
              type="submit"
              loading={isSubmitting}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              }
            >
              Send Reset Link
            </AuthButton>

            <div className="auth-footer-link-wrap">
              <Link to="/login" className="back-login-link">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </AuthCard>

      <style>{`
        .auth-form-inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-footer-link-wrap {
          text-align: center;
          margin-top: 4px;
        }

        .back-login-link {
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s ease;
          display: inline-block;
        }

        .back-login-link:hover {
          color: var(--text-white);
        }

        .reset-sent-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 10px 0;
        }

        .sent-icon {
          font-size: 32px;
          color: var(--red-primary);
          text-shadow: 0 0 15px var(--red-glow);
        }

        .sent-title {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-white);
        }

        .sent-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .sent-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin-top: 10px;
        }

        .continue-reset-link {
          display: block;
          width: 100%;
          padding: 12px 20px;
          background: var(--red-glow-subtle);
          border: 1px solid var(--red-primary);
          border-radius: 9999px;
          color: var(--text-white);
          font-size: 13.5px;
          font-weight: 600;
          text-align: center;
          transition: all 0.2s ease;
        }

        .continue-reset-link:hover {
          background: var(--red-primary);
          box-shadow: var(--shadow-btn);
        }
      `}</style>
    </AuthLayout>
  );
}
