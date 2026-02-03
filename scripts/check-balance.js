const hre = require("hardhat");

/**
 * Check account balance on BNB Chain networks
 * Usage: npx hardhat run scripts/check-balance.js --network <network-name>
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = signer.address;
  
  console.log("Checking balance for:", address);
  console.log("Network:", hre.network.name);
  
  const balance = await hre.ethers.provider.getBalance(address);
  const balanceInBNB = hre.ethers.formatEther(balance);
  
  console.log("\nBalance:", balanceInBNB, "BNB");
  console.log("Balance (Wei):", balance.toString());
  
  if (parseFloat(balanceInBNB) < 0.01) {
    console.log("\n⚠️  Warning: Low balance! You may need more BNB for gas fees.");
    if (hre.network.name.includes("testnet")) {
      console.log("Get testnet BNB from the faucet:");
      console.log("  - opBNB Testnet: https://opbnb-testnet-bridge.bnbchain.org/");
      console.log("  - BSC Testnet: https://testnet.bnbchain.org/faucet-smart");
    }
  } else {
    console.log("\n✅ Sufficient balance for operations");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

