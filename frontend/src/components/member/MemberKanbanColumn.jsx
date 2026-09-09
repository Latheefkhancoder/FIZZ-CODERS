import React from 'react';
import './MemberKanbanColumn.css';
import MemberTaskCard from './MemberTaskCard';

const COLUMN_CONFIG = {
  'TODO':        { label: 'TODO',        dotClass: 'member-dot-todo'     },
  'IN PROGRESS': { label: 'IN PROGRESS', dotClass: 'member-dot-progress' },
  'DONE':        { label: 'DONE',        dotClass: 'member-dot-done'     },
};

/**
 * MemberKanbanColumn — A column for the Member My Tasks view.
 * Props: status, tasks, onTaskClick, dragOverStatus, onDragOver, onDrop, onDragStart, onDragEnd, getBoardName
 */
export default function MemberKanbanColumn({ 
  status, 
  tasks, 
  onTaskClick, 
  dragOverStatus, 
  onDragOver, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  dragTaskId,
  getBoardName 
}) {
  const config = COLUMN_CONFIG[status] || { label: status, dotClass: '' };
  const isOver = dragOverStatus === status;

  return (
    <div 
      className={`member-kanban-column ${isOver ? 'member-col-drag-over' : ''}`}
      onDragOver={(e) => onDragOver(e, status)}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column header */}
      <div className="member-kanban-col-header">
        <div className="member-kanban-col-title-row">
          <span className={`member-kanban-col-dot ${config.dotClass}`} />
          <span className="member-kanban-col-title">{config.label}</span>
          <span className="member-kanban-col-count">{tasks.length}</span>
        </div>
      </div>

      {/* Task cards */}
      <div className="member-kanban-cards">
        {tasks.length === 0 ? (
          <div className="member-kanban-empty">
            <p>Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              onDragEnd={onDragEnd}
              className="member-draggable-wrapper"
            >
              <MemberTaskCard
                task={task}
                onClick={onTaskClick}
                isDragging={dragTaskId === task.id}
                boardName={getBoardName(task.boardId)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
