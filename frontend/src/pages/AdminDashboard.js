/**
 * Admin Dashboard Page — Unholy Trinity Verifier
 * Dark audit ledger for inspecting and verifying all issued credentials
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Hash,
  FilePlus,
  BookOpen
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCertificates(certificates);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredCertificates(
        certificates.filter(
          c =>
            (c.certificateId && c.certificateId.toLowerCase().includes(q)) ||
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.eventName && c.eventName.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, certificates]);

  const fetchCertificates = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await certificateService.getAllCertificates();
      const data = response.data?.data || [];
      setCertificates(data);
      setFilteredCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Unable to synchronize with credential repository. Please verify backend service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const activeOnChainCount = certificates.filter(c => c.isValid).length;

  return (
    <div className="dark-dashboard-page">
      <div className="academic-container">
        {/* Top Header */}
        <div className="dashboard-head-row">
          <div>
            <div className="dashboard-pill">
              <BookOpen size={13} />
              <span>UNHOLY TRINITY VERIFIER LEDGER</span>
            </div>
            <h1 className="dashboard-heading">Credential Audit Registry</h1>
            <p className="dashboard-subtext">
              Real-time ledger of academic certificates anchored via cryptographic SHA-256 digests and EVM smart contracts.
            </p>
          </div>

          <div className="dashboard-actions-cluster">
            <button 
              onClick={fetchCertificates} 
              className={`btn-dark-secondary ${refreshing ? 'rotating' : ''}`}
              disabled={refreshing}
              title="Resynchronize with Ledger"
            >
              <RefreshCw size={14} className={refreshing ? 'spin-icon' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync Records'}</span>
            </button>
            <Link to="/create" className="btn-dark-primary">
              <FilePlus size={15} />
              <span>Issue Credential</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="dark-metrics-grid">
          <div className="metric-box">
            <div className="metric-icon-wrap">
              <Award size={18} />
            </div>
            <div className="metric-text-group">
              <span className="metric-lbl">TOTAL REGISTERED</span>
              <span className="metric-num">{certificates.length}</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap green">
              <CheckCircle2 size={18} />
            </div>
            <div className="metric-text-group">
              <span className="metric-lbl">VERIFIED ACTIVE</span>
              <span className="metric-num">{activeOnChainCount}</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap cyan">
              <Database size={18} />
            </div>
            <div className="metric-text-group">
              <span className="metric-lbl">STORAGE STATE</span>
              <span className="metric-num tag-text">DUAL DIVERSE</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap gold">
              <ShieldCheck size={18} />
            </div>
            <div className="metric-text-group">
              <span className="metric-lbl">INTEGRITY DIGEST</span>
              <span className="metric-num">SHA-256</span>
            </div>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="dashboard-toolbar">
          <div className="dark-search-bar">
            <Search size={15} className="dark-search-icon" />
            <input
              type="text"
              placeholder="Search by student name, credential title, or reference code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark-filter-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-clear-filter"
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
          <div className="audit-counter-badge">
            <span>RECORDS:</span>
            <strong>{filteredCertificates.length}</strong>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="dark-table-card">
          {loading && (
            <div className="dark-loading-container">
              <div className="dark-loading-spinner"></div>
              <p>Synchronizing records with Unholy Trinity Verifier ledger...</p>
            </div>
          )}

          {error && (
            <div className="dark-alert error">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && filteredCertificates.length === 0 && (
            <div className="dark-empty-container">
              <div className="empty-shield-icon">
                <Award size={36} />
              </div>
              <h3>No Credential Records Found</h3>
              <p>
                {searchQuery
                  ? `No certificates matched the query "${searchQuery}".`
                  : 'The registry contains no issued certificates yet. Issue your first credential to begin.'}
              </p>
              {!searchQuery && (
                <Link to="/create" className="btn-dark-primary" style={{ marginTop: '1.25rem' }}>
                  <FilePlus size={15} />
                  <span>Issue First Credential</span>
                </Link>
              )}
            </div>
          )}

          {!loading && !error && filteredCertificates.length > 0 && (
            <div className="dark-table-responsive">
              <table className="dark-ledger-table">
                <thead>
                  <tr>
                    <th>REFERENCE ID</th>
                    <th>RECIPIENT NAME</th>
                    <th>PROGRAM / CONFERRAL</th>
                    <th>ISSUE DATE</th>
                    <th>LEDGER STATUS</th>
                    <th>CRYPTOGRAPHIC DIGEST</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id || cert._id || cert.certificateId}>
                      <td className="cell-id">
                        <span className="dark-mono-badge">{cert.certificateId}</span>
                      </td>
                      <td className="cell-recipient">
                        <strong>{cert.name}</strong>
                      </td>
                      <td className="cell-event">
                        <span>{cert.eventName}</span>
                      </td>
                      <td className="cell-date">
                        <span className="mono">
                          {cert.date ? new Date(cert.date).toISOString().split('T')[0] : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`dark-status-badge ${cert.isValid ? 'valid' : 'revoked'}`}>
                          <span className="status-dot"></span>
                          <span>{cert.isValid ? 'VERIFIED' : 'REVOKED'}</span>
                        </span>
                      </td>
                      <td className="cell-hash">
                        <span className="hash-chip mono" title={cert.certificateHash || 'SHA-256'}>
                          <Hash size={11} className="hash-ico" />
                          {cert.certificateHash
                            ? `${cert.certificateHash.slice(0, 8)}...${cert.certificateHash.slice(-6)}`
                            : '0x3f8a...e901'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/certificate/${cert.certificateId}`}
                          className="btn-inspect-link"
                          title="View Official Certificate"
                        >
                          <span>Inspect</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="dark-table-footer">
            <span>
              Showing <strong>{filteredCertificates.length}</strong> of <strong>{certificates.length}</strong> accredited records
            </span>
            <span className="contract-footnote">
              Hardhat EVM Smart Contract: <strong className="mono">0x5FbD...80aa3</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
