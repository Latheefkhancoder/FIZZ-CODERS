import React, { useEffect } from 'react';
import './ConfirmationDialog.css';

/**
 * ConfirmationDialog — Reusable modal for destructive actions.
 * Props: isOpen, title, message, confirmLabel, onConfirm, onCancel
 */
export default function ConfirmationDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog-box"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="dialog-icon-ring">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h3 id="dialog-title" className="dialog-title">{title}</h3>
        {message && <p className="dialog-message">{message}</p>}

        <div className="dialog-actions">
          <button className="dialog-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="dialog-btn-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
