import React from 'react';
import './AuthCard.css';

/**
 * AuthCard - White card container with thin aqua border,
 * subtle aqua ambient shadow, and responsive layout.
 */
export default function AuthCard({
  title,
  subtitle,
  children,
  icon,
  className = '',
  centered = false,
}) {
  return (
    <div
      className={`auth-card-container ${
        centered ? 'is-centered' : ''
      } ${className}`}
    >
      {icon && <div className="auth-card-icon-header">{icon}</div>}

      {title && <h2 className="auth-card-title">{title}</h2>}

      {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}

      <div className="auth-card-body">{children}</div>
    </div>
  );
}