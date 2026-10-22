# Unholy Trinity Verifier — Step-by-Step Website Demonstration Guide

> **Document Type:** Live Screen Recording & Demonstration Protocol  
> **Target Audience:** Video Presenter / Student Demonstrator  
> **Application URLs:**  
> - Frontend: `http://localhost:3000`  
> - Backend API: `http://localhost:5000/api/certificates`  
> - Local Hardhat EVM Node: `http://127.0.0.1:8545`  
> **Prerequisites:** All 3 background tasks running (Node, Express, React)

---

## 1. Pre-Recording Environment Checklist

Before you start recording your screen, ensure your computer is configured properly:

| Item | Ideal Setting / Value | Why It Matters |
| :--- | :--- | :--- |
| **Display Resolution** | `1920 x 1080` (Standard Full HD) | Ensures crisp text and clean aspect ratio on YouTube/Vimeo |
| **Browser Zoom** | `100%` (Default) | Prevents layout distortion or excessive white space |
| **Active Browser Tabs** | Tab 1: `http://localhost:3000` (Home)<br>Tab 2: `http://localhost:3000/admin` (Pre-loaded)<br>Tab 3: VS Code (Code Walkthrough) | Avoids awkward loading delays during recording |
| **Terminal Windows** | Keep them minimized or on a separate virtual desktop | Terminal windows with private keys or JSON-RPC logs can distract viewers |
| **Security & Privacy** | Never open `.env` files on camera | Keeps all system configuration secure |

---

## 2. Test Data Cheat Sheet

Have these exact test strings copied to a sticky note or clipboard manager:

### Test Record A: Pre-Minted Valid Certificate (Dr. Alan Turing)
- **Certificate Reference ID:** `CERT-1792683461568-A84A68CB`
- **Expected Student Name:** `Dr. Alan Turing`
- **Expected Degree Program:** `Applied Cryptanalysis & Machine Intelligence`
- **Expected Status:** `Verified Authentic (On-Chain NFT)`

### Test Record B: New Certificate to Create Live
- **Student Full Name:** `Alexander Wright`
- **Degree / Event Program:** `M.S. in Cryptographic Engineering`
- **Conferral Date:** `Today's Date` (pre-filled by the form)

### Test Record C: Invalid / Fraudulent Certificate ID
- **Fraudulent Certificate ID:** `CERT-FAKE-999999`
- **Expected Outcome:** Red Error Alert (`No matching academic credential found in the registry.`)

---

## 3. Step-by-Step Screen Recording Walkthrough

Follow this exact chronological sequence during your recording:

---

### Step 1: Open Homepage & Show Brand Identity
1. **URL:** `http://localhost:3000/`
2. **Action:**
   - Position your browser at the top of the page.
   - Point cursor to the brand logo **"Unholy Trinity Verifier"** in the upper left.
   - Point cursor to the green status pill in the upper right: **"EVM NODE ACTIVE: 31337"**.
   - Explain what this badge means: the React frontend is actively communicating with the local Ethereum blockchain.
3. **What Appears on Screen:**
   - Clean white/slate canvas with bold typography.
   - Navigation links: **Verify Credential**, **Issue Certificate**, **Registry Ledger**.
   - Hero headline: *"Autonomous Academic Credential Verification Powered by EVM Smart Contracts"*.

---

### Step 2: Demonstrate Homepage Instant Lookup & Sample Chips
1. **URL:** `http://localhost:3000/` (Hero section)
2. **Action:**
   - Notice the three quick-sample chips beneath the search bar: `Dr. Alan Turing`, `Elena Rostova`, `Satoshi Nakamoto`.
   - Click directly on the **"Dr. Alan Turing"** chip.
3. **What Happens:**
   - The Certificate ID `CERT-1792683461568-A84A68CB` is instantly populated into the input field.
   - The system triggers verification automatically.
   - A verified modal/card appears with an emerald-green border.
