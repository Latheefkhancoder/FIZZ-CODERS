import React, { useState, useEffect, useCallback } from 'react';
import './CreateBoardModal.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * CreateBoardModal — Modal for creating a new board with Name and 5-character Code.
 * Props: isOpen, onClose, onSubmit
 */
export default function CreateBoardModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});

  const handleClose = useCallback(() => {
    setName('');
    setCode('');
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const handleCodeChange = (e) => {
    // Automatically convert to uppercase and filter non-alphanumeric characters, max 5 chars
    const rawVal = e.target.value.toUpperCase();
    const cleanVal = rawVal.replace(/[^A-Z0-9]/g, '').slice(0, 5);
    setCode(cleanVal);
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedName) {
      nextErrors.name = 'Board name is required.';
    } else if (trimmedName.length < 3) {
      nextErrors.name = 'Board name must be at least 3 characters.';
    }

    if (!trimmedCode) {
      nextErrors.code = 'Board code is required.';
    } else if (trimmedCode.length !== 5) {
      nextErrors.code = 'Board code must contain exactly 5 alphanumeric characters.';
    } else if (!/^[A-Z0-9]{5}$/.test(trimmedCode)) {
      nextErrors.code = 'Board code must contain only letters and numbers (A-Z, 0-9).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(trimmedName, trimmedCode);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-board-title"
      >
        <div className="modal-header">
          <h3 id="create-board-title" className="modal-title">Create New Board</h3>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close" type="button">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Board Name */}
          <div className="modal-field">
            <label htmlFor="board-name-input" className="modal-label">Board Name</label>
            <input
              id="board-name-input"
              type="text"
              className={`modal-input ${errors.name ? 'input-error' : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Development Board"
              autoFocus
              autoComplete="off"
            />
            {errors.name && <span className="modal-field-error">{errors.name}</span>}
          </div>

          {/* Board Code */}
          <div className="modal-field">
            <div className="modal-label-row">
              <label htmlFor="board-code-input" className="modal-label">Board Code</label>
              <span className="modal-label-counter">{code.length}/5</span>
            </div>
            <input
              id="board-code-input"
              type="text"
              className={`modal-input modal-code-input font-pixel ${errors.code ? 'input-error' : ''}`}
              value={code}
              onChange={handleCodeChange}
              placeholder="e.g. A7K2P"
              maxLength={5}
              autoComplete="off"
              spellCheck="false"
            />
            <span className="modal-field-hint">
              Board Code must contain exactly 5 alphanumeric characters (A-Z, 0-9).
            </span>
            {errors.code && <span className="modal-field-error">{errors.code}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={handleClose}>Cancel</button>
            <button type="submit" className="modal-btn-primary" id="create-board-submit-btn">Create Board</button>
          </div>
        </form>
      </div>
    </div>
  );
}
