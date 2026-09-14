import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAdmin } from './AdminContext';
import { taskService } from '../services/task.service';
import { commentService } from '../services/comment.service';
import { chatService } from '../services/chat.service';
import { profileService } from '../services/profile.service';
import { memberService } from '../services/member.service';
import { activityService } from '../services/activity.service';

/* ================================================================
   FIZZ-CONNECT — MemberContext
   Scoped member workspace backed by real Express + Firestore APIs.
   Zero mock/seed data. Real authenticated user ID.
   ================================================================ */

const MemberContext = createContext(null);

export function MemberProvider({ children }) {
  const admin = useAdmin();

  const [myTasks, setMyTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [profile, setProfile] = useState(admin.profile || {
    id: '',
    name: 'Member',
    email: '',
    role: 'Member',
    bio: '',
    initials: 'M',
  });

  // Current active board for the member
  const [currentBoardId, setCurrentBoardId] = useState(() => {
    return sessionStorage.getItem('fizz_current_board_id') || admin.activeBoardId || '';
  });

  // Board-scoped data for member view
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardLogs, setBoardLogs] = useState([]);
  const [boardChat, setBoardChat] = useState([]);

  // Sync profile when admin.profile changes
  useEffect(() => {
    if (admin.profile && admin.profile.id) {
      setProfile(admin.profile);
    }
  }, [admin.profile]);

  // Load member's real profile if not already loaded
  useEffect(() => {
    profileService.getProfile()
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => {
        console.warn('Could not load member profile:', err.message);
      });
  }, []);

  // Determine active board ID
  useEffect(() => {
    if (!currentBoardId && admin.boards.length > 0) {
      const firstId = admin.boards[0].id;
      setCurrentBoardId(firstId);
      sessionStorage.setItem('fizz_current_board_id', firstId);
    }
  }, [currentBoardId, admin.boards]);

  // ── Fetch My Tasks ─────────────────────────────────────────────
  const fetchMyTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const data = await taskService.getMyTasks();
      setMyTasks(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch assigned tasks for member:', err.message);
      return [];
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  // ── Board-scoped data for member ───────────────────────────────
  const fetchBoardData = useCallback(async (boardId) => {
    if (!boardId) return;
    try {
      const [membersData, logsData, chatData] = await Promise.all([
        memberService.getBoardMembers(boardId).catch(() => []),
        activityService.getActivityLogs(boardId).catch(() => []),
        chatService.getChatMessages(boardId).catch(() => []),
      ]);
      setBoardMembers(membersData);
      setBoardLogs(logsData);
      setBoardChat(chatData);
    } catch (err) {
      console.warn('Error fetching board data for member:', err.message);
    }
  }, []);

  useEffect(() => {
    if (currentBoardId) {
      fetchBoardData(currentBoardId);
    }
  }, [currentBoardId, fetchBoardData]);

  // ── Member Actions ─────────────────────────────────────────────
  const moveMyTask = useCallback(async (taskId, newStatus) => {
    // Optimistic UI update
    setMyTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      const updated = await taskService.updateTaskStatus(taskId, newStatus);
      setMyTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      if (currentBoardId) {
        activityService.getActivityLogs(currentBoardId).then(setBoardLogs).catch(() => {});
      }
      return updated;
    } catch (err) {
      fetchMyTasks();
      throw err;
    }
  }, [currentBoardId, fetchMyTasks]);

  const addMyComment = useCallback(async (taskId, text) => {
    const comment = await commentService.addComment(taskId, text);
    setMyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const existing = Array.isArray(t.comments) ? t.comments : [];
        return { ...t, comments: [...existing, comment] };
      }
      return t;
    }));
    return comment;
  }, []);

  const sendMyChatMessage = useCallback(async (text) => {
    const targetBoardId = currentBoardId || admin.activeBoardId;
    if (!targetBoardId) {
      throw new Error('Please join or select a board before sending chat messages.');
    }
    const msg = await chatService.sendMessage(targetBoardId, text);
    setBoardChat(prev => [...prev, msg]);
    return msg;
  }, [currentBoardId, admin.activeBoardId]);

  const updateMyProfile = useCallback(async (updates) => {
    const updated = await profileService.updateProfile(updates);
    if (updated) {
      setProfile(prev => ({
        ...prev,
        ...updated,
        initials: updated.name ? updated.name[0].toUpperCase() : prev.initials,
      }));
      admin.fetchProfile();
    }
    return updated;
  }, [admin]);

  const selectCurrentBoard = useCallback((boardId) => {
    setCurrentBoardId(boardId);
    if (boardId) {
      sessionStorage.setItem('fizz_current_board_id', boardId);
    } else {
      sessionStorage.removeItem('fizz_current_board_id');
    }
  }, []);

  const value = {
    // Member identity
    profile,
    memberId: profile.id,

    // Real API workspace state
    tasks: myTasks,
    members: boardMembers.length > 0 ? boardMembers : admin.members,
    boards: admin.boards,
    logs: boardLogs.length > 0 ? boardLogs : admin.logs,
    chat: boardChat.length > 0 ? boardChat : admin.chat,
    currentBoardId,
    loadingTasks,

    // Member-scoped actions
    getMyTasks: () => myTasks,
    fetchMyTasks,
    moveMyTask,
    addMyComment,
    sendMyChatMessage,
    updateMyProfile,
    selectCurrentBoard,

    // Helpers
    getMemberById: (id) => {
      const allMembers = boardMembers.length > 0 ? boardMembers : admin.members;
      return allMembers.find(m => m.userId === id || m.id === id);
    },
    getBoardById: admin.getBoardById,
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
