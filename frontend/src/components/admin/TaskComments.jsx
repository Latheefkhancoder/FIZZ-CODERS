import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './TaskComments.css';

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

function formatCommentTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * TaskComments — Per-task comment thread shared between Admin and Assigned Member.
 * Props: task
 */
export default function TaskComments({ task }) {
  const { addComment, profile } = useAdmin();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // Scroll to bottom when comments load/change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task.comments]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(task.id, trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="task-comments">
      <div className="comments-header">
        <span className="comments-title">Comments</span>
        <span className="comments-count">{task.comments.length}</span>
      </div>

      <div className="comments-list">
        {task.comments.length === 0 ? (
          <div className="comments-empty">
            <p>No comments yet. Start the conversation!</p>
          </div>
        ) : (
          task.comments.map((c) => {
            const isOwn = c.author === profile.name;
            return (
              <div key={c.id} className={`comment-item ${isOwn ? 'comment-own' : ''}`}>
                <span className="comment-avatar">{c.author.charAt(0).toUpperCase()}</span>
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="comment-author">{c.author}</span>
                    <span className="comment-time">{formatCommentTime(c.timestamp)}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="comment-input-row" onSubmit={handleSend}>
        <span className="comment-input-avatar">{profile.name.charAt(0).toUpperCase()}</span>
        <textarea
          className="comment-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          rows={1}
          aria-label="Write a comment"
        />
        <button
          className="comment-send-btn"
          type="submit"
          disabled={!text.trim()}
          aria-label="Send comment"
        >
          <IconSend />
        </button>
      </form>
    </div>
  );
}
