import React from 'react';
import './TeamMemberCard.css';

const IconEdit  = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const ROLE_COLORS = {
  Admin:  'role-admin',
  Member: 'role-member',
};

/**
 * TeamMemberCard — Row in the team members table.
 * Props: member, onEdit, onRemove
 */
export default function TeamMemberCard({ member, onEdit, onRemove }) {
  const initials = member.name ? member.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="member-row">
      {/* Avatar + Name */}
      <div className="member-identity">
        <span className="member-avatar">{initials}</span>
        <span className="member-name">{member.name}</span>
      </div>

      {/* Email */}
      <span className="member-email">{member.email}</span>

      {/* Role */}
      <span className={`member-role-badge ${ROLE_COLORS[member.role] || 'role-member'}`}>
        {member.role}
      </span>

      {/* Actions */}
      <div className="member-actions">
        <button
          className="member-action-btn edit-btn"
          onClick={() => onEdit(member)}
          title="Edit role"
          aria-label={`Edit role of ${member.name}`}
          type="button"
        >
          <IconEdit />
        </button>
        <button
          className="member-action-btn remove-btn"
          onClick={() => onRemove(member.id)}
          title="Remove member"
          aria-label={`Remove ${member.name}`}
          type="button"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}
