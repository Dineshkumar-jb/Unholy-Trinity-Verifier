# Unholy Trinity Verifier — Source Code Navigation & Walkthrough Guide

> **Document Type:** Codebase Navigation & Architecture Reference  
> **Target Audience:** Video Presenters, Evaluators, and Code Reviewers  
> **Scope:** Complete file-by-file breakdown of Frontend, Backend, Database, Blockchain, Configuration, and Tests  
> **Workspace Root:** `/home/nullframe/BLOCKCHAIN_PROJECT`

---

## 1. Quick File Map by System Layer

```text
BLOCKCHAIN_PROJECT/
├── blockchain/
│   ├── contracts/
│   │   └── CertificateNFT.sol           <-- Smart Contract (ERC-721 + Ownable)
│   ├── scripts/
│   │   └── deploy.js                    <-- Hardhat Contract Deployment Script
│   ├── test/
│   │   └── CertificateNFT.test.js       <-- 40 Unit Tests
│   └── deployments/
│       ├── CertificateNFT.json          <-- Contract ABI
│       └── deployment.json              <-- Deployed Contract Address & Network Info
├── backend/
│   ├── config/
│   │   └── db.js                        <-- Dual Storage Connection & Fallback Flag
│   ├── controllers/
│   │   └── certificateController.js     <-- Express Controller & Business Logic
│   ├── data/
│   │   └── certificates.json            <-- Local JSON Persistence Ledger
│   ├── models/
│   │   └── Certificate.js               <-- Mongoose Schema & Dual Storage Proxy
│   ├── routes/
│   │   └── certificateRoutes.js         <-- REST Endpoint Route Definitions
│   ├── utils/
│   │   ├── blockchain.js                <-- Ethers.js Blockchain Bridge
│   │   ├── idGenerator.js               <-- Collision-Resistant ID Generator
│   │   └── qrCodeGenerator.js           <-- Base64 PNG QR Code Generator
│   └── server.js                        <-- Express Application Entry Point
├── frontend/
│   ├── public/
│   │   └── index.html                   <-- HTML Shell & Metadata
│   └── src/
│       ├── App.js                       <-- Routing & Global Layout
│       ├── components/
│       │   └── Header.js                <-- Navigation Bar & EVM Node Badge
│       ├── pages/
│       │   ├── Home.js                  <-- Homepage, Instant Search, & Team Section
│       │   ├── CreateCertificate.js     <-- Issuance Form & Live Interactive Preview
│       │   ├── VerifyCertificate.js     <-- Multi-Modal Verification Terminal
│       │   ├── AdminDashboard.js        <-- Credential Audit Ledger Table
│       │   └── ViewCertificate.js       <-- Printable Formal Diploma View
│       ├── services/
│       │   ├── certificateService.js    <-- Axios HTTP Client Gateway
│       │   └── pdfGenerator.js          <-- Client-Side Vector PDF Generator (jsPDF)
│       └── contracts/
│           ├── CertificateNFT.json      <-- Client-Side Smart Contract ABI
│           └── deployment.json          <-- Client-Side Contract Address
├── hardhat.config.js                    <-- Hardhat EVM Compiler & Network Settings
├── start-all.js                         <-- All-in-One Multi-Process Orchestrator
└── package.json                         <-- Root Scripts & Development Dependencies
```

---

## 2. Blockchain Layer

