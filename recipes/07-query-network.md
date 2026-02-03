# Recipe 7: Querying OptimAI Network

This recipe demonstrates how to query and monitor OptimAI Network data from both on-chain contracts and off-chain sources.

## 🎯 What You'll Learn

- How to read epoch data from opBNB contracts
- How to query Greenfield storage
- How to monitor network activity
- How to build analytics dashboards
- How to track node performance

## 📋 Prerequisites

- Completed [Recipe 2: Deploying Contracts to opBNB](./02-deploy-to-opbnb.md)
- Access to opBNB RPC endpoint
- Understanding of OptimAI Network architecture

## 🚀 Step-by-Step Instructions

### Step 1: Connect to opBNB Contracts

```javascript
const { ethers } = require('ethers');

// Connect to opBNB
const provider = new ethers.JsonRpcProvider(
  'https://opbnb-mainnet-rpc.bnbchain.org'
);

// Connect to contracts
const integrityAnchorAddress = '0xa596E82b0e7D9F5c3e7841CF3F53F66b34D2c1D2';
const epochRegistryAddress = '0x41d3CF0Ddf968FC65295efaBf4d920D6c02ADffE';

const integrityAnchor = new ethers.Contract(
  integrityAnchorAddress,
  IntegrityAnchorABI,
  provider
);

const epochRegistry = new ethers.Contract(
  epochRegistryAddress,
  EpochRegistryABI,
  provider
);
```

### Step 2: Query Epoch Data

```javascript
// Get total number of epochs
async function getTotalEpochs() {
  const totalEpochs = await integrityAnchor.totalEpochs();
  return totalEpochs.toString();
}

// Get specific epoch data
async function getEpoch(epochId) {
  const epoch = await integrityAnchor.getEpoch(epochId);
  return {
    epochId: epoch.epochId.toString(),
    merkleRoot: epoch.merkleRoot,
    manifestURI: epoch.manifestURI,
    timestamp: new Date(epoch.timestamp * 1000),
    schemaVersion: epoch.schemaVersion
  };
}

// Get recent epochs
async function getRecentEpochs(limit = 10) {
  const totalEpochs = await getTotalEpochs();
  const epochs = [];
  
  for (let i = totalEpochs; i > Math.max(0, totalEpochs - limit); i--) {
    const epoch = await getEpoch(i);
    epochs.push(epoch);
  }
  
  return epochs;
}
```

### Step 3: Query Epoch Registry

```javascript
// Get epoch metadata from registry
async function getEpochMetadata(epochId) {
  const metadata = await epochRegistry.getEpochMetadata(epochId);
  return {
    epochId: metadata.epochId.toString(),
    merkleRoot: metadata.merkleRoot,
    manifestURI: metadata.manifestURI,
    startTime: new Date(metadata.startTime * 1000),
    endTime: new Date(metadata.endTime * 1000),
    taskCount: metadata.taskCount.toString(),
    verified: metadata.verified,
    disputed: metadata.disputed
  };
}

// Get verifiers for an epoch
async function getEpochVerifiers(epochId) {
  const verifiers = await epochRegistry.getEpochVerifiers(epochId);
  return verifiers;
}
```

### Step 4: Monitor Events

```javascript
// Listen for new epoch anchoring events
async function monitorEpochAnchoring() {
  integrityAnchor.on("EpochAnchored", (merkleRoot, manifestURI, epochId, timestamp, schemaVersion) => {
    console.log("New epoch anchored:", {
      epochId: epochId.toString(),
      merkleRoot,
      manifestURI,
      timestamp: new Date(timestamp * 1000),
      schemaVersion
    });
  });
}

// Listen for verification events
async function monitorVerifications() {
  epochRegistry.on("EpochVerified", (epochId, verified, verifier) => {
    console.log("Epoch verified:", {
      epochId: epochId.toString(),
      verified,
      verifier
    });
  });

  epochRegistry.on("EpochDisputed", (epochId, disputer, reason) => {
    console.log("Epoch disputed:", {
      epochId: epochId.toString(),
      disputer,
      reason
    });
  });
}
```

### Step 5: Query Greenfield Storage

```javascript
const { Client } = require('@bnb-chain/greenfield-js-sdk');

async function getManifestFromGreenfield(manifestURI) {
  // Parse URI
  const uriMatch = manifestURI.match(/greenfield:\/\/([^\/]+)\/(.+)/);
  if (!uriMatch) return null;

  const [bucketName, objectName] = [uriMatch[1], uriMatch[2]];

  // Fetch from Greenfield
  const client = Client.create(
    'https://gnfd-fullnode-tendermint-us.bnbchain.org',
    '1017'
  );

  const downloadRes = await client.object.getObject({
    bucketName,
    objectName,
  });

  return JSON.parse(Buffer.from(downloadRes.body).toString('utf-8'));
}
```

### Step 6: Build Network Analytics

```javascript
// Get network statistics
async function getNetworkStats() {
  const totalEpochs = await getTotalEpochs();
  const recentEpochs = await getRecentEpochs(100);
  
  // Calculate statistics
  const stats = {
    totalEpochs: parseInt(totalEpochs),
    verifiedEpochs: 0,
    disputedEpochs: 0,
    totalTasks: 0,
    averageTasksPerEpoch: 0
  };

  for (const epoch of recentEpochs) {
    const metadata = await getEpochMetadata(epoch.epochId);
    if (metadata.verified) stats.verifiedEpochs++;
    if (metadata.disputed) stats.disputedEpochs++;
    stats.totalTasks += parseInt(metadata.taskCount);
  }

  stats.averageTasksPerEpoch = stats.totalTasks / recentEpochs.length;

  return stats;
}
```

