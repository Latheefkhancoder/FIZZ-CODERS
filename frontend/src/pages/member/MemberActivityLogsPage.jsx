import React from 'react';
import { useMember } from '../../context/MemberContext';
import ActivityLogItem from '../../components/admin/ActivityLogItem';
import './MemberActivityLogsPage.css';

/**
 * MemberActivityLogsPage — Workspace activity feed.
 */
export default function MemberActivityLogsPage() {
  const { logs } = useMember();

  return (
    <div className="member-activity-page">
      <div className="member-page-header">
        <div>
          <h1 className="member-page-title">Activity Logs</h1>
          <p className="member-page-subtitle">Track workspace activities.</p>
        </div>
      </div>

      <div className="member-activity-content">
        <div className="member-activity-feed-card">
          {logs.length === 0 ? (
            <div className="member-activity-empty">
              <p>No recent activity.</p>
            </div>
          ) : (
            logs.map(log => (
              <ActivityLogItem key={log.id} log={log} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
