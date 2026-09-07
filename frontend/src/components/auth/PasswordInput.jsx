import React, { useState } from 'react';

/**
 * PasswordInput - Password field with left lock icon and interactive show/hide toggle.
 */
export default function PasswordInput({
  id,
  name,
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-field-group">
      {label && (
        <label htmlFor={id} className="auth-field-label">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}

      <div className={`auth-input-wrapper ${error ? 'has-error' : ''}`}>
        {/* Lock Icon */}
        <span className="auth-input-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="auth-input-element"
        />

        {/* Show / Hide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            /* Eye Off Icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            /* Eye Icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {error && <span className="auth-field-error">{error}</span>}

      <style>{`
        .auth-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          text-align: left;
        }

        .auth-field-label {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-light);
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: var(--input-radius);
          transition: all 0.25s ease;
          padding: 0 14px;
        }

        .auth-input-wrapper:hover {
          border-color: rgba(22, 198, 210, 0.45);
        }

        .auth-input-wrapper:focus-within {
          border-color: var(--input-border-focus);
          box-shadow: 0 0 0 3px rgba(22, 198, 210, 0.18), 0 0 15px rgba(22, 198, 210, 0.15);
        }

        .auth-input-wrapper.has-error {
          border-color: #28D3D6;
          box-shadow: 0 0 0 2px rgba(255, 51, 68, 0.25);
        }

        .auth-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 15px;
          margin-right: 10px;
          pointer-events: none;
        }

        .auth-input-wrapper:focus-within .auth-input-icon {
          color: var(--red-primary);
        }

        .auth-input-element {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-white);
          font-size: 14px;
          padding: 12px 0;
          font-family: var(--font-sans);
        }

        .auth-input-element::placeholder {
          color: var(--text-dim);
          font-size: 13.5px;
        }

        .password-toggle-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          padding: 4px;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.15s ease;
        }

        .password-toggle-btn:hover {
          color: var(--red-primary);
          transform: scale(1.1);
        }

        .auth-field-error {
          font-size: 11.5px;
          color: #28D3D6;
          font-family: var(--font-sans);
          padding-left: 2px;
        }
      `}</style>
    </div>
  );
}
