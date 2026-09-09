import React, { useState } from 'react';
import './AddMemberForm.css';

const ROLES = ['Member', 'Admin'];

/**
 * AddMemberForm — Inline form for adding a new team member.
 * Props: onAdd
 */
export default function AddMemberForm({ onAdd }) {
  const [email, setEmail] = useState('');
  const [role,  setRole]  = useState('Member');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    onAdd(email.trim(), role);
    setEmail('');
    setRole('Member');
    setError('');
  };

  return (
    <form className="add-member-form" onSubmit={handleSubmit}>
      <div className="add-member-fields">
        <div className="add-member-input-wrap">
          <input
            id="add-member-email"
            type="email"
            className={`add-member-email-input ${error ? 'input-error-field' : ''}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="Enter email address..."
            autoComplete="off"
          />
          {error && <span className="add-member-error">{error}</span>}
        </div>

        <select
          id="add-member-role"
          className="add-member-role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button type="submit" className="add-member-btn" id="add-member-submit-btn">
          + Add Member
        </button>
      </div>
    </form>
  );
}
