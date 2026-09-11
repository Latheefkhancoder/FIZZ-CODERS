import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAdmin } from '../../context/AdminContext';
import './MemberJoinBoard.css';

const IconKey = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7c0-.72-.11-1.41-.31-2.06L21 4.5V2h-2.5z" />
    <circle cx="7.5" cy="15.5" r="1.5" />
  </svg>
);

const IconCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function MemberJoinBoard() {
  const navigate = useNavigate();
  const { boards, getBoardByCode } = useAdmin();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [joinedBoard, setJoinedBoard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeChange = (e) => {
    // Automatically convert to uppercase and filter non-alphanumeric characters, max 5 chars
    const rawVal = e.target.value.toUpperCase();
    const cleanVal = rawVal.replace(/[^A-Z0-9]/g, '').slice(0, 5);
    setCode(cleanVal);
    if (error) setError('');
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setError('Board code is required.');
      return;
    }

    if (trimmed.length !== 5) {
      setError('Board code must contain exactly 5 alphanumeric characters.');
      return;
    }

    if (!/^[A-Z0-9]{5}$/.test(trimmed)) {
      setError('Board code must contain only letters and numbers (A-Z, 0-9).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Check against mock/context state
    const foundBoard = getBoardByCode(trimmed) || boards.find((b) => b.code?.toUpperCase() === trimmed);

    setTimeout(() => {
      setIsSubmitting(false);
      if (foundBoard) {
        setJoinedBoard(foundBoard);
        sessionStorage.setItem('fizz_role', 'member');
        localStorage.setItem('fizz_role', 'member');
        sessionStorage.setItem('fizz_current_board_id', foundBoard.id);
      } else {
        setError('Invalid board code. Please check the code and try again.');
      }
    }, 300);
  };

  const handleContinueToDashboard = () => {
    navigate('/member');
  };

  return (
    <div className="join-board-page-wrapper">
      <div className="pixel-grid-bg" />

      {/* Ambient Illumination */}
      <div className="join-ambient-glow glow-top-left" />
      <div className="join-ambient-glow glow-bottom-right" />

      {/* Top Header */}
      <header className="join-header">
        <div className="join-brand">
          <img src={logo} alt="FIZZ-CONNECT" className="join-logo" />
          <div className="join-brand-text">
            <span className="brand-fizz">FIZZ-</span>
            <span className="brand-connect">CONNECT</span>
          </div>
        </div>

        <Link to="/select-role" className="join-back-link" id="join-back-to-roles">
          ← Switch Role
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="join-main-container">
        <div className="join-card">
          {joinedBoard ? (
            /* Success State */
            <div className="join-success-view" id="join-success-panel">
              <div className="join-success-icon-box">
                <IconCheck />
              </div>

              <div className="join-success-badge font-pixel">ACCESS GRANTED</div>
              <h1 className="join-success-title">Board joined successfully</h1>
              <p className="join-success-subtitle">
                You have been added to the workspace and can now start collaborating.
              </p>

              <div className="joined-board-card">
                <div className="joined-board-info">
                  <span className="joined-board-label">Active Workspace</span>
                  <h3 className="joined-board-name" id="joined-board-name">
                    {joinedBoard.name}
                  </h3>
                </div>
                <div className="joined-board-code-pill font-pixel">
                  CODE: {joinedBoard.code}
                </div>
              </div>

              <button
                type="button"
                className="join-continue-btn"
                id="continue-to-dashboard-btn"
                onClick={handleContinueToDashboard}
              >
                <span>Continue to Member Dashboard</span>
                <IconArrowRight />
              </button>
            </div>
          ) : (
            /* Join Form State */
            <div className="join-form-view">
              <div className="join-icon-box">
                <IconKey />
              </div>

              <div className="join-tag font-pixel">MEMBER ONBOARDING</div>
              <h1 className="join-title">Join a Board</h1>
              <p className="join-subtitle">
                Enter the board code shared by your admin.
              </p>

              {error && (
                <div className="join-error-banner" id="join-error-message" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleJoinSubmit} className="join-form" noValidate>
                <div className="join-field-group">
                  <div className="join-field-header">
                    <label htmlFor="member-board-code" className="join-label">
                      Board Code
                    </label>
                    <span className="join-counter font-pixel">
                      {code.length}/5
                    </span>
                  </div>

                  <div className="join-input-wrapper">
                    <input
                      id="member-board-code"
                      name="boardCode"
                      type="text"
                      className={`join-code-input font-pixel ${error ? 'join-input-error' : ''}`}
                      placeholder="e.g. A7K2P"
                      value={code}
                      onChange={handleCodeChange}
                      maxLength={5}
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <p className="join-hint">
                    Enter the 5-character alphanumeric code provided by your board administrator.
                  </p>
                </div>

                <button
                  type="submit"
                  className="join-submit-btn"
                  id="join-board-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="join-btn-spinner" />
                  ) : (
                    <>
                      <span>Join Board</span>
                      <IconArrowRight />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="join-footer">
        <span>FIZZ-CONNECT MEMBER WORKSPACE</span>
        <span>•</span>
        <span>DEEP ROYAL BLUE EDITION</span>
      </footer>
    </div>
  );
}