### [`blockchain/contracts/CertificateNFT.sol`](file:///home/nullframe/BLOCKCHAIN_PROJECT/blockchain/contracts/CertificateNFT.sol)
- **Role:** Core ERC-721 Smart Contract governing certificate tokenization, immutability, and verification.
- **Why It Matters:** This is the bedrock of the decentralized verification architecture. It enforces that only the contract owner (university registrar) can mint or revoke credentials, and guarantees that verification is 100% free of gas fees.
- **Key Functions & Data Structures:**
  - `struct Certificate`: On-chain data structure storing `certificateId`, `certificateHash`, `studentName`, `courseName`, `institutionName`, `issueDate`, `issuer`, and `isRevoked`.
  - `mintCertificate(...)`: Mints an ERC-721 token, increments `_nextTokenId`, records the struct, and populates reverse lookups.
  - `revokeCertificate(uint256 tokenId)`: Flags a certificate as revoked without deleting historical data.
  - `verifyCertificateByCertId(string certId)`: Public gas-free view function returning validity, revocation status, and token ID.
  - `verifyCertificateByHash(string certHash)`: Public gas-free view function matching against the SHA-256 hash.
- **Connects To:** Deployed to Hardhat; interacts with backend via Ethers.js in `backend/utils/blockchain.js`.
- **When to Show in Video:** During **Scene 9 (Blockchain & Smart Contract Deep Dive)**.

---

### [`blockchain/scripts/deploy.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/blockchain/scripts/deploy.js)
- **Role:** Automation script that compiles and deploys `CertificateNFT.sol` to the target network.
- **Why It Matters:** Eliminates manual configuration mistakes. It automatically extracts the deployed contract address and ABI and mirrors them into both `backend/contracts/` and `frontend/src/contracts/`.
- **Key Logic:**
  - Uses `hre.ethers.getContractFactory("CertificateNFT")` and `deploy()`.
  - Writes deployment metadata (`contractAddress`, `deployerAddress`, `network`, `chainId`, `transactionHash`) to `deployment.json`.
- **Connects To:** Executed by `npx hardhat run blockchain/scripts/deploy.js --network localhost`.
- **When to Show in Video:** During architecture or deployment explanation.

---

### [`blockchain/test/CertificateNFT.test.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/blockchain/test/CertificateNFT.test.js)
- **Role:** Automated unit test suite containing **40 tests** written using Mocha and Chai.
- **Why It Matters:** Proves to professors and evaluators that the contract is thoroughly tested, secure, and resilient against edge cases.
- **Test Categories Covered:**
  - Deployment initial states (symbol, name, nextTokenId = 1).
  - Minting execution, event emissions, and ownership assignment.
  - Rejection of duplicate certificate IDs and empty fields.
  - Tamper detection via SHA-256 hash differences.
  - Revocation without deletion (immutability).
  - Access control: ensuring non-owners cannot mint or revoke.
  - Gas-free view verification by third parties.
- **When to Show in Video:** If asked about contract testing, show running `npx hardhat test` in terminal.

---

## 3. Backend API & Storage Layer

### [`backend/server.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/server.js)
- **Role:** Main entry point for the Express API server (runs on port 5000).
- **Why It Matters:** Initializes database connections, enables CORS, registers JSON body parsing, and mounts API routes.
- **Key Code:**
  - `connectDB()`: Initiates database or fallback storage.
  - `app.use('/api/certificates', certificateRoutes)`: Mounts certificate routes.
  - `GET /health`: Health-check endpoint returning server status.
- **Connects To:** `backend/config/db.js` and `backend/routes/certificateRoutes.js`.

---

### [`backend/controllers/certificateController.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/controllers/certificateController.js)
- **Role:** Primary business logic controller for certificate creation, fetching, and verification.
- **Why It Matters:** Orchestrates the entire lifecycle: computes the SHA-256 hash, dispatches the on-chain minting call to ethers.js, generates the QR code, and saves records.
- **Key Functions:**
  - `createCertificate(req, res)`: Handles `POST /api/certificates/create`. Generates ID, QR code, SHA-256 hash, calls `mintOnBlockchain`, and saves to database.
  - `getCertificate(req, res)`: Handles `GET /api/certificates/:id`. Looks up by readable certificate ID or internal UUID.
  - `verifyCertificate(req, res)`: Handles `GET /api/certificates/verify/:id`. Calls `verifyOnBlockchain` and cross-references database validity.
  - `getAllCertificates(req, res)`: Handles `GET /api/certificates`. Returns all records sorted newest first.
