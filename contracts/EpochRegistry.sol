// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EpochRegistry
 * @dev Registry contract deployed on opBNB for managing epoch metadata and verification
 *      This contract works in conjunction with IntegrityAnchor and BNB Greenfield storage.
 * 
 * @notice Part of OptimAI Network's deployment on BNB Chain ecosystem (opBNB + Greenfield)
 */
contract EpochRegistry {
    // Event emitted when epoch verification status changes
    event EpochVerified(uint256 indexed epochId, bool verified, address verifier);
    
    // Event emitted when epoch is marked as disputed
    event EpochDisputed(uint256 indexed epochId, address disputer, string reason);

    struct EpochMetadata {
        uint256 epochId;
        bytes32 merkleRoot;
        string manifestURI; // Points to BNB Greenfield storage
        uint256 startTime;
        uint256 endTime;
        uint256 taskCount;
        bool verified;
        bool disputed;
    }

    mapping(uint256 => EpochMetadata) public epochs;
    mapping(uint256 => address[]) public epochVerifiers;
    
    address public registryAdmin;
    address public integrityAnchor; // Reference to IntegrityAnchor contract

    modifier onlyAdmin() {
        require(msg.sender == registryAdmin, "EpochRegistry: not admin");
        _;
    }

    constructor(address _admin, address _integrityAnchor) {
        registryAdmin = _admin;
        integrityAnchor = _integrityAnchor;
    }

    /**
     * @dev Register a new epoch with metadata
     * @param _epochId Unique epoch identifier
     * @param _merkleRoot Merkle root from IntegrityAnchor
     * @param _manifestURI URI to manifest on BNB Greenfield
     * @param _startTime Epoch start timestamp
     * @param _endTime Epoch end timestamp
     * @param _taskCount Number of tasks in this epoch
     */
    function registerEpoch(
        uint256 _epochId,
        bytes32 _merkleRoot,
        string memory _manifestURI,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _taskCount
    ) external onlyAdmin {
        require(epochs[_epochId].epochId == 0, "EpochRegistry: epoch already registered");
        
        epochs[_epochId] = EpochMetadata({
            epochId: _epochId,
            merkleRoot: _merkleRoot,
            manifestURI: _manifestURI,
            startTime: _startTime,
            endTime: _endTime,
            taskCount: _taskCount,
            verified: false,
            disputed: false
        });
    }

    /**
     * @dev Mark an epoch as verified after independent verification
     * @param _epochId The epoch to verify
     * @notice Verifiers can independently fetch manifest from BNB Greenfield,
     *         recompute Merkle tree, and verify against on-chain root
     */
    function verifyEpoch(uint256 _epochId) external {
        require(epochs[_epochId].epochId != 0, "EpochRegistry: epoch does not exist");
        require(!epochs[_epochId].verified, "EpochRegistry: already verified");
        
        epochs[_epochId].verified = true;
        epochVerifiers[_epochId].push(msg.sender);
        
        emit EpochVerified(_epochId, true, msg.sender);
    }

    /**
     * @dev Dispute an epoch if verification fails
     * @param _epochId The epoch to dispute
     * @param _reason Reason for dispute
     */
    function disputeEpoch(uint256 _epochId, string memory _reason) external {
        require(epochs[_epochId].epochId != 0, "EpochRegistry: epoch does not exist");
        
        epochs[_epochId].disputed = true;
        
        emit EpochDisputed(_epochId, msg.sender, _reason);
    }

    /**
     * @dev Get epoch metadata
     */
    function getEpochMetadata(uint256 _epochId) external view returns (EpochMetadata memory) {
        return epochs[_epochId];
    }

    /**
     * @dev Get list of verifiers for an epoch
     */
    function getEpochVerifiers(uint256 _epochId) external view returns (address[] memory) {
        return epochVerifiers[_epochId];
    }
}

