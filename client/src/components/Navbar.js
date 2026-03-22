import React from 'react';
import './Navbar.css';

export default function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => setPage('playground')}>
          <span className="logo-bracket">[</span>
          <span className="logo-text">ML</span>
          <span className="logo-accent">_playground</span>
          <span className="logo-bracket">]</span>
        </div>
        <div className="navbar-links">
          <button className={`nav-link ${page === 'playground' ? 'active' : ''}`} onClick={() => setPage('playground')}>
            {'> run'}
          </button>
          <button className={`nav-link ${page === 'history' ? 'active' : ''}`} onClick={() => setPage('history')}>
            {'> history'}
          </button>
        </div>
        <div className="navbar-status">
          <span className="status-dot" />
          <span>system online</span>
        </div>
      </div>
    </nav>
  );
}