- **Connects To:** `models/Certificate.js`, `utils/blockchain.js`, `utils/idGenerator.js`, `utils/qrCodeGenerator.js`.
- **When to Show in Video:** During **Scene 5 (System Architecture & Data Flow)**.

---

### [`backend/utils/blockchain.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/utils/blockchain.js)
- **Role:** Web3 interaction bridge linking Express to the Hardhat EVM node using **Ethers.js v6**.
- **Why It Matters:** Contains the actual cryptographic hashing code and blockchain dispatch logic. Implements graceful fallback if the node is offline.
- **Key Functions:**
  - `calculateHash(data)`: Computes deterministic SHA-256 from `${name}-${eventName}-${date}-${certificateId}`.
  - `initContract()`: Loads ABI and deployment address, creates `ethers.JsonRpcProvider`, and connects signer wallet.
  - `mintOnBlockchain({...})`: Dispatches `contract.mintCertificate(...)` and awaits the transaction receipt.
  - `verifyOnBlockchain(certificateId)`: Calls the gas-free view function `contract.verifyCertificateByCertId(...)`.
- **Connects To:** Local Hardhat node at `http://127.0.0.1:8545`.
- **When to Show in Video:** During **Scene 9 (Blockchain & Smart Contract Deep Dive)**.

---

### [`backend/models/Certificate.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/models/Certificate.js)
- **Role:** Dual-storage model featuring a transparent JavaScript Proxy pattern.
- **Why It Matters:** Prevents server crashes if MongoDB is not running locally by seamlessly routing all database calls (`find`, `findOne`, `findById`, `save`) to [`backend/data/certificates.json`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/data/certificates.json).
- **Key Classes & Structures:**
  - `class LocalCertificate`: File-based storage implementation reading/writing JSON.
  - `certificateSchema`: Standard Mongoose schema with indexes on `certificateId` and `createdAt`.
  - `CertificateProxy`: JavaScript `Proxy` that dynamically switches between Mongoose and LocalCertificate based on connection status.
- **Connects To:** `backend/config/db.js` and `backend/data/certificates.json`.

---

### [`backend/utils/idGenerator.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/utils/idGenerator.js)
- **Role:** Generates unique, human-readable certificate reference strings.
- **Key Code:**
  ```javascript
  const generateCertificateId = () => {
    const timestamp = Date.now();
    const uuid = uuidv4().split('-')[0].toUpperCase();
    return `CERT-${timestamp}-${uuid}`;
  };
  ```

---

### [`backend/utils/qrCodeGenerator.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/backend/utils/qrCodeGenerator.js)
- **Role:** Generates 300x300 Base64 PNG QR code matrices encoding the Certificate ID.
- **Key Function:** `generateQRCode(certificateId)` using `QRCode.toDataURL`.

---

## 4. Frontend Application Layer

### [`frontend/src/App.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/App.js)
- **Role:** Main React layout and router configuration.
- **Why It Matters:** Defines all browser routes and contains the global academic footer with team credits and live node indicator.
- **Routes Defined:**
  - `/` -> `<Home />`
  - `/admin` -> `<AdminDashboard />`
  - `/create` -> `<CreateCertificate />`
  - `/verify` -> `<VerifyCertificate />`
  - `/certificate/:id` -> `<ViewCertificate />`

---

### [`frontend/src/pages/Home.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/pages/Home.js)
- **Role:** Platform homepage, instant verification terminal, architecture showcase, and team credits.
- **Why It Matters:** First page viewers see. Provides immediate interactive demonstrations through sample chips (`Dr. Alan Turing`, `Elena Rostova`, `Satoshi Nakamoto`).
- **Key Sections:**
  - Hero search bar with instant verification modal.
  - Tri-Fold Trust Architecture feature cards.
  - Interactive certificate diploma preview.
  - Project Development Team section attributing:
    - **Dinesh Kumar JB** (Lead Developer & Architecture) with clickable link: `https://github.com/Dineshkumar-jb`
    - **Sanjay** (Core Systems & Verification)
    - **Bharath Vikraman** (Smart Contract & Ledger Engineering)
