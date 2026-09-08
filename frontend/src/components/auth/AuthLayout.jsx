import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
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
      {/* Background Pixel Grid */}
      <div className="pixel-grid-bg" />

      {/* Top Header Navbar */}
      <header className="auth-header">
        <Link to="/login" className="brand-logo-link">
          {/* Logo Icon */}
          <span className="pixel-brand-icon">
            <img
              src={logo}
              alt="FIZZ-CONNECT Logo"
              width="42"
              height="42"
              style={{ objectFit: 'contain' }}
            />
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
              {headline && headline.length > 0 && (
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
              )}

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