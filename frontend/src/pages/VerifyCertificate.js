/**
 * Verify Certificate Page — Unholy Trinity Verifier
 * Multi-modal verification terminal supporting manual ID entry,
 * live camera QR scanning, and image upload.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Hash, 
  RotateCcw, 
  Copy, 
  Check, 
  Lock, 
  FileCheck,
  Camera,
  Upload,
  Keyboard,
  StopCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { certificateService } from '../services/certificateService';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Scanner modes: 'manual' | 'camera' | 'upload'
  const [scanMode, setScanMode] = useState('manual');
  const [cameraError, setCameraError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Camera stop error:', e);
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setVerificationResult(null);

    setTimeout(async () => {
      try {
        const qrCodeScanner = new Html5Qrcode('qr-camera-region');
        html5QrCodeRef.current = qrCodeScanner;

        await qrCodeScanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 }
          },
          async (decodedText) => {
            await stopCamera();
            setCertificateId(decodedText);
            setScanMode('manual');
            executeVerification(decodedText);
          },
          () => {}
        );
      } catch (err) {
        console.error('Camera init error:', err);
        setCameraError('Unable to access video camera. Please verify device permissions or try uploading a QR image.');
      }
    }, 200);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setVerificationResult(null);
    setLoading(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-hidden-region');
      const decodedText = await html5QrCode.scanFile(file, true);
      setCertificateId(decodedText);
      setScanMode('manual');
      executeVerification(decodedText);
    } catch (err) {
      console.error('QR Decode error:', err);
      setError('Could not decode QR barcode from the uploaded file. Please ensure the code is in focus and unclipped.');
      setLoading(false);
    }
  };

  const executeVerification = async (idToVerify) => {
    const targetId = (idToVerify || certificateId).trim();
    if (!targetId) {
      setError('Please provide a valid certificate reference ID to verify.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setVerificationResult(null);

      const response = await certificateService.verifyCertificate(targetId);
      setVerificationResult(response.data);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError(err.response?.data?.message || 'Certificate verification query failed.');
      setVerificationResult({
        success: false,
        isValid: false,
        message: 'Certificate ID not found on smart contract ledger or database.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    executeVerification(certificateId);
  };

  const handleClear = () => {
    setCertificateId('');
    setError(null);
    setVerificationResult(null);
    stopCamera();
  };

  const copyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="dark-verify-page">
      <div className="academic-container">
        
        {/* Page Header */}
        <div className="verify-page-head">
          <div className="verify-eyebrow-badge">
            <BookOpen size={13} />
            <span>UNHOLY TRINITY VERIFIER TERMINAL</span>
          </div>
          <h1 className="verify-heading">Verify Certificate Authenticity</h1>
          <p className="verify-desc">
            Validate digital credentials against our Tri-Fold cryptographic architecture 
            using reference IDs, live webcam scanning, or QR image files.
          </p>
        </div>

        {/* Verification Card */}
        <div className="verify-terminal-frame">
          
          {/* Mode Selector Tabs */}
          <div className="verify-tabs-row">
            <button
              onClick={() => { stopCamera(); setScanMode('manual'); }}
              className={`mode-btn ${scanMode === 'manual' ? 'active' : ''}`}
            >
              <Keyboard size={15} />
              <span>Reference ID</span>
            </button>
            <button
              onClick={() => { setScanMode('camera'); startCamera(); }}
              className={`mode-btn ${scanMode === 'camera' ? 'active' : ''}`}
            >
              <Camera size={15} />
              <span>Camera QR Scanner</span>
            </button>
            <button
              onClick={() => { stopCamera(); setScanMode('upload'); }}
              className={`mode-btn ${scanMode === 'upload' ? 'active' : ''}`}
            >
              <Upload size={15} />
              <span>Upload QR Image</span>
            </button>
          </div>

          {/* Mode 1: Manual Input */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="verify-form-row">
              <div className="verify-input-box">
                <Search size={17} className="verify-ico" />
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate reference ID (e.g. CERT-1792675186461-9F6767E5)"
                  disabled={loading}
                  className="verify-input-dark"
                />
                <button
                  type="submit"
                  className="btn-verify-exec"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="verify-spinner-sm"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search size={15} />
                      <span>Verify Record</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="camera-scan-wrap">
              {cameraError ? (
                <div className="camera-err-box">
                  <AlertTriangle size={24} color="#EF4444" />
                  <p>{cameraError}</p>
                  <button onClick={startCamera} className="btn-retry-cam">
                    Retry Camera Access
                  </button>
                </div>
              ) : (
                <div className="camera-viewport-card">
                  <div id="qr-camera-region" className="camera-video-target"></div>
                  <div className="camera-reticle-frame">
                    <div className="reticle-corner tl"></div>
                    <div className="reticle-corner tr"></div>
                    <div className="reticle-corner bl"></div>
                    <div className="reticle-corner br"></div>
                  </div>
                  <p className="camera-hint-text">Position the certificate QR seal within the crosshairs</p>
                  <button onClick={() => { stopCamera(); setScanMode('manual'); }} className="btn-cancel-cam">
                    <StopCircle size={15} />
                    <span>Cancel Camera Scan</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Image File Upload */}
          {scanMode === 'upload' && (
            <div className="upload-scan-wrap">
              <label htmlFor="qr-file-input" className="dark-file-dropzone">
                <Upload size={38} className="dropzone-svg" />
                <h4>Select Certificate QR Image to Decode</h4>
                <p>Upload a PNG, JPEG, or screenshot containing the certificate QR code</p>
                <span className="btn-file-select">
                  Browse Device Files
                </span>
                <input
                  type="file"
                  id="qr-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          {/* Hidden region for file decoder */}
          <div id="qr-hidden-region" style={{ display: 'none' }}></div>

          {error && (
            <div className="verify-alert-banner error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* =========================================================================
              VERIFICATION OUTCOME CARD
              ========================================================================= */}
          {verificationResult && (
            <div className={`dark-outcome-card ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
              
              <div className="outcome-banner-row">
                <div className="outcome-icon-circle">
                  {verificationResult.isValid ? (
                    <ShieldCheck size={30} className="outcome-svg valid" />
                  ) : (
                    <XCircle size={30} className="outcome-svg invalid" />
                  )}
                </div>

                <div className="outcome-text-group">
                  <div className="outcome-badge-line">
                    <span className={`outcome-chip ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
                      {verificationResult.isValid ? 'OFFICIALLY VERIFIED' : 'UNREGISTERED RECORD'}
                    </span>
                    {verificationResult.blockchain?.tokenId && (
                      <span className="outcome-nft-pill">
                        ON-CHAIN NFT #{verificationResult.blockchain.tokenId}
                      </span>
                    )}
                  </div>
                  <h3 className="outcome-title-txt">{verificationResult.message}</h3>
                </div>
              </div>

              {/* Data Breakdown Grid */}
              {verificationResult.isValid && verificationResult.data && (
                <div className="outcome-grid-cells">
                  <div className="outcome-cell">
                    <span className="cell-tag">RECIPIENT NAME</span>
                    <strong className="cell-data">{verificationResult.data.name}</strong>
                  </div>

                  <div className="outcome-cell">
                    <span className="cell-tag">ACADEMIC PROGRAM / CONFERRAL</span>
                    <strong className="cell-data">{verificationResult.data.eventName}</strong>
                  </div>

                  <div className="outcome-cell">
                    <span className="cell-tag">DATE OF CONFERRAL</span>
                    <span className="cell-data mono">
                      {new Date(verificationResult.data.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="outcome-cell">
                    <span className="cell-tag">CERTIFICATE REFERENCE ID</span>
                    <span className="cell-data mono cyan">{verificationResult.data.certificateId}</span>
                  </div>

                  {verificationResult.data.certificateHash && (
                    <div className="outcome-cell full-span">
                      <div className="digest-header-bar">
                        <span className="cell-tag">
                          <Hash size={11} />
                          <span>CRYPTOGRAPHIC SHA-256 DIGEST</span>
                        </span>
                        <button
                          onClick={() => copyHash(verificationResult.data.certificateHash)}
                          className="btn-copy-digest-action"
                          title="Copy Digest"
                        >
                          {copiedHash ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                          <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                      <code className="digest-code-block mono">
                        {verificationResult.data.certificateHash}
                      </code>
                    </div>
                  )}

                  <div className="outcome-cell full-span">
                    <span className="cell-tag">SECURITY & IMMUTABILITY STATUS</span>
                    <div className="security-tag-row">
                      <Lock size={14} className="lock-ico" />
                      <span>
                        {verificationResult.data.onChain
                          ? 'Anchored to Ethereum Cancun EVM Smart Contract (ERC-721 NFT) // Mathematically Non-Falsifiable'
                          : 'Cryptographically Verified via Deterministic SHA-256 Digest in Registry'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="outcome-footer-actions">
                {verificationResult.isValid && verificationResult.data && (
                  <Link 
                    to={`/certificate/${verificationResult.data.certificateId}`}
                    className="btn-view-official-diploma"
                  >
                    <span>View Official Certificate & Print</span>
                    <ExternalLink size={14} />
                  </Link>
                )}
                <button onClick={handleClear} className="btn-verify-next">
                  <RotateCcw size={14} />
                  <span>Verify Another Credential</span>
                </button>
              </div>
            </div>
          )}

          {/* Verification Guide Box (Standby State) */}
          {!verificationResult && (
            <div className="dark-guide-panel">
              <div className="guide-title-strip">
                <FileCheck size={17} className="guide-ico" />
                <h4>Tri-Fold Verification Protocol</h4>
              </div>
              <div className="guide-tri-cols">
                <div className="guide-box">
                  <div className="guide-index">01</div>
                  <h5>Identifier Extraction</h5>
                  <p>Provide the unique certificate reference code or scan the scannable QR code printed on the official diploma.</p>
                </div>
                <div className="guide-box">
                  <div className="guide-index">02</div>
                  <h5>Digest Computation</h5>
                  <p>The system computes the cryptographic SHA-256 hash across canonical recipient and program conferral parameters.</p>
                </div>
                <div className="guide-box">
                  <div className="guide-index">03</div>
                  <h5>Consensus Lookup</h5>
                  <p>The hash is queried against the ERC-721 smart contract on the EVM blockchain to guarantee non-falsification.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
