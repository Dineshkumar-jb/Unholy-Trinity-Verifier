/**
 * Certificate Routes
 * Defines all certificate-related endpoints
 */

const express = require('express');
const router = express.Router();
const {
  createCertificate,
  getCertificate,
  verifyCertificate,
  getAllCertificates
} = require('../controllers/certificateController');

/**
 * GET /api/certificates
 * Get all certificates
 */
router.get('/', getAllCertificates);

/**
 * POST /api/certificates/create
 * Create a new certificate
 */
router.post('/create', createCertificate);

/**
 * GET /api/certificates/:id
 * Fetch a certificate by ID
 */
router.get('/:id', getCertificate);

/**
 * GET /api/certificates/verify/:id
 * Verify a certificate
 */
router.get('/verify/:id', verifyCertificate);

module.exports = router;
