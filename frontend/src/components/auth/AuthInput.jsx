import React from 'react';
import './AuthInput.css';

/**
 * AuthInput - Modern, accessible input with left icon support and aqua glow on focus.
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
    </div>
  );
}