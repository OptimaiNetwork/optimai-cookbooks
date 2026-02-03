// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IntegrityAnchor
 * @dev Smart contract deployed on opBNB for anchoring off-chain AI/mining work
 *      into public, verifiable commitments. This contract is part of OptimAI Network's
 *      deployment on BNB Chain (opBNB and BNB Greenfield).
 * 
 * @notice This contract anchors Merkle roots of epoch manifests stored on BNB Greenfield,
 *         enabling trustless verification of off-chain work without relying on OptimAI servers.
 */
contract IntegrityAnchor {
    // Event emitted when a new epoch is anchored on opBNB
    event EpochAnchored(
        bytes32 indexed merkleRoot,
        string manifestURI,
        uint256 indexed epochId,
        uint256 timestamp,
        uint8 schemaVersion
    );

    // Struct representing an anchored epoch
    struct AnchoredEpoch {
        bytes32 merkleRoot;
        string manifestURI; // URI pointing to BNB Greenfield storage
        uint256 epochId;
        uint256 timestamp;
        uint8 schemaVersion;
    }

    // Mapping from epochId to anchored epoch data
    mapping(uint256 => AnchoredEpoch) public epochs;
    
    // Total number of epochs anchored
    uint256 public totalEpochs;
    
    // Address authorized to anchor epochs (can be governance contract)
    address public anchorer;

    modifier onlyAnchorer() {
        require(msg.sender == anchorer, "IntegrityAnchor: not authorized");
        _;
    }

    constructor(address _anchorer) {
        anchorer = _anchorer;
    }

    /**
     * @dev Anchor a new epoch commitment on opBNB
     * @param _merkleRoot The Merkle root of all tasks in this epoch
     * @param _manifestURI URI pointing to the full manifest stored on BNB Greenfield
     * @param _epochId Unique identifier for this epoch
     * @param _schemaVersion Version of the manifest schema
     * 
     * @notice The full epoch manifest (including all tasks, leaf hashes, and metadata)
     *         is stored on BNB Greenfield. Only the commitment is stored on-chain for
     *         cost efficiency while maintaining verifiability.
     */
    function anchorEpoch(
        bytes32 _merkleRoot,
        string memory _manifestURI,
        uint256 _epochId,
        uint8 _schemaVersion
    ) external onlyAnchorer {
        require(epochs[_epochId].epochId == 0, "IntegrityAnchor: epoch already exists");
        
        epochs[_epochId] = AnchoredEpoch({
            merkleRoot: _merkleRoot,
            manifestURI: _manifestURI,
            epochId: _epochId,
            timestamp: block.timestamp,
            schemaVersion: _schemaVersion
        });
        
        totalEpochs++;
        
        emit EpochAnchored(
            _merkleRoot,
            _manifestURI,
            _epochId,
            block.timestamp,
            _schemaVersion
        );
    }

    /**
     * @dev Get anchored epoch data
     * @param _epochId The epoch ID to query
     * @return The anchored epoch data
     */
    function getEpoch(uint256 _epochId) external view returns (AnchoredEpoch memory) {
        require(epochs[_epochId].epochId != 0, "IntegrityAnchor: epoch does not exist");
        return epochs[_epochId];
    }

    /**
     * @dev Verify if a Merkle root matches an anchored epoch
     * @param _epochId The epoch ID to verify
     * @param _merkleRoot The Merkle root to verify against
     * @return true if the Merkle root matches
     */
    function verifyEpochRoot(uint256 _epochId, bytes32 _merkleRoot) external view returns (bool) {
        return epochs[_epochId].merkleRoot == _merkleRoot;
    }

    /**
     * @dev Update the anchorer address (can be called by current anchorer or governance)
     */
    function setAnchorer(address _newAnchorer) external onlyAnchorer {
        anchorer = _newAnchorer;
    }
}

