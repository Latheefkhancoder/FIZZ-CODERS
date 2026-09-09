import React from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberTeamMembersPage.css';

/**
 * MemberTeamMembersPage — View-only team members list.
 */
export default function MemberTeamMembersPage() {
  const { members } = useMember();

  return (
    <div className="member-team-page">
      {/* Header */}
      <div className="member-page-header">
        <div>
          <h1 className="member-page-title">Team Members</h1>
          <p className="member-page-subtitle">View your workspace colleagues.</p>
        </div>
      </div>

      {/* Members table */}
      <div className="member-team-content">
        <div className="member-team-table-card">
          {/* Table header */}
          <div className="member-team-table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>

          {/* Member rows */}
          {members.length === 0 ? (
            <div className="member-team-empty">
              <p>No team members found.</p>
            </div>
          ) : (
            members.map(member => (
              <div key={member.id} className="member-team-row">
                <div className="member-team-cell-name">
                  <div className="member-team-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="member-team-name-text">{member.name}</span>
                </div>
                <div className="member-team-cell">
                  <span className="member-team-email">{member.email}</span>
                </div>
                <div className="member-team-cell">
                  <span className={`member-role-badge ${member.role === 'Admin' ? 'member-role-admin' : 'member-role-regular'}`}>
                    {member.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
