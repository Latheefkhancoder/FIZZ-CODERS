import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAdmin } from '../context/AdminContext';
import './AdminLayout.css';

/* ── SVG Icons ── */
const IconBoards   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconMyTasks  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const IconTeam     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const IconActivity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconChatbot  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconProfile  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMenu     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const NAV_ITEMS = [
  { to: '/admin/boards',         label: 'Boards',        Icon: IconBoards   },
  { to: '/admin/my-tasks',       label: 'My Tasks',      Icon: IconMyTasks  },
  { to: '/admin/team-members',   label: 'Team Members',  Icon: IconTeam     },
  { to: '/admin/activity-logs',  label: 'Activity Logs', Icon: IconActivity },
  { to: '/admin/chatbot',        label: 'Team Chatbot',  Icon: IconChatbot  },
  { to: '/admin/profile',        label: 'Profile',       Icon: IconProfile  },
];

export default function AdminLayout() {
  const { profile } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('fizz_role');
    navigate('/login');
  };

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="admin-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <img src={logo} alt="FIZZ-CONNECT" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <span className="brand-fizz">FIZZ-</span>
            <span className="brand-connect">CONNECT</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'nav-item-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom tagline */}
        <div className="sidebar-footer">
          <p className="sidebar-tagline font-pixel">
            Plan.<br />Collaborate.<br />Achieve Together.
          </p>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="admin-main-col">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <IconMenu />
            </button>
            {/* Inline brand (visible when sidebar hidden on mobile) */}
            <div className="topbar-brand-inline">
              <img src={logo} alt="FIZZ-CONNECT" className="topbar-logo" />
              <span className="topbar-brand-name">
                <span className="brand-fizz">FIZZ-</span>
                <span className="brand-connect">CONNECT</span>
              </span>
            </div>
          </div>

          <div className="topbar-right" style={{ position: 'relative' }}>
            <button
              className="topbar-avatar"
              aria-label="Profile"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title="Profile"
            >
              {initials}
            </button>
            <span className="topbar-username">Admin</span>

            {profileMenuOpen && (
              <div className="profile-dropdown-menu">
                <button 
                  className="profile-dropdown-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/admin/profile');
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
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
