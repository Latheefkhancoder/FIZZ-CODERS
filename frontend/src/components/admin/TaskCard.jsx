import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import './TaskCard.css';

const PRIORITY_CLASSES = {
  Low:    'priority-low',
  Medium: 'priority-medium',
  High:   'priority-high',
  Urgent: 'priority-urgent',
};

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);

const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5"  r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

/**
 * TaskCard — Compact kanban card shown in a column.
 * Props: task, onClick, onDelete
 */
export default function TaskCard({ task, onClick, onDelete }) {
  const { getMemberById } = useAdmin();
  const member = task.assignee ? getMemberById(task.assignee) : null;
  const initials = member ? member.name.charAt(0).toUpperCase() : '?';

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <div
      className="task-card"
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(task)}
    >
      {/* Header row */}
      <div className="task-card-header">
        <span className={`task-priority-badge ${PRIORITY_CLASSES[task.priority] || ''}`}>
          {task.priority}
        </span>
        <button
          className="task-card-menu-btn"
          onClick={handleDeleteClick}
          aria-label="Delete task"
          title="Delete task"
          type="button"
        >
          <IconMore />
        </button>
      </div>

      {/* Title */}
      <h4 className="task-card-title">{task.title}</h4>

      {/* Description snippet */}
      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {/* Footer: assignee + due date */}
      <div className="task-card-footer">
        <div className="task-card-assignee" title={member ? member.name : 'Unassigned'}>
          <span className="assignee-avatar">{initials}</span>
          <span className="assignee-name">{member ? member.name : 'Unassigned'}</span>
        </div>

        {dueDateStr && (
          <div className="task-card-due">
            <IconCalendar />
            <span>{dueDateStr}</span>
          </div>
        )}
      </div>
    </div>
  );
}
