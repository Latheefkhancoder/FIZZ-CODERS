import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AuthLayout - Master retro-futuristic layout shell for all CollabBoard auth views.
 * Handles split-screen desktop, responsive mobile stacking, pixel grid background,
 * branding header with navigation links, and bottom retro status tags.
 */
export default function AuthLayout({
  headline,
  highlightWord,
  subtext,
  topQuote = 'SAME IDEAS. BIGGER POSSIBILITIES.',
  bottomLeftTag = 'IDEAS CONNECT PEOPLE.',
  bottomRightTag = 'COLLABORATE · INNOVATE · BUILD · GROW',
  visualSlot,
  children,
  centeredLayout = false,
}) {
  return (
    <div className="auth-master-wrapper">
      {/* Background Pixel Grid & Atmospheric Ambient Radiance */}
      <div className="pixel-grid-bg" />

      {/* Floating ambient corner red glow */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* Top Header Navbar */}
      <header className="auth-header">
        <Link to="/login" className="brand-logo-link">
          {/* Pixel Gem / Cog Icon */}
          <span className="pixel-brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="2" width="8" height="4" fill="#FF2D3D" />
              <rect x="10" y="22" width="8" height="4" fill="#FF2D3D" />
              <rect x="2" y="10" width="4" height="8" fill="#FF2D3D" />
              <rect x="22" y="10" width="4" height="8" fill="#FF2D3D" />
              <rect x="6" y="6" width="16" height="16" fill="#750009" stroke="#FF2D3D" strokeWidth="2" />
              <rect x="11" y="11" width="6" height="6" fill="#FFFFFF" />
            </svg>
          </span>

          <div className="brand-text-block">
            <h1 className="brand-title">
              <span className="brand-collab">Collab</span>
              <span className="brand-board">Board</span>
            </h1>
            <span className="brand-tagline">Plan · Collaborate · Build</span>
          </div>
        </Link>

        <div className="header-right-meta">
          <div className="top-pixel-quote font-pixel">"{topQuote}"</div>
          <nav className="header-nav" aria-label="Main Navigation">
            <span className="nav-item">Ideas</span>
            <span className="nav-item">People</span>
            <span className="nav-item">Projects</span>
            <span className="nav-item">About</span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`auth-main-container ${centeredLayout ? 'layout-centered' : 'layout-split'}`}>
        {!centeredLayout ? (
          <>
            {/* Left Side: Editorial Typography & Pixel Collaboration Visual */}
            <section className="auth-left-section">
              <div className="editorial-text-group">
                <h2 className="editorial-headline">
                  {headline.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  {highlightWord && <span className="text-red">{highlightWord}</span>}
                </h2>
                {subtext && <p className="editorial-subtext">{subtext}</p>}
              </div>

              {/* Pixel Visual Area */}
              <div className="visual-wrapper">{visualSlot}</div>
            </section>

            {/* Right Side: Auth Form Card */}
            <section className="auth-right-section">{children}</section>
          </>
        ) : (
          /* Centered Layout for Reset Success view */
          <section className="auth-center-section">
            <div className="center-visual-bg">{visualSlot}</div>
            <div className="center-card-wrapper">{children}</div>
          </section>
        )}
      </main>

      {/* Bottom Retro Status Tags matching reference image */}
      <footer className="auth-footer-bar">
        <span className="footer-tag-left font-pixel">{bottomLeftTag}</span>
        <span className="footer-tag-right font-pixel">{bottomRightTag}</span>
      </footer>

      {/* Layout Styles */}
      <style>{`
        .auth-master-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 44px;
          box-sizing: border-box;
          z-index: 1;
        }

        .ambient-glow {
          position: fixed;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }

        .glow-top-left {
          top: -100px;
          left: -100px;
          background: #520000;
        }

        .glow-bottom-right {
          bottom: -100px;
          right: -100px;
          background: #380002;
        }

        /* Header */
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          position: relative;
          z-index: 10;
          padding-bottom: 20px;
        }

        .brand-logo-link {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .pixel-brand-icon {
          display: flex;
          align-items: center;
          filter: drop-shadow(0 0 10px rgba(255, 45, 61, 0.6));
          transition: transform 0.2s ease;
        }

        .brand-logo-link:hover .pixel-brand-icon {
          transform: scale(1.08) rotate(5deg);
        }

        .brand-text-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-title {
          font-family: var(--font-sans);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .brand-collab {
          color: var(--text-white);
        }

        .brand-board {
          color: var(--red-primary);
        }

        .brand-tagline {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .header-right-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .top-pixel-quote {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.85;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-item {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-light);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .nav-item:hover {
          color: var(--red-primary);
          text-shadow: 0 0 8px var(--red-glow);
        }

        /* Main Container */
        .auth-main-container {
          flex: 1;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
          padding: 16px 0;
        }

        .layout-split {
          display: grid;
          grid-template-columns: 1.3fr 0.82fr;
          gap: 42px;
          align-items: center;
        }

        .layout-centered {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
        }

        /* Left Side */
        .auth-left-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        .editorial-headline {
          font-family: var(--font-sans);
          font-size: clamp(34px, 4.2vw, 54px);
          font-weight: 900;
          color: var(--text-white);
          line-height: 1.08;
          letter-spacing: -1.5px;
        }

        .editorial-subtext {
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text-muted);
          max-width: 440px;
          line-height: 1.6;
          margin-top: 8px;
        }

        .visual-wrapper {
          position: relative;
          width: 100%;
        }

        /* Right Side */
        .auth-right-section {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .center-card-wrapper {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 440px;
        }

        .center-visual-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        /* Bottom Status Tags */
        .auth-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-top: 20px;
          font-size: 10.5px;
          color: var(--text-muted);
          letter-spacing: 1px;
          opacity: 0.75;
          user-select: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .layout-split {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 900px) {
          .auth-master-wrapper {
            padding: 20px 24px;
          }
          .layout-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .auth-left-section {
            text-align: center;
            align-items: center;
          }
          .editorial-subtext {
            margin: 0 auto;
          }
          .top-pixel-quote {
            display: none;
          }
          .header-nav {
            gap: 16px;
          }
        }

        @media (max-width: 580px) {
          .auth-master-wrapper {
            padding: 16px;
          }
          .auth-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .header-right-meta {
            align-items: flex-start;
          }
          .editorial-headline {
            font-size: 30px;
          }
          .auth-footer-bar {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
