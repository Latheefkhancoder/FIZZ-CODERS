import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { boardService } from '../services/board.service';
import { taskService } from '../services/task.service';
import { memberService } from '../services/member.service';
import { commentService } from '../services/comment.service';
import { activityService } from '../services/activity.service';
import { chatService } from '../services/chat.service';
import { profileService } from '../services/profile.service';
import { getAuthToken } from '../services/api';

/* ================================================================
   FIZZ-CONNECT — AdminContext
   Central state for Admin Dashboard backed by Express & Firestore.
   Zero mock/seed data.
   ================================================================ */

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(() => {
    return sessionStorage.getItem('fizz_active_board_id') || '';
  });
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [chat, setChat] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Admin',
    bio: '',
    initials: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reference to track active board in callbacks without stale closures
  const activeBoardRef = useRef(activeBoardId);
  useEffect(() => {
    activeBoardRef.current = activeBoardId;
  }, [activeBoardId]);

  // ── Profile ────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const data = await profileService.getProfile();
      if (data) {
        setProfile({
          id: data.id,
          name: data.name || 'Admin',
          email: data.email || '',
          role: data.role || 'Admin',
          bio: data.bio || '',
          initials: data.initials || (data.name ? data.name[0].toUpperCase() : 'A'),
        });
      }
      return data;
    } catch (err) {
      console.warn('Could not fetch user profile:', err.message);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await profileService.updateProfile(updates);
    if (updated) {
      setProfile(prev => ({
        ...prev,
        ...updated,
        initials: updated.name ? updated.name[0].toUpperCase() : prev.initials,
      }));
    }
    return updated;
  }, []);

  // ── Boards ─────────────────────────────────────────────────────
  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getUserBoards();
      setBoards(data);

      // If activeBoardId is not set or invalid, select the first board
      const storedActiveId = sessionStorage.getItem('fizz_active_board_id');
      const validStored = data.some(b => b.id === storedActiveId);

      if (validStored) {
        setActiveBoardId(storedActiveId);
      } else if (data.length > 0) {
        setActiveBoardId(data[0].id);
        sessionStorage.setItem('fizz_active_board_id', data[0].id);
      } else {
        setActiveBoardId('');
        sessionStorage.removeItem('fizz_active_board_id');
      }

      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const selectBoard = useCallback((boardId) => {
    setActiveBoardId(boardId);
    if (boardId) {
      sessionStorage.setItem('fizz_active_board_id', boardId);
    } else {
      sessionStorage.removeItem('fizz_active_board_id');
    }
  }, []);

  const createBoard = useCallback(async (name, code) => {
    const board = await boardService.createBoard({ name, code });
    setBoards(prev => [board, ...prev]);
    selectBoard(board.id);
    return board;
  }, [selectBoard]);

  const deleteBoard = useCallback(async (boardId) => {
    await boardService.deleteBoard(boardId);
    setBoards(prev => prev.filter(b => b.id !== boardId));
    setTasks(prev => prev.filter(t => t.boardId !== boardId));

    if (activeBoardRef.current === boardId) {
      setBoards(remaining => {
        const nextBoard = remaining.find(b => b.id !== boardId);
        const nextId = nextBoard ? nextBoard.id : '';
        selectBoard(nextId);
        return remaining;
      });
    }
  }, [selectBoard]);

  // ── Tasks ──────────────────────────────────────────────────────
  const fetchBoardTasks = useCallback(async (boardId) => {
    const targetBoardId = boardId || activeBoardRef.current;
    if (!targetBoardId) {
      setTasks([]);
      return [];
    }
    try {
      const data = await taskService.getBoardTasks(targetBoardId);
      setTasks(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch tasks for board:', targetBoardId, err.message);
      return [];
    }
  }, []);

  const createTask = useCallback(async (boardId, taskData) => {
    const targetBoardId = boardId || activeBoardRef.current;
    const task = await taskService.createTask(targetBoardId, taskData);
    setTasks(prev => [...prev, task]);
    // Refresh activity logs for this board
    if (targetBoardId) {
      activityService.getActivityLogs(targetBoardId).then(setLogs).catch(() => {});
    }
    return task;
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    const updated = await taskService.updateTask(taskId, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    return updated;
  }, []);

  const moveTask = useCallback(async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      const updated = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      // Refresh activity logs
      if (updated.boardId) {
        activityService.getActivityLogs(updated.boardId).then(setLogs).catch(() => {});
      }
      return updated;
    } catch (err) {
      // Revert if error
      fetchBoardTasks(activeBoardRef.current);
      throw err;
    }
  }, [fetchBoardTasks]);

  const deleteTask = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    await taskService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (task && task.boardId) {
      activityService.getActivityLogs(task.boardId).then(setLogs).catch(() => {});
    }
  }, [tasks]);

  const getBoardTasks = useCallback((boardId) => {
    return tasks.filter(t => t.boardId === boardId);
  }, [tasks]);

  const getMyTasks = useCallback(async () => {
    return taskService.getMyTasks();
  }, []);

  // ── Comments ───────────────────────────────────────────────────
  const addComment = useCallback(async (taskId, text) => {
    const comment = await commentService.addComment(taskId, text);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const existing = Array.isArray(t.comments) ? t.comments : [];
        return { ...t, comments: [...existing, comment] };
      }
      return t;
    }));
    return comment;
  }, []);

  // ── Members ────────────────────────────────────────────────────
  const fetchMembers = useCallback(async (boardId) => {
    const targetBoardId = boardId || activeBoardRef.current;
    if (!targetBoardId) {
      setMembers([]);
      return [];
    }
    try {
      const data = await memberService.getBoardMembers(targetBoardId);
      setMembers(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch members for board:', targetBoardId, err.message);
      return [];
    }
  }, []);

  const addMember = useCallback(async (arg1, arg2, arg3) => {
    // Overloaded to support addMember(email, role) using active board, or addMember(boardId, email, role)
    let targetBoardId, email, role;
    if (arg3 !== undefined) {
      targetBoardId = arg1;
      email = arg2;
      role = arg3;
    } else {
      targetBoardId = activeBoardRef.current;
      email = arg1;
      role = arg2 || 'Member';
    }

    if (!targetBoardId) {
      throw new Error('Please select a board before adding members.');
    }

    const member = await memberService.addMember(targetBoardId, { email, role });
    setMembers(prev => [...prev, member]);
    activityService.getActivityLogs(targetBoardId).then(setLogs).catch(() => {});
    return member;
  }, []);

  const updateMemberRole = useCallback(async (arg1, arg2, arg3) => {
    let targetBoardId, targetUserId, newRole;
    if (arg3 !== undefined) {
      targetBoardId = arg1;
      targetUserId = arg2;
      newRole = arg3;
    } else {
      targetBoardId = activeBoardRef.current;
      targetUserId = arg1;
      newRole = arg2;
    }

    // Resolve userId if a member record ID was passed
    const memberRecord = members.find(m => m.id === targetUserId || m.userId === targetUserId);
    const resolvedUserId = memberRecord ? (memberRecord.userId || memberRecord.id) : targetUserId;

    const updated = await memberService.updateMemberRole(targetBoardId, resolvedUserId, newRole);
    setMembers(prev => prev.map(m => (m.userId === resolvedUserId || m.id === targetUserId) ? { ...m, role: newRole } : m));
    return updated;
  }, [members]);

  const removeMember = useCallback(async (arg1, arg2) => {
    let targetBoardId, targetUserId;
    if (arg2 !== undefined) {
      targetBoardId = arg1;
      targetUserId = arg2;
    } else {
      targetBoardId = activeBoardRef.current;
      targetUserId = arg1;
    }

    // Resolve userId if member ID was passed
    const memberRecord = members.find(m => m.id === targetUserId || m.userId === targetUserId);
    const resolvedUserId = memberRecord ? (memberRecord.userId || memberRecord.id) : targetUserId;

    await memberService.removeMember(targetBoardId, resolvedUserId);
    setMembers(prev => prev.filter(m => m.userId !== resolvedUserId && m.id !== targetUserId));
    activityService.getActivityLogs(targetBoardId).then(setLogs).catch(() => {});
  }, [members]);

  const getMemberById = useCallback((id) => {
    return members.find(m => m.userId === id || m.id === id);
  }, [members]);

  // ── Activity Logs ──────────────────────────────────────────────
  const fetchActivityLogs = useCallback(async (boardId) => {
    const targetBoardId = boardId || activeBoardRef.current;
    if (!targetBoardId) {
      setLogs([]);
      return [];
    }
    try {
      const data = await activityService.getActivityLogs(targetBoardId);
      setLogs(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch activity logs:', err.message);
      return [];
    }
  }, []);

  const addLog = useCallback((who, what) => {
    // Local optimistic log display if needed
    setLogs(prev => [{
      id: `local_${Date.now()}`,
      who,
      what,
      when: new Date().toISOString(),
    }, ...prev]);
  }, []);

  // ── Chat ───────────────────────────────────────────────────────
  const fetchChat = useCallback(async (boardId) => {
    const targetBoardId = boardId || activeBoardRef.current;
    if (!targetBoardId) {
      setChat([]);
      return [];
    }
    try {
      const data = await chatService.getChatMessages(targetBoardId);
      setChat(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch chat messages:', err.message);
      return [];
    }
  }, []);

  const sendChatMessage = useCallback(async (text) => {
    const targetBoardId = activeBoardRef.current;
    if (!targetBoardId) {
      throw new Error('Please select a board before sending chat messages.');
    }
    const msg = await chatService.sendMessage(targetBoardId, text);
    setChat(prev => [...prev, msg]);
    return msg;
  }, []);

  const sendChatMessageAs = useCallback(async (_authorName, text) => {
    return sendChatMessage(text);
  }, [sendChatMessage]);

  // ── Selectors ──────────────────────────────────────────────────
  const getBoardById = useCallback((id) => {
    return boards.find(b => b.id === id) || null;
  }, [boards]);

  const getBoardByCode = useCallback(async (code) => {
    if (!code) return null;
    try {
      return await boardService.getBoardByCode(code);
    } catch {
      return null;
    }
  }, []);

  // ── Initial Load & Synchronization ─────────────────────────────
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Load profile and boards
    fetchProfile();
    fetchBoards();
  }, [fetchProfile, fetchBoards]);

  // When activeBoardId changes, synchronize tasks, members, logs, chat
  useEffect(() => {
    if (!activeBoardId) {
      setTasks([]);
      setMembers([]);
      setLogs([]);
      setChat([]);
      return;
    }

    fetchBoardTasks(activeBoardId);
    fetchMembers(activeBoardId);
    fetchActivityLogs(activeBoardId);
    fetchChat(activeBoardId);
  }, [activeBoardId, fetchBoardTasks, fetchMembers, fetchActivityLogs, fetchChat]);

  const value = {
    // State
    boards,
    activeBoardId,
    tasks,
    members,
    logs,
    chat,
    profile,
    loading,
    error,
    // Board actions
    fetchBoards,
    selectBoard,
    createBoard,
    deleteBoard,
    getBoardById,
    getBoardByCode,
    // Task actions
    fetchBoardTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    getBoardTasks,
    getMyTasks,
    // Comment actions
    addComment,
    // Member actions
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    getMemberById,
    // Activity actions
    fetchActivityLogs,
    addLog,
    // Chat actions
    fetchChat,
    sendChatMessage,
    sendChatMessageAs,
    // Profile actions
    fetchProfile,
    updateProfile,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within <AdminProvider>');
  return ctx;
}
