# Recipe 2: Deploying Contracts to opBNB

This recipe shows you how to deploy OptimAI's smart contracts to opBNB (BNB Chain's Layer 2).

## 🎯 What You'll Learn

- How to deploy IntegrityAnchor contract to opBNB
- How to deploy EpochRegistry contract
- How to verify contracts on opBNB explorer
- How to interact with deployed contracts

## 📋 Prerequisites

- Completed [Recipe 1: Setup Development Environment](./01-setup-development-environment.md)
- Wallet with BNB for gas fees (testnet BNB for testnet deployment)
- opBNB explorer API key (for contract verification)

## 🚀 Step-by-Step Instructions

### Step 1: Prepare Your Deployment Account

```bash
# Check your account balance
npx hardhat run scripts/check-balance.js --network opbnb-testnet
```

Make sure you have sufficient BNB for gas fees.

### Step 2: Deploy IntegrityAnchor Contract

```bash
# Deploy to opBNB testnet
npx hardhat run scripts/deploy-opbnb.js --network opbnb-testnet

# Or deploy to opBNB mainnet (use with caution!)
npx hardhat run scripts/deploy-opbnb.js --network opbnb-mainnet
```

The script will output:
- IntegrityAnchor contract address
- EpochRegistry contract address
- Explorer links for verification

### Step 3: Verify Contracts on opBNB Explorer

```bash
# Verify IntegrityAnchor
npx hardhat verify --network opbnb-testnet \
  <INTEGRITY_ANCHOR_ADDRESS> \
  <ANCHORER_ADDRESS>

# Verify EpochRegistry
npx hardhat verify --network opbnb-testnet \
  <EPOCH_REGISTRY_ADDRESS> \
  <ADMIN_ADDRESS> \
  <INTEGRITY_ANCHOR_ADDRESS>
```

### Step 4: Update Configuration

After deployment, update `config/bnbconfig.json` with your deployed contract addresses:

```json
{
  "contracts": {
    "opbnb-testnet": {
      "integrityAnchor": "0x...",
      "epochRegistry": "0x..."
    }
  }
}
```

## 💻 Code Example

Here's what the deployment script does:

```javascript
// scripts/deploy-opbnb.js
const IntegrityAnchor = await ethers.getContractFactory("IntegrityAnchor");
const integrityAnchor = await IntegrityAnchor.deploy(deployer.address);
await integrityAnchor.waitForDeployment();
const integrityAnchorAddress = await integrityAnchor.getAddress();

const EpochRegistry = await ethers.getContractFactory("EpochRegistry");
const epochRegistry = await EpochRegistry.deploy(
  deployer.address,
  integrityAnchorAddress
);
```

## ✅ Verification

Your deployment is successful when:

- ✅ Contracts are deployed and have addresses
- ✅ Contracts are verified on opBNB explorer
- ✅ You can read contract state (e.g., `totalEpochs()`)
- ✅ Contract addresses are saved in configuration

## 🔍 Interacting with Deployed Contracts

```javascript
// Connect to deployed contract
const integrityAnchor = await ethers.getContractAt(
  "IntegrityAnchor",
  "<CONTRACT_ADDRESS>"
);

// Read contract state
const totalEpochs = await integrityAnchor.totalEpochs();
console.log("Total epochs:", totalEpochs.toString());

// Get anchorer address
const anchorer = await integrityAnchor.anchorer();
console.log("Anchorer:", anchorer);
```

## 🔧 Troubleshooting

### Issue: "nonce too high" error

**Solution**: Reset your account nonce or wait a few minutes for pending transactions to clear.

### Issue: Contract verification fails

**Solution**: 
- Ensure constructor arguments are correct
- Check that the contract code matches exactly
- Try using the `--force` flag

### Issue: "insufficient funds" error

**Solution**: Get testnet BNB from the opBNB faucet or ensure your mainnet wallet has sufficient BNB.

## 📚 Next Steps

- [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)
- [Recipe 4: Storing Proofs on BNB Greenfield](./04-greenfield-storage.md)

## 🔗 Related Resources

- [opBNB Explorer](https://mainnet.opbnbscan.com)
- [opBNB Documentation](https://docs.bnbchain.org/opbnb-docs/)
- [Hardhat Verification Guide](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)

