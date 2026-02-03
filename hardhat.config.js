require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load BNB Chain configuration
const bnbConfig = require("./config/bnbconfig.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // opBNB Mainnet - Primary deployment for OptimAI integrity anchoring
    "opbnb-mainnet": {
      url: bnbConfig.networks["opbnb-mainnet"].rpcUrl,
      chainId: bnbConfig.networks["opbnb-mainnet"].chainId,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    // opBNB Testnet
    "opbnb-testnet": {
      url: bnbConfig.networks["opbnb-testnet"].rpcUrl,
      chainId: bnbConfig.networks["opbnb-testnet"].chainId,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000,
    },
    // BNB Smart Chain Mainnet
    "bsc-mainnet": {
      url: bnbConfig.networks["bsc-mainnet"].rpcUrl,
      chainId: bnbConfig.networks["bsc-mainnet"].chainId,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000, // 5 gwei
    },
    // BNB Smart Chain Testnet
    "bsc-testnet": {
      url: bnbConfig.networks["bsc-testnet"].rpcUrl,
      chainId: bnbConfig.networks["bsc-testnet"].chainId,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
    },
  },
  etherscan: {
    apiKey: {
      opbnb: process.env.OPBNB_API_KEY || "",
      bsc: process.env.BSC_API_KEY || "",
    },
    customChains: [
      {
        network: "opbnb",
        chainId: 204,
        urls: {
          apiURL: "https://api-opbnb-mainnet.bscscan.com/api",
          browserURL: "https://mainnet.opbnbscan.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

