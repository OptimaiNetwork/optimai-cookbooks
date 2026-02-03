# Recipe 1: Setting Up Your Development Environment

This recipe guides you through setting up your development environment to work with OptimAI Network on BNB Chain.

## 🎯 What You'll Learn

- How to configure Hardhat for BNB Chain networks
- Setting up opBNB and BSC network connections
- Installing required dependencies
- Configuring environment variables

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- A code editor (VS Code recommended)
- Basic knowledge of Solidity and JavaScript

## 🚀 Step-by-Step Instructions

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-org/optimai-cookbooks.git
cd optimai-cookbooks

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# You'll need:
# - PRIVATE_KEY: Your wallet private key (for deployment)
# - OPBNB_API_KEY: opBNB explorer API key (for contract verification)
# - BSC_API_KEY: BSC explorer API key (for contract verification)
```

**⚠️ Security Note**: Never commit your `.env` file. It's already in `.gitignore`.

### Step 3: Verify Network Configuration

Check `config/bnbconfig.json` to see the configured networks:

```json
{
  "networks": {
    "opbnb-mainnet": {
      "chainId": 204,
      "rpcUrl": "https://opbnb-mainnet-rpc.bnbchain.org",
      "primary": true
    },
    "opbnb-testnet": {
      "chainId": 5611,
      "rpcUrl": "https://opbnb-testnet-rpc.bnbchain.org"
    }
  }
}
```

### Step 4: Test Your Setup

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Check available networks
npx hardhat networks
```

## ✅ Verification

Your setup is complete when:

- ✅ Contracts compile without errors
- ✅ Tests pass successfully
- ✅ You can see opBNB networks in Hardhat configuration

## 🔧 Troubleshooting

### Issue: "Cannot find module '@nomicfoundation/hardhat-toolbox'"

**Solution**: Run `npm install` again to ensure all dependencies are installed.

### Issue: "Invalid network" error

**Solution**: Verify your `hardhat.config.js` includes the opBNB network configuration and your `.env` file has the correct RPC URLs.

### Issue: "Insufficient funds" when deploying

**Solution**: Ensure your wallet has BNB for gas fees. For testnet, get testnet BNB from the faucet.

## 📚 Next Steps

- [Recipe 2: Deploying Contracts to opBNB](./02-deploy-to-opbnb.md)
- [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)

## 🔗 Related Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [BNB Chain Documentation](https://docs.bnbchain.org/)
- [opBNB Network Info](https://docs.bnbchain.org/opbnb-docs/)

