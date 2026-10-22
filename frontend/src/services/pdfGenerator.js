/**
 * Academic PDF Certificate Generator Utility — Unholy Trinity Verifier
 * Uses jsPDF to generate an official institutional diploma document
 */

import { jsPDF } from 'jspdf';

/**
 * Generate and trigger download of an official academic PDF certificate
 * @param {Object} cert - Certificate object containing name, eventName, date, certificateId, qrCode, certificateHash
 */
export const downloadCertificatePDF = (cert) => {
  if (!cert) return;

  // Create landscape A4 document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background: Rich Obsidian Graphite (#0A0E17)
  doc.setFillColor(10, 14, 23);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border: Precision Electric Cyan (#38BDF8)
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Inner Border: Subtle Slate (#1E293B)
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner Accents (Tri-Fold Brackets)
  const bracket = 8;
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(1.5);
  // Top-left
  doc.line(11, 12 + bracket, 11, 11);
  doc.line(11, 11, 12 + bracket, 11);
  // Top-right
  doc.line(pageWidth - 12 - bracket, 11, pageWidth - 11, 11);
  doc.line(pageWidth - 11, 11, pageWidth - 11, 12 + bracket);
  // Bottom-left
  doc.line(11, pageHeight - 12 - bracket, 11, pageHeight - 11);
  doc.line(11, pageHeight - 11, 12 + bracket, pageHeight - 11);
  // Bottom-right
  doc.line(pageWidth - 12 - bracket, pageHeight - 11, pageWidth - 11, pageHeight - 11);
  doc.line(pageWidth - 11, pageHeight - 11, pageWidth - 11, pageHeight - 12 - bracket);

  // Top Protocol Header
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248);
  doc.text('UNHOLY TRINITY VERIFIER // TRI-FOLD AUTHENTICATION PROTOCOL', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('OFFICIAL RECORD OF RECOGNITION ANCHORED TO ETHEREUM EVM LEDGER', pageWidth / 2, 34, { align: 'center' });

  // Divider Rule
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.3);
  doc.line(45, 38, pageWidth - 45, 38);

  // Presentation Lead
  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225);
  doc.text('This is an official document to certify that', pageWidth / 2, 50, { align: 'center' });

  // Recipient Name
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(cert.name.toUpperCase(), pageWidth / 2, 66, { align: 'center' });

  // Conferred statement
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('has successfully satisfied all prescribed requirements of coursework and is hereby conferred the award of', pageWidth / 2, 78, { align: 'center' });

  // Program Title
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(56, 189, 248); // Precision Cyan
  doc.text(cert.eventName, pageWidth / 2, 92, { align: 'center' });

  // Cyan accent rule
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.4);
  doc.line(65, 100, pageWidth - 65, 100);

  // Details Column
  const leftX = 26;
  const startY = 118;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CERTIFICATE REFERENCE NUMBER', leftX, startY);

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248);
  doc.text(cert.certificateId, leftX, startY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('DATE OF CONFERRAL', leftX, startY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(248, 250, 252);
  const dateStr = cert.date ? new Date(cert.date).toISOString().split('T')[0] : 'N/A';
  doc.text(dateStr, leftX, startY + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('SECURITY & IMMUTABILITY STATUS', leftX, startY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(16, 185, 129); // Emerald Verified
  doc.text('SMART CONTRACT VERIFIED (ERC-721 NFT)', leftX, startY + 38);

  // Cryptographic SHA-256 Digest box
  if (cert.certificateHash) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('CRYPTOGRAPHIC SHA-256 AUDIT DIGEST:', leftX, startY + 48);

    doc.setFillColor(18, 25, 38);
    doc.rect(leftX, startY + 50, 175, 8, 'F');
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.2);
    doc.rect(leftX, startY + 50, 175, 8);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(56, 189, 248);
    doc.text(cert.certificateHash, leftX + 2, startY + 55);
  }

  // QR Code Seal on Right Side
  if (cert.qrCode) {
    const qrSize = 42;
    const qrX = pageWidth - 26 - qrSize;
    const qrY = 114;

    // White backing box with subtle border
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 'F');
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.5);
    doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

    doc.addImage(cert.qrCode, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(56, 189, 248);
    doc.text('OFFICIAL VERIFICATION SEAL', qrX + qrSize / 2, qrY + qrSize + 8, { align: 'center' });

    doc.setFont('times', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('SCAN TO VERIFY AUDIT LEDGER', qrX + qrSize / 2, qrY + qrSize + 12, { align: 'center' });
  }

  // Bottom Footer
  doc.setFont('times', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('ETHEREUM CANCUN EVM SMART CONTRACT: 0x5FbDB2315678afecb367f032d93F642f64180aa3 // NON-FALSIFIABLE ACADEMIC RECORD', pageWidth / 2, 198, { align: 'center' });

  // Save the PDF
  doc.save(`CERTIFICATE_${cert.certificateId}.pdf`);
};
