import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import ActivityLogItem from '../../components/admin/ActivityLogItem';
import './AdminActivityLogsPage.css';

/**
 * AdminActivityLogsPage — Workspace activity feed.
 */
export default function AdminActivityLogsPage() {
  const { logs } = useAdmin();

  return (
    <div className="activity-page">
      <div className="page-header" style={{ padding: '24px 24px 0' }}>
        <div>
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-subtitle">Track all workspace activities.</p>
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
