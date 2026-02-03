const hre = require("hardhat");
const bnbConfig = require("../config/bnbconfig.json");

/**
 * Deployment script for OptimAI Network contracts on opBNB
 * 
 * This script deploys the IntegrityAnchor and EpochRegistry contracts
 * to opBNB (BNB Chain's Layer 2) as part of OptimAI's primary deployment.
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying OptimAI contracts to opBNB with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy IntegrityAnchor contract
  console.log("\nDeploying IntegrityAnchor...");
  const IntegrityAnchor = await hre.ethers.getContractFactory("IntegrityAnchor");
  const integrityAnchor = await IntegrityAnchor.deploy(deployer.address); // Deployer is initial anchorer
  await integrityAnchor.waitForDeployment();
  const integrityAnchorAddress = await integrityAnchor.getAddress();
  console.log("IntegrityAnchor deployed to:", integrityAnchorAddress);
  
  // Deploy EpochRegistry contract
  console.log("\nDeploying EpochRegistry...");
  const EpochRegistry = await hre.ethers.getContractFactory("EpochRegistry");
  const epochRegistry = await EpochRegistry.deploy(deployer.address, integrityAnchorAddress);
  await epochRegistry.waitForDeployment();
  const epochRegistryAddress = await epochRegistry.getAddress();
  console.log("EpochRegistry deployed to:", epochRegistryAddress);
  
  // Verify contracts on opBNB explorer
  console.log("\nWaiting for block confirmations...");
  await integrityAnchor.deploymentTransaction()?.wait(5);
  await epochRegistry.deploymentTransaction()?.wait(5);
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network: opBNB Mainnet (Chain ID: 204)");
  console.log("IntegrityAnchor:", integrityAnchorAddress);
  console.log("EpochRegistry:", epochRegistryAddress);
  console.log("\nVerify contracts on opBNB explorer:");
  console.log(`https://mainnet.opbnbscan.com/address/${integrityAnchorAddress}`);
  console.log(`https://mainnet.opbnbscan.com/address/${epochRegistryAddress}`);
  
  // Save deployment addresses
  const deploymentInfo = {
    network: "opbnb-mainnet",
    chainId: 204,
    deployer: deployer.address,
    contracts: {
      integrityAnchor: integrityAnchorAddress,
      epochRegistry: epochRegistryAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  console.log("\nDeployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

