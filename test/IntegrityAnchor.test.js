const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Tests for IntegrityAnchor contract deployed on opBNB
 * 
 * This contract is part of OptimAI Network's deployment on BNB Chain.
 * It anchors Merkle roots and epoch metadata on opBNB, with full manifests
 * stored on BNB Greenfield.
 */
describe("IntegrityAnchor", function () {
  let integrityAnchor;
  let owner;
  let anchorer;
  let addr1;

  beforeEach(async function () {
    [owner, anchorer, addr1] = await ethers.getSigners();

    const IntegrityAnchor = await ethers.getContractFactory("IntegrityAnchor");
    integrityAnchor = await IntegrityAnchor.deploy(anchorer.address);
    await integrityAnchor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct anchorer", async function () {
      expect(await integrityAnchor.anchorer()).to.equal(anchorer.address);
    });

    it("Should initialize with zero epochs", async function () {
      expect(await integrityAnchor.totalEpochs()).to.equal(0);
    });
  });

  describe("Anchoring Epochs", function () {
    const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));
    const manifestURI = "greenfield://optimai-mining-proofs/epoch-1.json";
    const epochId = 1;
    const schemaVersion = 1;

    it("Should allow anchorer to anchor a new epoch", async function () {
      await expect(
        integrityAnchor.connect(anchorer).anchorEpoch(
          merkleRoot,
          manifestURI,
          epochId,
          schemaVersion
        )
      ).to.emit(integrityAnchor, "EpochAnchored")
        .withArgs(merkleRoot, manifestURI, epochId, (timestamp) => timestamp > 0n, schemaVersion);

      const epoch = await integrityAnchor.getEpoch(epochId);
      expect(epoch.merkleRoot).to.equal(merkleRoot);
      expect(epoch.manifestURI).to.equal(manifestURI);
      expect(epoch.epochId).to.equal(epochId);
      expect(epoch.schemaVersion).to.equal(schemaVersion);
      expect(await integrityAnchor.totalEpochs()).to.equal(1);
    });

    it("Should prevent non-anchorer from anchoring epochs", async function () {
      await expect(
        integrityAnchor.connect(addr1).anchorEpoch(
          merkleRoot,
          manifestURI,
          epochId,
          schemaVersion
        )
      ).to.be.revertedWith("IntegrityAnchor: not authorized");
    });

    it("Should prevent anchoring duplicate epoch IDs", async function () {
      await integrityAnchor.connect(anchorer).anchorEpoch(
        merkleRoot,
        manifestURI,
        epochId,
        schemaVersion
      );

      await expect(
        integrityAnchor.connect(anchorer).anchorEpoch(
          merkleRoot,
          manifestURI,
          epochId,
          schemaVersion
        )
      ).to.be.revertedWith("IntegrityAnchor: epoch already exists");
    });
  });

  describe("Verification", function () {
    const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));
    const manifestURI = "greenfield://optimai-mining-proofs/epoch-1.json";
    const epochId = 1;
    const schemaVersion = 1;

    beforeEach(async function () {
      await integrityAnchor.connect(anchorer).anchorEpoch(
        merkleRoot,
        manifestURI,
        epochId,
        schemaVersion
      );
    });

    it("Should verify correct Merkle root", async function () {
      expect(await integrityAnchor.verifyEpochRoot(epochId, merkleRoot)).to.be.true;
    });

    it("Should reject incorrect Merkle root", async function () {
      const wrongRoot = ethers.keccak256(ethers.toUtf8Bytes("wrong-root"));
      expect(await integrityAnchor.verifyEpochRoot(epochId, wrongRoot)).to.be.false;
    });

    it("Should return epoch data correctly", async function () {
      const epoch = await integrityAnchor.getEpoch(epochId);
      expect(epoch.merkleRoot).to.equal(merkleRoot);
      expect(epoch.manifestURI).to.equal(manifestURI);
    });
  });

  describe("Access Control", function () {
    it("Should allow anchorer to update anchorer address", async function () {
      await integrityAnchor.connect(anchorer).setAnchorer(addr1.address);
      expect(await integrityAnchor.anchorer()).to.equal(addr1.address);
    });

    it("Should prevent non-anchorer from updating anchorer", async function () {
      await expect(
        integrityAnchor.connect(addr1).setAnchorer(addr1.address)
      ).to.be.revertedWith("IntegrityAnchor: not authorized");
    });
  });
});

