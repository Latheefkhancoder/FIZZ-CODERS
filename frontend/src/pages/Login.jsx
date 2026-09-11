import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import { loginUser } from '../services/auth.service';

import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const validateForm = () => {
    const nextErrors = {};
    const emailVal = formData.email.trim();

    if (!emailVal) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (serverError) {
      setServerError('');
      setUnverifiedEmail('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');
    setUnverifiedEmail('');

    try {
      const res = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      setIsSubmitting(false);
      setLoginSuccess(true);
      setUserProfile(res.data?.user);

      if (res.data?.token) {
        if (formData.rememberMe) {
          localStorage.setItem('auth_token', res.data.token);
        } else {
          sessionStorage.setItem('auth_token', res.data.token);
        }
      }

      setTimeout(() => {
        navigate('/select-role');
      }, 600);
    } catch (err) {
      setIsSubmitting(false);
      const msg = err.message || 'Login failed. Please check your credentials.';
      setServerError(msg);
      if (err.status === 403 || msg.toLowerCase().includes('verification')) {
        setUnverifiedEmail(formData.email.trim());
      }
    }
  };

  return (
    <AuthLayout
      visualSlot={<PixelCollaborationVisual variant="login" />}
    >
      <AuthCard
        title="Welcome Back!"
        subtitle="Log in to continue building great things on FIZZ-CONNECT."
      >
        {loginSuccess ? (
          <div className="reset-sent-box" style={{ textAlign: 'center' }}>
            <div className="sent-icon font-pixel">✨</div>
            <h3 className="sent-title">Login Successful!</h3>
            <p className="sent-desc">
              Welcome back, <strong className="text-white">{userProfile?.name || 'User'}</strong>! You are securely logged in.
            </p>
            <div className="sent-actions">
              <button
                type="button"
                onClick={() => setLoginSuccess(false)}
                className="back-login-link"
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Log in as another user
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="auth-form-inner"
            noValidate
          >
            {serverError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  lineHeight: '1.4',
                }}
              >
                <div>{serverError}</div>
                {unverifiedEmail && (
                  <div style={{ marginTop: '8px' }}>
                    <Link
                      to="/verify-email"
                      state={{ email: unverifiedEmail }}
                      style={{
                        color: '#38bdf8',
                        fontWeight: '600',
                        textDecoration: 'underline',
                        fontSize: '0.825rem',
                      }}
                    >
                      Click here to verify your email now →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Email Address */}
            <AuthInput
              id="login-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
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

            {/* Password with show/hide toggle */}
            <PasswordInput
              id="login-password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Options: Remember Me & Forgot Password */}
            <div className="auth-options-row">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="checkbox-input"
                />

                <span className="checkbox-custom" />

                <span className="checkbox-label">
                  Keep me signed in
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary Action Button */}
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              }
            >
              Log In
            </AuthButton>

            {/* Switch to Create Account */}
            <div className="auth-switch-text">
              <span>Don't have an account? </span>

              <Link
                to="/create-account"
                className="auth-switch-link"
              >
                Create account →
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}