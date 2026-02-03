# OptimAI Network Deployment on BNB Chain

This document describes OptimAI Network's deployment architecture on the BNB Chain ecosystem.

## Overview

OptimAI Network leverages **BNB Chain's multi-layer infrastructure**:
- **opBNB** (Layer 2): For immutable integrity anchoring and low-cost transactions
- **BNB Greenfield**: For decentralized storage of proof artifacts and manifests

## Architecture

### Two-Layer Verification System

```
┌─────────────────────────────────────────────────────────┐
│                    Off-Chain Work                        │
│  (Data Crawling, AI Processing, Node Mining)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BNB Greenfield Storage                      │
│  • Full epoch manifests                                 │
│  • Task proofs and metadata                             │
│  • Verification artifacts                                │
│  Bucket: optimai-mining-proofs                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ manifestURI
                     ▼
┌─────────────────────────────────────────────────────────┐
│              opBNB (Layer 2)                            │
│  • Merkle root commitments                              │
│  • Epoch metadata (epochId, timestamp)                  │
│  • Immutable integrity anchors                          │
│  Contracts:                                             │
│  - IntegrityAnchor: 0xa596E82b0e7D9F5c3e7841CF3F53F66b34D2c1D2 │
│  - EpochRegistry: 0x41d3CF0Ddf968FC65295efaBf4d920D6c02ADffE  │
└─────────────────────────────────────────────────────────┘
```

## Deployment Details

### opBNB Mainnet

**Network Information:**
- Chain ID: 204
- RPC: https://opbnb-mainnet-rpc.bnbchain.org
- Explorer: https://mainnet.opbnbscan.com

**Deployed Contracts:**
- **IntegrityAnchor**: `0xa596E82b0e7D9F5c3e7841CF3F53F66b34D2c1D2`
  - Purpose: Anchor Merkle roots and epoch metadata
  - Function: `anchorEpoch(bytes32 merkleRoot, string manifestURI, uint256 epochId, uint8 schemaVersion)`
  
- **EpochRegistry**: `0x41d3CF0Ddf968FC65295efaBf4d920D6c02ADffE`
  - Purpose: Manage epoch metadata and verification status
  - Functions: `registerEpoch()`, `verifyEpoch()`, `disputeEpoch()`

### BNB Greenfield

**Storage Configuration:**
- Bucket Name: `optimai-mining-proofs`
- Endpoint: https://gnfd-fullnode-tendermint-us.bnbchain.org
- Access: Public read access for trustless verification

**Stored Data:**
- Epoch manifests (JSON format)
- Task proofs and leaf hashes
- Worker metadata and timestamps
- Verification reports

## Verification Process

### Step 1: Off-Chain Work
Core Nodes perform data crawling, AI processing, and other compute-intensive tasks off-chain.

### Step 2: Manifest Creation
Task results are aggregated into an epoch manifest containing:
- All task IDs and leaf hashes
- Worker information
- Timestamps and metadata
- Merkle tree computation

### Step 3: Greenfield Storage
Full manifest is uploaded to BNB Greenfield bucket `optimai-mining-proofs` and a URI is obtained.

### Step 4: On-Chain Anchoring
Merkle root and manifest URI are anchored on opBNB via `IntegrityAnchor.anchorEpoch()`.

### Step 5: Trustless Verification
Anyone can:
1. Fetch manifest from Greenfield using `manifestURI`
2. Recompute Merkle tree from task leaf hashes
3. Compare computed root with on-chain `merkleRoot`
4. Verify consistency and report via `EpochRegistry.verifyEpoch()`

## Benefits of BNB Chain Deployment

1. **Low Transaction Costs**: opBNB's low fees enable high-frequency epoch anchoring
2. **Scalable Storage**: Greenfield provides cost-effective storage for large manifests
3. **Trustless Verification**: Public, immutable commitments enable independent verification
4. **Ecosystem Integration**: Seamless integration with BNB Chain's growing DeFi and infrastructure ecosystem
5. **Future Expansion**: Foundation for cross-chain expansion via LayerZero in Q1/2026

## Network Status

- **Primary Launch**: Q4/2025 on BNB Chain
- **Cross-Chain Expansion**: Q1/2026 (Ethereum, Solana, Base, Aptos via LayerZero)
- **Long-Term Vision**: OptimAI Layer-2 blockchain optimized for agentic AI operations

## Resources

- opBNB Explorer: https://mainnet.opbnbscan.com
- BNB Greenfield Docs: https://docs.bnbchain.org/greenfield-docs/
- OptimAI Explorer: https://explorer.optimai.network/

