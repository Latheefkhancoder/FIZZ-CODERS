import React from 'react';
import './KanbanColumn.css';
import TaskCard from './TaskCard';

const COLUMN_CONFIG = {
  'TODO':        { label: 'TODO',        dotClass: 'dot-todo'     },
  'IN PROGRESS': { label: 'IN PROGRESS', dotClass: 'dot-progress' },
  'DONE':        { label: 'DONE',        dotClass: 'dot-done'     },
};

/**
 * KanbanColumn — One column in the Kanban board.
 * Props: status, tasks, onTaskClick, onDeleteTask, onAddTask
 */
export default function KanbanColumn({ status, tasks, onTaskClick, onDeleteTask, onAddTask }) {
  const config = COLUMN_CONFIG[status] || { label: status, dotClass: '' };

  return (
    <div className="kanban-column">
      {/* Column header */}
      <div className="kanban-col-header">
        <div className="kanban-col-title-row">
          <span className={`kanban-col-dot ${config.dotClass}`} />
          <span className="kanban-col-title">{config.label}</span>
          <span className="kanban-col-count">{tasks.length}</span>
        </div>
      </div>

      {/* Task cards */}
      <div className="kanban-cards">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

    </div>
  );
}
