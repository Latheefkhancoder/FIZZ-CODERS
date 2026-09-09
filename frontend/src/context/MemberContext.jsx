import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAdmin } from './AdminContext';

/* ================================================================
   FIZZ-CONNECT — MemberContext
   Scoped member view on top of the shared AdminContext workspace.
   The CURRENT_MEMBER_ID represents the authenticated member.
   Replace with real auth user ID when backend is connected.
   ================================================================ */

const MemberContext = createContext(null);

// The currently logged-in member (Priya, m2).
// Replace with auth token payload when backend is integrated.
export const CURRENT_MEMBER_ID = 'm2';

export function MemberProvider({ children }) {
  const admin = useAdmin();

  // Local bio state (additive — not in AdminContext seed)
  const [bio, setBio] = useState('');
  // Local name/email overrides for the member profile
  const [profileOverride, setProfileOverride] = useState({});

  // ── Derived member profile ────────────────────────────────────
  const memberRecord = admin.members.find(m => m.id === CURRENT_MEMBER_ID) || {
    id: CURRENT_MEMBER_ID,
    name: 'Priya',
    email: 'priya@gmail.com',
    role: 'Member',
  };

  const profile = {
    ...memberRecord,
    ...profileOverride,
    bio,
  };

  // ── My Tasks selector ─────────────────────────────────────────
  const getMyTasks = useCallback(() =>
    admin.tasks.filter(t => t.assignee === CURRENT_MEMBER_ID),
  [admin.tasks]);

  // ── Move task (member can move their own assigned tasks) ──────
  const moveMyTask = useCallback((taskId, newStatus) => {
    const task = admin.tasks.find(t => t.id === taskId);
    if (!task) return;
    // Use AdminContext moveTask — it updates shared state
    admin.moveTask(taskId, newStatus);
  }, [admin]);

  // ── Add comment (shared thread, sent as member name) ──────────
  // AdminContext.addComment uses the admin profile.name.
  // We call addComment directly then patch author via updateTask.
  const addMyComment = useCallback((taskId, text) => {
    // Build the comment manually so author = member name
    const comment = {
      id: `mc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      taskId,
      author: profile.name,
      text,
      timestamp: new Date().toISOString(),
    };
    // Patch tasks state via AdminContext.updateTask (merges comments)
    const task = admin.tasks.find(t => t.id === taskId);
    if (!task) return;
    admin.updateTask(taskId, {
      comments: [...task.comments, comment],
    });
    return comment;
  }, [admin, profile.name]);

  // ── Send chat message (member name) ───────────────────────────
  // AdminContext.sendChatMessage uses admin profile.name.
  // We call addChatMessageDirect which we will expose in AdminContext.
  const sendMyChatMessage = useCallback((text) => {
    admin.sendChatMessageAs(profile.name, text);
  }, [admin, profile.name]);

  // ── Update member profile ─────────────────────────────────────
  const updateMyProfile = useCallback((updates) => {
    if (updates.bio !== undefined) setBio(updates.bio);
    if (updates.name !== undefined || updates.email !== undefined) {
      setProfileOverride(prev => ({
        ...prev,
        ...(updates.name  !== undefined && { name:  updates.name  }),
        ...(updates.email !== undefined && { email: updates.email }),
      }));
    }
  }, []);

  const value = {
    // Member identity
    profile,
    memberId: CURRENT_MEMBER_ID,

    // Shared workspace state (read access)
    tasks:   admin.tasks,
    members: admin.members,
    boards:  admin.boards,
    logs:    admin.logs,
    chat:    admin.chat,

    // Member-scoped actions
    getMyTasks,
    moveMyTask,
    addMyComment,
    sendMyChatMessage,
    updateMyProfile,

    // Helpers
    getMemberById: admin.getMemberById,
    getBoardById:  admin.getBoardById,
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used within <MemberProvider>');
  return ctx;
}
