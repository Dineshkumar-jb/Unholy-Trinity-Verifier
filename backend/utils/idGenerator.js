/**
 * Unique ID Generator Utility
 * Generates unique certificate IDs
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique certificate ID
 * Format: CERT-[timestamp]-[uuid]
 * @returns {string} Unique certificate ID
 */
const generateCertificateId = () => {
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0].toUpperCase(); // First 8 chars of UUID
  return `CERT-${timestamp}-${uuid}`;
};

module.exports = {
  generateCertificateId
};
