import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ResetSuccess from '../pages/ResetSuccess';

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
import MemberMyTasksPage      from '../pages/member/MemberMyTasksPage';
import MemberTeamMembersPage  from '../pages/member/MemberTeamMembersPage';
import MemberActivityLogsPage from '../pages/member/MemberActivityLogsPage';
import MemberTeamChatbotPage  from '../pages/member/MemberTeamChatbotPage';
import MemberProfilePage      from '../pages/member/MemberProfilePage';

/**
 * AppRoutes - Configures all authentication routes, Admin Dashboard, and Member Dashboard.
 * Existing auth routes are completely unchanged.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = sessionStorage.getItem('fizz_role');
  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Pages — UNCHANGED */}
      <Route path="/login"            element={<Login />} />
      <Route path="/create-account"   element={<CreateAccount />} />
      <Route path="/forgot-password"  element={<ForgotPassword />} />
      <Route path="/reset-password"   element={<ResetPassword />} />
      <Route path="/reset-success"    element={<ResetSuccess />} />

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

