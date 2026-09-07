import React from 'react';

/**
 * AuthButton - Primary retro-futuristic red pill button with subtle glow and hover elevation.
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

      <style>{`
        .auth-btn-primary {
          position: relative;
          width: 100%;
          padding: 13px 24px;
          background: linear-gradient(135deg, #FF2D3D 0%, #D81F2E 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px; /* Pill style matching reference */
          color: var(--text-white);
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-btn);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #FF4B55 0%, #FF2D3D 100%);
          box-shadow: var(--shadow-btn-hover);
        }

        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(255, 45, 61, 0.5);
        }

        .auth-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }

        .auth-btn-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-btn-icon {
          display: flex;
          align-items: center;
          font-size: 15px;
        }

        .auth-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
