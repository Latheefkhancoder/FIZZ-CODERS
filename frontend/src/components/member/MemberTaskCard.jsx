import React from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberTaskCard.css';

const PRIORITY_CLASSES = {
  Low:    'member-priority-low',
  Medium: 'member-priority-medium',
  High:   'member-priority-high',
  Urgent: 'member-priority-urgent',
};

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);

const IconGrip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8"  cy="6"  r="1"/><circle cx="16" cy="6"  r="1"/>
    <circle cx="8"  cy="12" r="1"/><circle cx="16" cy="12" r="1"/>
    <circle cx="8"  cy="18" r="1"/><circle cx="16" cy="18" r="1"/>
  </svg>
);

/**
 * MemberTaskCard — Compact kanban card for member My Tasks view.
 * Props: task, onClick, isDragging, boardName
 * NOTE: No delete button — members cannot delete tasks.
 */
export default function MemberTaskCard({ task, onClick, isDragging, boardName }) {
  const { getMemberById } = useMember();
  const member = task.assignee ? getMemberById(task.assignee) : null;

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <div
      className={`member-task-card ${isDragging ? 'member-card-dragging' : ''}`}
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(task)}
    >
      {/* Drag handle */}
      <div className="member-drag-handle" title="Drag to move">
        <IconGrip />
      </div>

      {/* Main content */}
      <div className="member-card-main">
        {/* Top row: priority + board name */}
        <div className="member-card-top-row">
          <span className={`member-priority-badge ${PRIORITY_CLASSES[task.priority] || ''}`}>
            {task.priority}
          </span>
          {boardName && (
            <span className="member-card-board-name">{boardName}</span>
          )}
        </div>

        {/* Title */}
        <p className="member-card-title">{task.title}</p>

        {/* Description snippet */}
        {task.description && (
          <p className="member-card-desc">{task.description}</p>
        )}

        {/* Footer: assignee + due date */}
        <div className="member-card-footer">
          <div className="member-card-assignee" title={member ? member.name : 'Unassigned'}>
            <span className="member-assignee-avatar">
              {member ? member.name.charAt(0).toUpperCase() : '?'}
            </span>
            <span className="member-assignee-name">
              {member ? member.name : 'Unassigned'}
            </span>
          </div>

          {dueDateStr && (
            <div className="member-card-due">
              <IconCalendar />
              <span>{dueDateStr}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
