/**
 * Blockchain Utility for Backend
 * Interacts with the local Hardhat CertificateNFT smart contract
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ethers } = require('ethers');

const DEPLOYMENT_PATH = path.join(__dirname, '..', 'contracts', 'deployment.json');
const ABI_PATH = path.join(__dirname, '..', 'contracts', 'CertificateNFT.json');

// Hardhat default Account #0 private key
const DEFAULT_PRIVATE_KEY =
  process.env.ISSUER_PRIVATE_KEY ||
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';

let provider = null;
let contract = null;
let signer = null;

function calculateHash(data) {
  return crypto
    .createHash('sha256')
    .update(`${data.name}-${data.eventName}-${data.date}-${data.certificateId}`)
    .digest('hex');
}

function initContract() {
  try {
    if (!fs.existsSync(DEPLOYMENT_PATH) || !fs.existsSync(ABI_PATH)) {
      return null;
    }

    const deployment = JSON.parse(fs.readFileSync(DEPLOYMENT_PATH, 'utf8'));
    const abiArtifact = JSON.parse(fs.readFileSync(ABI_PATH, 'utf8'));

    if (!deployment.contractAddress || !abiArtifact.abi) {
      return null;
    }

    provider = new ethers.JsonRpcProvider(RPC_URL);
    signer = new ethers.Wallet(DEFAULT_PRIVATE_KEY, provider);
    contract = new ethers.Contract(deployment.contractAddress, abiArtifact.abi, signer);

    return contract;
  } catch (err) {
    console.error('Failed to initialize blockchain connection:', err.message);
    return null;
  }
}

// Mint certificate as NFT on blockchain if local Hardhat node is available
async function mintOnBlockchain({
  certificateId,
  studentName,
  courseName,
  institutionName = 'Decentralized Academy',
  issueDate = Math.floor(Date.now() / 1000)
}) {
  const hash = calculateHash({
    name: studentName,
    eventName: courseName,
    date: issueDate,
    certificateId
  });

  try {
    const certContract = contract || initContract();
    if (!certContract) {
      return { success: false, hash, error: 'Contract configuration not found' };
    }

    // Check if Hardhat node is active
    await provider.getBlockNumber();

    const recipient = await signer.getAddress();
    const metadataURI = `http://localhost:5000/api/certificates/${certificateId}`;

    const tx = await certContract.mintCertificate(
      recipient,
      certificateId,
      hash,
      studentName,
      courseName,
      institutionName,
      issueDate,
      metadataURI
    );

    const receipt = await tx.wait();

    return {
      success: true,
      hash,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      contractAddress: await certContract.getAddress()
    };
  } catch (err) {
    // If Hardhat node is not running, log and gracefully return hash
    return {
      success: false,
      hash,
      error: err.message
    };
  }
}

// Verify certificate on blockchain
async function verifyOnBlockchain(certificateId) {
  try {
    const certContract = contract || initContract();
    if (!certContract) {
      return { onChain: false, reason: 'Contract not initialized' };
    }

    await provider.getBlockNumber();

    const [isValid, isRevoked, tokenId] = await certContract.verifyCertificateByCertId(certificateId);

    if (tokenId === 0n || !isValid) {
      return { onChain: false, exists: false };
    }

    return {
      onChain: true,
      exists: true,
      isRevoked,
      tokenId: tokenId.toString()
    };
  } catch (err) {
    return { onChain: false, error: err.message };
  }
}

module.exports = {
  calculateHash,
  mintOnBlockchain,
  verifyOnBlockchain,
  initContract
};
