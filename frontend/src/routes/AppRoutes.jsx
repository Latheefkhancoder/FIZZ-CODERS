import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ResetSuccess from '../pages/ResetSuccess';

/**
 * AppRoutes - Configures all authentication routes for CollabBoard.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
