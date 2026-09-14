import React, { useState, useEffect } from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberProfilePage.css';

/**
 * MemberProfilePage — Allows member to update their own bio and name.
 */
export default function MemberProfilePage() {
  const { profile, updateMyProfile } = useMember();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    bio: profile?.bio || ''
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateMyProfile({
        name: formData.name.trim(),
        bio: formData.bio ? formData.bio.trim() : '',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'M';

  return (
    <div className="member-profile-page">
      <div className="member-page-header">
        <div>
          <h1 className="member-page-title">My Profile</h1>
          <p className="member-page-subtitle">Manage your personal information and bio.</p>
        </div>
      </div>

      <div className="member-profile-content">
        <div className="member-profile-card">
          
          <div className="member-profile-card-header">
            <div className="member-profile-avatar-large">
              {initials}
            </div>
            <div className="member-profile-header-text">
              <h2>{profile?.name}</h2>
              <span className="member-profile-role-badge">{profile?.role || 'Member'}</span>
            </div>
          </div>

          <form className="member-profile-form" onSubmit={handleSave}>
            {error && (
              <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div className="member-form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="member-form-group">
              <label htmlFor="email">Email Address (Account ID)</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                readOnly
                title="Email cannot be changed as it is your account identifier"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="member-form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell your team a little about yourself..."
              />
            </div>

            <div className="member-form-actions">
              {saved && <span className="member-save-success">Profile updated successfully!</span>}
              <button type="submit" className="member-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
