import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import TaskDetails from '../../components/admin/TaskDetails';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import './AdminMyTasksPage.css';

const STATUSES = ['TODO', 'IN PROGRESS', 'DONE'];

const STATUS_LABELS = {
  'TODO':        { label: 'TODO',        dot: 'dot-todo'     },
  'IN PROGRESS': { label: 'IN PROGRESS', dot: 'dot-progress' },
  'DONE':        { label: 'DONE',        dot: 'dot-done'     },
};

const PRIORITY_CLASSES = {
  Low: 'priority-low', Medium: 'priority-medium',
  High: 'priority-high', Urgent: 'priority-urgent',
};

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconGrip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="6"  r="1"/><circle cx="16" cy="6"  r="1"/>
    <circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>
    <circle cx="8" cy="18" r="1"/><circle cx="16" cy="18" r="1"/>
  </svg>
);

/**
 * AdminMyTasksPage — Shows tasks assigned to the Admin (m1) in a Kanban layout.
 * Supports drag-and-drop between columns.
 */
export default function AdminMyTasksPage() {
  const { tasks, boards, moveTask, deleteTask, getMemberById } = useAdmin();

  // My tasks = assigned to m1 (Admin)
  const myTasks = tasks.filter(t => t.assignee === 'm1');

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [dragTaskId,   setDragTaskId]   = useState(null);
  const [dragOverCol,  setDragOverCol]  = useState(null);

  const getBoardName = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    return board ? board.name : 'Unknown Board';
  };

  /* ── Drag handlers ── */
  const handleDragStart = (e, taskId) => {
    setDragTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverCol(status);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (dragTaskId) moveTask(dragTaskId, status);
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

  const confirmDeleteTask = () => {
    if (taskToDelete) deleteTask(taskToDelete);
    setTaskToDelete(null);
  };

  return (
    <div className="my-tasks-page">
      {/* Header */}
      <div className="page-header" style={{ padding: '24px 24px 0' }}>
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Tasks assigned to you (Admin).</p>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="my-tasks-board">
        {STATUSES.map(status => {
          const colTasks = myTasks.filter(t => t.status === status);
          const cfg = STATUS_LABELS[status];
          const isOver = dragOverCol === status;

          return (
            <div
              key={status}
              className={`my-tasks-column ${isOver ? 'col-drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDrop={(e)     => handleDrop(e, status)}
            >
              {/* Column header */}
              <div className="my-tasks-col-header">
                <span className={`kanban-col-dot ${cfg.dot}`} />
                <span className="kanban-col-title">{cfg.label}</span>
                <span className="kanban-col-count">{colTasks.length}</span>
              </div>

              {/* Task rows */}
              {colTasks.length === 0 ? (
                <div className="my-tasks-empty">
                  <p>Drop tasks here</p>
                </div>
              ) : (
                colTasks.map(task => {
                  const member = task.assignee ? getMemberById(task.assignee) : null;
                  const dueDateStr = task.dueDate
                    ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })
                    : null;
                  const isDragging = dragTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`my-task-card ${isDragging ? 'card-dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTask(task)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="my-task-drag-handle" title="Drag to move">
                        <IconGrip />
                      </div>

                      <div className="my-task-main">
                        <div className="my-task-top-row">
                          <span className={`task-priority-badge ${PRIORITY_CLASSES[task.priority] || ''}`}>
                            {task.priority}
                          </span>
                          <span className="my-task-board-name">{getBoardName(task.boardId)}</span>
                        </div>
                        <p className="my-task-title">{task.title}</p>
                        <div className="my-task-meta">
                          <span className="assignee-avatar-sm">
                            {member ? member.name.charAt(0).toUpperCase() : 'A'}
                          </span>
                          {dueDateStr && (
                            <div className="my-task-due">
                              <IconCalendar />
                              <span>{dueDateStr}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Task Details */}
      {selectedTask && (
        <TaskDetails
          task={tasks.find(t => t.id === selectedTask.id) || selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          hideComments={true}
        />
      )}

      {/* Delete Confirmation */}
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
