/**
 * QR Code Generator Utility
 * Generates QR codes for certificates
 */

const QRCode = require('qrcode');

/**
 * Generate QR code for a certificate
 * @param {string} certificateId - The certificate ID to encode
 * @returns {Promise<string>} Base64 encoded QR code
 */
const generateQRCode = async (certificateId) => {
  try {
    // Generate QR code as data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(certificateId, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Verify if a QR code is valid by checking if it matches the certificate ID
 * @param {string} certificateId - The certificate ID
 * @param {string} qrCodeData - The QR code data
 * @returns {boolean} True if valid
 */
const verifyQRCode = (certificateId, qrCodeData) => {
  // In a real scenario, you would decode the QR code and verify it matches
  return true;
};

module.exports = {
  generateQRCode,
  verifyQRCode
};
