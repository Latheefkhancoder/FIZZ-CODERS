import React from 'react';
import './ActivityLogItem.css';

function formatLogTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ', '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * ActivityLogItem — Single row in the activity feed.
 * Props: log { id, who, what, when }
 */
export default function ActivityLogItem({ log }) {
  const initials = log.who ? log.who.charAt(0).toUpperCase() : '?';

  return (
    <div className="log-item">
      <span className="log-avatar">{initials}</span>
      <div className="log-content">
        <p className="log-text">
          <span className="log-who">{log.who}</span>
          {' '}
          <span className="log-what">{log.what}</span>
        </p>
        <span className="log-when">{formatLogTime(log.when)}</span>
      </div>
    </div>
  );
}
