import React from 'react';

/**
 * AuthInput - Modern, accessible input with left icon support and retro-pixel red glow on focus.
 */
export default function AuthInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  autoComplete,
  disabled = false,
}) {
  return (
    <div className="auth-field-group">
      {label && (
        <label htmlFor={id} className="auth-field-label">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}

      <div className={`auth-input-wrapper ${error ? 'has-error' : ''}`}>
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="auth-input-element"
        />
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
          font-weight: 500;
          color: var(--text-light);
          letter-spacing: 0.2px;
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
          border-color: rgba(255, 45, 61, 0.45);
        }

        .auth-input-wrapper:focus-within {
          border-color: var(--red-primary);
          box-shadow: 0 0 0 3px rgba(255, 45, 61, 0.18), 0 0 15px rgba(255, 45, 61, 0.25);
        }

        .auth-input-wrapper.has-error {
          border-color: #ff3344;
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

        .auth-field-error {
          font-size: 11.5px;
          color: var(--red-light);
          font-family: var(--font-sans);
          padding-left: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
