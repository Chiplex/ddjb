// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IArbitrator
 * @dev Interface for arbiter registration and case handling in the decentralized justice system
 */
interface IArbitrator {
    /// @dev Struct representing an arbitrator's profile
    struct ArbitratorProfile {
        address arbitrator;
        uint256 stake;
        uint256 reputationScore;
        uint256 totalCasesHandled;
        uint256 successfulResolutions;
        bool isActive;
        string publicKey; // For encrypted communication
        uint256 minimumStake;
        uint256 averageResolutionTime;
    }

    /// @dev Emitted when an arbitrator registers
    event ArbitratorRegistered(
        address indexed arbitrator,
        uint256 stake,
        string publicKey
    );

    /// @dev Emitted when an arbitrator's reputation is updated
    event ReputationUpdated(
        address indexed arbitrator,
        uint256 oldScore,
        uint256 newScore
    );

    /// @dev Emitted when an arbitrator stakes additional tokens
    event StakeIncreased(
        address indexed arbitrator,
        uint256 additionalStake,
        uint256 totalStake
    );

    /**
     * @dev Register as an arbitrator in the system
     * @param stake Amount of tokens to stake
     * @param publicKey Public key for encrypted communication
     * @param minimumStake Minimum stake required for this arbitrator
     */
    function registerArbitrator(
        uint256 stake,
        string calldata publicKey,
        uint256 minimumStake
    ) external;

    /**
     * @dev Update arbitrator's public key
     * @param newPublicKey New public key for encrypted communication
     */
    function updatePublicKey(string calldata newPublicKey) external;

    /**
     * @dev Increase stake amount
     * @param additionalStake Additional amount to stake
     */
    function increaseStake(uint256 additionalStake) external;

    /**
     * @dev Request to withdraw stake (with timelock)
     * @param amount Amount to withdraw
     */
    function requestStakeWithdrawal(uint256 amount) external;

    /**
     * @dev Complete stake withdrawal after timelock period
     */
    function completeStakeWithdrawal() external;

    /**
     * @dev Deactivate arbitrator status
     */
    function deactivateArbitrator() external;

    /**
     * @dev Get arbitrator profile
     * @param arbitrator Address of the arbitrator
     * @return ArbitratorProfile struct
     */
    function getArbitratorProfile(address arbitrator)
        external
        view
        returns (ArbitratorProfile memory);

    /**
     * @dev Get list of active arbitrators
     * @return Array of active arbitrator addresses
     */
    function getActiveArbitrators() external view returns (address[] memory);

    /**
     * @dev Check if address is registered arbitrator
     * @param arbitrator Address to check
     * @return True if registered and active
     */
    function isActiveArbitrator(address arbitrator) external view returns (bool);

    /**
     * @dev Get arbitrators by minimum reputation score
     * @param minReputation Minimum reputation threshold
     * @return Array of qualifying arbitrator addresses
     */
    function getArbitratorsByReputation(uint256 minReputation)
        external
        view
        returns (address[] memory);
}
