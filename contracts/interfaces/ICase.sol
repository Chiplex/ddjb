// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ICase
 * @dev Interface for dispute case management in the decentralized justice system
 */
interface ICase {
    /// @dev Enum representing case status
    enum CaseStatus {
        Submitted,
        ArbitratorSelected,
        EvidencePhase,
        DeliberationPhase,
        Resolved,
        Appealed,
        Cancelled
    }

    /// @dev Enum representing case verdict
    enum Verdict {
        Pending,
        InFavorOfClaimant,
        InFavorOfRespondent,
        Dismissed,
        Settled
    }

    /// @dev Struct representing a dispute case
    struct Case {
        uint256 caseId;
        address claimant;
        address respondent;
        address arbitrator;
        uint256 disputeAmount;
        uint256 arbitrationFee;
        CaseStatus status;
        Verdict verdict;
        string encryptedEvidence; // IPFS hash of encrypted evidence
        string publicDescription;
        uint256 createdAt;
        uint256 evidenceDeadline;
        uint256 deliberationDeadline;
        uint256 resolutionDeadline;
        bool isAnonymous;
        bytes32 evidenceCommitment; // Cryptographic commitment for evidence integrity
    }

    /// @dev Struct for evidence submission
    struct Evidence {
        address submitter;
        string encryptedData; // IPFS hash
        bytes32 commitment;
        uint256 timestamp;
        bool isVerified;
    }

    /// @dev Emitted when a new case is created
    event CaseCreated(
        uint256 indexed caseId,
        address indexed claimant,
        address indexed respondent,
        uint256 disputeAmount
    );

    /// @dev Emitted when an arbitrator is assigned to a case
    event ArbitratorAssigned(
        uint256 indexed caseId,
        address indexed arbitrator
    );

    /// @dev Emitted when evidence is submitted
    event EvidenceSubmitted(
        uint256 indexed caseId,
        address indexed submitter,
        string evidenceHash
    );

    /// @dev Emitted when a case is resolved
    event CaseResolved(
        uint256 indexed caseId,
        Verdict verdict,
        address indexed arbitrator
    );

    /// @dev Emitted when a case is appealed
    event CaseAppealed(
        uint256 indexed caseId,
        address indexed appellant,
        uint256 newCaseId
    );

    /**
     * @dev Create a new dispute case
     * @param respondent Address of the respondent
     * @param disputeAmount Amount in dispute
     * @param arbitrationFee Fee for arbitration
     * @param publicDescription Public description of the dispute
     * @param evidenceCommitment Cryptographic commitment for evidence
     * @param isAnonymous Whether the case should be anonymous
     * @return caseId ID of the created case
     */
    function createCase(
        address respondent,
        uint256 disputeAmount,
        uint256 arbitrationFee,
        string calldata publicDescription,
        bytes32 evidenceCommitment,
        bool isAnonymous
    ) external payable returns (uint256 caseId);

    /**
     * @dev Select arbitrator for a case
     * @param caseId ID of the case
     * @param arbitrator Address of the selected arbitrator
     */
    function selectArbitrator(uint256 caseId, address arbitrator) external;

    /**
     * @dev Submit evidence for a case
     * @param caseId ID of the case
     * @param encryptedEvidence IPFS hash of encrypted evidence
     * @param commitment Cryptographic commitment for the evidence
     */
    function submitEvidence(
        uint256 caseId,
        string calldata encryptedEvidence,
        bytes32 commitment
    ) external;

    /**
     * @dev Resolve a case (arbitrator only)
     * @param caseId ID of the case
     * @param verdict The verdict for the case
     * @param reasoning Encrypted reasoning for the decision
     */
    function resolveCase(
        uint256 caseId,
        Verdict verdict,
        string calldata reasoning
    ) external;

    /**
     * @dev Appeal a case decision
     * @param caseId ID of the case to appeal
     * @param reason Reason for the appeal
     * @return newCaseId ID of the new appeal case
     */
    function appealCase(uint256 caseId, string calldata reason)
        external
        payable
        returns (uint256 newCaseId);

    /**
     * @dev Cancel a case (before arbitrator assignment)
     * @param caseId ID of the case to cancel
     */
    function cancelCase(uint256 caseId) external;

    /**
     * @dev Get case details
     * @param caseId ID of the case
     * @return Case struct
     */
    function getCase(uint256 caseId) external view returns (Case memory);

    /**
     * @dev Get evidence for a case
     * @param caseId ID of the case
     * @return Array of Evidence structs
     */
    function getCaseEvidence(uint256 caseId)
        external
        view
        returns (Evidence[] memory);

    /**
     * @dev Get cases by status
     * @param status Case status to filter by
     * @return Array of case IDs
     */
    function getCasesByStatus(CaseStatus status)
        external
        view
        returns (uint256[] memory);

    /**
     * @dev Get cases for a specific address (as claimant or respondent)
     * @param user Address to get cases for
     * @return Array of case IDs
     */
    function getUserCases(address user) external view returns (uint256[] memory);

    /**
     * @dev Get cases assigned to an arbitrator
     * @param arbitrator Address of the arbitrator
     * @return Array of case IDs
     */
    function getArbitratorCases(address arbitrator)
        external
        view
        returns (uint256[] memory);
}
