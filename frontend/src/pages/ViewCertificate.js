/**
 * View Certificate Page — Unholy Trinity Verifier
 * Document-like presentation of digital credentials with printable formatting,
 * QR verification seal, and PDF export.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  Copy, 
  Check, 
  Search,
  FileText
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import { downloadCertificatePDF } from '../services/pdfGenerator';
import './ViewCertificate.css';

const ViewCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await certificateService.getCertificate(id);
        setCertificate(response.data?.data);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.response?.data?.message || 'Certificate not found in the official registry.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const copyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const copyId = (certId) => {
    if (!certId) return;
    navigator.clipboard.writeText(certId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="dark-view-page">
        <div className="view-loading-card">
          <div className="view-spinner"></div>
          <p>Retrieving accredited credential record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark-view-page">
        <div className="view-err-card">
          <AlertTriangle size={36} color="#EF4444" />
          <h2>Credential Record Not Found</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Link to="/admin" className="btn-dark-secondary">
              <ArrowLeft size={16} />
              <span>Return to Registry</span>
            </Link>
            <Link to="/verify" className="btn-dark-primary">
              <Search size={16} />
              <span>Verify Other Identifier</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) return null;

  return (
    <div className="dark-view-page">
      <div className="academic-container">
        
        {/* Navigation & Action Toolbar (Hidden during print) */}
        <div className="dark-view-toolbar no-print">
          <Link to="/admin" className="view-back-link">
            <ArrowLeft size={16} />
            <span>Registry Ledger</span>
          </Link>

          <div className="view-btn-group">
            <button 
              onClick={() => copyId(certificate.certificateId)} 
              className="btn-toolbar-dark"
              title="Copy Certificate Reference ID"
            >
              {copiedId ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copiedId ? 'ID Copied' : 'Copy ID'}</span>
            </button>
            <Link to={`/verify`} className="btn-toolbar-dark">
              <Search size={14} />
              <span>Audit Terminal</span>
            </Link>
            <button onClick={handlePrint} className="btn-toolbar-dark">
              <Printer size={14} />
              <span>Print Diploma</span>
            </button>
            <button onClick={() => downloadCertificatePDF(certificate)} className="btn-toolbar-dark">
              <FileText size={14} />
              <span>Download Official PDF</span>
            </button>
            {certificate.qrCode && (
              <a
                href={certificate.qrCode}
                download={`QR_${certificate.certificateId}.png`}
                className="btn-toolbar-highlight"
              >
                <Download size={14} />
                <span>Save QR Seal</span>
              </a>
            )}
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL DIPLOMA DOCUMENT FRAME
            ========================================================================= */}
        <div className="dark-diploma-wrapper">
          <div className="diploma-sheet-container">
            <div className="diploma-double-outer">
              <div className="diploma-double-inner">

                {/* Institutional Crest & Header */}
                <div className="diploma-head-section">
                  <div className="diploma-crest-box">
                    <ShieldCheck size={36} />
                  </div>
                  <div className="diploma-titles-group">
                    <span className="diploma-sup-title">UNHOLY TRINITY VERIFIER // TRI-FOLD PROTOCOL</span>
                    <h2 className="diploma-main-title">ACADEMIC CREDENTIAL OF ATTAINMENT</h2>
                    <span className="diploma-sub-title">AUTHENTICATED ON IMMUTABLE EVM SMART CONTRACT LEDGER</span>
                  </div>
                </div>

                {/* Presentation Body */}
                <div className="diploma-body-section">
                  <p className="diploma-lead-txt">This is an official document to certify that</p>
                  
                  <h1 className="diploma-student-name">{certificate.name}</h1>
                  
                  <p className="diploma-conferral-body">
                    has successfully satisfied all prescribed requirements of coursework and examination 
                    and is hereby awarded this formal credential of attainment for
                  </p>

                  <h3 className="diploma-program-title">{certificate.eventName}</h3>
                </div>

                {/* Metadata & Audit Footer */}
                <div className="diploma-bottom-grid">
                  
                  {/* Left Column: Metadata & Security */}
                  <div className="diploma-info-column">
                    <div className="diploma-meta-pair">
                      <span className="meta-pair-label">CERTIFICATE REFERENCE ID</span>
                      <strong className="meta-pair-val mono cyan">{certificate.certificateId}</strong>
                    </div>

                    <div className="diploma-meta-pair">
                      <span className="meta-pair-label">DATE OF CONFERRAL</span>
                      <span className="meta-pair-val mono">
                        {new Date(certificate.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="diploma-meta-pair">
                      <span className="meta-pair-label">CONSENSUS & IMMUTABILITY STATE</span>
                      <div className="security-status-badge">
                        <CheckCircle2 size={13} />
                        <span>SMART CONTRACT VERIFIED (ERC-721 NFT)</span>
                      </div>
                    </div>

                    {certificate.certificateHash && (
                      <div className="diploma-meta-pair digest-pair">
                        <div className="digest-bar-line">
                          <span className="meta-pair-label">
                            <Hash size={11} />
                            <span>CRYPTOGRAPHIC SHA-256 DIGEST</span>
                          </span>
                          <button
                            onClick={() => copyHash(certificate.certificateHash)}
                            className="btn-copy-digest-mini no-print"
                            title="Copy Fingerprint"
                          >
                            {copiedHash ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                            <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <code className="digest-code-view mono">
                          {certificate.certificateHash}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Right Column: QR Verification Seal */}
                  <div className="diploma-seal-column">
                    <div className="diploma-qr-wrapper">
                      {certificate.qrCode && (
                        <img
                          src={certificate.qrCode}
                          alt="Verification QR Code"
                          className="diploma-qr-img"
                        />
                      )}
                    </div>
                    <span className="seal-text-title">OFFICIAL AUDIT SEAL</span>
                    <span className="seal-text-sub mono">SCAN TO VERIFY LEDGER</span>
                  </div>

                </div>

                {/* Bottom Legal Disclaimer */}
                <div className="diploma-legal-footnote">
                  <span>
                    UNHOLY TRINITY VERIFIER • HARDHAT EVM (CHAIN ID 31337) • CONTRACT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewCertificate;
