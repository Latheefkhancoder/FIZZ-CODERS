import React, { useState, useRef, useEffect } from 'react';
import { useMember } from '../../context/MemberContext';
import './MemberTeamChatbotPage.css';

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
 * MemberTeamChatbotPage — General team communication channel (not task-specific).
 */
export default function MemberTeamChatbotPage() {
  const { chat, sendMyChatMessage, profile, members } = useMember();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMyChatMessage(trimmed);
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
    <div className="member-chatbot-page">
      {/* Header */}
      <div className="member-chatbot-header">
        <div>
          <h1 className="member-chatbot-title">Team Chatbot</h1>
          <p className="member-chatbot-subtitle">Discuss, share ideas, and stay connected with your team.</p>
        </div>

        {/* Participant avatars */}
        <div className="member-chatbot-participants">
          {allParticipants.slice(0, 7).map((name, i) => (
            <span key={i} className="member-participant-avatar" title={name}>
              {name.charAt(0).toUpperCase()}
            </span>
          ))}
          {allParticipants.length > 7 && (
            <span className="member-participant-more">+{allParticipants.length - 7}</span>
          )}
          <span className="member-participants-label">
            {allParticipants.length} member{allParticipants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="member-chatbot-panel">
        {/* Channel tabs */}
        <div className="member-chatbot-tabs">
          <button className="member-chatbot-tab member-chatbot-tab-active" type="button">Team Chat</button>
          <div className="member-chatbot-members-list">
            {members.map(m => (
              <span key={m.id} className="member-chatbot-member-item">
                <span className="member-chatbot-member-dot" />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Messages + Input */}
        <div className="member-chatbot-main">
          <div className="member-chatbot-messages" aria-live="polite">
            {chat.length === 0 ? (
              <div className="member-chatbot-empty">
                <p>No messages yet. Start the conversation! 👋</p>
              </div>
            ) : (
              chat.map(msg => {
                const isOwn = msg.author === profile.name;
                return (
                  <div key={msg.id} className={`member-chat-message ${isOwn ? 'member-chat-msg-own' : ''}`}>
                    <span className="member-chat-avatar" title={msg.author}>
                      {msg.author.charAt(0).toUpperCase()}
                    </span>
                    <div className="member-chat-bubble">
                      <div className="member-chat-meta">
                        <span className="member-chat-author">{msg.author}</span>
                        <span className="member-chat-time">{formatChatTime(msg.timestamp)}</span>
                      </div>
                      <p className="member-chat-text">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form className="member-chatbot-input-row" onSubmit={handleSend}>
            <textarea
              className="member-chatbot-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              aria-label="Type a message"
            />
            <button
              className="member-chatbot-send-btn"
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
