import React, { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import TaskComments from './TaskComments';
import './TaskDetails.css';

const PRIORITY_CLASSES = {
  Low: 'priority-low', Medium: 'priority-medium',
  High: 'priority-high', Urgent: 'priority-urgent',
};

const STATUS_CLASSES = {
  'TODO': 'status-todo', 'IN PROGRESS': 'status-progress', 'DONE': 'status-done',
};

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

/**
 * TaskDetails — Slide-in panel showing full task info + comments.
 * Props: task, onClose, onDelete
 */
export default function TaskDetails({ task, onClose, onDelete, hideComments }) {
  const { getMemberById, getBoardById } = useAdmin();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!task) return null;

  const member = task.assignee ? getMemberById(task.assignee) : null;
  const board  = task.boardId  ? getBoardById(task.boardId)  : null;

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : 'Not set';

  return (
    <div className="task-details-backdrop" onClick={onClose}>
      <div
        className="task-details-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Task details: ${task.title}`}
      >
        {/* Header */}
        <div className="task-details-header">
          <h2 className="task-details-title">{task.title}</h2>
          <div className="task-details-header-actions">
            <button
              className="task-details-delete-btn"
              onClick={() => onDelete(task.id)}
              title="Delete task"
              aria-label="Delete task"
              type="button"
            >
              <IconTrash />
              <span>Delete Task</span>
            </button>
            <button
              className="task-details-close-btn"
              onClick={onClose}
              aria-label="Close task details"
              type="button"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="task-details-body">
          {/* Description */}
          <div className="task-detail-row">
            <span className="task-detail-label">Description</span>
            <p className="task-detail-desc">{task.description || 'No description provided.'}</p>
          </div>

          {/* Meta grid */}
          <div className="task-meta-grid">
            <div className="task-meta-item">
              <span className="task-detail-label">Priority</span>
              <span className={`task-priority-badge ${PRIORITY_CLASSES[task.priority] || ''}`}>
                {task.priority}
              </span>
            </div>

            <div className="task-meta-item">
              <span className="task-detail-label">Assignee</span>
              <div className="task-assignee-display">
                <span className="assignee-avatar-sm">{member ? member.name.charAt(0).toUpperCase() : '?'}</span>
                <span>{member ? member.name : 'Unassigned'}</span>
                {member && <span className="assignee-email">{member.email}</span>}
              </div>
            </div>

            <div className="task-meta-item">
              <span className="task-detail-label">Due Date</span>
              <div className="task-detail-due">
                <IconCalendar />
                <span>{dueDateStr}</span>
              </div>
            </div>

            <div className="task-meta-item">
              <span className="task-detail-label">Status</span>
              <span className={`task-status-badge ${STATUS_CLASSES[task.status] || ''}`}>
                {task.status}
              </span>
            </div>

            {board && (
              <div className="task-meta-item task-meta-full">
                <span className="task-detail-label">Board</span>
                <span className="task-board-name">{board.name}</span>
              </div>
            )}
          </div>

          {/* Comments */}
          {!hideComments && <TaskComments task={task} />}
        </div>
      </div>
    </div>
  );
}
