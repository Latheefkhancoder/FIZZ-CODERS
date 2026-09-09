import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './CreateBoardModal.css'; /* reuse shared modal styles */

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  assignee: '',
  dueDate: '',
};

/**
 * CreateTaskModal — Modal for creating a task in a board.
 * Every task starts in TODO automatically.
 * Props: isOpen, boardId, onClose, onSubmit
 */
export default function CreateTaskModal({ isOpen, boardId, onClose, onSubmit }) {
  const { members } = useAdmin();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleClose = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())    errs.title    = 'Task title is required.';
    if (!form.assignee)        errs.assignee = 'Please select an assignee.';
    if (!form.dueDate)         errs.dueDate  = 'Due date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(boardId, {
      title:       form.title.trim(),
      description: form.description.trim(),
      priority:    form.priority,
      assignee:    form.assignee,
      dueDate:     form.dueDate,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-box"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
      >
        <div className="modal-header">
          <h3 id="create-task-title" className="modal-title">Create New Task</h3>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close" type="button">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Task Title */}
          <div className="modal-field">
            <label htmlFor="task-title-input" className="modal-label">Task Title *</label>
            <input
              id="task-title-input"
              type="text"
              className={`modal-input ${errors.title ? 'input-error' : ''}`}
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              autoComplete="off"
            />
            {errors.title && <span className="modal-field-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="modal-field">
            <label htmlFor="task-desc-input" className="modal-label">Description</label>
            <textarea
              id="task-desc-input"
              className="modal-textarea"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Describe this task..."
              rows={3}
            />
          </div>

          {/* Priority + Assignee */}
          <div className="modal-form-row">
            <div className="modal-field">
              <label htmlFor="task-priority-select" className="modal-label">Priority</label>
              <select
                id="task-priority-select"
                className="modal-select"
                value={form.priority}
                onChange={(e) => setField('priority', e.target.value)}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label htmlFor="task-assignee-select" className="modal-label">Assignee *</label>
              <select
                id="task-assignee-select"
                className={`modal-select ${errors.assignee ? 'input-error' : ''}`}
                value={form.assignee}
                onChange={(e) => setField('assignee', e.target.value)}
              >
                <option value="">Select member...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {errors.assignee && <span className="modal-field-error">{errors.assignee}</span>}
            </div>
          </div>

          {/* Due Date */}
          <div className="modal-field">
            <label htmlFor="task-due-input" className="modal-label">Due Date *</label>
            <input
              id="task-due-input"
              type="date"
              className={`modal-input ${errors.dueDate ? 'input-error' : ''}`}
              value={form.dueDate}
              onChange={(e) => setField('dueDate', e.target.value)}
            />
            {errors.dueDate && <span className="modal-field-error">{errors.dueDate}</span>}
          </div>

          <p className="modal-hint">New tasks automatically start in <strong>TODO</strong>.</p>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={handleClose}>Cancel</button>
            <button type="submit" className="modal-btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
