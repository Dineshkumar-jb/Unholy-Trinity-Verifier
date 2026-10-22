/**
 * API Service
 * Axios configuration and API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Certificate API endpoints
export const certificateService = {
  /**
   * Create a new certificate
   * @param {Object} data - Certificate data (name, eventName, date)
   */
  createCertificate: (data) => {
    return api.post('/certificates/create', data);
  },

  /**
   * Get a certificate by ID
   * @param {string} id - Certificate ID
   */
  getCertificate: (id) => {
    return api.get(`/certificates/${id}`);
  },

  /**
   * Verify a certificate
   * @param {string} id - Certificate ID
   */
  verifyCertificate: (id) => {
    return api.get(`/certificates/verify/${id}`);
  },

  /**
   * Get all certificates
   */
  getAllCertificates: () => {
    return api.get('/certificates');
  }
};

export default api;
