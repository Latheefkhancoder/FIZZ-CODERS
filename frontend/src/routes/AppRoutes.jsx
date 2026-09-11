import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';
import VerifyEmail from '../pages/VerifyEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ResetSuccess from '../pages/ResetSuccess';
import RoleSelection from '../pages/RoleSelection';

/* ── Admin Dashboard ── */
import { AdminProvider } from '../context/AdminContext';
import AdminLayout from '../layouts/AdminLayout';
import AdminBoardsPage       from '../pages/admin/AdminBoardsPage';
import AdminMyTasksPage      from '../pages/admin/AdminMyTasksPage';
import AdminTeamMembersPage  from '../pages/admin/AdminTeamMembersPage';
import AdminActivityLogsPage from '../pages/admin/AdminActivityLogsPage';
import AdminTeamChatbotPage  from '../pages/admin/AdminTeamChatbotPage';
import AdminProfilePage      from '../pages/admin/AdminProfilePage';

/* ── Member Dashboard ── */
import { MemberProvider } from '../context/MemberContext';
import MemberLayout from '../layouts/MemberLayout';
import MemberJoinBoard       from '../pages/member/MemberJoinBoard';
import MemberMyTasksPage      from '../pages/member/MemberMyTasksPage';
import MemberTeamMembersPage  from '../pages/member/MemberTeamMembersPage';
import MemberActivityLogsPage from '../pages/member/MemberActivityLogsPage';
import MemberTeamChatbotPage  from '../pages/member/MemberTeamChatbotPage';
import MemberProfilePage      from '../pages/member/MemberProfilePage';

/**
 * AppRoutes - Configures all authentication routes, Role Selection, Admin Dashboard, and Member Dashboard.
 * Existing auth routes and dashboard functionality are preserved.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = sessionStorage.getItem('fizz_role') || localStorage.getItem('fizz_role');
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');

  if (!token && !role) {
    return <Navigate to="/login" replace />;
  }
  if (!role) {
    return <Navigate to="/select-role" replace />;
  }
  if (allowedRole && role !== allowedRole && role !== 'admin') {
    return <Navigate to={role === 'member' ? '/member' : '/login'} replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Role Selection Page */}
      <Route path="/select-role" element={<RoleSelection />} />

      {/* Member Join Board Page */}
      <Route
        path="/member/join-board"
        element={
          <AdminProvider>
            <MemberJoinBoard />
          </AdminProvider>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminProvider>
              <AdminLayout />
            </AdminProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/boards" replace />} />
        <Route path="boards"         element={<AdminBoardsPage />} />
        <Route path="my-tasks"       element={<AdminMyTasksPage />} />
        <Route path="team-members"   element={<AdminTeamMembersPage />} />
        <Route path="activity-logs"  element={<AdminActivityLogsPage />} />
        <Route path="chatbot"        element={<AdminTeamChatbotPage />} />
        <Route path="profile"        element={<AdminProfilePage />} />
      </Route>

      {/* Member Dashboard */}
      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRole="member">
            <AdminProvider>
              <MemberProvider>
                <MemberLayout />
              </MemberProvider>
            </AdminProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/member/my-tasks" replace />} />
        <Route path="my-tasks"       element={<MemberMyTasksPage />} />
        <Route path="team-members"   element={<MemberTeamMembersPage />} />
        <Route path="activity-logs"  element={<MemberActivityLogsPage />} />
        <Route path="chatbot"        element={<MemberTeamChatbotPage />} />
        <Route path="profile"        element={<MemberProfilePage />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