4. **What to Point Out:**
   - Student Name: `Dr. Alan Turing`.
   - Program: `Applied Cryptanalysis & Machine Intelligence`.
   - SHA-256 Digest: Click the small copy button next to the hash to show the copy feedback tooltip.
   - Status: Active and verified on the blockchain.

---

### Step 3: Scroll Through Key Homepage Explanations
1. **Action:**
   - Scroll slowly down the page.
   - Pause on the **"Tri-Fold Trust Architecture"** section.
   - Point cursor at Pillar 1 (Cryptographic Fingerprint), Pillar 2 (EVM Blockchain Ledger), and Pillar 3 (Authorized Registrar Repository).
   - Scroll to the **"Interactive Certificate Preview"** card to show the realistic diploma styling.
   - Scroll to the **"Project Development Team"** section. Point out the three team member cards:
     - **Dinesh Kumar JB** (Lead Developer & Architecture) — hover over the **GitHub Profile** link (`https://github.com/Dineshkumar-jb`).
     - **Sanjay** (Core Systems & Verification).
     - **Bharath Vikraman** (Smart Contract & Ledger Engineering).

---

### Step 4: Issue a New Certificate Live (`/create`)
1. **URL:** Click **"Issue Certificate"** in the top navigation bar, navigating to `http://localhost:3000/create`.
2. **Action:**
   - Show the two-column layout: Conferral Form on the left, Live Interactive Diploma Preview on the right.
   - Click into the **"Recipient Full Name"** field. Type: `Alexander Wright`.
   - Notice how the preview on the right instantly reflects `Alexander Wright` as you type!
   - Click into the **"Academic Degree / Event Program"** field. Type: `M.S. in Cryptographic Engineering`.
   - Notice how the degree title updates in real time on the preview diploma.
   - Leave the Conferral Date as today's date.
   - Click the bright blue button: **"Issue & Anchor Credential"**.
3. **What Happens:**
   - The button shows a loading spinner for approx. 1 second while the backend hashes the data and executes the smart contract transaction on the local Hardhat blockchain.
   - A green success message appears: *"Academic credential successfully issued and anchored to the ledger."*
   - The generated Certificate ID (e.g., `CERT-1792...`) appears.
   - The 64-character SHA-256 hash appears.
   - The 300x300 Base64 QR code image renders clearly on the screen.
4. **Interactive Actions to Perform:**
   - Click the **"Copy Hash"** icon next to the SHA-256 fingerprint.
   - Click the **"Download QR Code"** button. The browser saves `VERIFY_CERT-....png` to your downloads folder. *(You will use this in Step 6!)*
   - Click the **"Export Official PDF"** button.
   - Show that a high-resolution, landscape-oriented PDF diploma is instantly generated by `jsPDF` and downloaded to your computer.

---

### Step 5: Verify the Certificate via Reference ID (`/verify`)
1. **URL:** Click **"Verify Credential"** in the top navigation, navigating to `http://localhost:3000/verify`.
2. **Action:**
   - Paste the newly created Certificate ID (or paste `CERT-1792683461568-A84A68CB`).
   - Click the blue button: **"Verify Identifier"**.
3. **What Appears on Screen:**
   - A clean verification result card with a solid emerald border and a `ShieldCheck` icon.
   - Headline: *"Academic Credential Verified Authentic"*.
   - Verification timestamp.
   - Recipient Name: `Alexander Wright`.
   - Program: `M.S. in Cryptographic Engineering`.
   - Cryptographic SHA-256 Hash badge.
   - Blockchain Ledger Badge: `Verified on Blockchain (NFT)`.
   - A clickable button: **"Inspect Credential in Ledger"** (links to `/certificate/:id`).

---

### Step 6: Verify via QR Code Image Upload
1. **URL:** Still on `http://localhost:3000/verify`.
2. **Action:**
   - Notice the three tabs at the top of the verification box:
     - Tab 1: **Manual Entry**
     - Tab 2: **Live Camera**
     - Tab 3: **Upload QR Image**
   - Click on the **"Upload QR Image"** tab.
   - Click the upload drop-zone (or drag-and-drop the QR PNG file you downloaded in Step 4).
