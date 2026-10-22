/**
 * Certificate Model with Dual Storage Support (MongoDB + Local JSON File Fallback)
 * Works automatically whether MongoDB is running or not.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { getIsLocalStorage } = require('../config/db');

const DATA_FILE = path.join(__dirname, '..', 'data', 'certificates.json');

function readLocalCertificates() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading local certificates:', err);
    return [];
  }
}

function writeLocalCertificates(certs) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(certs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local certificates:', err);
  }
}

class LocalCertificate {
  constructor(data) {
    this._id = data._id || uuidv4();
    this.name = data.name;
    this.eventName = data.eventName;
    this.date = data.date ? new Date(data.date) : new Date();
    this.certificateId = data.certificateId;
    this.qrCode = data.qrCode;
    this.isValid = data.isValid !== undefined ? data.isValid : true;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    const certs = readLocalCertificates();
    const existingIndex = certs.findIndex(
      c => c.certificateId === this.certificateId || String(c._id) === String(this._id)
    );
    if (existingIndex >= 0) {
      certs[existingIndex] = { ...this, updatedAt: new Date() };
    } else {
      certs.push({ ...this });
    }
    writeLocalCertificates(certs);
    return this;
  }

  static async findOne(query) {
    const certs = readLocalCertificates();
    const found = certs.find(c => {
      for (const [key, val] of Object.entries(query)) {
        if (c[key] !== val) return false;
      }
      return true;
    });
    return found ? new LocalCertificate(found) : null;
  }

  static async findById(id) {
    const certs = readLocalCertificates();
    const found = certs.find(c => String(c._id) === String(id));
    return found ? new LocalCertificate(found) : null;
  }

  static find(query = {}) {
    const certs = readLocalCertificates();
    let filtered = certs
      .filter(c => {
        for (const [key, val] of Object.entries(query)) {
          if (c[key] !== val) return false;
        }
        return true;
      })
      .map(c => new LocalCertificate(c));

    const queryObj = {
      sort(sortCriteria) {
        if (sortCriteria && sortCriteria.createdAt) {
          const dir = sortCriteria.createdAt;
          filtered.sort((a, b) =>
            dir === -1
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : new Date(a.createdAt) - new Date(b.createdAt)
          );
        }
        return Promise.resolve(filtered);
      },
      then(resolve, reject) {
        return Promise.resolve(filtered).then(resolve, reject);
      }
    };
    return queryObj;
  }
}

// Mongoose schema definition
const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a certificate name'],
      trim: true
    },
    eventName: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    qrCode: {
      type: String,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ createdAt: -1 });

const MongooseCertificate =
  mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

// Transparent proxy to delegate to LocalCertificate if MongoDB is not connected
const CertificateProxy = new Proxy(MongooseCertificate, {
  construct(target, args) {
    if (getIsLocalStorage() || mongoose.connection.readyState !== 1) {
      return new LocalCertificate(...args);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (getIsLocalStorage() || mongoose.connection.readyState !== 1) {
      if (prop in LocalCertificate) {
        return LocalCertificate[prop];
      }
    }
    return target[prop];
  }
});

module.exports = CertificateProxy;
