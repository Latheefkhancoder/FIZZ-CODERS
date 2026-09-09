import React, { useState } from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberProfilePage.css';

/**
 * MemberProfilePage — Allows member to update their own bio, name, email.
 */
export default function MemberProfilePage() {
  const { profile, updateMyProfile } = useMember();
  
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || ''
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateMyProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : 'M';

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
              <h2>{profile.name}</h2>
              <span className="member-profile-role-badge">{profile.role}</span>
            </div>
          </div>

          <form className="member-profile-form" onSubmit={handleSave}>
            <div className="member-form-group">
              <label htmlFor="name">Full Name</label>
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
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              <button type="submit" className="member-btn-primary">
                Save Changes
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