## 💻 Complete Query Example

```javascript
// examples/query-network.js
const { ethers } = require('ethers');
const { Client } = require('@bnb-chain/greenfield-js-sdk');

class OptimAINetworkQuerier {
  constructor(rpcUrl, contractAddresses) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.integrityAnchor = new ethers.Contract(
      contractAddresses.integrityAnchor,
      IntegrityAnchorABI,
      this.provider
    );
    this.epochRegistry = new ethers.Contract(
      contractAddresses.epochRegistry,
      EpochRegistryABI,
      this.provider
    );
  }

  async getNetworkOverview() {
    const totalEpochs = await this.integrityAnchor.totalEpochs();
    const recentEpochs = await this.getRecentEpochs(10);
    
    return {
      totalEpochs: totalEpochs.toString(),
      recentEpochs: recentEpochs.length,
      latestEpoch: recentEpochs[0] || null
    };
  }

  async getEpochDetails(epochId) {
    // Get on-chain data
    const onChainEpoch = await this.integrityAnchor.getEpoch(epochId);
    const metadata = await this.epochRegistry.getEpochMetadata(epochId);
    const verifiers = await this.epochRegistry.getEpochVerifiers(epochId);

    // Get off-chain manifest
    let manifest = null;
    try {
      manifest = await this.getManifestFromGreenfield(onChainEpoch.manifestURI);
    } catch (error) {
      console.error('Failed to fetch manifest:', error);
    }

    return {
      onChain: {
        epochId: onChainEpoch.epochId.toString(),
        merkleRoot: onChainEpoch.merkleRoot,
        manifestURI: onChainEpoch.manifestURI,
        timestamp: new Date(onChainEpoch.timestamp * 1000)
      },
      metadata: {
        startTime: new Date(metadata.startTime * 1000),
        endTime: new Date(metadata.endTime * 1000),
        taskCount: metadata.taskCount.toString(),
        verified: metadata.verified,
        disputed: metadata.disputed
      },
      verifiers: verifiers,
      manifest: manifest
    };
  }

  async getRecentEpochs(limit = 10) {
    const totalEpochs = await this.integrityAnchor.totalEpochs();
    const epochs = [];
    
    const start = Math.max(1, totalEpochs - BigInt(limit));
    for (let i = totalEpochs; i >= start; i--) {
      const epoch = await this.integrityAnchor.getEpoch(i);
      epochs.push({
        epochId: epoch.epochId.toString(),
        merkleRoot: epoch.merkleRoot,
        manifestURI: epoch.manifestURI,
        timestamp: new Date(epoch.timestamp * 1000)
      });
    }
    
    return epochs;
  }

  async getManifestFromGreenfield(manifestURI) {
    const uriMatch = manifestURI.match(/greenfield:\/\/([^\/]+)\/(.+)/);
    if (!uriMatch) return null;

    const [bucketName, objectName] = [uriMatch[1], uriMatch[2]];
    const client = Client.create(
      'https://gnfd-fullnode-tendermint-us.bnbchain.org',
      '1017'
    );

    const downloadRes = await client.object.getObject({
      bucketName,
      objectName,
    });

    return JSON.parse(Buffer.from(downloadRes.body).toString('utf-8'));
  }

  async monitorNetwork() {
    console.log('Monitoring OptimAI Network...\n');

    // Monitor new epochs
    this.integrityAnchor.on("EpochAnchored", async (merkleRoot, manifestURI, epochId) => {
      console.log(`\n📋 New Epoch Anchored: ${epochId.toString()}`);
      console.log(`   Merkle Root: ${merkleRoot}`);
      console.log(`   Manifest URI: ${manifestURI}`);
      
      // Get full details
      const details = await this.getEpochDetails(epochId.toString());
      console.log(`   Tasks: ${details.metadata.taskCount}`);
    });

    // Monitor verifications
    this.epochRegistry.on("EpochVerified", (epochId, verified, verifier) => {
      console.log(`✅ Epoch ${epochId.toString()} verified by ${verifier}`);
    });

    // Monitor disputes
    this.epochRegistry.on("EpochDisputed", (epochId, disputer, reason) => {
      console.log(`⚠️  Epoch ${epochId.toString()} disputed by ${disputer}`);
      console.log(`   Reason: ${reason}`);
    });
  }
}

// Usage
const querier = new OptimAINetworkQuerier(
  'https://opbnb-mainnet-rpc.bnbchain.org',
  {
    integrityAnchor: '0xa596E82b0e7D9F5c3e7841CF3F53F66b34D2c1D2',
    epochRegistry: '0x41d3CF0Ddf968FC65295efaBf4d920D6c02ADffE'
  }
);

// Get network overview
querier.getNetworkOverview().then(console.log);

// Monitor network
querier.monitorNetwork();
```

## ✅ Verification

Your queries are working when:

- ✅ You can read epoch data from contracts
- ✅ You can fetch manifests from Greenfield
- ✅ Events are being monitored correctly
- ✅ Statistics are calculated accurately

## 🔧 Troubleshooting

### Issue: RPC connection timeout

**Solution**: 
- Use a reliable RPC provider
- Implement retry logic
- Consider using multiple RPC endpoints

### Issue: Event listener not receiving events

**Solution**:
- Ensure you're connected to the correct network
- Check that events are being emitted
- Verify contract addresses are correct

## 📚 Next Steps

- Build a dashboard using these queries
- Set up automated monitoring
- Create analytics reports

## 🔗 Related Resources

- [opBNB Explorer](https://mainnet.opbnbscan.com)
- [OptimAI Network Explorer](https://explorer.optimai.network/)
- [Ethers.js Documentation](https://docs.ethers.org/)

