import React, { createContext, useContext, useState, useCallback } from 'react';

/* ================================================================
   FIZZ-CONNECT — AdminContext
   Central state for all Admin Dashboard data.
   Structured for easy future backend integration.
   ================================================================ */

const AdminContext = createContext(null);

// ── Seed Data ────────────────────────────────────────────────────

const SEED_MEMBERS = [
  { id: 'm1', name: 'Arun',  email: 'arun@gmail.com',  role: 'Admin'  },
  { id: 'm2', name: 'Priya', email: 'priya@gmail.com', role: 'Member' },
  { id: 'm3', name: 'Rahul', email: 'rahul@gmail.com', role: 'Member' },
  { id: 'm4', name: 'Kishor',email: 'kishor@gmail.com',role: 'Member' },
  { id: 'm5', name: 'Vijay', email: 'vijay@gmail.com', role: 'Member' },
];

const SEED_BOARDS = [
  { id: 'b1', name: 'Development Board', code: 'A7K2P', createdAt: '2025-09-01T10:00:00Z' },
];

const SEED_TASKS = [
  {
    id: 't1', boardId: 'b1',
    title: 'Design Login Page',
    description: 'Create a responsive login page with validation. Include error handling and modern UI.',
    priority: 'High', assignee: 'm2', dueDate: '2025-09-12', status: 'TODO',
    comments: [
      { id: 'c1', taskId: 't1', author: 'Arun',  text: 'Please make the login page responsive.',    timestamp: '2025-09-08T10:00:00Z' },
      { id: 'c2', taskId: 't1', author: 'Priya', text: 'Okay, I\'ll work on it.',                   timestamp: '2025-09-08T11:00:00Z' },
      { id: 'c3', taskId: 't1', author: 'Arun',  text: 'Make sure to include form validation.',     timestamp: '2025-09-08T15:37:00Z' },
    ],
  },
  {
    id: 't2', boardId: 'b1',
    title: 'Setup Project Structure',
    description: 'Initialize the repository and set up folder architecture.',
    priority: 'Medium', assignee: 'm3', dueDate: '2025-09-14', status: 'TODO',
    comments: [],
  },
  {
    id: 't3', boardId: 'b1',
    title: 'Write API Documentation',
    description: 'Document all API endpoints with examples.',
    priority: 'Low', assignee: 'm1', dueDate: '2025-09-28', status: 'TODO',
    comments: [],
  },
  {
    id: 't4', boardId: 'b1',
    title: 'Integrate Authentication',
    description: 'Connect login and register endpoints to the backend.',
    priority: 'High', assignee: 'm4', dueDate: '2025-09-10', status: 'IN PROGRESS',
    comments: [],
  },
  {
    id: 't5', boardId: 'b1',
    title: 'UI for Dashboard',
    description: 'Build the admin dashboard UI with all required panels.',
    priority: 'Medium', assignee: 'm3', dueDate: '2025-09-16', status: 'IN PROGRESS',
    comments: [],
  },
  {
    id: 't6', boardId: 'b1',
    title: 'Research Tech Stack',
    description: 'Evaluate and confirm final technology stack.',
    priority: 'Low', assignee: 'm5', dueDate: '2025-09-08', status: 'DONE',
    comments: [],
  },
];

const SEED_LOGS = [
  { id: 'l1', who: 'Arun',  what: 'created board "Development Board"',            when: '2025-09-05T08:05:00Z' },
  { id: 'l2', who: 'Arun',  what: 'created task "Design Login Page"',             when: '2025-09-05T09:10:00Z' },
  { id: 'l3', who: 'Priya', what: 'commented on "Design Login Page"',             when: '2025-09-05T11:20:00Z' },
  { id: 'l4', who: 'Arun',  what: 'assigned "Write API Documentation" to Priya',  when: '2025-09-05T09:30:00Z' },
  { id: 'l5', who: 'Priya', what: 'created task "Research Tech Stack"', when: '2025-09-05T10:00:00Z' },
  { id: 'l6', who: 'Kishor',what: 'moved "UI for Dashboard" from TODO to IN PROGRESS', when: '2025-09-08T04:22:00Z' },
  { id: 'l7', who: 'Rahul', what: 'deleted task "Old Task"',                      when: '2025-09-08T02:11:00Z' },
];

const SEED_CHAT = [
  { id: 'ch1', author: 'Arun',  text: 'Hey team! Let\'s keep all general discussions here 👋',  timestamp: '2025-09-08T10:00:00Z' },
  { id: 'ch2', author: 'Priya', text: 'Sounds good!',                                           timestamp: '2025-09-08T10:05:00Z' },
  { id: 'ch3', author: 'Kishor',text: 'Can we have a quick sync tomorrow?',                     timestamp: '2025-09-08T10:10:00Z' },
  { id: 'ch4', author: 'Rahul', text: 'Sure! I\'ll share the meeting link.',                    timestamp: '2025-09-08T10:20:00Z' },
  { id: 'ch5', author: 'Vijay', text: 'Great 🙌',                                               timestamp: '2025-09-08T10:22:00Z' },
];

const SEED_PROFILE = {
  name: 'Admin',
  email: 'admin@fizzconnect.com',
  role: 'Admin',
  initials: 'A',
};

// ── Counter helper ────────────────────────────────────────────────
let _idCounter = 100;
const uid = (prefix) => `${prefix}${++_idCounter}_${Date.now()}`;

// ── Provider ─────────────────────────────────────────────────────

