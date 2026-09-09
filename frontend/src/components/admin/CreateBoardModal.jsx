import React, { useState, useEffect, useCallback } from 'react';
import './CreateBoardModal.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/**
 * CreateBoardModal — Modal for creating a new board.
 * Props: isOpen, onClose, onSubmit
 */
export default function CreateBoardModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    setName('');
    setError('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Board name is required.'); return; }
    if (trimmed.length < 3) { setError('Board name must be at least 3 characters.'); return; }
    onSubmit(trimmed);
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

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="board-name-input" className="modal-label">Board Name</label>
            <input
              id="board-name-input"
              type="text"
              className={`modal-input ${error ? 'input-error' : ''}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Development Board"
              autoFocus
              autoComplete="off"
            />
            {error && <span className="modal-field-error">{error}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={handleClose}>Cancel</button>
            <button type="submit" className="modal-btn-primary">Create Board</button>
          </div>
        </form>
      </div>
    </div>
  );
}
