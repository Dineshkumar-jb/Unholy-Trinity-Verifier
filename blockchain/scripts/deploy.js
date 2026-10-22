/**
 * Deployment Script for CertificateNFT Smart Contract
 * Deploys to local Hardhat network and saves contract address
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Deploying CertificateNFT Smart Contract...");
  console.log("=".repeat(60));

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("\nDeployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy the contract
  console.log("\nDeploying CertificateNFT...");
  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();

  await certificateNFT.waitForDeployment();

  const contractAddress = await certificateNFT.getAddress();
  console.log("\n✅ CertificateNFT deployed to:", contractAddress);
  console.log("Transaction hash:", certificateNFT.deploymentTransaction().hash);

  // Save deployment info for backend and frontend
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    transactionHash: certificateNFT.deploymentTransaction().hash
  };

  // Save to blockchain directory
  const deploymentDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(deploymentDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Copy ABI for backend and frontend usage
  const artifactPath = path.join(
    __dirname, "..", "artifacts", "blockchain", "contracts",
    "CertificateNFT.sol", "CertificateNFT.json"
  );

  // If the standard artifact path doesn't exist, try the direct path
  let abiSource = artifactPath;
  if (!fs.existsSync(abiSource)) {
    // Hardhat sometimes puts artifacts at root artifacts dir
    const altPath = path.join(
      __dirname, "..", "artifacts", "contracts",
      "CertificateNFT.sol", "CertificateNFT.json"
    );
    if (fs.existsSync(altPath)) {
      abiSource = altPath;
    }
  }

  if (fs.existsSync(abiSource)) {
    const artifact = JSON.parse(fs.readFileSync(abiSource, "utf8"));
    const abiOnly = { abi: artifact.abi };

    // Save ABI to deployments directory
    fs.writeFileSync(
      path.join(deploymentDir, "CertificateNFT.json"),
      JSON.stringify(abiOnly, null, 2)
    );

    // Copy ABI to backend
    const backendContractsDir = path.join(__dirname, "..", "..", "backend", "contracts");
    if (!fs.existsSync(backendContractsDir)) {
      fs.mkdirSync(backendContractsDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(backendContractsDir, "CertificateNFT.json"),
      JSON.stringify(abiOnly, null, 2)
    );
    fs.writeFileSync(
      path.join(backendContractsDir, "deployment.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );

    // Copy ABI to frontend
    const frontendContractsDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
    if (!fs.existsSync(frontendContractsDir)) {
      fs.mkdirSync(frontendContractsDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(frontendContractsDir, "CertificateNFT.json"),
      JSON.stringify(abiOnly, null, 2)
    );
    fs.writeFileSync(
      path.join(frontendContractsDir, "deployment.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n✅ ABI and deployment info saved to:");
    console.log("   - blockchain/deployments/");
    console.log("   - backend/contracts/");
    console.log("   - frontend/src/contracts/");
  } else {
    console.log("\n⚠️  Could not find contract artifact for ABI extraction.");
    console.log("   Run 'npx hardhat compile' first, then re-deploy.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("1. Start Hardhat node: npx hardhat node");
  console.log("2. In a new terminal, deploy: npx hardhat run blockchain/scripts/deploy.js --network localhost");
  console.log("3. Configure MetaMask with:");
  console.log("   - Network: Localhost 8545");
  console.log("   - RPC URL: http://127.0.0.1:8545");
  console.log("   - Chain ID: 31337");
  console.log("   - Import Account #0 private key from Hardhat node output");
  console.log(`4. Contract address: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
