import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useMember } from '../context/MemberContext';
import './MemberLayout.css';

/* ── SVG Icons ── */
const IconMyTasks  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const IconTeam     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const IconActivity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconChatbot  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconProfile  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMenu     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const MEMBER_NAV = [
  { to: '/member/my-tasks',      label: 'My Tasks',      Icon: IconMyTasks  },
  { to: '/member/team-members',  label: 'Team Members',  Icon: IconTeam     },
  { to: '/member/activity-logs', label: 'Activity Logs', Icon: IconActivity },
  { to: '/member/chatbot',       label: 'Team Chatbot',  Icon: IconChatbot  },
  { to: '/member/profile',       label: 'Profile',       Icon: IconProfile  },
];

export default function MemberLayout() {
  const { profile } = useMember();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('fizz_role');
    navigate('/login');
  };

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : 'M';

  return (
    <div className="member-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="member-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`member-sidebar ${sidebarOpen ? 'member-sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="member-sidebar-brand">
          <img src={logo} alt="FIZZ-CONNECT" className="member-sidebar-logo" />
          <div className="member-sidebar-brand-text">
            <span className="member-brand-fizz">FIZZ-</span>
            <span className="member-brand-connect">CONNECT</span>
          </div>
          <button
            className="member-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        {/* Role badge */}
        <div className="member-role-indicator">
          <span className="member-role-dot" />
          <span className="member-role-label">Member View</span>
        </div>

        {/* Nav */}
        <nav className="member-sidebar-nav">
          {MEMBER_NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `member-nav-item ${isActive ? 'member-nav-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="member-nav-icon"><Icon /></span>
              <span className="member-nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer tagline */}
        <div className="member-sidebar-footer">
          <p className="member-sidebar-tagline font-pixel">
            Plan.<br />Collaborate.<br />Achieve Together.
          </p>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="member-main-col">
        {/* Top Bar */}
        <header className="member-topbar">
          <div className="member-topbar-left">
            <button
              className="member-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <IconMenu />
            </button>
            <div className="member-topbar-brand-inline">
              <img src={logo} alt="FIZZ-CONNECT" className="member-topbar-logo" />
              <span className="member-topbar-brand-name">
                <span className="member-brand-fizz">FIZZ-</span>
                <span className="member-brand-connect">CONNECT</span>
              </span>
            </div>
          </div>

          <div className="member-topbar-right" style={{ position: 'relative' }}>
            <button
              className="member-topbar-avatar"
              aria-label="Profile"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title={profile.name}
            >
              {initials}
            </button>
            <span className="member-topbar-username">{profile.name}</span>
            <span className="member-topbar-role-chip">Member</span>

            {profileMenuOpen && (
              <div className="profile-dropdown-menu">
                <button 
                  className="profile-dropdown-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/member/profile');
                  }}
                >
                  My Profile
                </button>
                <button 
                  className="profile-dropdown-item text-red"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="member-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