export function AdminProvider({ children }) {
  const [boards, setBoards] = useState(() => {
    try {
      const stored = localStorage.getItem('fizz_boards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_BOARDS;
  });
  const [tasks,    setTasks]    = useState(SEED_TASKS);
  const [members,  setMembers]  = useState(SEED_MEMBERS);
  const [logs,     setLogs]     = useState(SEED_LOGS);
  const [chat,     setChat]     = useState(SEED_CHAT);
  const [profile,  setProfile]  = useState(SEED_PROFILE);

  // ── Log helper ─────────────────────────────────────────────────
  const addLog = useCallback((who, what) => {
    setLogs(prev => [{
      id: uid('l'), who, what, when: new Date().toISOString(),
    }, ...prev]);
  }, []);

  // ── Boards ─────────────────────────────────────────────────────
  const createBoard = useCallback((name, code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const board = {
      id: uid('b'),
      name: name.trim(),
      code: cleanCode,
      createdAt: new Date().toISOString()
    };
    setBoards(prev => {
      const next = [...prev, board];
      try {
        localStorage.setItem('fizz_boards', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    addLog(profile.name, `created board "${name}" (Code: ${cleanCode})`);
    return board;
  }, [addLog, profile.name]);

  const deleteBoard = useCallback((boardId) => {
    const board = boards.find(b => b.id === boardId);
    setBoards(prev => {
      const next = prev.filter(b => b.id !== boardId);
      try {
        localStorage.setItem('fizz_boards', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    setTasks(prev => prev.filter(t => t.boardId !== boardId));
    if (board) addLog(profile.name, `deleted board "${board.name}"`);
  }, [boards, addLog, profile.name]);

  // ── Tasks ──────────────────────────────────────────────────────
  const createTask = useCallback((boardId, taskData) => {
    const task = {
      id: uid('t'),
      boardId,
      ...taskData,
      status: 'TODO',
      comments: [],
    };
    setTasks(prev => [...prev, task]);
    addLog(profile.name, `created task "${taskData.title}"`);
    // Log assignment
    if (taskData.assignee) {
      const member = members.find(m => m.id === taskData.assignee);
      if (member) addLog(profile.name, `assigned "${taskData.title}" to ${member.name}`);
    }
    return task;
  }, [addLog, profile.name, members]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const moveTask = useCallback((taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    addLog(profile.name, `moved "${task.title}" to ${newStatus}`);
  }, [tasks, addLog, profile.name]);

  const deleteTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (task) addLog(profile.name, `deleted task "${task.title}"`);
  }, [tasks, addLog, profile.name]);

  // ── Comments ───────────────────────────────────────────────────
  const addComment = useCallback((taskId, text) => {
    const comment = {
      id: uid('c'),
      taskId,
      author: profile.name,
      text,
      timestamp: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, comments: [...t.comments, comment] }
        : t
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) addLog(profile.name, `commented on "${task.title}"`);
    return comment;
  }, [profile.name, tasks, addLog]);

  // ── Members ────────────────────────────────────────────────────
  const addMember = useCallback((email, role) => {
    const name = email.split('@')[0];
    const initials = name.charAt(0).toUpperCase();
    const member = { id: uid('m'), name, email, role, initials };
    setMembers(prev => [...prev, member]);
    addLog(profile.name, `added member "${email}" as ${role}`);
    return member;
  }, [addLog, profile.name]);

  const updateMemberRole = useCallback((memberId, role) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m));
  }, []);

  const removeMember = useCallback((memberId) => {
    const member = members.find(m => m.id === memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    if (member) addLog(profile.name, `removed member "${member.name}"`);
  }, [members, addLog, profile.name]);

  // ── Chat ───────────────────────────────────────────────────────
  const sendChatMessage = useCallback((text) => {
    const msg = {
      id: uid('ch'),
      author: profile.name,
      text,
      timestamp: new Date().toISOString(),
    };
    setChat(prev => [...prev, msg]);
    return msg;
  }, [profile.name]);

  // Send as a specific author (used by MemberContext)
  const sendChatMessageAs = useCallback((authorName, text) => {
    const msg = {
      id: uid('ch'),
      author: authorName,
      text,
      timestamp: new Date().toISOString(),
    };
    setChat(prev => [...prev, msg]);
    return msg;
  }, []);

  // ── Profile ────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
    addLog(updates.name || profile.name, 'updated their profile');
  }, [addLog, profile.name]);

  // ── Selectors ──────────────────────────────────────────────────
  const getBoardTasks = useCallback((boardId) =>
    tasks.filter(t => t.boardId === boardId),
  [tasks]);

  const getMyTasks = useCallback(() =>
    tasks.filter(t => t.assignee === 'm1'),
  [tasks]);

  const getMemberById = useCallback((id) =>
    members.find(m => m.id === id),
  [members]);

  const getBoardById = useCallback((id) =>
    boards.find(b => b.id === id),
  [boards]);

  const getBoardByCode = useCallback((code) => {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return boards.find(b => b.code?.toUpperCase() === clean) || null;
  }, [boards]);

  const value = {
    // State
    boards, tasks, members, logs, chat, profile,
    // Board actions
    createBoard, deleteBoard, getBoardById, getBoardByCode,
    // Task actions
    createTask, updateTask, moveTask, deleteTask, getBoardTasks, getMyTasks,
    // Comment actions
    addComment,
    // Member actions
    addMember, updateMemberRole, removeMember, getMemberById,
    // Chat actions
    sendChatMessage, sendChatMessageAs,
    // Profile actions
    updateProfile,
    // Log (exposed for MemberContext)
    addLog,
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
