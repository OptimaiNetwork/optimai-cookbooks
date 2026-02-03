# Recipe 5: Trustless Verification

This recipe demonstrates how to verify epoch commitments trustlessly by fetching manifests from Greenfield and comparing with on-chain commitments.

## 🎯 What You'll Learn

- How to fetch epoch manifests from BNB Greenfield
- How to recompute Merkle trees from task data
- How to verify against on-chain commitments
- How to build a verification service

## 📋 Prerequisites

- Completed [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)
- Completed [Recipe 4: Storing Proofs on BNB Greenfield](./04-greenfield-storage.md)
- Understanding of Merkle tree verification
- Access to opBNB RPC endpoint

## 🚀 Step-by-Step Instructions

### Step 1: Fetch On-Chain Epoch Data

```javascript
const integrityAnchor = await ethers.getContractAt(
  "IntegrityAnchor",
  "<INTEGRITY_ANCHOR_ADDRESS>"
);

const epochId = 1;
const onChainEpoch = await integrityAnchor.getEpoch(epochId);

console.log("On-chain data:", {
  merkleRoot: onChainEpoch.merkleRoot,
  manifestURI: onChainEpoch.manifestURI,
  timestamp: new Date(onChainEpoch.timestamp * 1000)
});
```

### Step 2: Parse Manifest URI

```javascript
// Parse Greenfield URI: greenfield://bucket-name/object-name
const uriMatch = onChainEpoch.manifestURI.match(/greenfield:\/\/([^\/]+)\/(.+)/);
if (!uriMatch) {
  throw new Error("Invalid manifest URI format");
}

const bucketName = uriMatch[1];
const objectName = uriMatch[2];

console.log("Bucket:", bucketName);
console.log("Object:", objectName);
```

### Step 3: Fetch Manifest from Greenfield

```javascript
const { Client } = require('@bnb-chain/greenfield-js-sdk');

// Public read - no authentication needed
const client = Client.create(
  'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
  '56000'
);

const downloadRes = await client.object.getObject({
  bucketName: bucketName,
  objectName: objectName,
});

const manifest = JSON.parse(
  Buffer.from(downloadRes.body).toString('utf-8')
);

console.log("Manifest fetched:", manifest);
```

### Step 4: Recompute Merkle Root

```javascript
const { MerkleTree } = require('merkletreejs');
const { keccak256 } = require('ethers');

// Create leaf hashes from manifest tasks
const leaves = manifest.tasks.map(task => {
  return keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'string', 'address', 'bytes32', 'uint256'],
      [
        task.taskId,
        task.type,
        task.worker,
        task.leafHash,
        task.metadata.timestamp
      ]
    )
  );
});

// Build Merkle tree
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const computedRoot = tree.getHexRoot();

console.log("Computed root:", computedRoot);
console.log("On-chain root:", onChainEpoch.merkleRoot);
```

### Step 5: Verify Consistency

```javascript
const isValid = computedRoot.toLowerCase() === onChainEpoch.merkleRoot.toLowerCase();

if (isValid) {
  console.log("✅ Verification successful! Epoch is valid.");
} else {
  console.log("❌ Verification failed! Roots do not match.");
  console.log("This may indicate data tampering or incorrect manifest.");
}

// Also verify using contract method
const contractVerification = await integrityAnchor.verifyEpochRoot(
  epochId,
  computedRoot
);
console.log("Contract verification:", contractVerification);
```

## 💻 Complete Verification Script

