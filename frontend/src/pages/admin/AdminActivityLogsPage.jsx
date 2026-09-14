import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import ActivityLogItem from '../../components/admin/ActivityLogItem';
import './AdminActivityLogsPage.css';

/**
 * AdminActivityLogsPage — Workspace activity feed.
 */
export default function AdminActivityLogsPage() {
  const { logs, boards, activeBoardId, selectBoard } = useAdmin();
  const currentBoard = boards.find(b => b.id === activeBoardId);

  return (
    <div className="activity-page">
      <div className="page-header" style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Activity Logs</h1>
            <p className="page-subtitle">
              {currentBoard ? `Tracking activities for ${currentBoard.name} (Code: ${currentBoard.code})` : 'Track all workspace activities.'}
            </p>
          </div>

          {boards.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="logs-board-select" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Board:</label>
              <select
                id="logs-board-select"
                value={activeBoardId}
                onChange={(e) => selectBoard(e.target.value)}
                className="filter-select"
                style={{ width: 'auto', padding: '6px 12px' }}
              >
                {boards.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="activity-feed-card">
        {logs.length === 0 ? (
          <div className="activity-empty">
            <p>No activity yet. Actions you take will appear here.</p>
          </div>
        ) : (
          logs.map(log => (
            <ActivityLogItem key={log.id} log={log} />
          ))
        )}
      </div>
    </div>
  );
}
