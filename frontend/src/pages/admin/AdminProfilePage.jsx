import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './AdminProfilePage.css';

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

/**
 * AdminProfilePage — View and edit admin profile information.
 */
export default function AdminProfilePage() {
  const { profile, updateProfile } = useAdmin();

  const [isEditing,  setIsEditing]  = useState(false);
  const [form,       setForm]       = useState({ name: profile?.name || '', email: profile?.email || '', bio: profile?.bio || '' });
  const [saved,      setSaved]      = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : (profile?.email ? profile.email.charAt(0).toUpperCase() : 'A');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEdit = () => {
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
    });
    setErrors({});
    setSaved(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        bio: form.bio ? form.bio.trim() : '',
      });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header" style={{ padding: '24px 24px 0' }}>
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account information.</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-ring">
            <span className="profile-avatar-letter">{initials}</span>
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{profile?.name || 'Admin'}</h2>
            <p className="profile-email">{profile?.email || 'admin@fizz.com'}</p>
            {profile?.bio && <p className="profile-bio" style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile.bio}</p>}
            <span className="profile-role-badge" style={{ marginTop: '8px', display: 'inline-block' }}>
              {profile?.role || 'Admin'}
            </span>
          </div>

          {!isEditing && (
            <button className="btn-outline-aqua" onClick={handleEdit} type="button">
              <IconEdit />
              Edit Profile
            </button>
          )}
        </div>

        {/* Save success banner */}
        {saved && (
          <div className="profile-save-banner">
            ✓ Profile updated successfully!
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="profile-edit-card">
            <h3 className="edit-form-title">Edit Profile</h3>

            {errors.form && (
              <div style={{ color: '#f87171', marginBottom: '12px', fontSize: '0.875rem' }}>
                {errors.form}
              </div>
            )}

            <div className="edit-form-grid">
              {/* Full Name */}
              <div className="edit-form-field">
                <label htmlFor="profile-name-input" className="edit-form-label">Full Name *</label>
                <input
                  id="profile-name-input"
                  type="text"
                  className={`edit-form-input ${errors.name ? 'input-err' : ''}`}
                  value={form.name}
                  onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: null })); }}
                  placeholder="Your full name"
                  autoFocus
                />
                {errors.name && <span className="edit-form-error">{errors.name}</span>}
              </div>

              {/* Email (Read-only) */}
              <div className="edit-form-field">
                <label htmlFor="profile-email-input" className="edit-form-label">Email (Account ID)</label>
                <input
                  id="profile-email-input"
                  type="email"
                  className="edit-form-input"
                  value={form.email}
                  disabled
                  readOnly
                  title="Email cannot be changed as it is your account identifier"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              {/* Bio */}
              <div className="edit-form-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="profile-bio-input" className="edit-form-label">Bio</label>
                <textarea
                  id="profile-bio-input"
                  className="edit-form-input"
                  value={form.bio}
                  onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Write a short bio..."
                  rows={3}
                />
              </div>
            </div>

            <div className="edit-form-actions">
              <button className="btn-outline-aqua" onClick={handleCancel} type="button" disabled={saving}>Cancel</button>
              <button className="btn-primary-aqua" onClick={handleSave} type="button" disabled={saving}>
                <IconSave />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
