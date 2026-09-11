import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './RoleSelection.css';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    sessionStorage.setItem('fizz_role', role);
    localStorage.setItem('fizz_role', role);

    if (role === 'admin') {
      navigate('/admin/boards');
    } else {
      navigate('/member/join-board');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('fizz_role');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('fizz_role');
    navigate('/login');
  };

  return (
    <div className="role-selection-wrapper">
      <div className="pixel-grid-bg" />

      {/* Ambient Illumination */}
      <div className="role-ambient-glow glow-top-left" />
      <div className="role-ambient-glow glow-bottom-right" />

      {/* Header */}
      <header className="role-header">
        <div className="role-brand">
          <img src={logo} alt="FIZZ-CONNECT" className="role-logo" />
          <div className="role-brand-text">
            <span className="brand-fizz">FIZZ-</span>
            <span className="brand-connect">CONNECT</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="role-logout-btn"
          id="role-logout-button"
        >
          <span>Log out</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main Container */}
      <main className="role-main-container">
        <div className="role-heading-group">
          <div className="role-badge font-pixel">WORKSPACE ACCESS</div>
          <h1 className="role-title">Choose Your Workspace Role</h1>
          <p className="role-subtitle">
            Select your mode of operation to proceed to your specialized dashboard.
          </p>
        </div>

        <div className="role-cards-grid">
          {/* Admin Role Card */}
          <div
            className="role-card admin-card"
            id="role-card-admin"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('admin')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('admin'); }}
          >
            <div className="role-card-glow-overlay" />
            
            <div className="role-card-icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>

            <div className="role-card-tag font-pixel">MANAGEMENT</div>

            <h2 className="role-card-title">ADMIN</h2>
            <p className="role-card-desc">
              Create and manage project boards
            </p>

            <ul className="role-perks-list">
              <li>
                <span className="perk-bullet">►</span>
                <span>Full board creation & management</span>
              </li>
              <li>
                <span className="perk-bullet">►</span>
                <span>Generate 5-character board codes for team</span>
              </li>
              <li>
                <span className="perk-bullet">►</span>
                <span>Assign tasks & track activity logs</span>
              </li>
            </ul>

            <button
              type="button"
              className="role-action-btn admin-btn"
              id="select-admin-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRole('admin');
              }}
            >
              <span>Enter as Admin</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Member Role Card */}
          <div
            className="role-card member-card"
            id="role-card-member"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('member')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('member'); }}
          >
            <div className="role-card-glow-overlay" />

            <div className="role-card-icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <div className="role-card-tag font-pixel">COLLABORATION</div>

            <h2 className="role-card-title">MEMBER</h2>
            <p className="role-card-desc">
              Join a project board and collaborate with your team
            </p>

            <ul className="role-perks-list">
              <li>
                <span className="perk-bullet">►</span>
                <span>Join active boards via shared board code</span>
              </li>
              <li>
                <span className="perk-bullet">►</span>
                <span>View and manage assigned Kanban tasks</span>
              </li>
              <li>
                <span className="perk-bullet">►</span>
                <span>Collaborate via team chatbot & comments</span>
              </li>
            </ul>

            <button
              type="button"
              className="role-action-btn member-btn"
              id="select-member-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRole('member');
              }}
            >
              <span>Enter as Member</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="role-footer">
        <span>FIZZ-CONNECT CORE ARCHITECTURE</span>
        <span>•</span>
        <span>DEEP ROYAL BLUE EDITION</span>
      </footer>
    </div>
  );
}
