/**
 * BNB Greenfield Storage Configuration
 * 
 * This script demonstrates how OptimAI Network uses BNB Greenfield
 * for storing epoch manifests and proof artifacts.
 * 
 * Greenfield bucket: optimai-mining-proofs
 * Purpose: Decentralized storage for full proof artifacts backing on-chain commitments
 */

const GREENFIELD_CONFIG = {
  bucketName: "optimai-mining-proofs",
  endpoint: {
    testnet: "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
    mainnet: "https://gnfd-fullnode-tendermint-us.bnbchain.org",
  },
  description: "Stores epoch manifests, task proofs, and verification artifacts for OptimAI Network",
};

/**
 * Example epoch manifest structure stored on BNB Greenfield
 * This manifest is referenced by manifestURI in on-chain IntegrityAnchor contract
 */
const EXAMPLE_MANIFEST = {
  epochId: 12345,
  schemaVersion: 1,
  merkleRoot: "0x...", // Must match on-chain commitment
  timestamp: 1234567890,
  tasks: [
    {
      taskId: "task-001",
      type: "data_crawl",
      worker: "node-abc123",
      leafHash: "0x...",
      metadata: {
        url: "https://example.com",
        timestamp: 1234567890,
      },
    },
    // ... more tasks
  ],
  verification: {
    totalTasks: 1000,
    validTasks: 995,
    invalidTasks: 5,
  },
};

/**
 * How verification works:
 * 1. Fetch manifest from BNB Greenfield using manifestURI
 * 2. Recompute Merkle tree from all task leaf hashes
 * 3. Compare computed root with on-chain merkleRoot from opBNB
 * 4. If match, epoch is verified; if not, epoch can be disputed
 */

module.exports = {
  GREENFIELD_CONFIG,
  EXAMPLE_MANIFEST,
};

