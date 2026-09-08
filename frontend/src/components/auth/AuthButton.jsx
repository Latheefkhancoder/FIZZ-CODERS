import React from 'react';
import './AuthButton.css';

/**
 * AuthButton - Primary SaaS pill button with subtle aqua glow and hover elevation.
 */
export default function AuthButton({
  children,
  type = 'submit',
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`auth-btn-primary ${loading ? 'is-loading' : ''} ${className}`}
    >
      <span className="auth-btn-content">
        {loading ? (
          <span className="auth-btn-spinner" />
        ) : (
          icon && <span className="auth-btn-icon">{icon}</span>
        )}

        <span>{children}</span>
      </span>
    </button>
  );
}