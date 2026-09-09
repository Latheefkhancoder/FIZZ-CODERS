import React, { useState, useRef, useEffect } from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberTaskComments.css';

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
 * MemberTaskComments — Shared comment thread for members
 */
export default function MemberTaskComments({ task }) {
  const { addMyComment, profile } = useMember();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task.comments]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addMyComment(task.id, trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="member-task-comments">
      <div className="member-comments-header">
        <span className="member-comments-title">Comments</span>
        <span className="member-comments-count">{task.comments.length}</span>
      </div>

      <div className="member-comments-list">
        {task.comments.length === 0 ? (
          <div className="member-comments-empty">
            <p>No comments yet. Start the conversation!</p>
          </div>
        ) : (
          task.comments.map((c) => {
            const isOwn = c.author === profile.name;
            return (
              <div key={c.id} className={`member-comment-item ${isOwn ? 'member-comment-own' : ''}`}>
                <span className="member-comment-avatar">{c.author.charAt(0).toUpperCase()}</span>
                <div className="member-comment-body">
                  <div className="member-comment-meta">
                    <span className="member-comment-author">{c.author}</span>
                    <span className="member-comment-time">{formatCommentTime(c.timestamp)}</span>
                  </div>
                  <p className="member-comment-text">{c.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form className="member-comment-input-row" onSubmit={handleSend}>
        <span className="member-comment-input-avatar">{profile.name.charAt(0).toUpperCase()}</span>
        <textarea
          className="member-comment-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          rows={1}
          aria-label="Write a comment"
        />
        <button
          className="member-comment-send-btn"
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
