import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import TeamMemberCard from '../../components/admin/TeamMemberCard';
import AddMemberForm from '../../components/admin/AddMemberForm';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import './AdminTeamMembersPage.css';

const ROLES = ['Admin', 'Member'];

/**
 * AdminTeamMembersPage — View, add, edit role, and remove team members.
 */
export default function AdminTeamMembersPage() {
  const { members, addMember, updateMemberRole, removeMember } = useAdmin();

  const [memberToRemove,  setMemberToRemove]  = useState(null);
  const [editingMember,   setEditingMember]   = useState(null);
  const [editRole,        setEditRole]        = useState('');

  const memberToRemoveObj = memberToRemove ? members.find(m => m.id === memberToRemove) : null;

  const handleEdit = (member) => {
    setEditingMember(member);
    setEditRole(member.role);
  };

  const handleSaveRole = () => {
    if (editingMember) updateMemberRole(editingMember.id, editRole);
    setEditingMember(null);
  };

  return (
    <div className="team-page">
      {/* Header */}
      <div className="page-header" style={{ padding: '24px 24px 0' }}>
        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="page-subtitle">Manage your team members.</p>
        </div>
      </div>

      {/* Add Member form */}
      <div className="team-add-section">
        <AddMemberForm onAdd={addMember} />
      </div>

      {/* Members table */}
      <div className="team-table-card">
        {/* Table header */}
        <div className="team-table-header">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        {/* Member rows */}
        {members.length === 0 ? (
          <div className="team-empty">
            <p>No team members yet. Add one above.</p>
          </div>
        ) : (
          members.map(member => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onRemove={setMemberToRemove}
            />
          ))
        )}
      </div>

      {/* Edit Role Modal */}
      {editingMember && (
        <div className="modal-backdrop" onClick={() => setEditingMember(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: 360 }}
          >
            <div className="modal-header">
              <h3 className="modal-title">Edit Role — {editingMember.name}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setEditingMember(null)}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="modal-form">
              <div className="modal-field">
                <label htmlFor="edit-role-select" className="modal-label">Role</label>
                <select
                  id="edit-role-select"
                  className="modal-select"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button className="modal-btn-cancel" onClick={() => setEditingMember(null)} type="button">Cancel</button>
                <button className="modal-btn-primary" onClick={handleSaveRole} type="button">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      <ConfirmationDialog
        isOpen={!!memberToRemove}
        title="Remove Member?"
        message={`Are you sure you want to remove "${memberToRemoveObj?.name}" from the team?`}
        confirmLabel="Remove"
        onConfirm={() => { removeMember(memberToRemove); setMemberToRemove(null); }}
        onCancel={() => setMemberToRemove(null)}
      />
    </div>
  );
}
