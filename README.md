# OptimAI Network

A decentralized AI network focused on enabling real-time, continuously learning agentic AI systems through community-owned data and distributed compute. Built on a DePIN architecture with an EVM Layer-2 backbone on **BNB Chain** (opBNB and BNB Greenfield), OptimAI addresses a structural limitation of current AI platforms: dependence on centralized, static, and low-context data.

## Overview

OptimAI Network is a decentralized AI network designed to support autonomous AI systems at scale. The network enables agents to operate on behalf of users, while data and compute are contributed, validated, and economically rewarded across a distributed infrastructure. Continuous reinforcement is driven by network participation rather than centralized model control.

Our flagship product, the **OptimAI Agent**, delivers autonomous research, search, and personalized content workflows across web and social platforms, with agents that improve over time through decentralized reinforcement rather than one-off prompts.

Built on **BNB Chain's opBNB** for immutable integrity anchoring and **BNB Greenfield** for scalable proof storage, OptimAI creates an end-to-end verifiable on-chain data pipeline for decentralized AI operations. This architecture supports scalable, cost-efficient, and verifiable AI systems that remain aligned with user ownership and long-term network incentives.

**Backed by YZi Labs (EASY Residency S1) and CoinMarketCap's CMC Labs**, OptimAI has scaled rapidly since its March 2025 launch to over **970,000 deployed nodes** and more than **40,000 active agentic users**. The network enables privacy-first, user-owned AI agents and positions itself as a Web3-native alternative to centralized agentic systems such as Manus AI, ChatGPT Operator, or Grok. OptimAI's approach has been externally validated, including recognition by CZ as the leading persona-based agentic system during his Personalized AI Challenge on Binance Square in August 2025.

## ⚠️ The Problem

Current AI platforms are built on centralized architectures that concentrate data ownership, model control, and economic value within a small number of providers. This structure increases costs, limits transparency, and restricts user agency, while relying on static or low-context data that does not improve meaningfully through real-world use.

## 🧠 OptimAI's Approach

OptimAI introduces a decentralized AI network where autonomous agents operate on behalf of users, not platforms. Data and compute are contributed and rewarded across a distributed network, and model reinforcement is driven by continuous community validation rather than centralized oversight. This design enables AI systems that are scalable, cost-efficient, verifiable, and aligned with user ownership and long-term participation.

OptimAI turns everyday browsing and interactions into ethical, privacy-preserving AI training, shifting AI from extraction to participation and ownership.

## Technology Stack

- **Blockchain**: BNB Chain (opBNB for integrity layer, BNB Greenfield for data availability)
- **Smart Contracts**: Solidity (EVM-compatible)
- **Storage**: BNB Greenfield (decentralized storage for proof artifacts)
- **Network**: opBNB (Layer 2 for low-cost, high-throughput transactions)
- **Development**: Hardhat / Foundry, OpenZeppelin libraries
- **SDKs**: BNB Greenfield SDK for storage operations

## Supported Networks

- **opBNB Mainnet** (Chain ID: 204) - Primary deployment for integrity anchoring
- **BNB Smart Chain Mainnet** (Chain ID: 56) - Token and governance contracts
- **BNB Greenfield** - Decentralized storage for mining proofs and manifests
- **opBNB Testnet** (Chain ID: 5611) - Testing environment
- **BNB Smart Chain Testnet** (Chain ID: 97) - Testing environment

*Note: Cross-chain expansion to Ethereum, Solana, Base, and Aptos planned for Q1/2026 via LayerZero interoperability.*

## Contract Addresses

| Network | Integrity Anchor Contract | Epoch Registry Contract | Token Contract ($OPI) |
|---------|---------------------------|-------------------------|----------------------|
| opBNB Mainnet | 0xa596E82b0e7D9F5c3e7841CF3F53F66b34D2c1D2 | 0x41d3CF0Ddf968FC65295efaBf4d920D6c02ADffE | TBD |
| opBNB Testnet | TBD | TBD | TBD |

## BNB Greenfield Storage

- **Bucket Name**: `optimai-mining-proofs`
- **Purpose**: Stores epoch manifests, task proofs, and verification artifacts
- **Access**: Public read access for trustless verification