```javascript
// scripts/verify-epoch.js
const hre = require("hardhat");
const { Client } = require('@bnb-chain/greenfield-js-sdk');
const { MerkleTree } = require('merkletreejs');

async function verifyEpoch(epochId, integrityAnchorAddress) {
  // 1. Fetch on-chain data
  const integrityAnchor = await hre.ethers.getContractAt(
    "IntegrityAnchor",
    integrityAnchorAddress
  );
  
  const onChainEpoch = await integrityAnchor.getEpoch(epochId);
  console.log("📋 On-chain epoch:", {
    epochId: onChainEpoch.epochId.toString(),
    merkleRoot: onChainEpoch.merkleRoot,
    manifestURI: onChainEpoch.manifestURI,
    timestamp: new Date(onChainEpoch.timestamp * 1000)
  });

  // 2. Parse and fetch manifest
  const uriMatch = onChainEpoch.manifestURI.match(/greenfield:\/\/([^\/]+)\/(.+)/);
  if (!uriMatch) {
    throw new Error("Invalid manifest URI");
  }

  const [bucketName, objectName] = [uriMatch[1], uriMatch[2]];
  console.log("📦 Fetching manifest from Greenfield...");

  const client = Client.create(
    'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
    '56000'
  );

  const downloadRes = await client.object.getObject({
    bucketName,
    objectName,
  });

  const manifest = JSON.parse(
    Buffer.from(downloadRes.body).toString('utf-8')
  );
  console.log("✅ Manifest fetched:", {
    epochId: manifest.epochId,
    taskCount: manifest.tasks.length
  });

  // 3. Recompute Merkle root
  const leaves = manifest.tasks.map(task => {
    return hre.ethers.keccak256(
      hre.ethers.AbiCoder.defaultAbiCoder().encode(
        ['string', 'string', 'address', 'bytes32', 'uint256'],
        [
          task.taskId,
          task.type,
          task.worker,
          task.leafHash,
          task.metadata.timestamp
        ]
      )
    );
  });

  const tree = new MerkleTree(leaves, hre.ethers.keccak256, { sortPairs: true });
  const computedRoot = tree.getHexRoot();

  // 4. Verify
  const isValid = computedRoot.toLowerCase() === onChainEpoch.merkleRoot.toLowerCase();
  
  console.log("\n🔍 Verification Results:");
  console.log("Computed root:", computedRoot);
  console.log("On-chain root:", onChainEpoch.merkleRoot);
  console.log("Match:", isValid ? "✅ VALID" : "❌ INVALID");

  if (isValid) {
    console.log("\n✅ Epoch verification successful!");
    console.log("The epoch data is consistent and has not been tampered with.");
  } else {
    console.log("\n❌ Epoch verification failed!");
    console.log("The computed root does not match the on-chain commitment.");
    console.log("This may indicate:");
    console.log("  - Data tampering in Greenfield storage");
    console.log("  - Incorrect manifest structure");
    console.log("  - Mismatch in encoding/hashing methods");
  }

  return isValid;
}

// Run verification
const epochId = process.argv[2] || 1;
const contractAddress = process.env.INTEGRITY_ANCHOR_ADDRESS;

verifyEpoch(epochId, contractAddress)
  .then(isValid => process.exit(isValid ? 0 : 1))
  .catch(console.error);
```

## 🔄 Building a Verification Service

You can build a service that continuously verifies epochs:

```javascript
// scripts/verification-service.js
async function monitorAndVerify() {
  const integrityAnchor = await ethers.getContractAt(
    "IntegrityAnchor",
    process.env.INTEGRITY_ANCHOR_ADDRESS
  );

  // Listen for new epochs
  integrityAnchor.on("EpochAnchored", async (merkleRoot, manifestURI, epochId) => {
    console.log(`New epoch detected: ${epochId.toString()}`);
    
    try {
      const isValid = await verifyEpoch(epochId.toString());
      if (isValid) {
        console.log(`✅ Epoch ${epochId} verified successfully`);
        // Mark as verified in your database
      } else {
        console.log(`❌ Epoch ${epochId} verification failed`);
        // Alert or flag for review
      }
    } catch (error) {
      console.error(`Error verifying epoch ${epochId}:`, error);
    }
  });
}
```

## ✅ Verification Checklist

A successful verification confirms:

- ✅ Manifest exists in Greenfield storage
- ✅ Manifest structure matches expected schema
- ✅ All tasks are present and valid
- ✅ Computed Merkle root matches on-chain root
- ✅ Epoch timestamp is reasonable
- ✅ No data tampering detected

## 🔧 Troubleshooting

### Issue: "Object not found" in Greenfield

**Solution**: 
- Verify the manifest URI is correct
- Check that the object was uploaded successfully
- Ensure bucket visibility allows public read

### Issue: Merkle root mismatch

**Solution**:
- Verify you're using the same encoding method as when creating the tree
- Check that task data hasn't been modified
- Ensure leaf hash computation matches the original

### Issue: "Invalid manifest structure"

**Solution**:
- Verify manifest schema version matches
- Check that all required fields are present
- Ensure task data format is correct

## 📚 Next Steps

- [Recipe 6: Building a Node Integration](./06-node-integration.md)
- [Recipe 7: Querying OptimAI Network](./07-query-network.md)

## 🔗 Related Resources

- [IntegrityAnchor Contract](./../contracts/IntegrityAnchor.sol)
- [Merkle Tree Verification](https://github.com/miguelmota/merkletreejs)
- [BNB Greenfield Documentation](https://docs.bnbchain.org/greenfield-docs/)

