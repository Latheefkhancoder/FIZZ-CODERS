import React, { useState } from 'react';
import './BoardCard.css';

const IconBoard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/**
 * BoardCard — Summary card for a board on the Boards list page with 5-char code display.
 * Props: board, taskCount, onClick, onDelete
 */
export default function BoardCard({ board, taskCount, onClick, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(board.id);
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (board.code) {
      navigator.clipboard?.writeText(board.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="board-card" onClick={() => onClick(board.id)} role="button" tabIndex={0}>
      <div className="board-card-icon">
        <IconBoard />
      </div>

      <div className="board-card-body">
        <div className="board-card-title-row">
          <h3 className="board-card-name">{board.name}</h3>
        </div>

        {board.code && (
          <div className="board-card-code-badge" onClick={handleCopyCode} title="Click to copy board code">
            <span className="board-code-prefix">CODE:</span>
            <span className="board-code-text font-pixel">{board.code}</span>
            <button type="button" className="board-code-copy-btn" aria-label="Copy board code">
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
            {copied && <span className="board-code-copied-tooltip">Copied!</span>}
          </div>
        )}

        <p className="board-card-meta">
          {taskCount} task{taskCount !== 1 ? 's' : ''} · Created {formatDate(board.createdAt)}
        </p>
      </div>

      <button
        className="board-card-delete"
        onClick={handleDelete}
        title="Delete board"
        aria-label={`Delete board ${board.name}`}
        type="button"
      >
        <IconTrash />
      </button>
    </div>
  );
}
