# Application Screenshots

This directory stores authentic screenshots of the **Unholy Trinity Verifier** web application.

## Recommended Screenshots to Add

| File Name | Page | Suggested Dimensions | Description |
| :--- | :--- | :--- | :--- |
| `01-homepage.png` | Homepage (`http://localhost:3000/`) | 1920x1080 | Hero section with instant lookup terminal and sample verification chips. |
| `02-create-certificate.png` | Issue Certificate (`/create`) | 1920x1080 | Administrative conferral form with real-time interactive diploma preview. |
| `03-verification-valid.png` | Verification Terminal (`/verify`) | 1920x1080 | Authentic result card with emerald-green status badge and SHA-256 fingerprint. |
| `04-verification-fraud.png` | Verification Terminal (`/verify`) | 1920x1080 | Crimson-red warning banner flagging an invalid or tampered credential ID. |
| `05-admin-registry.png` | Registry Ledger (`/admin`) | 1920x1080 | Audit table showing all on-chain registered credentials and real-time search. |
| `06-official-diploma.png` | Diploma View (`/certificate/:id`) | 1920x1080 | Document-style parchment view with embedded QR seal and PDF export button. |

## How to Capture and Add Screenshots

1. Start all services locally:
   ```bash
   npm start
   ```
2. Open your browser at `http://localhost:3000`.
3. Press `Win + Shift + S` (Windows) or `Shift + Cmd + 4` (macOS) or `PrtScn` (Linux).
4. Save your captures directly into this folder (`docs/screenshots/`) using the filenames above.
5. Once placed in this folder, GitHub will automatically render them in the root `README.md`.
