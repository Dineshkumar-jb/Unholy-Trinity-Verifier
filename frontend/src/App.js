/**
 * Main App Component — Unholy Trinity Verifier
 * React Router configuration and application layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import CreateCertificate from './pages/CreateCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import ViewCertificate from './pages/ViewCertificate';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create" element={<CreateCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/certificate/:id" element={<ViewCertificate />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="academic-container">
            <div className="footer-top">
              <div className="footer-brand">
                <h4>
                  <ShieldCheck size={20} color="#38BDF8" />
                  <span>Unholy Trinity Verifier</span>
                </h4>
                <p>
                  A multi-layered academic certificate verification protocol combining cryptographic SHA-256 
                  fingerprinting, immutable Ethereum EVM smart contract records, and an authorized registrar repository.
                </p>
              </div>

              <div className="footer-column">
                <h5>Platform Navigation</h5>
                <ul className="footer-links">
                  <li><Link to="/">Homepage</Link></li>
                  <li><Link to="/verify">Verify Credential</Link></li>
                  <li><Link to="/create">Issue Certificate</Link></li>
                  <li><Link to="/admin">Registry Ledger</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h5>Project Team</h5>
                <ul className="footer-links">
                  <li>Dinesh Kumar JB</li>
                  <li>Sanjay</li>
                  <li>Bharath Vikraman</li>
                  <li>
                    <a 
                      href="https://github.com/Dineshkumar-jb" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38BDF8' }}
                      title="Dinesh Kumar JB's GitHub Profile"
                    >
                      <span>GitHub Profile</span>
                      <ExternalLink size={13} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div>
                <p>&copy; {new Date().getFullYear()} Unholy Trinity Verifier. All rights reserved.</p>
              </div>
              <div className="footer-node-status">
                <span className="node-dot"></span>
                <span>EVM NODE: HARDHAT CANCUN (CHAIN ID 31337)</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
