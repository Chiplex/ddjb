// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IReputationToken
 * @dev Interface for reputation scoring and rewards in the decentralized justice system
 */
interface IReputationToken {
    /// @dev Struct representing reputation metrics
    struct ReputationMetrics {
        uint256 totalScore;
        uint256 casesResolved;
        uint256 successfulResolutions;
        uint256 averageResolutionTime;
        uint256 stakingRewards;
        uint256 penaltiesReceived;
        uint256 lastUpdated;
        bool isSlashed;
    }

    /// @dev Struct for reputation calculation parameters
    struct ReputationParams {
        uint256 baseScore;
        uint256 resolutionWeight;
        uint256 timelinessWeight;
        uint256 accuracyWeight;
        uint256 stakeWeight;
        uint256 decayRate;
    }

    /// @dev Emitted when reputation is updated
    event ReputationUpdated(
        address indexed arbitrator,
        uint256 oldScore,
        uint256 newScore,
        string reason
    );

    /// @dev Emitted when reputation tokens are minted as rewards
    event ReputationReward(
        address indexed arbitrator,
        uint256 amount,
        uint256 caseId
    );

    /// @dev Emitted when reputation is slashed due to misconduct
    event ReputationSlashed(
        address indexed arbitrator,
        uint256 amount,
        string reason
    );

    /// @dev Emitted when reputation decay is applied
    event ReputationDecay(
        address indexed arbitrator,
        uint256 oldScore,
        uint256 newScore
    );

    /**
     * @dev Calculate reputation score for an arbitrator
     * @param arbitrator Address of the arbitrator
     * @return Current reputation score
     */
    function calculateReputation(address arbitrator)
        external
        view
        returns (uint256);

    /**
     * @dev Update reputation after case resolution
     * @param arbitrator Address of the arbitrator
     * @param caseId ID of the resolved case
     * @param resolutionTime Time taken to resolve the case
     * @param wasSuccessful Whether the resolution was successful
     * @param wasTimely Whether the resolution was within deadline
     */
    function updateReputationAfterCase(
        address arbitrator,
        uint256 caseId,
        uint256 resolutionTime,
        bool wasSuccessful,
        bool wasTimely
    ) external;

    /**
     * @dev Mint reputation tokens as rewards
     * @param arbitrator Address to mint tokens for
     * @param amount Amount of tokens to mint
     * @param caseId Associated case ID
     */
    function mintReputationReward(
        address arbitrator,
        uint256 amount,
        uint256 caseId
    ) external;

    /**
     * @dev Slash reputation due to misconduct
     * @param arbitrator Address to slash reputation for
     * @param amount Amount of reputation to slash
     * @param reason Reason for the slash
     */
    function slashReputation(
        address arbitrator,
        uint256 amount,
        string calldata reason
    ) external;

    /**
     * @dev Apply time-based reputation decay
     * @param arbitrator Address to apply decay for
     */
    function applyReputationDecay(address arbitrator) external;

    /**
     * @dev Get reputation metrics for an arbitrator
     * @param arbitrator Address of the arbitrator
     * @return ReputationMetrics struct
     */
    function getReputationMetrics(address arbitrator)
        external
        view
        returns (ReputationMetrics memory);

    /**
     * @dev Get top arbitrators by reputation
     * @param limit Maximum number of arbitrators to return
     * @return Array of arbitrator addresses sorted by reputation
     */
    function getTopArbitrators(uint256 limit)
        external
        view
        returns (address[] memory);

    /**
     * @dev Calculate weighted reputation score (including stake)
     * @param arbitrator Address of the arbitrator
     * @param stakeAmount Current stake amount
     * @return Weighted reputation score
     */
    function calculateWeightedReputation(address arbitrator, uint256 stakeAmount)
        external
        view
        returns (uint256);

    /**
     * @dev Check if arbitrator meets minimum reputation requirements
     * @param arbitrator Address of the arbitrator
     * @param minReputation Minimum reputation required
     * @return True if meets requirements
     */
    function meetsReputationRequirement(
        address arbitrator,
        uint256 minReputation
    ) external view returns (bool);

    /**
     * @dev Set reputation calculation parameters (governance only)
     * @param params New reputation parameters
     */
    function setReputationParams(ReputationParams calldata params) external;

    /**
     * @dev Get current reputation calculation parameters
     * @return ReputationParams struct
     */
    function getReputationParams() external view returns (ReputationParams memory);

    /**
     * @dev Transfer reputation tokens (if transferable)
     * @param to Recipient address
     * @param amount Amount to transfer
     * @return True if successful
     */
    function transferReputation(address to, uint256 amount)
        external
        returns (bool);

    /**
     * @dev Burn reputation tokens
     * @param amount Amount to burn
     */
    function burnReputation(uint256 amount) external;

    /**
     * @dev Get reputation token balance
     * @param account Address to check balance for
     * @return Token balance
     */
    function reputationBalanceOf(address account) external view returns (uint256);
}
