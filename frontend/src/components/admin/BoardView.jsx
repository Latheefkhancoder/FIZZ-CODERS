import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import KanbanColumn from './KanbanColumn';
import TaskDetails from './TaskDetails';
import CreateTaskModal from './CreateTaskModal';
import ConfirmationDialog from './ConfirmationDialog';
import SearchBar from './SearchBar';
import TaskFilters from './TaskFilters';
import './BoardView.css';

const STATUSES = ['TODO', 'IN PROGRESS', 'DONE'];

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

/**
 * BoardView — Full kanban view for a single board.
 * Props: board, onBack
 */
export default function BoardView({ board, onBack }) {
  const {
    getBoardTasks,
    fetchBoardTasks,
    fetchMembers,
    createTask,
    deleteTask,
    moveTask,
  } = useAdmin();

  const [search,         setSearch]         = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [selectedTask,   setSelectedTask]   = useState(null);
  const [taskToDelete,   setTaskToDelete]   = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Drag & drop state
  const [dragTaskId,   setDragTaskId]   = useState(null);
  const [dragOverCol,  setDragOverCol]  = useState(null);

  // Fetch board tasks and board members when board ID changes
  useEffect(() => {
    if (board && board.id) {
      fetchBoardTasks(board.id);
      fetchMembers(board.id);
    }
  }, [board?.id, fetchBoardTasks, fetchMembers]);

  const allTasks = getBoardTasks(board.id);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchSearch = !search.trim() ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchAssignee = assigneeFilter === 'All' || task.assignee === assigneeFilter;
      return matchSearch && matchPriority && matchAssignee;
    });
  }, [allTasks, search, priorityFilter, assigneeFilter]);

  const getColumnTasks = (status) => filteredTasks.filter(t => t.status === status);

  /* ── Drag & drop handlers ── */
  const handleDragStart = (e, taskId) => {
    setDragTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverCol(status);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (dragTaskId) {
      try {
        await moveTask(dragTaskId, status);
      } catch (err) {
        console.error('Failed to move task:', err);
      }
    }
    setDragTaskId(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDragTaskId(null);
    setDragOverCol(null);
  };

  const handleDeleteTask = (taskId) => {
    setSelectedTask(null);
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
    }
    setTaskToDelete(null);
  };

  const handleCreateTask = async (boardId, taskData) => {
    await createTask(boardId, taskData);
  };

  return (
    <div className="board-view">
      {/* Board Header */}
      <div className="board-view-header">
        <button className="board-back-btn" onClick={onBack} type="button">
          <IconArrowLeft />
          <span>Boards</span>
        </button>
        <div className="board-view-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 className="board-view-title">{board.name}</h2>
            {board.code && (
              <span
                className="font-pixel"
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(1, 26, 82, 0.8)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--accent-light)',
                  letterSpacing: '1px',
                }}
              >
                CODE: {board.code}
              </span>
            )}
          </div>
          <button
            id="add-task-btn"
            className="btn-primary-aqua"
            onClick={() => setCreateModalOpen(true)}
            type="button"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="board-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        <TaskFilters
          priority={priorityFilter}
          assignee={assigneeFilter}
          onPriorityChange={setPriorityFilter}
          onAssigneeChange={setAssigneeFilter}
        />
      </div>

      {/* Kanban Columns */}
      <div className="kanban-board">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getColumnTasks(status)}
            onTaskClick={setSelectedTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={() => setCreateModalOpen(true)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            dragOverCol={dragOverCol}
            dragTaskId={dragTaskId}
          />
        ))}
      </div>

      {/* Task Details panel */}
      {selectedTask && (
        <TaskDetails
          task={allTasks.find(t => t.id === selectedTask.id) || selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Create Task modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        boardId={board.id}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={!!taskToDelete}
        title="Delete Task?"
        message="This action cannot be undone. The task and all its comments will be permanently deleted."
        confirmLabel="Delete Task"
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}

