/**
 * Create Certificate Page — Unholy Trinity Verifier
 * Dark theme form to issue academic credentials with live interactive preview,
 * SHA-256 cryptographic hashing, and QR generation.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Award, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Hash, 
  Sparkles,
  FileText,
  ExternalLink,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import { downloadCertificatePDF } from '../services/pdfGenerator';
import './CreateCertificate.css';

const CreateCertificate = () => {
  const [formData, setFormData] = useState({
    name: '',
    eventName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [createdCertificate, setCreatedCertificate] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.eventName.trim()) {
      setError('Please provide all mandatory credential parameters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setCreatedCertificate(null);

      const response = await certificateService.createCertificate(formData);
      const data = response.data.data;

      setSuccess(response.data.message || 'Academic credential successfully issued and anchored to the ledger.');
      setCreatedCertificate(data);

      // Reset form
      setFormData({
        name: '',
        eventName: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error creating certificate:', err);
      setError(err.response?.data?.message || 'Failed to issue credential. Verify server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const copyHashToClipboard = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const downloadQRCode = () => {
    if (!createdCertificate?.qrCode) return;
    const link = document.createElement('a');
    link.href = createdCertificate.qrCode;
    link.download = `VERIFY_${createdCertificate.certificateId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dark-create-page">
      <div className="academic-container">
        
        {/* Page Header */}
        <div className="create-page-header">
          <div className="create-eyebrow-chip">
            <BookOpen size={13} />
            <span>UNHOLY TRINITY VERIFIER ISSUANCE</span>
          </div>
          <h1 className="create-title-dark">Issue Digital Certificate</h1>
          <p className="create-desc-dark">
            Generate an accredited digital credential with a cryptographic SHA-256 fingerprint, 
            immutable reference ID, and scannable verification seal.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="create-grid-layout">
          
          {/* Form Panel */}
          <div className="dark-form-card">
            <div className="card-top-head">
              <span className="step-tag">STEP 01</span>
              <h2 className="card-heading">Credential Parameters</h2>
            </div>

            <form onSubmit={handleSubmit} className="dark-issuance-form">
              {error && (
                <div className="form-alert-msg error">
                  <AlertTriangle size={17} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="form-alert-msg success">
                  <CheckCircle2 size={17} />
                  <span>{success}</span>
                </div>
              )}

              <div className="dark-field-group">
                <label htmlFor="name" className="dark-field-label">
                  RECIPIENT FULL NAME <span className="req">*</span>
                </label>
                <div className="dark-input-wrap">
                  <User size={15} className="dark-input-ico" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Katherine L. Howard"
                    required
                    disabled={loading}
                    className="dark-text-field"
                  />
                </div>
                <span className="dark-field-hint">Legal recipient name as encoded on the certificate</span>
              </div>

              <div className="dark-field-group">
                <label htmlFor="eventName" className="dark-field-label">
                  PROGRAM / DEGREE / EVENT TITLE <span className="req">*</span>
                </label>
                <div className="dark-input-wrap">
                  <Award size={15} className="dark-input-ico" />
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    required
                    disabled={loading}
                    className="dark-text-field"
                  />
                </div>
                <span className="dark-field-hint">Degree conferral, certification program, or coursework</span>
              </div>

              <div className="dark-field-group">
                <label htmlFor="date" className="dark-field-label">
                  CONFERRAL / ISSUANCE DATE <span className="req">*</span>
                </label>
                <div className="dark-input-wrap">
                  <Calendar size={15} className="dark-input-ico" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="dark-text-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-dark-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="submit-spinner"></div>
                    <span>ANCHORING RECORD TO LEDGER...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Issue & Anchor Credential</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview / Output Panel */}
          <div className="dark-form-card preview-col">
            <div className="card-top-head">
              <span className="step-tag">STEP 02</span>
              <h2 className="card-heading">
                {createdCertificate ? 'Issued Credential & Proof' : 'Live Document Preview'}
              </h2>
            </div>

            {createdCertificate ? (
              <div className="issued-success-card">
                <div className="success-status-stripe">
                  <div className="stripe-left">
                    <CheckCircle2 size={16} />
                    <span>CREDENTIAL ANCHORED SUCCESSFULLY</span>
                  </div>
                  <span className="stripe-pill">ACTIVE ON-CHAIN</span>
                </div>

                <div className="issued-meta-rows">
                  <div className="meta-row">
                    <span className="meta-tag">CERTIFICATE ID:</span>
                    <strong className="meta-data mono cyan">{createdCertificate.certificateId}</strong>
                  </div>
                  <div className="meta-row">
                    <span className="meta-tag">RECIPIENT:</span>
                    <strong className="meta-data">{createdCertificate.name}</strong>
                  </div>
                  <div className="meta-row">
                    <span className="meta-tag">PROGRAM:</span>
                    <strong className="meta-data">{createdCertificate.eventName}</strong>
                  </div>
                  <div className="meta-row">
                    <span className="meta-tag">DATE:</span>
                    <span className="meta-data mono">
                      {new Date(createdCertificate.date).toISOString().split('T')[0]}
                    </span>
                  </div>

                  {createdCertificate.certificateHash && (
                    <div className="digest-box-row">
                      <div className="digest-bar-top">
                        <span className="meta-tag">
                          <Hash size={11} />
                          <span>SHA-256 FINGERPRINT:</span>
                        </span>
                        <button
                          onClick={() => copyHashToClipboard(createdCertificate.certificateHash)}
                          className="btn-copy-digest-mini"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHash ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                          <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                      <code className="digest-val-box mono">
                        {createdCertificate.certificateHash}
                      </code>
                    </div>
                  )}
                </div>

                {/* QR Code Container */}
                <div className="issued-qr-wrap">
                  <span className="qr-title-lbl">OFFICIAL QR VERIFICATION SEAL</span>
                  <div className="qr-frame-box">
                    {createdCertificate.qrCode && (
                      <img
                        src={createdCertificate.qrCode}
                        alt="Certificate QR Verification Code"
                        className="qr-img-tag"
                      />
                    )}
                  </div>
                  <div className="issued-btns-cluster">
                    <button onClick={downloadQRCode} className="btn-save-qr">
                      <Download size={14} />
                      <span>Download QR</span>
                    </button>
                    <button 
                      onClick={() => downloadCertificatePDF(createdCertificate)} 
                      className="btn-export-pdf"
                    >
                      <FileText size={14} />
                      <span>Export PDF</span>
                    </button>
                  </div>
                  <div style={{ marginTop: '0.85rem', textAlign: 'center' }}>
                    <Link 
                      to={`/certificate/${createdCertificate.certificateId}`}
                      className="btn-inspect-full"
                    >
                      <span>Open Full Certificate Record</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Live Dark Parchment Preview while filling form */
              <div className="live-dark-preview">
                <div className="dark-preview-sheet">
                  <div className="sheet-inner-border">
                    <div className="sheet-emblem">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="sheet-heading-text">UNHOLY TRINITY VERIFIER</div>
                    <div className="sheet-conferral-lead">This certifies that</div>
                    <div className="sheet-recipient-name">
                      {formData.name.trim() || 'RECIPIENT NAME'}
                    </div>
                    <div className="sheet-for-text">has satisfied all requirements for the conferral of</div>
                    <div className="sheet-program-name">
                      {formData.eventName.trim() || 'CREDENTIAL / DEGREE PROGRAM'}
                    </div>
                    <div className="sheet-date-line">
                      Conferred on: {formData.date || 'YYYY-MM-DD'}
                    </div>
                    <div className="sheet-bottom-line">
                      <span className="mono">ID: PENDING SUBMISSION</span>
                      <span className="sheet-seal-badge">AUTHENTICATED</span>
                    </div>
                  </div>
                </div>
                <p className="preview-caption-text">
                  Live preview updates in real time. Upon submission, a canonical SHA-256 digest 
                  and scannable QR verification seal will be minted to the ledger.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCertificate;
