# Recipe 3: Anchoring Epochs on opBNB

This recipe demonstrates how to anchor epoch commitments on opBNB, creating immutable records of off-chain work.

## 🎯 What You'll Learn

- How to create epoch manifests
- How to compute Merkle roots from task data
- How to anchor epochs on opBNB using IntegrityAnchor contract
- How to verify anchored epochs

## 📋 Prerequisites

- Completed [Recipe 2: Deploying Contracts to opBNB](./02-deploy-to-opbnb.md)
- Deployed IntegrityAnchor contract address
- Understanding of Merkle trees
- Wallet with BNB for gas fees

## 🚀 Step-by-Step Instructions

### Step 1: Prepare Epoch Data

An epoch contains multiple tasks. Each task has:
- Task ID
- Task type
- Worker address
- Result hash
- Timestamp

```javascript
// Example epoch data
const epochData = {
  epochId: 1,
  tasks: [
    {
      taskId: "task-001",
      type: "data_crawl",
      worker: "0x...",
      resultHash: "0x...",
      timestamp: 1234567890
    },
    // ... more tasks
  ]
};
```

### Step 2: Compute Merkle Root

```javascript
const { MerkleTree } = require('merkletreejs');
const { keccak256 } = require('ethers');

// Create leaf hashes for each task
const leaves = epochData.tasks.map(task => 
  keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'string', 'address', 'bytes32', 'uint256'],
      [task.taskId, task.type, task.worker, task.resultHash, task.timestamp]
    )
  )
);

// Build Merkle tree
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const merkleRoot = tree.getHexRoot();
```

### Step 3: Upload Manifest to Greenfield

First, upload the full epoch manifest to BNB Greenfield (see [Recipe 4](./04-greenfield-storage.md)) to get the `manifestURI`.

```javascript
// After uploading to Greenfield
const manifestURI = "greenfield://optimai-mining-proofs/epoch-1.json";
```

### Step 4: Anchor Epoch on opBNB

```javascript
const integrityAnchor = await ethers.getContractAt(
  "IntegrityAnchor",
  "<INTEGRITY_ANCHOR_ADDRESS>"
);

const schemaVersion = 1;

// Anchor the epoch
const tx = await integrityAnchor.anchorEpoch(
  merkleRoot,
  manifestURI,
  epochData.epochId,
  schemaVersion
);

await tx.wait();
console.log("Epoch anchored! Transaction:", tx.hash);
```

### Step 5: Verify Anchored Epoch

```javascript
// Read epoch data from contract
const epoch = await integrityAnchor.getEpoch(epochData.epochId);

console.log("Epoch ID:", epoch.epochId.toString());
console.log("Merkle Root:", epoch.merkleRoot);
console.log("Manifest URI:", epoch.manifestURI);
console.log("Timestamp:", new Date(epoch.timestamp * 1000));

// Verify Merkle root matches
const isValid = await integrityAnchor.verifyEpochRoot(
  epochData.epochId,
  merkleRoot
);
console.log("Root verified:", isValid);
```

## 💻 Complete Example Script

```javascript
// scripts/anchor-epoch.js
const hre = require("hardhat");
const { MerkleTree } = require('merkletreejs');

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const integrityAnchor = await hre.ethers.getContractAt(
    "IntegrityAnchor",
    process.env.INTEGRITY_ANCHOR_ADDRESS
  );

  // 1. Prepare epoch data
  const epochId = 1;
  const tasks = [
    {
      taskId: "task-001",
      type: "data_crawl",
      worker: signer.address,
      resultHash: hre.ethers.keccak256(hre.ethers.toUtf8Bytes("result-1")),
      timestamp: Math.floor(Date.now() / 1000)
    }
    // Add more tasks...
  ];

  // 2. Compute Merkle root
  const leaves = tasks.map(task => 
    hre.ethers.keccak256(
      hre.ethers.AbiCoder.defaultAbiCoder().encode(
        ['string', 'string', 'address', 'bytes32', 'uint256'],
        [task.taskId, task.type, task.worker, task.resultHash, task.timestamp]
      )
    )
  );
  const tree = new MerkleTree(leaves, hre.ethers.keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();

  // 3. Upload to Greenfield (simplified - see Recipe 4)
  const manifestURI = "greenfield://optimai-mining-proofs/epoch-1.json";

  // 4. Anchor on opBNB
  const tx = await integrityAnchor.anchorEpoch(
    merkleRoot,
    manifestURI,
    epochId,
    1 // schemaVersion
  );
  
  await tx.wait();
  console.log("✅ Epoch anchored:", tx.hash);
}

main().catch(console.error);
```

## ✅ Verification

Your epoch is successfully anchored when:

- ✅ Transaction is confirmed on opBNB
- ✅ `getEpoch()` returns the correct data
- ✅ `verifyEpochRoot()` returns `true`
- ✅ Event `EpochAnchored` is emitted

## 🔍 Monitoring Events

```javascript
// Listen for epoch anchoring events
integrityAnchor.on("EpochAnchored", (merkleRoot, manifestURI, epochId, timestamp, schemaVersion) => {
  console.log("New epoch anchored:", {
    epochId: epochId.toString(),
    merkleRoot,
    manifestURI,
    timestamp: new Date(timestamp * 1000)
  });
});
```

## 🔧 Troubleshooting

### Issue: "epoch already exists"

**Solution**: Use a unique `epochId` for each epoch. Consider using a timestamp or incrementing counter.

### Issue: "not authorized" error

**Solution**: Ensure you're calling from the anchorer address. Check `integrityAnchor.anchorer()`.

### Issue: Merkle root mismatch

**Solution**: Ensure you're using the same encoding and hashing method for both creating and verifying the tree.

## 📚 Next Steps

- [Recipe 4: Storing Proofs on BNB Greenfield](./04-greenfield-storage.md)
- [Recipe 5: Trustless Verification](./05-trustless-verification.md)

## 🔗 Related Resources

- [Merkle Tree Documentation](https://github.com/miguelmota/merkletreejs)
- [IntegrityAnchor Contract](./../contracts/IntegrityAnchor.sol)

