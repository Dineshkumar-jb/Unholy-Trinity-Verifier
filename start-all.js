/**
 * All-in-One Runner for Blockchain Certificate Verification System
 * Starts:
 * 1. Local Hardhat Blockchain (Port 8545)
 * 2. Smart Contract Deployment (CertificateNFT ERC-721)
 * 3. Express API Backend (Port 5000)
 * 4. React Frontend (Port 3000)
 */

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('='.repeat(65));
console.log('🚀 Starting Blockchain Certificate Verification System');
console.log('='.repeat(65));

// 1. Start Hardhat Node
console.log('\n[1/3] ⛓️  Starting Local Hardhat Blockchain Node (Port 8545)...');
const hardhatProcess = spawn('npx', ['hardhat', 'node'], {
  cwd: __dirname,
  shell: true,
  stdio: 'pipe'
});

hardhatProcess.stdout.on('data', (data) => {
  const msg = data.toString();
  if (msg.includes('Started HTTP and WebSocket JSON-RPC server')) {
    console.log('       ✅ Hardhat Blockchain Node running at http://127.0.0.1:8545');
    deployContract();
  }
});

hardhatProcess.stderr.on('data', (data) => {
  // Ignore minor hardhat warnings
});

function deployContract() {
  console.log('\n[2/3] 📜 Deploying CertificateNFT Smart Contract to Local Node...');
  const deployProcess = spawn('npx', ['hardhat', 'run', 'blockchain/scripts/deploy.js', '--network', 'localhost'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });

  deployProcess.on('close', (code) => {
    if (code === 0) {
      console.log('       ✅ Contract deployed successfully!');
    }
    startBackendAndFrontend();
  });
}

function startBackendAndFrontend() {
  // 3. Start Backend
  console.log('\n[3/3] ⚙️  Starting Express API Backend (Port 5000)...');
  const backendProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
  });

  // 4. Start Frontend
  console.log('       💻 Starting React Frontend (Port 3000)...');
  const frontendProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    shell: true,
    stdio: 'inherit'
  });

  const cleanup = () => {
    console.log('\nStopping all services...');
    try { hardhatProcess.kill(); } catch (e) {}
    try { backendProcess.kill(); } catch (e) {}
    try { frontendProcess.kill(); } catch (e) {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// Fallback timeout in case Hardhat output is delayed
setTimeout(() => {
  if (!contractDeployed) {
    // Contract deploy logic if needed
  }
}, 5000);
let contractDeployed = false;
