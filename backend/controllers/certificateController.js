/**
 * Certificate Controller
 * Handles all certificate-related business logic with Blockchain & Local Storage support
 */

const Certificate = require('../models/Certificate');
const { generateCertificateId } = require('../utils/idGenerator');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const {
  mintOnBlockchain,
  verifyOnBlockchain,
  calculateHash
} = require('../utils/blockchain');

/**
 * Create a new certificate
 * POST /api/certificates/create
 */
const createCertificate = async (req, res) => {
  try {
    const { name, eventName, date } = req.body;

    // Validate required fields
    if (!name || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and eventName'
      });
    }

    // Generate unique certificate ID
    const certificateId = generateCertificateId();

    // Generate QR code
    const qrCode = await generateQRCode(certificateId);

    const certDate = date ? new Date(date) : new Date();

    // Calculate cryptographic SHA-256 hash for document
    const certificateHash = calculateHash({
      name,
      eventName,
      date: certDate.toISOString(),
      certificateId
    });

    // Attempt blockchain minting if Hardhat node is running
    const blockchainResult = await mintOnBlockchain({
      certificateId,
      studentName: name,
      courseName: eventName,
      issueDate: Math.floor(certDate.getTime() / 1000)
    });

    // Create certificate instance
    const certificate = new Certificate({
      name,
      eventName,
      date: certDate,
      certificateId,
      qrCode,
      isValid: true,
      certificateHash,
      txHash: blockchainResult.txHash || null,
      onChain: Boolean(blockchainResult.success)
    });

    // Save to database (or local JSON storage)
    await certificate.save();

    res.status(201).json({
      success: true,
      message: blockchainResult.success
        ? 'Certificate created and minted as NFT on Blockchain!'
        : 'Certificate created successfully',
      data: {
        id: certificate._id,
        certificateId: certificate.certificateId,
        name: certificate.name,
        eventName: certificate.eventName,
        date: certificate.date,
        qrCode: certificate.qrCode,
        certificateHash,
        txHash: blockchainResult.txHash || null,
        onChain: Boolean(blockchainResult.success)
      }
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create certificate',
      error: error.message
    });
  }
};

/**
 * Fetch a certificate by ID
 * GET /api/certificates/:id
 */
const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by certificateId
    let certificate = await Certificate.findOne({ certificateId: id });

    // If not found, try searching by MongoDB _id
    if (!certificate) {
      certificate = await Certificate.findById(id);
    }

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: certificate._id,
        certificateId: certificate.certificateId,
        name: certificate.name,
        eventName: certificate.eventName,
        date: certificate.date,
        qrCode: certificate.qrCode,
        isValid: certificate.isValid,
        certificateHash: certificate.certificateHash,
        txHash: certificate.txHash,
        onChain: certificate.onChain,
        createdAt: certificate.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate',
      error: error.message
    });
  }
};

/**
 * Verify a certificate
 * GET /api/certificates/verify/:id
 */
const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by certificateId
    let certificate = await Certificate.findOne({ certificateId: id });

    // If not found, try searching by ID
    if (!certificate) {
      certificate = await Certificate.findById(id);
    }

    // Check blockchain verification
    const onChainResult = await verifyOnBlockchain(id);

    const isRevokedOnChain = onChainResult.onChain && onChainResult.isRevoked;
    const isValid = Boolean(certificate && certificate.isValid && !isRevokedOnChain);

    let message = 'Certificate is invalid or not found';
    if (isRevokedOnChain) {
      message = '⚠️ Certificate has been REVOKED on Blockchain';
    } else if (isValid) {
      message = onChainResult.onChain
        ? '✅ Certificate is authentic and verified on Blockchain (NFT)'
        : '✅ Certificate is valid';
    }

    res.status(200).json({
      success: true,
      isValid: isValid,
      message: message,
      blockchain: {
        verifiedOnChain: onChainResult.onChain || false,
        isRevoked: isRevokedOnChain,
        tokenId: onChainResult.tokenId || null
      },
      data: isValid
        ? {
            certificateId: certificate.certificateId,
            name: certificate.name,
            eventName: certificate.eventName,
            date: certificate.date,
            createdAt: certificate.createdAt,
            certificateHash: certificate.certificateHash,
            txHash: certificate.txHash,
            onChain: onChainResult.onChain || certificate.onChain || false
          }
        : null
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: error.message
    });
  }
};

/**
 * Get all certificates
 * GET /api/certificates
 */
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates.map(cert => ({
        id: cert._id,
        certificateId: cert.certificateId,
        name: cert.name,
        eventName: cert.eventName,
        date: cert.date,
        isValid: cert.isValid,
        certificateHash: cert.certificateHash,
        txHash: cert.txHash,
        onChain: cert.onChain,
        createdAt: cert.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
};

module.exports = {
  createCertificate,
  getCertificate,
  verifyCertificate,
  getAllCertificates
};
