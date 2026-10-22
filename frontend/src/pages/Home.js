/**
 * Home Page Component — Unholy Trinity Verifier
 * Cohesive dark theme with photographic hero, instant lookup terminal,
 * Tri-Fold Trust Architecture, interactive certificate preview, and team attribution.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Database, 
  Cpu, 
  QrCode, 
  Check, 
  Copy, 
  Users, 
  Lock, 
  FileCheck2,
  FileText,
  Key,
  Layers
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import './Home.css';

const Home = () => {
  // Verification Search State
  const [certIdInput, setCertIdInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Recent sample certificates for quick testing
  const [recentCertificates, setRecentCertificates] = useState([]);

  useEffect(() => {
    // Fetch recent certificates to provide quick verification samples
    const loadSampleCerts = async () => {
      try {
        const response = await certificateService.getAllCertificates();
        const data = response.data?.data || [];
        if (data.length > 0) {
          setRecentCertificates(data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load sample certificates:', err);
      }
    };
    loadSampleCerts();
  }, []);

  const handleVerifySubmit = async (e) => {
    if (e) e.preventDefault();
    const query = certIdInput.trim();
    if (!query) {
      setVerificationError('Please enter a valid certificate reference identifier.');
      setVerificationResult(null);
      return;
    }

    try {
      setVerifying(true);
      setVerificationError(null);
      setVerificationResult(null);

      const response = await certificateService.verifyCertificate(query);
      const data = response.data?.data;
      if (data) {
        setVerificationResult(data);
      } else {
        setVerificationError('No matching academic credential found in the registry.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationError(
        err.response?.data?.message || 'Certificate identifier not found in the official registry.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleSampleClick = (id) => {
    setCertIdInput(id);
    setTimeout(() => {
      executeSampleVerification(id);
    }, 50);
  };

  const executeSampleVerification = async (id) => {
    try {
      setVerifying(true);
      setVerificationError(null);
      setVerificationResult(null);
      const response = await certificateService.verifyCertificate(id);
      setVerificationResult(response.data?.data);
    } catch (err) {
      setVerificationError('Unable to verify sample certificate.');
    } finally {
      setVerifying(false);
    }
  };

  const copyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const scrollToVerify = () => {
    const el = document.getElementById('verification-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dark-home-page">
      {/* =========================================================================
          HERO SECTION — WIDE EDITORIAL WITH REAL ACADEMIC PHOTOGRAPHY
          ========================================================================= */}
      <section className="dark-hero-section">
        {/* Photographic background with deliberate dark overlay */}
        <div className="hero-backdrop">
          <img 
            src={process.env.PUBLIC_URL + '/assets/campus-hero.jpg'} 
            alt="University Campus Architecture" 
            className="hero-backdrop-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <div className="hero-dark-scrim"></div>
        </div>

        <div className="academic-container hero-inner-container">
          <div className="hero-grid">
            {/* Left Column: Headlines & Actions */}
            <div className="hero-text-block">
              <div className="hero-eyebrow-pill">
                <span className="eyebrow-dot"></span>
                <span>TRI-FOLD ACADEMIC AUTHENTICATION</span>
              </div>

              <h1 className="hero-headline">
                Trust the credential. <br />
                <span className="headline-accent">Verify the record.</span>
              </h1>

              <p className="hero-subhead">
                Verify digital academic certificates through a clear, reliable process using their unique certificate references. 
                Unholy Trinity Verifier establishes immutable confidence by correlating deterministic SHA-256 digests, 
                an on-chain EVM smart contract ledger, and an authorized registry.
              </p>

              <div className="hero-btn-row">
                <button onClick={scrollToVerify} className="btn-cyan-primary">
                  <Search size={17} />
                  <span>Verify a Certificate</span>
                </button>
                <button onClick={scrollToHowItWorks} className="btn-ghost-secondary">
                  <span>How It Works</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="hero-pillar-chips">
                <div className="pillar-chip">
                  <Lock size={14} className="chip-icon" />
                  <span>SHA-256 Cryptography</span>
                </div>
                <div className="chip-sep">/</div>
                <div className="pillar-chip">
                  <Cpu size={14} className="chip-icon" />
                  <span>EVM Smart Contract</span>
                </div>
                <div className="chip-sep">/</div>
                <div className="pillar-chip">
                  <Database size={14} className="chip-icon" />
                  <span>Registry Audit Trail</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Document Certificate Preview */}
            <div className="hero-preview-block">
              <div className="dark-cert-preview-card">
                <div className="preview-card-header">
                  <div className="preview-crest">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="preview-org-meta">
                    <span className="preview-org-title">UNHOLY TRINITY VERIFIER</span>
                    <span className="preview-org-sub">TRI-FOLD AUTHENTIC RECORD</span>
                  </div>
                  <span className="preview-status-pill">
                    <CheckCircle2 size={12} />
                    <span>AUTHENTIC</span>
                  </span>
                </div>

                <div className="preview-card-body">
                  <div className="preview-lead">This is to officially certify that</div>
                  <div className="preview-recipient">SATOSHI NAKAMOTO</div>
                  <div className="preview-conferred">
                    has successfully satisfied all prescribed requirements for
                  </div>
                  <div className="preview-program">
                    Decentralized Systems Mastery
                  </div>
                  
                  <div className="preview-meta-grid">
                    <div className="preview-meta-item">
                      <span className="meta-k">REFERENCE ID</span>
                      <strong className="meta-v mono">CERT-1792675186461-9F67</strong>
                    </div>
                    <div className="preview-meta-item">
                      <span className="meta-k">CONFERRAL</span>
                      <span className="meta-v">October 2026</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="meta-k">LAYER STATE</span>
                      <span className="meta-v green">Anchored (NFT)</span>
                    </div>
                  </div>
                </div>

                <div className="preview-card-footer">
                  <span className="footer-hash-preview mono">
                    SHA-256: 3f8a9e01...b942d7
                  </span>
                  <div className="footer-audit-seal">
                    <QrCode size={14} />
                    <span>ON-CHAIN PROOF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PROMINENT VERIFICATION INTERFACE
          Focused certificate lookup with live backend interrogation
          ========================================================================= */}
      <section id="verification-section" className="dark-verify-section">
        <div className="academic-container">
          <div className="verify-panel-card">
            <div className="panel-header-center">
              <span className="badge-terminal">
                <Search size={13} />
                <span>INSTANT RECORD LOOKUP</span>
              </span>
              <h2 className="panel-title">Verify an Academic Certificate</h2>
              <p className="panel-subtitle">
                Enter the unique certificate reference code to interrogate the immutable ledger and audit records.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleVerifySubmit} className="verify-search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={certIdInput}
                  onChange={(e) => setCertIdInput(e.target.value)}
                  placeholder="Enter Certificate Reference ID (e.g. CERT-1792675186461-9F6767E5)"
                  className="dark-search-input"
                  aria-label="Certificate Reference ID"
                />
                <button 
                  type="submit" 
                  disabled={verifying}
                  className="btn-search-exec"
                >
                  {verifying ? (
                    <span className="dark-spinner-sm"></span>
                  ) : (
                    <Search size={16} />
                  )}
                  <span>{verifying ? 'Checking...' : 'Verify Record'}</span>
                </button>
              </div>
            </form>

            {/* Live Test Recommendations from Backend Ledger */}
            {recentCertificates.length > 0 && (
              <div className="sample-records-row">
                <span className="sample-label">Or test an existing issued credential:</span>
                <div className="sample-btn-cluster">
                  {recentCertificates.map((cert) => (
                    <button
                      key={cert.certificateId}
                      type="button"
                      onClick={() => handleSampleClick(cert.certificateId)}
                      className="btn-sample-record"
                    >
                      <CheckCircle2 size={12} className="sample-check" />
                      <span>{cert.name}: <strong className="mono">{cert.certificateId}</strong></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Notice */}
            {verificationError && (
              <div className="verify-alert-box error">
                <AlertCircle size={20} className="alert-icon" />
                <div className="alert-content">
                  <strong>Verification Notice</strong>
                  <p>{verificationError}</p>
                </div>
              </div>
            )}

            {/* Verification Result Card */}
            {verificationResult && (
              <div className="verify-result-box">
                <div className="result-top-banner">
                  <div className="result-status-wrap">
                    <div className="result-status-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="result-title">Authentic Academic Credential</h4>
                      <p className="result-desc">
                        Record verified against cryptographic fingerprint and EVM smart contract ledger.
                      </p>
                    </div>
                  </div>
                  <span className="status-tag-active">VERIFIED & ACTIVE</span>
                </div>

                <div className="result-fields-grid">
                  <div className="field-cell">
                    <span className="cell-label">RECIPIENT NAME</span>
                    <strong className="cell-value">{verificationResult.name}</strong>
                  </div>

                  <div className="field-cell">
                    <span className="cell-label">CREDENTIAL / DEGREE PROGRAM</span>
                    <strong className="cell-value">{verificationResult.eventName}</strong>
                  </div>

                  <div className="field-cell">
                    <span className="cell-label">DATE OF CONFERRAL</span>
                    <span className="cell-value mono">
                      {verificationResult.date ? new Date(verificationResult.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>

                  <div className="field-cell">
                    <span className="cell-label">CERTIFICATE IDENTIFIER</span>
                    <span className="cell-value mono highlight">{verificationResult.certificateId}</span>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Digest */}
                {verificationResult.certificateHash && (
                  <div className="result-digest-row">
                    <div className="digest-header-line">
                      <span className="cell-label">CRYPTOGRAPHIC SHA-256 FINGERPRINT</span>
                      <button 
                        type="button" 
                        onClick={() => copyHash(verificationResult.certificateHash)}
                        className="btn-copy-digest"
                        title="Copy cryptographic hash"
                      >
                        {copiedHash ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                        <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                    <code className="digest-string mono">{verificationResult.certificateHash}</code>
                  </div>
                )}

                <div className="result-actions-strip">
                  <Link 
                    to={`/certificate/${verificationResult.certificateId}`}
                    className="btn-action-diploma"
                  >
                    <span>View Official Certificate & Print</span>
                    <ExternalLink size={15} />
                  </Link>
                  <Link to="/verify" className="btn-action-terminal">
                    <span>Open Camera QR Scanner</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SERVICE EXPLANATION: WHAT WE DO & HOW A USER VERIFIES
          Wix Locksmith Service-Style Editorial with Real Academic Photography
          ========================================================================= */}
      <section className="dark-service-editorial-section">
        <div className="academic-container">
          
          {/* Service Block 1: What the System Does & Verification Channels */}
          <div className="service-editorial-split">
            <div className="service-editorial-visual">
              <div className="service-photo-frame">
                <img 
                  src={process.env.PUBLIC_URL + '/assets/library-trust.jpg'} 
                  alt="Academic Research Library and Archives" 
                  className="service-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="service-photo-badge">
                  <ShieldCheck size={16} />
                  <span>ACCREDITED VERIFICATION STANDARD</span>
                </div>
              </div>
              <div className="service-stat-strip">
                <div className="stat-item">
                  <strong>&lt; 1 sec</strong>
                  <span>Audit Latency</span>
                </div>
                <div className="stat-sep"></div>
                <div className="stat-item">
                  <strong>100%</strong>
                  <span>Deterministic Hash</span>
                </div>
                <div className="stat-sep"></div>
                <div className="stat-item">
                  <strong>EVM 31337</strong>
                  <span>Cancun Consensus</span>
                </div>
              </div>
            </div>

            <div className="service-editorial-content">
              <div className="service-eyebrow-tag">
                <Layers size={13} />
                <span>SERVICE FUNCTIONALITY</span>
              </div>
              <h2 className="service-heading">What Unholy Trinity Verifier Does</h2>
              <p className="service-lead-text">
                Unholy Trinity Verifier replaces slow manual transcript verifications and insecure PDF diplomas 
                with an automated, mathematically non-falsifiable audit service.
              </p>

              <div className="service-features-list">
                <div className="service-feature-item">
                  <div className="feature-icon-bullet">
                    <Search size={16} />
                  </div>
                  <div className="feature-text-block">
                    <h4>How a User Verifies a Certificate</h4>
                    <p>
                      Users can verify credentials through three versatile channels: by entering the unique 
                      alphanumeric reference code directly into our audit terminal, by using their device camera 
                      to scan a physical diploma's QR seal, or by uploading an existing certificate image file.
                    </p>
                  </div>
                </div>

                <div className="service-feature-item">
                  <div className="feature-icon-bullet">
                    <FileText size={16} />
                  </div>
                  <div className="feature-text-block">
                    <h4>What Information is Returned</h4>
                    <p>
                      Every successful query returns the verified recipient's legal name, conferred academic degree 
                      or certificate title, formal date of conferral, authoritative SHA-256 digest, and confirmed 
                      ERC-721 smart contract anchoring status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="service-link-cta">
                <Link to="/verify" className="btn-service-action">
                  <span>Open Verification Terminal</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          <div className="service-divider-line"></div>

          {/* Service Block 2: Workflow & Authentic Blockchain Role */}
          <div className="service-editorial-split reverse">
            <div className="service-editorial-content">
              <div className="service-eyebrow-tag">
                <Cpu size={13} />
                <span>CRYPTOGRAPHIC ARCHITECTURE</span>
              </div>
              <h2 className="service-heading">How the QR Code & Blockchain Operate</h2>
              <p className="service-lead-text">
                We believe in technical accuracy over marketing buzzwords. Here is how our certificate reference 
                workflow and blockchain consensus actually function.
              </p>

              <div className="service-features-list">
                <div className="service-feature-item">
                  <div className="feature-icon-bullet">
                    <QrCode size={16} />
                  </div>
                  <div className="feature-text-block">
                    <h4>Certificate ID & QR-Code Workflow</h4>
                    <p>
                      Each issued diploma receives a collision-resistant reference identifier derived from institutional 
                      epoch timestamps and cryptographic entropy. An official vector QR seal is generated, embedding the 
                      direct validation URI so that printed paper credentials can be audited instantly via any smartphone.
                    </p>
                  </div>
                </div>

                <div className="service-feature-item">
                  <div className="feature-icon-bullet">
                    <Lock size={16} />
                  </div>
                  <div className="feature-text-block">
                    <h4>Authentic Role of Blockchain & NFT Consensus</h4>
                    <p>
                      Rather than storing cumbersome PDFs on-chain, our engine computes a 32-byte SHA-256 fingerprint 
                      from the certificate parameters and commits it to our deployed Ethereum ERC-721 smart contract 
                      (Cancun EVM, Chain ID 31337). A unique NFT token ID is minted to immutably timestamp the record, 
                      rendering retroactive forgery or deletion mathematically impossible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="service-link-cta">
                <Link to="/admin" className="btn-service-action">
                  <span>Inspect Audit Ledger</span>
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>

            <div className="service-editorial-visual">
              <div className="service-photo-frame">
                <img 
                  src={process.env.PUBLIC_URL + '/assets/academic-archive.jpg'} 
                  alt="Archival Diploma and Certification Records" 
                  className="service-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="service-photo-badge">
                  <Key size={16} />
                  <span>IMMUTABLE NFT LEDGER ANCHOR</span>
                </div>
              </div>
              <div className="service-stat-strip">
                <div className="stat-item">
                  <strong>ERC-721</strong>
                  <span>NFT Standard</span>
                </div>
                <div className="stat-sep"></div>
                <div className="stat-item">
                  <strong>Dual-Tier</strong>
                  <span>Storage Fallback</span>
                </div>
                <div className="stat-sep"></div>
                <div className="stat-item">
                  <strong>Zero-Trust</strong>
                  <span>Tamper Detection</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          THE THREE PILLARS OF TRUST (THE TRINITY ARCHITECTURE)
          Explaining the authentic three-layer security model
          ========================================================================= */}
      <section className="dark-trinity-section">
        <div className="academic-container">
          <div className="section-head-center">
            <span className="section-eyebrow">THE TRI-FOLD SECURITY MODEL</span>
            <h2 className="section-title">The Three Pillars of Verification</h2>
            <p className="section-lead">
              Unholy Trinity Verifier establishes immutable confidence by correlating three independent layers of verification.
            </p>
          </div>

          <div className="trinity-cards-grid">
            {/* Pillar 1 */}
            <div className="trinity-card">
              <div className="pillar-num">01</div>
              <div className="pillar-icon-box">
                <Lock size={22} />
              </div>
              <h3 className="pillar-title">Cryptographic Fingerprint</h3>
              <p className="pillar-desc">
                Every certificate's recipient name, academic program, and conferral date are computed into a deterministic 
                SHA-256 cryptographic digest. Any alteration to even a single character invalidates the hash.
              </p>
              <div className="pillar-footer-tag">
                <span>Deterministic SHA-256</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="trinity-card featured-pillar">
              <div className="pillar-num">02</div>
              <div className="pillar-icon-box cyan">
                <Cpu size={22} />
              </div>
              <h3 className="pillar-title">Immutable EVM Smart Contract</h3>
              <p className="pillar-desc">
                The computed credential hash is minted as an ERC-721 non-fungible token on the Ethereum EVM ledger 
                (Cancun EVM, Chain ID 31337). Retroactive tampering is rendered cryptographically impossible.
              </p>
              <div className="pillar-footer-tag">
                <span>ERC-721 NFT Consensus</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="trinity-card">
              <div className="pillar-num">03</div>
              <div className="pillar-icon-box">
                <Database size={22} />
              </div>
              <h3 className="pillar-title">High-Availability Registry</h3>
              <p className="pillar-desc">
                An authorized dual-tier repository provides instant sub-second verification for recruiters, admissions 
                officers, and licensing bodies, with continuous operation even during external network maintenance.
              </p>
              <div className="pillar-footer-tag">
                <span>Dual-Tier Resilience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VERIFICATION WORKFLOW (4 STEPS)
          ========================================================================= */}
      <section id="how-it-works-section" className="dark-workflow-section">
        <div className="academic-container">
          <div className="section-head-center">
            <span className="section-eyebrow">AUDIT PROTOCOL</span>
            <h2 className="section-title">How the Workflow Operates</h2>
            <p className="section-lead">
              A transparent verification lifecycle from university registrar conferral to employer verification.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-box">
              <div className="step-count">STEP 01</div>
              <h4 className="step-heading">Registrar Issuance</h4>
              <p className="step-body">
                The authorized institution submits student details, degree program, and date through the issuance portal.
              </p>
              <span className="step-badge">
                <FileCheck2 size={13} />
                <span>Data Ingestion</span>
              </span>
            </div>

            <div className="workflow-step-box">
              <div className="step-count">STEP 02</div>
              <h4 className="step-heading">Cryptographic Anchoring</h4>
              <p className="step-body">
                A unique SHA-256 digest is generated and anchored to the local EVM smart contract as an NFT record.
              </p>
              <span className="step-badge">
                <Lock size={13} />
                <span>On-Chain Commitment</span>
              </span>
            </div>

            <div className="workflow-step-box">
              <div className="step-count">STEP 03</div>
              <h4 className="step-heading">QR Code Generation</h4>
              <p className="step-body">
                The student receives a printable diploma accompanied by an official high-resolution QR verification seal.
              </p>
              <span className="step-badge">
                <QrCode size={13} />
                <span>Scannable Seal</span>
              </span>
            </div>

            <div className="workflow-step-box">
              <div className="step-count">STEP 04</div>
              <h4 className="step-heading">Instant Audit</h4>
              <p className="step-body">
                Verifiers enter the ID or scan the QR code to validate certificate authenticity against the ledger in seconds.
              </p>
              <span className="step-badge">
                <CheckCircle2 size={13} />
                <span>Zero Alteration</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REAL ACADEMIC IMAGERY BANNER
          Featuring graduation & research library photographs
          ========================================================================= */}
      <section className="dark-photo-banner-section">
        <div className="academic-container">
          <div className="photo-banner-card">
            <div className="banner-photo-wrapper">
              <img 
                src={process.env.PUBLIC_URL + '/assets/graduation.jpg'} 
                alt="University Graduates with Diplomas" 
                className="banner-photo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1600&q=80";
                }}
              />
              <div className="banner-photo-overlay"></div>
            </div>

            <div className="banner-content">
              <span className="section-eyebrow">ACCREDITED REGISTRATION</span>
              <h3 className="banner-title">Ready to issue or audit academic credentials?</h3>
              <p className="banner-desc">
                Access the registrar ledger to inspect existing issued records or issue a new verifiable certificate 
                with SHA-256 fingerprinting and on-chain NFT anchoring.
              </p>
              <div className="banner-actions">
                <Link to="/create" className="btn-cyan-primary">
                  <FileCheck2 size={16} />
                  <span>Issue New Certificate</span>
                </Link>
                <Link to="/admin" className="btn-ghost-secondary">
                  <Database size={16} />
                  <span>View Registry Ledger</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PROJECT TEAM SECTION
          Exact names: Dinesh Kumar JB, Sanjay, Bharath Vikraman
          Clickable GitHub link for Dinesh Kumar JB: https://github.com/Dineshkumar-jb
          ========================================================================= */}
      <section className="dark-team-section">
        <div className="academic-container">
          <div className="team-container-box">
            <div className="team-header-center">
              <span className="badge-team">
                <Users size={13} />
                <span>PROJECT DEVELOPMENT</span>
              </span>
              <h2 className="team-heading">Project Development Team</h2>
              <p className="team-lead">
                Engineered by the project team as a verifiable academic credential and blockchain verification system.
              </p>
            </div>

            <div className="team-members-grid">
              {/* Member 1: Dinesh Kumar JB */}
              <div className="team-card highlighted">
                <div className="member-avatar">DK</div>
                <h3 className="member-name">Dinesh Kumar JB</h3>
                <span className="member-subtitle">Lead Developer & Architecture</span>
                <a 
                  href="https://github.com/Dineshkumar-jb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="member-github-btn"
                  title="Visit Dinesh Kumar JB's GitHub Profile"
                >
                  <span>GitHub Profile</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Member 2: Sanjay */}
              <div className="team-card">
                <div className="member-avatar">S</div>
                <h3 className="member-name">Sanjay</h3>
                <span className="member-subtitle">Core Systems & Verification</span>
              </div>

              {/* Member 3: Bharath Vikraman */}
              <div className="team-card">
                <div className="member-avatar">BV</div>
                <h3 className="member-name">Bharath Vikraman</h3>
                <span className="member-subtitle">Smart Contract & Ledger Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
