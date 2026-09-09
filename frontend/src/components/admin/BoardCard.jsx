import React from 'react';
import './BoardCard.css';

const IconBoard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/**
 * BoardCard — Summary card for a board on the Boards list page.
 * Props: board, taskCount, onClick, onDelete
 */
export default function BoardCard({ board, taskCount, onClick, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(board.id);
  };

  return (
    <div className="board-card" onClick={() => onClick(board.id)} role="button" tabIndex={0}>
      <div className="board-card-icon">
        <IconBoard />
      </div>
      <div className="board-card-body">
        <h3 className="board-card-name">{board.name}</h3>
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
