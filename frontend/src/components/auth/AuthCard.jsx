import React from 'react';

/**
 * AuthCard - Dark semi-transparent card container with thin red border,
 * glowing red ambient shadow, and responsive layout.
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
    <div className={`auth-card-container ${centered ? 'is-centered' : ''} ${className}`}>
      {icon && <div className="auth-card-icon-header">{icon}</div>}

      {title && <h2 className="auth-card-title">{title}</h2>}

      {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}

      <div className="auth-card-body">{children}</div>

      <style>{`
        .auth-card-container {
          width: 100%;
          max-width: 440px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 38px 36px;
          box-shadow: var(--shadow-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: cardFloatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          z-index: 5;
          text-align: left;
        }

        .auth-card-container.is-centered {
          text-align: center;
          margin: 0 auto;
        }

        .auth-card-icon-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .auth-card-title {
          font-family: var(--font-sans);
          font-size: 26px;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .auth-card-subtitle {
          font-family: var(--font-sans);
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 28px;
        }

        .auth-card-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (max-width: 480px) {
          .auth-card-container {
            padding: 24px 18px;
            border-radius: 16px;
          }
          .auth-card-title {
            font-size: 22px;
          }
        }

        @media (max-height: 700px) and (min-width: 901px) {
          .auth-card-container {
            padding: 24px 28px;
          }
          .auth-card-title {
            font-size: 22px;
            margin-bottom: 6px;
          }
          .auth-card-subtitle {
            font-size: 12.5px;
            margin-bottom: 20px;
          }
          .auth-card-body {
            gap: 14px;
          }
        }

        @media (max-height: 600px) and (min-width: 901px) {
          .auth-card-container {
            padding: 18px 24px;
          }
          .auth-card-body {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
