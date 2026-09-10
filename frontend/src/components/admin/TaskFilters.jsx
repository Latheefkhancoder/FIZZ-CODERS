import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import './TaskFilters.css';

const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Urgent'];

/**
 * TaskFilters — Priority + Assignee dropdowns.
 * Props: priority, assignee, onPriorityChange, onAssigneeChange
 */
export default function TaskFilters({ priority, assignee, onPriorityChange, onAssigneeChange }) {
  const { members } = useAdmin();

  return (
    <div className="task-filters">
      <select
        id="filter-priority"
        className="filter-select"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        aria-label="Filter by priority"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p === 'All' ? 'Priority' : p}</option>
        ))}
      </select>

      <select
        id="filter-assignee"
        className="filter-select"
        value={assignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
        aria-label="Filter by assignee"
      >
        <option value="All">Assignee</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </div>
  );
}