## Architecture

### opBNB - Immutable Integrity & Time Anchoring
- Records cryptographic commitments (Merkle roots) for each batch of completed tasks
- Stores irreversible on-chain "receipts" proving work existed within specific UTC epochs
- Anchors minimal metadata: `merkleRoot`, `manifestURI`, `epochId`, `schemaVersion`
- Enables trustless verification without relying on OptimAI servers

### BNB Greenfield - Scalable Proof & Data Availability Layer
- Decentralized storage for full proof artifacts generated from off-chain work
- Stores detailed epoch manifests including all tasks, leaf hashes, and metadata
- Serves as the data availability layer backing every on-chain commitment
- Allows third parties to fetch manifests, recompute Merkle trees, and verify consistency

### End-to-End Verifiable Pipeline
- **opBNB** = truth & finality
- **Greenfield** = evidence & availability
- Each epoch becomes a public, composable, verifiable proof unit

## Our Ecosystem

### Key Components

- **🔍 OptimAI Agent & Search (XAgent)**: Real-time AI search and intelligence with persona replication, content generation, and social workflow integration

- **🌐 OptimAI Network**: Decentralized Reinforcement Data Network combining DePIN, Layer-2 blockchain, and community validation

- **🖥 OptimAI Nodes**: Browser, mobile, and core nodes that collect, validate, and process real-world data (with user consent)

- **🪙 OPI Token**: Rewards node operators, powers data & AI marketplaces, enables staking and decentralized governance

- **🛠 Developer Ecosystem**: Agent OS, SDK, marketplace, and tools to build, deploy, and monetize AI agents

- **🤝 Strategic Backing**: Backed by Google for Startups (AI Tier) and AWS Startup Program, OptimAI leverages over $350,000 in cloud credits and advanced AI infrastructure to scale decentralized intelligence at global speed

## Features

- **Decentralized Data Integrity**: Off-chain AI/mining work anchored on opBNB with verifiable proofs stored on Greenfield
- **Trustless Verification**: Anyone can independently recompute and validate task integrity
- **Low-Cost Operations**: Leverages opBNB's low fees for high-frequency integrity anchoring
- **Scalable Storage**: Greenfield enables large-scale proof storage at low cost
- **Community Governance**: $OPI token holders govern data sources, model updates, and network policies
- **Node Staking System**: Core Nodes, Data Validation Nodes, and Compute Nodes stake $OPI for trust and accountability
- **Gas-Efficient Design**: Optimized for BNB Chain's low transaction costs
- **Privacy-First Architecture**: User-owned AI agents with ethical, privacy-preserving data collection
- **Continuous Learning**: Agents improve over time through decentralized reinforcement

## Use Cases

### Core Node Mining
- Heavy tasks (data crawling, parsing, AI processing) executed off-chain
- Results stored in BNB Greenfield
- Merkle roots periodically anchored on opBNB
- Fair rewards based on proven contribution, not trust

### Decentralized Search
- Search requests split across multiple nodes
- Data collected, structured, and analyzed off-chain
- Results verified against on-chain commitments
- Users and AI agents get reliable, verifiable public data

## Network Statistics

- **970,000+** deployed nodes
- **40,000+** active agentic users
- **179** countries represented
- **$350,000+** in cloud infrastructure credits (Google for Startups, AWS)

## Resources

- **OptimAI Network**: https://optimai.network/
- **OptimAI Explorer**: https://explorer.optimai.network/
- **OptimAI Search**: https://search.optimai.network/
- **Persona Agent**: https://optimai.im/download

## Development

### Prerequisites
- Node.js >= 18.0.0
- Hardhat or Foundry
- BNB Greenfield SDK

### Setup
```bash
npm install
```

### Configuration
See `config/bnbconfig.json` for BNB Chain network configurations.

### Deployment
```bash
# Deploy to opBNB Testnet
npx hardhat deploy --network opbnb-testnet

# Deploy to opBNB Mainnet
npx hardhat deploy --network opbnb-mainnet
```

## License

[Specify your license]

## Contact

[Add contact information or links to social media]
