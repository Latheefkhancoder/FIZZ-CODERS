import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

/**
 * AuthLayout - Master modern layout shell for all FIZZ-CONNECT auth views.
 * Handles split-screen desktop, responsive mobile stacking, background,
 * branding header with navigation links, and bottom retro status tags.
 */
export default function AuthLayout({
  headline,
  highlightWord,
  subtext,
  bottomLeftTag,
  bottomRightTag,
  visualSlot,
  children,
  centeredLayout = false,
}) {
  return (
    <div className="auth-master-wrapper">
      {/* Background Pixel Grid & Atmospheric Ambient Radiance */}
      <div className="pixel-grid-bg" />

      {/* Floating ambient corner aqua glow */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* Top Header Navbar */}
      <header className="auth-header">
        <Link to="/login" className="brand-logo-link">
          {/* Pixel Gem / Cog Icon in Aqua theme */}
          <span className="pixel-brand-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="10" y="2" width="8" height="4" fill="#39D9D5" />
              <rect x="10" y="22" width="8" height="4" fill="#39D9D5" />
              <rect x="2" y="10" width="4" height="8" fill="#39D9D5" />
              <rect x="22" y="10" width="4" height="8" fill="#39D9D5" />
              <rect
                x="6"
                y="6"
                width="16"
                height="16"
                fill="#16C6D2"
                stroke="#39D9D5"
                strokeWidth="2"
              />
              <rect x="11" y="11" width="6" height="6" fill="#FFFFFF" />
            </svg>
          </span>

          <div className="brand-text-block">
            <h1 className="brand-title">
              <span className="brand-fizz">FIZZ-</span>
              <span className="brand-connect">CONNECT</span>
            </h1>

            <span className="brand-tagline">
              PLAN · COLLABORATE · BUILD
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content Area */}
      <main
        className={`auth-main-container ${
          centeredLayout ? 'layout-centered' : 'layout-split'
        }`}
      >
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

                  {highlightWord && (
                    <span className="text-red">{highlightWord}</span>
                  )}
                </h2>

                {subtext && (
                  <p className="editorial-subtext">{subtext}</p>
                )}
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

      {/* Bottom Retro Status Tags */}
      {(bottomLeftTag || bottomRightTag) && (
        <footer className="auth-footer-bar">
          <span className="footer-tag-left font-pixel">
            {bottomLeftTag}
          </span>

          <span className="footer-tag-right font-pixel">
            {bottomRightTag}
          </span>
        </footer>
      )}
    </div>
  );
}