/**
 * CertificateNFT Smart Contract Tests
 * Comprehensive test suite covering all contract functionality
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT", function () {
  let certificateNFT;
  let owner;
  let addr1;
  let addr2;

  // Sample certificate data
  const sampleCert = {
    certificateId: "CERT-2026-001",
    certificateHash: "a8f7b3c9d2e1f0a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7",
    studentName: "Dinesh Kumar",
    courseName: "Computer Science and Engineering",
    institutionName: "VIT University",
    issueDate: Math.floor(Date.now() / 1000),
    metadataURI: "http://localhost:5000/api/metadata/CERT-2026-001"
  };

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    certificateNFT = await CertificateNFT.deploy();
    await certificateNFT.waitForDeployment();
  });

  // ============================================================
  // 1. Contract Deployment Tests
  // ============================================================
  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      expect(await certificateNFT.name()).to.equal("CertificateNFT");
      expect(await certificateNFT.symbol()).to.equal("CERTNFT");
    });

    it("Should set the deployer as the owner", async function () {
      expect(await certificateNFT.owner()).to.equal(owner.address);
    });

    it("Should start with zero certificates minted", async function () {
      expect(await certificateNFT.totalCertificatesMinted()).to.equal(0);
    });

    it("Should start with zero certificates revoked", async function () {
      expect(await certificateNFT.totalCertificatesRevoked()).to.equal(0);
    });

    it("Should start with next token ID = 1", async function () {
      expect(await certificateNFT.getNextTokenId()).to.equal(1);
    });
  });

  // ============================================================
  // 2. Certificate Minting Tests
  // ============================================================
  describe("Minting", function () {
    it("Should mint a certificate NFT successfully", async function () {
      const tx = await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      await tx.wait();

      expect(await certificateNFT.totalCertificatesMinted()).to.equal(1);
      expect(await certificateNFT.getNextTokenId()).to.equal(2);
    });

    it("Should emit CertificateMinted event with correct data", async function () {
      await expect(
        certificateNFT.mintCertificate(
          owner.address,
          sampleCert.certificateId,
          sampleCert.certificateHash,
          sampleCert.studentName,
          sampleCert.courseName,
          sampleCert.institutionName,
          sampleCert.issueDate,
          sampleCert.metadataURI
        )
      )
        .to.emit(certificateNFT, "CertificateMinted")
        .withArgs(
          1, // tokenId
          sampleCert.certificateId,
          sampleCert.certificateHash,
          sampleCert.studentName,
          sampleCert.courseName,
          sampleCert.institutionName,
          owner.address,
          sampleCert.issueDate
        );
    });

    it("Should assign the NFT to the correct owner", async function () {
      await certificateNFT.mintCertificate(
        addr1.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      expect(await certificateNFT.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should set the correct token URI", async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      expect(await certificateNFT.tokenURI(1)).to.equal(sampleCert.metadataURI);
    });

    it("Should reject duplicate certificate IDs", async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      await expect(
        certificateNFT.mintCertificate(
          owner.address,
          sampleCert.certificateId, // duplicate ID
          "different_hash",
          "Another Student",
          "Another Course",
          "Another Institution",
          sampleCert.issueDate,
          ""
        )
      ).to.be.revertedWith("Certificate ID already exists");
    });

    it("Should reject empty certificate ID", async function () {
      await expect(
        certificateNFT.mintCertificate(
          owner.address,
          "", // empty
          sampleCert.certificateHash,
          sampleCert.studentName,
          sampleCert.courseName,
          sampleCert.institutionName,
          sampleCert.issueDate,
          ""
        )
      ).to.be.revertedWith("Certificate ID cannot be empty");
    });

    it("Should reject empty certificate hash", async function () {
      await expect(
        certificateNFT.mintCertificate(
          owner.address,
          sampleCert.certificateId,
          "", // empty
          sampleCert.studentName,
          sampleCert.courseName,
          sampleCert.institutionName,
          sampleCert.issueDate,
          ""
        )
      ).to.be.revertedWith("Certificate hash cannot be empty");
    });

    it("Should reject empty student name", async function () {
      await expect(
        certificateNFT.mintCertificate(
          owner.address,
          sampleCert.certificateId,
          sampleCert.certificateHash,
          "", // empty
          sampleCert.courseName,
          sampleCert.institutionName,
          sampleCert.issueDate,
          ""
        )
      ).to.be.revertedWith("Student name cannot be empty");
    });

    it("Should mint multiple certificates with incremental token IDs", async function () {
      await certificateNFT.mintCertificate(
        owner.address, "CERT-001", "hash1", "Student 1", "Course 1", "Inst 1",
        sampleCert.issueDate, ""
      );
      await certificateNFT.mintCertificate(
        owner.address, "CERT-002", "hash2", "Student 2", "Course 2", "Inst 2",
        sampleCert.issueDate, ""
      );
      await certificateNFT.mintCertificate(
        owner.address, "CERT-003", "hash3", "Student 3", "Course 3", "Inst 3",
        sampleCert.issueDate, ""
      );

      expect(await certificateNFT.totalCertificatesMinted()).to.equal(3);
      expect(await certificateNFT.getNextTokenId()).to.equal(4);
    });
  });

  // ============================================================
  // 3. Certificate Verification Tests
  // ============================================================
  describe("Verification", function () {
    beforeEach(async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );
    });

    it("Should verify a valid certificate by certificate ID", async function () {
      const [isValid, isRevoked, tokenId] = await certificateNFT.verifyCertificateByCertId(
        sampleCert.certificateId
      );

      expect(isValid).to.be.true;
      expect(isRevoked).to.be.false;
      expect(tokenId).to.equal(1);
    });

    it("Should verify a valid certificate by hash", async function () {
      const [isValid, isRevoked, tokenId] = await certificateNFT.verifyCertificateByHash(
        sampleCert.certificateHash
      );

      expect(isValid).to.be.true;
      expect(isRevoked).to.be.false;
      expect(tokenId).to.equal(1);
    });

    it("Should return invalid for non-existent certificate ID", async function () {
      const [isValid, isRevoked, tokenId] = await certificateNFT.verifyCertificateByCertId(
        "NON-EXISTENT-ID"
      );

      expect(isValid).to.be.false;
      expect(isRevoked).to.be.false;
      expect(tokenId).to.equal(0);
    });

    it("Should return invalid for non-existent hash (tampered document)", async function () {
      const [isValid, isRevoked, tokenId] = await certificateNFT.verifyCertificateByHash(
        "tampered_hash_that_does_not_match"
      );

      expect(isValid).to.be.false;
      expect(isRevoked).to.be.false;
      expect(tokenId).to.equal(0);
    });

    it("Should confirm certificate exists", async function () {
      expect(await certificateNFT.certificateExists(sampleCert.certificateId)).to.be.true;
    });

    it("Should confirm certificate does not exist", async function () {
      expect(await certificateNFT.certificateExists("FAKE-ID")).to.be.false;
    });
  });

  // ============================================================
  // 4. Hash Matching / Tamper Detection Tests
  // ============================================================
  describe("Hash Matching & Tamper Detection", function () {
    beforeEach(async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );
    });

    it("Should match the original certificate hash", async function () {
      const cert = await certificateNFT.getCertificate(1);
      expect(cert.certificateHash).to.equal(sampleCert.certificateHash);
    });

    it("Should detect tampered certificate (different hash)", async function () {
      const tamperedHash = "0000000000000000000000000000000000000000000000000000000000000000";
      const [isValid] = await certificateNFT.verifyCertificateByHash(tamperedHash);
      expect(isValid).to.be.false;
    });

    it("Should detect even a single character change in hash", async function () {
      // Change last character of the original hash
      const slightlyTamperedHash = sampleCert.certificateHash.slice(0, -1) + "0";
      const [isValid] = await certificateNFT.verifyCertificateByHash(slightlyTamperedHash);
      expect(isValid).to.be.false;
    });
  });

  // ============================================================
  // 5. Certificate Revocation Tests
  // ============================================================
  describe("Revocation", function () {
    beforeEach(async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );
    });

    it("Should revoke a certificate by token ID", async function () {
      await certificateNFT.revokeCertificate(1);

      const cert = await certificateNFT.getCertificate(1);
      expect(cert.isRevoked).to.be.true;
      expect(await certificateNFT.totalCertificatesRevoked()).to.equal(1);
    });

    it("Should revoke a certificate by certificate ID", async function () {
      await certificateNFT.revokeCertificateByCertId(sampleCert.certificateId);

      const cert = await certificateNFT.getCertificate(1);
      expect(cert.isRevoked).to.be.true;
    });

    it("Should emit CertificateRevoked event", async function () {
      const tx = await certificateNFT.revokeCertificate(1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      await expect(tx)
        .to.emit(certificateNFT, "CertificateRevoked")
        .withArgs(1, sampleCert.certificateId, owner.address, block.timestamp);
    });

    it("Should show revoked status in verification", async function () {
      await certificateNFT.revokeCertificate(1);

      const [isValid, isRevoked] = await certificateNFT.verifyCertificateByCertId(
        sampleCert.certificateId
      );
      expect(isValid).to.be.true; // exists
      expect(isRevoked).to.be.true; // but revoked
    });

    it("Should NOT delete the blockchain record after revocation", async function () {
      await certificateNFT.revokeCertificate(1);

      // Certificate data should still be accessible
      const cert = await certificateNFT.getCertificate(1);
      expect(cert.certificateId).to.equal(sampleCert.certificateId);
      expect(cert.studentName).to.equal(sampleCert.studentName);
      expect(cert.certificateHash).to.equal(sampleCert.certificateHash);
    });

    it("Should reject revoking already revoked certificate", async function () {
      await certificateNFT.revokeCertificate(1);

      await expect(certificateNFT.revokeCertificate(1))
        .to.be.revertedWith("Certificate is already revoked");
    });

    it("Should reject revoking non-existent certificate", async function () {
      await expect(certificateNFT.revokeCertificate(999))
        .to.be.revertedWith("Certificate does not exist");
    });
  });

  // ============================================================
  // 6. Unauthorized Access Tests
  // ============================================================
  describe("Authorization", function () {
    it("Should reject minting from non-owner", async function () {
      await expect(
        certificateNFT.connect(addr1).mintCertificate(
          addr1.address,
          sampleCert.certificateId,
          sampleCert.certificateHash,
          sampleCert.studentName,
          sampleCert.courseName,
          sampleCert.institutionName,
          sampleCert.issueDate,
          sampleCert.metadataURI
        )
      ).to.be.revertedWithCustomError(certificateNFT, "OwnableUnauthorizedAccount");
    });

    it("Should reject revocation from non-owner", async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      await expect(
        certificateNFT.connect(addr1).revokeCertificate(1)
      ).to.be.revertedWithCustomError(certificateNFT, "OwnableUnauthorizedAccount");
    });

    it("Should allow anyone to verify (read) certificates", async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      // Non-owner can verify
      const [isValid] = await certificateNFT
        .connect(addr2)
        .verifyCertificateByCertId(sampleCert.certificateId);
      expect(isValid).to.be.true;

      // Non-owner can get certificate data
      const cert = await certificateNFT.connect(addr2).getCertificate(1);
      expect(cert.studentName).to.equal(sampleCert.studentName);
    });
  });

  // ============================================================
  // 7. NFT Ownership Tests
  // ============================================================
  describe("NFT Ownership", function () {
    it("Should correctly track NFT ownership", async function () {
      await certificateNFT.mintCertificate(
        addr1.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );

      expect(await certificateNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await certificateNFT.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should support ERC721 interface", async function () {
      // ERC721 interface ID: 0x80ac58cd
      expect(await certificateNFT.supportsInterface("0x80ac58cd")).to.be.true;
    });
  });

  // ============================================================
  // 8. Getter Function Tests
  // ============================================================
  describe("Getter Functions", function () {
    beforeEach(async function () {
      await certificateNFT.mintCertificate(
        owner.address,
        sampleCert.certificateId,
        sampleCert.certificateHash,
        sampleCert.studentName,
        sampleCert.courseName,
        sampleCert.institutionName,
        sampleCert.issueDate,
        sampleCert.metadataURI
      );
    });

    it("Should return correct data from getCertificate", async function () {
      const cert = await certificateNFT.getCertificate(1);

      expect(cert.certificateId).to.equal(sampleCert.certificateId);
      expect(cert.certificateHash).to.equal(sampleCert.certificateHash);
      expect(cert.studentName).to.equal(sampleCert.studentName);
      expect(cert.courseName).to.equal(sampleCert.courseName);
      expect(cert.institutionName).to.equal(sampleCert.institutionName);
      expect(cert.issueDate).to.equal(sampleCert.issueDate);
      expect(cert.issuer).to.equal(owner.address);
      expect(cert.isRevoked).to.be.false;
    });

    it("Should return correct data from getCertificateByCertId", async function () {
      const cert = await certificateNFT.getCertificateByCertId(sampleCert.certificateId);
      expect(cert.studentName).to.equal(sampleCert.studentName);
    });

    it("Should return correct token ID from getTokenIdByCertificateId", async function () {
      const tokenId = await certificateNFT.getTokenIdByCertificateId(sampleCert.certificateId);
      expect(tokenId).to.equal(1);
    });

    it("Should revert getCertificate for non-existent token", async function () {
      await expect(certificateNFT.getCertificate(999))
        .to.be.revertedWith("Certificate does not exist");
    });
  });

  // ============================================================
  // 9. End-to-End Flow Test
  // ============================================================
  describe("End-to-End Flow", function () {
    it("Should complete full certificate lifecycle", async function () {
      // Step 1: Mint certificate
      const originalHash = "abc123def456abc123def456abc123def456abc123def456abc123def456abc1";
      const tx = await certificateNFT.mintCertificate(
        owner.address,
        "CERT-E2E-001",
        originalHash,
        "Dinesh Kumar",
        "B.Tech / Integrated M.Tech CSE",
        "VIT University",
        Math.floor(Date.now() / 1000),
        ""
      );
      await tx.wait();
      console.log("      ✓ Step 1: Certificate minted (Token ID: 1)");

      // Step 2: Verify certificate exists
      const [isValid1, isRevoked1, tokenId1] = await certificateNFT.verifyCertificateByCertId("CERT-E2E-001");
      expect(isValid1).to.be.true;
      expect(isRevoked1).to.be.false;
      expect(tokenId1).to.equal(1);
      console.log("      ✓ Step 2: Certificate verified on blockchain");

      // Step 3: Verify by original hash (authentic document)
      const [hashValid] = await certificateNFT.verifyCertificateByHash(originalHash);
      expect(hashValid).to.be.true;
      console.log("      ✓ Step 3: Original hash matches - AUTHENTIC");

      // Step 4: Verify with tampered hash (modified document)
      const tamperedHash = "xxx999xxx888xxx777xxx666xxx555xxx444xxx333xxx222xxx111xxx000xxx999";
      const [tamperedValid] = await certificateNFT.verifyCertificateByHash(tamperedHash);
      expect(tamperedValid).to.be.false;
      console.log("      ✓ Step 4: Tampered hash does NOT match - TAMPER DETECTED");

      // Step 5: Revoke certificate
      await certificateNFT.revokeCertificate(1);
      const [isValid2, isRevoked2] = await certificateNFT.verifyCertificateByCertId("CERT-E2E-001");
      expect(isValid2).to.be.true; // still exists
      expect(isRevoked2).to.be.true; // but revoked
      console.log("      ✓ Step 5: Certificate revoked - REVOKED");

      // Step 6: Verify data still accessible after revocation (immutability)
      const cert = await certificateNFT.getCertificate(1);
      expect(cert.studentName).to.equal("Dinesh Kumar");
      expect(cert.certificateHash).to.equal(originalHash);
      console.log("      ✓ Step 6: Data immutable after revocation");
    });
  });

  // ============================================================
  // Helper Functions
  // ============================================================
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
