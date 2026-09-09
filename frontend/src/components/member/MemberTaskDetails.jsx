import React, { useEffect } from 'react';
import { useMember } from '../../context/MemberContext';
// Reuse the admin's TaskComments component, because we want it to be identical.
// However, the admin's TaskComments uses `useAdmin`.
// Oh wait, if we reuse the admin's TaskComments, it calls `useAdmin().addComment`, which will add it as the admin.
// We need a member version of TaskComments that uses `useMember().addMyComment`.
// I will create `MemberTaskComments.jsx` right after this.
import MemberTaskComments from './MemberTaskComments';
import './MemberTaskDetails.css';

const PRIORITY_CLASSES = {
  Low: 'member-priority-low', Medium: 'member-priority-medium',
  High: 'member-priority-high', Urgent: 'member-priority-urgent',
};

const STATUS_CLASSES = {
  'TODO': 'member-status-todo', 'IN PROGRESS': 'member-status-progress', 'DONE': 'member-status-done',
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

/**
 * MemberTaskDetails — Slide-in panel showing full task info + comments.
 * View-only task details for members. No delete button.
 */
export default function MemberTaskDetails({ task, onClose }) {
  const { getMemberById, getBoardById } = useMember();

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
    <div className="member-task-details-backdrop" onClick={onClose}>
      <div
        className="member-task-details-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Task details: ${task.title}`}
      >
        {/* Header */}
        <div className="member-task-details-header">
          <h2 className="member-task-details-title">{task.title}</h2>
          <div className="member-task-details-header-actions">
            <button
              className="member-task-details-close-btn"
              onClick={onClose}
              aria-label="Close task details"
              type="button"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="member-task-details-body">
          {/* Description */}
          <div className="member-task-detail-row">
            <span className="member-task-detail-label">Description</span>
            <p className="member-task-detail-desc">{task.description || 'No description provided.'}</p>
          </div>

          {/* Meta grid */}
          <div className="member-task-meta-grid">
            <div className="member-task-meta-item">
              <span className="member-task-detail-label">Priority</span>
              <span className={`member-priority-badge ${PRIORITY_CLASSES[task.priority] || ''}`}>
                {task.priority}
              </span>
            </div>

            <div className="member-task-meta-item">
              <span className="member-task-detail-label">Assignee</span>
              <div className="member-task-assignee-display">
                <span className="member-assignee-avatar-sm">{member ? member.name.charAt(0).toUpperCase() : '?'}</span>
                <span>{member ? member.name : 'Unassigned'}</span>
                {member && <span className="member-assignee-email">{member.email}</span>}
              </div>
            </div>

            <div className="member-task-meta-item">
              <span className="member-task-detail-label">Due Date</span>
              <div className="member-task-detail-due">
                <IconCalendar />
                <span>{dueDateStr}</span>
              </div>
            </div>

            <div className="member-task-meta-item">
              <span className="member-task-detail-label">Status</span>
              <span className={`member-task-status-badge ${STATUS_CLASSES[task.status] || ''}`}>
                {task.status}
              </span>
            </div>

            {board && (
              <div className="member-task-meta-item member-task-meta-full">
                <span className="member-task-detail-label">Board</span>
                <span className="member-task-board-name">{board.name}</span>
              </div>
            )}
          </div>

          {/* Comments */}
          <MemberTaskComments task={task} />
        </div>
      </div>
    </div>
  );
}
