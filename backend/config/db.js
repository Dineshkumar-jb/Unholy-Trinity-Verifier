/**
 * Database Connection Configuration with Automatic Local Storage Fallback
 * Works seamlessly with or without a MongoDB server running.
 */

const mongoose = require('mongoose');

let isUsingLocalStorage = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificate-verification';
    
    // Quick connection attempt (2s timeout) so server starts instantly without hanging
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
    });

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.log('ℹ️  MongoDB not running locally. Seamlessly using built-in File Storage (backend/data/certificates.json)');
    isUsingLocalStorage = true;
  }
};

const getIsLocalStorage = () => isUsingLocalStorage;

module.exports = connectDB;
module.exports.getIsLocalStorage = getIsLocalStorage;
