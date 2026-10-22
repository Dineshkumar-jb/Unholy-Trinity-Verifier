// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateNFT
 * @dev ERC-721 NFT Smart Contract for Blockchain-Enhanced Certificate Verification
 * 
 * Each certificate is represented as a unique NFT with:
 * - Certificate hash (SHA-256) stored on-chain for tamper detection
 * - Certificate metadata (student, course, institution, dates)
 * - Revocation status for institutional control
 * - Issuer wallet identity for traceability
 *
 * Only the contract owner (institution/admin) can mint and revoke certificates.
 * Anyone can verify a certificate without needing a wallet.
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {

    // ============================================================
    // State Variables
    // ============================================================

    /// @dev Auto-incrementing token ID counter
    uint256 private _nextTokenId;

    /// @dev Certificate data structure stored on-chain
    struct Certificate {
        string certificateId;      // e.g., "CERT-2026-001"
        string certificateHash;    // SHA-256 hash of the certificate file
        string studentName;        // Student / recipient name
        string courseName;         // Course or program name
        string institutionName;    // Issuing institution
        uint256 issueDate;         // Unix timestamp of issuance
        address issuer;            // Wallet address of the issuer
        bool isRevoked;            // Revocation status
        bool exists;               // Whether this certificate exists
    }

    /// @dev Mapping from token ID to Certificate data
    mapping(uint256 => Certificate) private _certificates;

    /// @dev Mapping from certificate ID string to token ID
    mapping(string => uint256) private _certificateIdToTokenId;

    /// @dev Mapping from certificate hash to token ID (for hash-based lookup)
    mapping(string => uint256) private _hashToTokenId;

    /// @dev Track whether a certificate ID has been used
    mapping(string => bool) private _certificateIdExists;

    /// @dev Total certificates minted (including revoked)
    uint256 public totalCertificatesMinted;

    /// @dev Total certificates revoked
    uint256 public totalCertificatesRevoked;

    // ============================================================
    // Events
    // ============================================================

    /// @dev Emitted when a new certificate NFT is minted
    event CertificateMinted(
        uint256 indexed tokenId,
        string certificateId,
        string certificateHash,
        string studentName,
        string courseName,
        string institutionName,
        address indexed issuer,
        uint256 issueDate
    );

    /// @dev Emitted when a certificate is revoked
    event CertificateRevoked(
        uint256 indexed tokenId,
        string certificateId,
        address indexed revokedBy,
        uint256 revokedAt
    );

    // ============================================================
    // Constructor
    // ============================================================

    /**
     * @dev Sets the token name and symbol, and transfers ownership to deployer
     */
    constructor() ERC721("CertificateNFT", "CERTNFT") Ownable(msg.sender) {
        _nextTokenId = 1; // Start token IDs from 1
    }

    // ============================================================
    // Core Functions
    // ============================================================

    /**
     * @dev Mint a new certificate NFT
     * @param to Address to receive the NFT (can be institution's own address)
     * @param certificateId Unique certificate identifier (e.g., "CERT-2026-001")
     * @param certificateHash SHA-256 hash of the certificate document
     * @param studentName Name of the student/recipient
     * @param courseName Name of the course or program
     * @param institutionName Name of the issuing institution
     * @param issueDate Unix timestamp of the issue date
     * @param metadataURI URI for NFT metadata (can be IPFS or local URL)
     * @return tokenId The ID of the newly minted token
     */
    function mintCertificate(
        address to,
        string memory certificateId,
        string memory certificateHash,
        string memory studentName,
        string memory courseName,
        string memory institutionName,
        uint256 issueDate,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        // Validate inputs
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(certificateHash).length > 0, "Certificate hash cannot be empty");
        require(bytes(studentName).length > 0, "Student name cannot be empty");
        require(!_certificateIdExists[certificateId], "Certificate ID already exists");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        // Mint the NFT
        _safeMint(to, tokenId);

        // Set token URI for metadata
        if (bytes(metadataURI).length > 0) {
            _setTokenURI(tokenId, metadataURI);
        }

        // Store certificate data on-chain
        _certificates[tokenId] = Certificate({
            certificateId: certificateId,
            certificateHash: certificateHash,
            studentName: studentName,
            courseName: courseName,
            institutionName: institutionName,
            issueDate: issueDate,
            issuer: msg.sender,
            isRevoked: false,
            exists: true
        });

        // Create reverse mappings for lookups
        _certificateIdToTokenId[certificateId] = tokenId;
        _hashToTokenId[certificateHash] = tokenId;
        _certificateIdExists[certificateId] = true;

        // Update counters
        totalCertificatesMinted++;

        // Emit event
        emit CertificateMinted(
            tokenId,
            certificateId,
            certificateHash,
            studentName,
            courseName,
            institutionName,
            msg.sender,
            issueDate
        );

        return tokenId;
    }

    /**
     * @dev Revoke a certificate by token ID
     * @param tokenId The token ID of the certificate to revoke
     *
     * Note: The NFT and blockchain record are NOT deleted.
     * Only the revocation flag is set, demonstrating blockchain immutability.
     */
    function revokeCertificate(uint256 tokenId) public onlyOwner {
        require(_certificates[tokenId].exists, "Certificate does not exist");
        require(!_certificates[tokenId].isRevoked, "Certificate is already revoked");

        _certificates[tokenId].isRevoked = true;
        totalCertificatesRevoked++;

        emit CertificateRevoked(
            tokenId,
            _certificates[tokenId].certificateId,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Revoke a certificate by certificate ID string
     * @param certificateId The certificate ID string (e.g., "CERT-2026-001")
     */
    function revokeCertificateByCertId(string memory certificateId) public onlyOwner {
        require(_certificateIdExists[certificateId], "Certificate ID does not exist");
        uint256 tokenId = _certificateIdToTokenId[certificateId];
        revokeCertificate(tokenId);
    }

    // ============================================================
    // Verification Functions (Public - No wallet required to call via backend)
    // ============================================================

    /**
     * @dev Verify a certificate by its hash
     * @param certificateHash The SHA-256 hash to verify
     * @return isValid Whether the hash matches a certificate on-chain
     * @return isRevoked Whether the certificate has been revoked
     * @return tokenId The token ID (0 if not found)
     */
    function verifyCertificateByHash(string memory certificateHash) 
        public view returns (bool isValid, bool isRevoked, uint256 tokenId) 
    {
        tokenId = _hashToTokenId[certificateHash];
        if (tokenId == 0 || !_certificates[tokenId].exists) {
            return (false, false, 0);
        }
        return (true, _certificates[tokenId].isRevoked, tokenId);
    }

    /**
     * @dev Verify a certificate by certificate ID
     * @param certificateId The certificate ID string
     * @return isValid Whether the certificate exists
     * @return isRevoked Whether the certificate has been revoked
     * @return tokenId The token ID (0 if not found)
     */
    function verifyCertificateByCertId(string memory certificateId) 
        public view returns (bool isValid, bool isRevoked, uint256 tokenId) 
    {
        if (!_certificateIdExists[certificateId]) {
            return (false, false, 0);
        }
        tokenId = _certificateIdToTokenId[certificateId];
        return (true, _certificates[tokenId].isRevoked, tokenId);
    }

    /**
     * @dev Check if a certificate exists
     * @param certificateId The certificate ID to check
     * @return Whether the certificate exists on the blockchain
     */
    function certificateExists(string memory certificateId) public view returns (bool) {
        return _certificateIdExists[certificateId];
    }

    // ============================================================
    // Getter Functions
    // ============================================================

    /**
     * @dev Get full certificate data by token ID
     * @param tokenId The token ID
     */
    function getCertificate(uint256 tokenId) public view returns (
        string memory certificateId,
        string memory certificateHash,
        string memory studentName,
        string memory courseName,
        string memory institutionName,
        uint256 issueDate,
        address issuer,
        bool isRevoked
    ) {
        require(_certificates[tokenId].exists, "Certificate does not exist");
        Certificate memory cert = _certificates[tokenId];
        return (
            cert.certificateId,
            cert.certificateHash,
            cert.studentName,
            cert.courseName,
            cert.institutionName,
            cert.issueDate,
            cert.issuer,
            cert.isRevoked
        );
    }

    /**
     * @dev Get certificate data by certificate ID string
     * @param certId The certificate ID string
     */
    function getCertificateByCertId(string memory certId) public view returns (
        string memory certificateId,
        string memory certificateHash,
        string memory studentName,
        string memory courseName,
        string memory institutionName,
        uint256 issueDate,
        address issuer,
        bool isRevoked
    ) {
        require(_certificateIdExists[certId], "Certificate ID does not exist");
        uint256 tokenId = _certificateIdToTokenId[certId];
        return getCertificate(tokenId);
    }

    /**
     * @dev Get token ID from certificate ID
     * @param certificateId The certificate ID string
     * @return The token ID
     */
    function getTokenIdByCertificateId(string memory certificateId) public view returns (uint256) {
        require(_certificateIdExists[certificateId], "Certificate ID does not exist");
        return _certificateIdToTokenId[certificateId];
    }

    /**
     * @dev Get the next token ID (useful for frontend)
     * @return The next token ID that will be minted
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    // ============================================================
    // Override Functions (Required by Solidity for multiple inheritance)
    // ============================================================

    function tokenURI(uint256 tokenId) 
        public view override(ERC721, ERC721URIStorage) returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721, ERC721URIStorage) returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
