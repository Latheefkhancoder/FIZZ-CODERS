import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './AdminTeamChatbotPage.css';

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

function formatChatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * AdminTeamChatbotPage — General team communication channel (not task-specific).
 */
export default function AdminTeamChatbotPage() {
  const { chat, sendChatMessage, profile, members } = useAdmin();
  const [text,       setText]    = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // All participants
  const allParticipants = [profile.name, ...members.filter(m => m.name !== profile.name).map(m => m.name)];

  return (
    <div className="chatbot-page">
      {/* Header */}
      <div className="chatbot-header">
        <div>
          <h1 className="chatbot-title">Team Chatbot</h1>
          <p className="chatbot-subtitle">Discuss, share ideas, and stay connected with your team.</p>
        </div>

        {/* Participant avatars */}
        <div className="chatbot-participants">
          {allParticipants.slice(0, 7).map((name, i) => (
            <span key={i} className="participant-avatar" title={name}>
              {name.charAt(0).toUpperCase()}
            </span>
          ))}
          {allParticipants.length > 7 && (
            <span className="participant-more">+{allParticipants.length - 7}</span>
          )}
          <span className="participants-label">
            {allParticipants.length} member{allParticipants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="chatbot-panel">
        {/* Channel tabs */}
        <div className="chatbot-tabs">
          <button className="chatbot-tab chatbot-tab-active" type="button">Team Chat</button>
          <div className="chatbot-members-list">
            {members.map(m => (
              <span key={m.id} className="chatbot-member-item">
                <span className="chatbot-member-dot" />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Messages + Input */}
        <div className="chatbot-main">
          <div className="chatbot-messages" aria-live="polite">
            {chat.length === 0 ? (
              <div className="chatbot-empty">
                <p>No messages yet. Start the conversation! 👋</p>
              </div>
            ) : (
              chat.map(msg => {
                const isOwn = msg.author === profile.name;
                return (
                  <div key={msg.id} className={`chat-message ${isOwn ? 'chat-msg-own' : ''}`}>
                    <span className="chat-avatar" title={msg.author}>
                      {msg.author.charAt(0).toUpperCase()}
                    </span>
                    <div className="chat-bubble">
                      <div className="chat-meta">
                        <span className="chat-author">{msg.author}</span>
                        <span className="chat-time">{formatChatTime(msg.timestamp)}</span>
                      </div>
                      <p className="chat-text">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chatbot-input-row" onSubmit={handleSend}>
            <textarea
              className="chatbot-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              aria-label="Type a message"
            />
            <button
              className="chatbot-send-btn"
              type="submit"
              disabled={!text.trim()}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