3. **What Happens:**
   - The browser-side `html5-qrcode` engine instantly decodes the QR code image.
   - It extracts the Certificate ID.
   - It automatically submits the verification request to the backend.
   - The exact same verified green result card appears!
4. **Presenter Note for Video:**  
   *Explain to the audience that this proves employers can simply drop an image of a student's diploma QR code into the portal to verify it in one second.*

---

### Step 7: Demonstrate Fraud & Tamper Detection (Invalid ID)
1. **URL:** Still on `http://localhost:3000/verify`.
2. **Action:**
   - Switch back to the **"Manual Entry"** tab.
   - In the Certificate ID input field, type: `CERT-FAKE-999999`.
   - Click the **"Verify Identifier"** button.
3. **What Appears on Screen:**
   - A crimson red warning card with an `AlertTriangle` icon.
   - Message: *"No matching academic credential found in the registry."*
4. **What to Say in Video:**  
   > *"If an applicant fabricates an ID, edits a PDF, or submits an unaccredited certificate, the mathematical hash and on-chain record fail to match. The employer is immediately protected."*

---

### Step 8: Demonstrate the Credential Audit Registry (`/admin`)
1. **URL:** Click **"Registry Ledger"** in the top navigation, navigating to `http://localhost:3000/admin`.
2. **Action:**
   - Show the top KPI counter cards:
     - **Total Issued Credentials** (e.g., `4` or `5`).
     - **Active Ledger Certificates** (e.g., `4` or `5`).
     - **Blockchain Network Status** (`Hardhat Localhost 31337`).
   - Click the **"Sync Records"** button with the refresh icon. Watch the icon spin smoothly as it re-fetches records.
   - Show the search filter bar:
     - Type `Turing` in the search box: watch the table instantly filter down to Dr. Alan Turing's row.
     - Clear the search box to restore all rows.
   - In the table row for your newly created certificate, click the blue **"Inspect"** link in the Actions column.

---

### Step 9: Demonstrate the Official Diploma View (`/certificate/:id`)
1. **URL:** Opens `http://localhost:3000/certificate/[id]`.
2. **Action:**
   - Show the full-page formal diploma layout:
     - Formal border styling with academic typography.
     - Recipient Name prominently displayed in deep navy.
     - Course conferred with official accreditation phrasing.
     - Embedded Base64 QR code seal in the bottom-left.
     - Cryptographic SHA-256 fingerprint badge in the bottom-right.
   - Show the top action toolbar buttons:
     - **"Print Document"** (click it briefly to show print preview, then cancel).
     - **"Download PDF"** (downloads a clean vector PDF of this diploma).
     - **"Verify in Terminal"** (links directly back to the verification page).

---

## 4. How to Handle Unimplemented or Out-of-Scope Features Honestly

If a viewer, professor, or reviewer asks about specific enterprise features during your presentation:

| Question / Feature | Honest Answer to Give |
| :--- | :--- |
| *"Is there a login screen for the admin?"* | "In this academic prototype, the `/create` and `/admin` routes are open for seamless evaluation. For an enterprise production release, we would add JWT-based role-based access control (RBAC)." |
| *"Are these certificates on the public Ethereum mainnet?"* | "Currently, the system runs on a local Hardhat EVM blockchain node (Cancun version, Chain ID 31337). Our configuration is fully prepared to deploy to public testnets like Sepolia with a single CLI flag." |
| *"Do verifiers need MetaMask?"* | "No. We intentionally designed a zero-barrier architecture. Verifiers query the contract through the backend via public view calls, requiring no crypto wallet and incurring zero gas fees." |
| *"What happens if MongoDB is turned off?"* | "Our backend includes an automatic dual-storage proxy. If MongoDB is offline, it transparently stores and reads from local JSON file storage (`backend/data/certificates.json`) with zero downtime." |

---

## 5. End of Demo Wrap-Up

Return to `http://localhost:3000/` (Homepage), frame the hero title in the center of the recording window, and deliver your concluding remarks.