- **When to Show in Video:** During **Scene 1 (Intro)**, **Scene 6 (Website Tour)**, and **Scene 11 (Team Credits)**.

---

### [`frontend/src/pages/CreateCertificate.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/pages/CreateCertificate.js)
- **Role:** Academic credential issuance interface with real-time interactive preview.
- **Why It Matters:** Allows the presenter to demonstrate live certificate creation and NFT minting.
- **Key Features:**
  - Controlled inputs for student name, degree program, and conferral date.
  - Side-by-side interactive diploma preview updating as the user types.
  - Triggers `certificateService.createCertificate(...)`.
  - Renders the generated QR code, SHA-256 hash copy button, and PDF download button upon success.
- **When to Show in Video:** During **Scene 7 (Certificate Creation Demonstration)**.

---

### [`frontend/src/pages/VerifyCertificate.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/pages/VerifyCertificate.js)
- **Role:** Multi-modal public verification terminal.
- **Why It Matters:** Proves zero-barrier verification across three distinct input modalities.
- **Key Modalities:**
  1. *Manual Reference Entry:* Direct input field for pasting a certificate ID.
  2. *Live Camera Scanner:* Uses `Html5Qrcode` to stream video from laptop/webcam and decode physical QR codes.
  3. *QR Image Upload:* Drag-and-drop zone using `html5QrCode.scanFile(file, true)` to decode image files directly in the browser.
- **Verification States:** Authentic (emerald green), Invalid (crimson red), Revoked (amber warning).
- **When to Show in Video:** During **Scene 8 (Multi-Modal Verification Demonstration)**.

---

### [`frontend/src/pages/AdminDashboard.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/pages/AdminDashboard.js)
- **Role:** Institutional registry ledger table and metrics audit dashboard.
- **Why It Matters:** Demonstrates administrative oversight, real-time search filtering, and on-chain status synchronization.
- **Key Features:**
  - Metric counters: Total Issued, Active Ledger, EVM Node Status.
  - Client-side full-text search filter by student, course, or certificate ID.
  - "Sync Records" button with animated spinning refresh icon.
  - Links directly to individual certificate inspect views.
- **When to Show in Video:** During **Scene 10 (Security & Registry Audit)**.

---

### [`frontend/src/pages/ViewCertificate.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/pages/ViewCertificate.js)
- **Role:** Clean, high-resolution academic diploma presentation.
- **Why It Matters:** Displays a realistic, accredited certificate suitable for framing, printing, or archival.
- **Key Features:**
  - Academic diploma border with official institutional typography.
  - Embedded Base64 QR code and SHA-256 verification seal.
  - Integrated print stylesheet (`@media print`) and PDF download button.
- **When to Show in Video:** At the conclusion of certificate creation or via registry inspection.

---

### [`frontend/src/services/pdfGenerator.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/frontend/src/services/pdfGenerator.js)
- **Role:** Client-side vector PDF generation using `jsPDF`.
- **Why It Matters:** Generates clean, printable, landscape-oriented PDF diplomas directly in the user's browser without requiring server-side rendering engines like Puppeteer.
- **Key Function:** `downloadCertificatePDF(certificateData)`.

---

## 5. Startup & Configuration Layer

### [`hardhat.config.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/hardhat.config.js)
- Configures Solidity compiler version (`0.8.24`), optimizer settings (`runs: 200`), Cancun EVM version, and localhost network (`http://127.0.0.1:8545`, Chain ID `31337`).

### [`start-all.js`](file:///home/nullframe/BLOCKCHAIN_PROJECT/start-all.js)
- Single-command orchestrator that spawns the Hardhat node, deploys the smart contract, launches the backend, and boots the React frontend.
