import React, { useState, useMemo } from 'react';
import { useMember } from '../../context/MemberContext';
import MemberKanbanColumn from '../../components/member/MemberKanbanColumn';
import MemberTaskDetails from '../../components/member/MemberTaskDetails';
import './MemberMyTasksPage.css';

const STATUSES = ['TODO', 'IN PROGRESS', 'DONE'];

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function MemberMyTasksPage() {
  const { getMyTasks, moveMyTask, getBoardById, boards } = useMember();
  
  const allMyTasks = getMyTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Drag state
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const getBoardName = (boardId) => {
    const board = getBoardById(boardId);
    return board ? board.name : 'Unknown Board';
  };

  // ── Filter Tasks ──
  const filteredTasks = useMemo(() => {
    return allMyTasks.filter(task => {
      // Search (title or desc)
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        task.title.toLowerCase().includes(q) || 
        (task.description && task.description.toLowerCase().includes(q));
      
      // Priority
      const matchesPriority = !selectedPriority || task.priority === selectedPriority;
      
      // Board
      const matchesBoard = !selectedBoard || task.boardId === selectedBoard;

      return matchesSearch && matchesPriority && matchesBoard;
    });
  }, [allMyTasks, searchQuery, selectedPriority, selectedBoard]);

  // ── Group by Board ──
  // The requirements state: "Tasks must be clearly grouped or associated with their BOARD NAME."
  // We can render multiple kanban boards (one per board).
  const tasksByBoard = useMemo(() => {
    const grouped = {};
    filteredTasks.forEach(t => {
      if (!grouped[t.boardId]) grouped[t.boardId] = [];
      grouped[t.boardId].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  // ── Drag & Drop ──
  const handleDragStart = (e, taskId) => {
    setDragTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (dragTaskId) moveMyTask(dragTaskId, status);
    setDragTaskId(null);
    setDragOverStatus(null);
  };

  const handleDragEnd = () => {
    setDragTaskId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="member-my-tasks-page">
      {/* Header & Controls */}
      <div className="member-page-header">
        <div>
          <h1 className="member-page-title">My Tasks</h1>
          <p className="member-page-subtitle">Tasks assigned to you across all boards.</p>
        </div>

        {/* Filters */}
        <div className="member-task-filters">
          <div className="member-search-box">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="member-filter-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="member-filter-select"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            <option value="">All Boards</option>
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="member-my-tasks-content">
        {Object.keys(tasksByBoard).length === 0 ? (
          <div className="member-my-tasks-global-empty">
            <div className="member-empty-icon">✓</div>
            <h3>You're all caught up!</h3>
            <p>No tasks found matching your criteria.</p>
          </div>
        ) : (
          Object.entries(tasksByBoard).map(([boardId, bTasks]) => (
            <div key={boardId} className="member-board-group">
              <h2 className="member-board-group-title font-pixel">
                <span className="member-board-icon">►</span>
                {getBoardName(boardId)}
              </h2>
              
              <div className="member-kanban-board">
                {STATUSES.map(status => {
                  const colTasks = bTasks.filter(t => t.status === status);
                  return (
                    <MemberKanbanColumn
                      key={status}
                      status={status}
                      tasks={colTasks}
                      getBoardName={getBoardName}
                      onTaskClick={setSelectedTask}
                      dragOverStatus={dragOverStatus}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      dragTaskId={dragTaskId}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Details Panel */}
      {selectedTask && (
        <MemberTaskDetails 
          task={allMyTasks.find(t => t.id === selectedTask.id) || selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
