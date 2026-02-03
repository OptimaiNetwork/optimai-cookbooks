# Recipe 4: Storing Proofs on BNB Greenfield

This recipe shows how to store epoch manifests and proof artifacts on BNB Greenfield, OptimAI's decentralized storage layer.

## 🎯 What You'll Learn

- How to configure BNB Greenfield SDK
- How to create and configure buckets
- How to upload epoch manifests
- How to set proper permissions for public verification
- How to retrieve manifests for verification

## 📋 Prerequisites

- Completed [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)
- BNB Greenfield account and credentials
- Understanding of epoch manifest structure
- Node.js environment with Greenfield SDK

## 🚀 Step-by-Step Instructions

### Step 1: Install Greenfield SDK

```bash
npm install @bnb-chain/greenfield-js-sdk
```

### Step 2: Configure Greenfield Client

```javascript
const { Client } = require('@bnb-chain/greenfield-js-sdk');
const { getPrivateKey } = require('./utils');

const client = Client.create(
  'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org', // Testnet
  '56000' // Chain ID
);

// For mainnet:
// const client = Client.create(
//   'https://gnfd-fullnode-tendermint-us.bnbchain.org',
//   '1017'
// );

// Set account
const account = await client.account.getAccount(getPrivateKey());
client.setAccount(account);
```

### Step 3: Create or Access Bucket

```javascript
const bucketName = 'optimai-mining-proofs';

// Check if bucket exists
let bucket;
try {
  bucket = await client.bucket.headBucket(bucketName);
  console.log('Bucket exists:', bucketName);
} catch (error) {
  // Create bucket if it doesn't exist
  const createBucketTx = await client.bucket.createBucket({
    bucketName: bucketName,
    visibility: 'public-read', // Allow public read for verification
  });
  
  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB',
  });
  
  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: account.address,
    granter: '',
  });
  
  console.log('Bucket created:', res.transactionHash);
}
```

### Step 4: Prepare Epoch Manifest

```javascript
// Example epoch manifest structure
const epochManifest = {
  epochId: 1,
  schemaVersion: 1,
  merkleRoot: "0x...", // Must match on-chain commitment
  timestamp: 1234567890,
  tasks: [
    {
      taskId: "task-001",
      type: "data_crawl",
      worker: "0x...",
      leafHash: "0x...",
      metadata: {
        url: "https://example.com",
        timestamp: 1234567890
      }
    }
    // ... more tasks
  ],
  verification: {
    totalTasks: 1000,
    validTasks: 995,
    invalidTasks: 5
  }
};

const manifestJson = JSON.stringify(epochManifest, null, 2);
const manifestBuffer = Buffer.from(manifestJson, 'utf-8');
```

### Step 5: Upload Manifest to Greenfield

```javascript
const objectName = `epoch-${epochManifest.epochId}.json`;

// Upload manifest
const uploadTx = await client.object.createObject({
  bucketName: bucketName,
  objectName: objectName,
  body: manifestBuffer,
  visibility: 'public-read', // Public read for trustless verification
});

const simulateInfo = await uploadTx.simulate({
  denom: 'BNB',
});

const uploadRes = await uploadTx.broadcast({
  denom: 'BNB',
  gasLimit: Number(simulateInfo?.gasLimit),
  gasPrice: simulateInfo?.gasPrice || '5000000000',
  payer: account.address,
  granter: '',
});

console.log('Manifest uploaded:', uploadRes.transactionHash);

// Construct manifest URI
const manifestURI = `greenfield://${bucketName}/${objectName}`;
console.log('Manifest URI:', manifestURI);
```

### Step 6: Retrieve Manifest for Verification

```javascript
// Public read - no authentication needed
const objectInfo = await client.object.headObject(bucketName, objectName);
console.log('Object info:', objectInfo);

// Download manifest
const downloadRes = await client.object.getObject({
  bucketName: bucketName,
  objectName: objectName,
});

const downloadedManifest = JSON.parse(
  Buffer.from(downloadRes.body).toString('utf-8')
);

console.log('Retrieved manifest:', downloadedManifest);
```

## 💻 Complete Example Script

```javascript
// scripts/upload-to-greenfield.js
const { Client } = require('@bnb-chain/greenfield-js-sdk');
const fs = require('fs');

async function uploadEpochManifest(epochManifest, privateKey) {
  // Initialize client
  const client = Client.create(
    'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
    '56000'
  );
  
  const account = await client.account.getAccount(privateKey);
  client.setAccount(account);

  const bucketName = 'optimai-mining-proofs';
  const objectName = `epoch-${epochManifest.epochId}.json`;
  
  // Ensure bucket exists
  try {
    await client.bucket.headBucket(bucketName);
  } catch {
    // Create bucket
    const createTx = await client.bucket.createBucket({
      bucketName,
      visibility: 'public-read',
    });
    const simulateInfo = await createTx.simulate({ denom: 'BNB' });
    await createTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || '5000000000',
      payer: account.address,
    });
  }

  // Upload manifest
  const manifestBuffer = Buffer.from(JSON.stringify(epochManifest, null, 2));
  const uploadTx = await client.object.createObject({
    bucketName,
    objectName,
    body: manifestBuffer,
    visibility: 'public-read',
  });

  const simulateInfo = await uploadTx.simulate({ denom: 'BNB' });
  const res = await uploadTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: account.address,
  });

  const manifestURI = `greenfield://${bucketName}/${objectName}`;
  return { manifestURI, txHash: res.transactionHash };
}

module.exports = { uploadEpochManifest };
```

## ✅ Verification

Your manifest is successfully stored when:

- ✅ Upload transaction is confirmed
- ✅ Object is visible in Greenfield explorer
- ✅ Manifest can be retrieved via public read
- ✅ Manifest URI can be used in on-chain anchoring

## 🔍 Accessing Stored Manifests

Manifests stored with `public-read` visibility can be accessed by anyone:

```javascript
// Public access (no authentication)
const client = Client.create(
  'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
  '56000'
);

const objectName = 'epoch-1.json';
const downloadRes = await client.object.getObject({
  bucketName: 'optimai-mining-proofs',
  objectName: objectName,
});

const manifest = JSON.parse(Buffer.from(downloadRes.body).toString('utf-8'));
```

## 🔧 Troubleshooting

### Issue: "bucket not found"

**Solution**: Create the bucket first using `createBucket()` or ensure you're using the correct bucket name.

### Issue: "insufficient balance"

**Solution**: Ensure your Greenfield account has sufficient BNB for storage operations.

### Issue: "permission denied"

**Solution**: Check bucket and object visibility settings. Use `public-read` for verification access.

## 📚 Next Steps

- [Recipe 5: Trustless Verification](./05-trustless-verification.md)
- [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)

## 🔗 Related Resources

- [BNB Greenfield Documentation](https://docs.bnbchain.org/greenfield-docs/)
- [Greenfield JS SDK](https://github.com/bnb-chain/greenfield-js-sdk)
- [Greenfield Testnet Explorer](https://greenfieldscan.com/)

