/**
 * Navigation Header — Unholy Trinity Verifier
 * Cohesive dark theme with custom three-part geometric trust seal
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilePlus, Database, Search, Menu, X } from 'lucide-react';
import './Header.css';

// Restrained Three-Part Geometric Verification Mark
const TrinityMark = () => (
  <svg 
    className="trinity-mark-svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Node 1: Cryptographic Digest (Top) */}
    <path 
      d="M12 2.5L16.5 10H7.5L12 2.5Z" 
      fill="currentColor" 
      fillOpacity="0.9"
    />
    {/* Node 2: Immutable EVM Ledger (Bottom Left) */}
    <path 
      d="M4.5 14L9 21.5H0L4.5 14Z" 
      fill="currentColor" 
      fillOpacity="0.65"
    />
    {/* Node 3: Institutional Registry (Bottom Right) */}
    <path 
      d="M19.5 14L24 21.5H15L19.5 14Z" 
      fill="currentColor" 
      fillOpacity="0.45"
    />
    {/* Center Nexus Point */}
    <circle cx="12" cy="14" r="2" fill="#38BDF8" />
  </svg>
);

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="dark-header">
      {/* Top emergency / service announcement bar inspired by Wix service template */}
      <div className="header-top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-item">
            <span className="top-bar-dot"></span>
            <span>OFFICIAL ACADEMIC CREDENTIAL VERIFICATION SYSTEM</span>
          </div>
          <div className="top-bar-meta">
            <span className="top-bar-chunk">EVM CANCUN (CHAIN ID 31337)</span>
            <span className="top-bar-sep">•</span>
            <span className="top-bar-chunk">SHA-256 CONSENSUS</span>
            <span className="top-bar-sep">•</span>
            <span className="top-bar-chunk status-active">REGISTRY ONLINE</span>
          </div>
        </div>
      </div>

      <div className="header-container">
        {/* Brand & Wordmark */}
        <Link to="/" className="brand-logo" title="Unholy Trinity Verifier" onClick={closeMenu}>
          <div className="brand-mark-box">
            <TrinityMark />
          </div>
          <div className="brand-text">
            <span className="brand-title">Unholy Trinity Verifier</span>
            <span className="brand-subtitle">Tri-Fold Credential Authentication</span>
          </div>
        </Link>

        {/* Primary Navigation (Desktop) */}
        <nav className="dark-nav" aria-label="Main Navigation">
          <Link
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>

          <Link
            to="/verify"
            className={`nav-item ${isActive('/verify') ? 'active' : ''}`}
          >
            Verify Certificate
          </Link>

          <Link
            to="/create"
            className={`nav-item ${isActive('/create') ? 'active' : ''}`}
          >
            <FilePlus size={14} />
            <span>Issue Certificate</span>
          </Link>

          <Link
            to="/admin"
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <Database size={14} />
            <span>Registry Ledger</span>
          </Link>
        </nav>

        {/* Actions (Desktop) */}
        <div className="header-actions">
          <div className="node-indicator" title="Hardhat Local Blockchain (Chain ID 31337) Active">
            <span className="node-status-dot"></span>
            <span className="node-label">EVM 31337</span>
          </div>

          <Link to="/verify" className="btn-header-verify">
            <Search size={14} />
            <span>Verify a Certificate</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
          <div className="mobile-nav-links">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span>Home</span>
            </Link>

            <Link
              to="/verify"
              className={`mobile-nav-link ${isActive('/verify') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Search size={16} />
              <span>Verify Certificate</span>
            </Link>

            <Link
              to="/create"
              className={`mobile-nav-link ${isActive('/create') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FilePlus size={16} />
              <span>Issue Certificate</span>
            </Link>

            <Link
              to="/admin"
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Database size={16} />
              <span>Registry Ledger</span>
            </Link>
          </div>

          <div className="mobile-drawer-footer">
            <div className="mobile-node-info">
              <span className="node-status-dot"></span>
              <span>EVM NODE: HARDHAT CANCUN (31337)</span>
            </div>
            <Link to="/verify" className="btn-mobile-verify-action" onClick={closeMenu}>
              <Search size={15} />
              <span>Launch Verification Terminal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
