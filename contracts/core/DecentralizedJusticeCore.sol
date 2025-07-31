// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IArbitrator.sol";
import "../interfaces/ICase.sol";
import "../interfaces/IReputationToken.sol";

/**
 * @title DecentralizedJusticeCore
 * @dev Core contract implementing the decentralized digital justice system
 */
contract DecentralizedJusticeCore is ReentrancyGuard, Ownable {
    IERC20 public immutable stakingToken;
    IReputationToken public reputationSystem;
    
    uint256 public constant MINIMUM_STAKE = 1000 * 10**18; // 1000 tokens
    uint256 public constant STAKE_WITHDRAWAL_DELAY = 7 days;
    uint256 public constant EVIDENCE_PERIOD = 3 days;
    uint256 public constant DELIBERATION_PERIOD = 5 days;

    /// @dev Counter for case IDs
    uint256 private nextCaseId = 1;

    /// @dev Mapping from arbitrator address to profile
    mapping(address => IArbitrator.ArbitratorProfile) public arbitrators;
    
    /// @dev Mapping from case ID to case data
    mapping(uint256 => ICase.Case) public cases;
    
    /// @dev Mapping from case ID to evidence array
    mapping(uint256 => ICase.Evidence[]) public caseEvidence;
    
    /// @dev Mapping for withdrawal requests
    mapping(address => uint256) public withdrawalRequests;
    mapping(address => uint256) public withdrawalAmounts;
    
    /// @dev Arrays for active arbitrators
    address[] public activeArbitrators;
    mapping(address => uint256) public arbitratorIndex;

    /// @dev Events
    event SystemInitialized(address stakingToken, address reputationSystem);
    event CaseCreated(uint256 indexed caseId, address indexed claimant, address indexed respondent);
    event ArbitratorAssigned(uint256 indexed caseId, address indexed arbitrator);
    event CaseResolved(uint256 indexed caseId, ICase.Verdict verdict);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @dev Set the reputation system contract
     * @param _reputationSystem Address of the reputation system contract
     */
    function setReputationSystem(address _reputationSystem) external onlyOwner {
        reputationSystem = IReputationToken(_reputationSystem);
        emit SystemInitialized(address(stakingToken), _reputationSystem);
    }

    /**
     * @dev Register as an arbitrator
     * @param stake Amount of tokens to stake
     * @param publicKey Public key for encrypted communication
     * @param minimumStake Minimum stake for this arbitrator
     */
    function registerArbitrator(
        uint256 stake,
        string calldata publicKey,
        uint256 minimumStake
    ) external nonReentrant {
        require(stake >= MINIMUM_STAKE, "Insufficient stake");
        require(stake >= minimumStake, "Below minimum stake");
        require(!arbitrators[msg.sender].isActive, "Already registered");
        require(bytes(publicKey).length > 0, "Invalid public key");

        // Transfer stake tokens
        require(
            stakingToken.transferFrom(msg.sender, address(this), stake),
            "Stake transfer failed"
        );

        // Create arbitrator profile
        arbitrators[msg.sender] = IArbitrator.ArbitratorProfile({
            arbitrator: msg.sender,
            stake: stake,
            reputationScore: 100, // Starting reputation
            totalCasesHandled: 0,
            successfulResolutions: 0,
            isActive: true,
            publicKey: publicKey,
            minimumStake: minimumStake,
            averageResolutionTime: 0
        });

        // Add to active arbitrators list
        arbitratorIndex[msg.sender] = activeArbitrators.length;
        activeArbitrators.push(msg.sender);

        emit ArbitratorRegistered(msg.sender, stake, publicKey);
    }

    /**
     * @dev Create a new dispute case
     * @param respondent Address of the respondent
     * @param disputeAmount Amount in dispute
     * @param publicDescription Public description of the dispute
     * @param evidenceCommitment Cryptographic commitment for evidence
     * @param isAnonymous Whether the case should be anonymous
     */
    function createCase(
        address respondent,
        uint256 disputeAmount,
        string calldata publicDescription,
        bytes32 evidenceCommitment,
        bool isAnonymous
    ) external payable nonReentrant returns (uint256) {
        require(respondent != address(0), "Invalid respondent");
        require(respondent != msg.sender, "Cannot dispute with yourself");
        require(disputeAmount > 0, "Invalid dispute amount");
        require(msg.value >= disputeAmount, "Insufficient dispute amount sent");

        uint256 caseId = nextCaseId++;
        uint256 arbitrationFee = calculateArbitrationFee(disputeAmount);

        cases[caseId] = ICase.Case({
            caseId: caseId,
            claimant: msg.sender,
            respondent: respondent,
            arbitrator: address(0),
            disputeAmount: disputeAmount,
            arbitrationFee: arbitrationFee,
            status: ICase.CaseStatus.Submitted,
            verdict: ICase.Verdict.Pending,
            encryptedEvidence: "",
            publicDescription: publicDescription,
            createdAt: block.timestamp,
            evidenceDeadline: block.timestamp + EVIDENCE_PERIOD,
            deliberationDeadline: 0,
            resolutionDeadline: 0,
            isAnonymous: isAnonymous,
            evidenceCommitment: evidenceCommitment
        });

        emit CaseCreated(caseId, msg.sender, respondent);
        return caseId;
    }

    /**
     * @dev Select arbitrator for a case
     * @param caseId ID of the case
     * @param arbitrator Address of the selected arbitrator
     */
    function selectArbitrator(uint256 caseId, address arbitrator) external {
        ICase.Case storage disputeCase = cases[caseId];
        require(disputeCase.claimant == msg.sender, "Only claimant can select arbitrator");
        require(disputeCase.status == ICase.CaseStatus.Submitted, "Invalid case status");
        require(arbitrators[arbitrator].isActive, "Arbitrator not active");

        disputeCase.arbitrator = arbitrator;
        disputeCase.status = ICase.CaseStatus.ArbitratorSelected;
        disputeCase.deliberationDeadline = block.timestamp + DELIBERATION_PERIOD;
        disputeCase.resolutionDeadline = disputeCase.deliberationDeadline + DELIBERATION_PERIOD;

        emit ArbitratorAssigned(caseId, arbitrator);
    }

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
    ) external {
        ICase.Case storage disputeCase = cases[caseId];
        require(
            msg.sender == disputeCase.claimant || msg.sender == disputeCase.respondent,
            "Unauthorized"
        );
        require(
            disputeCase.status == ICase.CaseStatus.ArbitratorSelected ||
            disputeCase.status == ICase.CaseStatus.EvidencePhase,
            "Invalid case status"
        );
        require(block.timestamp <= disputeCase.evidenceDeadline, "Evidence period expired");

        if (disputeCase.status == ICase.CaseStatus.ArbitratorSelected) {
            disputeCase.status = ICase.CaseStatus.EvidencePhase;
        }

        caseEvidence[caseId].push(ICase.Evidence({
            submitter: msg.sender,
            encryptedData: encryptedEvidence,
            commitment: commitment,
            timestamp: block.timestamp,
            isVerified: false
        }));

        emit EvidenceSubmitted(caseId, msg.sender, encryptedEvidence);
    }

    /**
     * @dev Resolve a case (arbitrator only)
     * @param caseId ID of the case
     * @param verdict The verdict for the case
     * @param reasoning Encrypted reasoning for the decision
     */
    function resolveCase(
        uint256 caseId,
        ICase.Verdict verdict,
        string calldata reasoning
    ) external nonReentrant {
        ICase.Case storage disputeCase = cases[caseId];
        require(msg.sender == disputeCase.arbitrator, "Only assigned arbitrator");
        require(
            disputeCase.status == ICase.CaseStatus.EvidencePhase ||
            disputeCase.status == ICase.CaseStatus.DeliberationPhase,
            "Invalid case status"
        );
        require(verdict != ICase.Verdict.Pending, "Invalid verdict");

        disputeCase.status = ICase.CaseStatus.Resolved;
        disputeCase.verdict = verdict;
        disputeCase.encryptedEvidence = reasoning;

        // Update arbitrator metrics
        IArbitrator.ArbitratorProfile storage arbProfile = arbitrators[msg.sender];
        arbProfile.totalCasesHandled++;
        
        // Calculate if resolution was successful and timely
        bool wasTimely = block.timestamp <= disputeCase.resolutionDeadline;
        bool wasSuccessful = true; // This would be determined by appeal outcomes in practice
        
        if (wasSuccessful) {
            arbProfile.successfulResolutions++;
        }

        // Update reputation
        if (address(reputationSystem) != address(0)) {
            uint256 resolutionTime = block.timestamp - disputeCase.createdAt;
            reputationSystem.updateReputationAfterCase(
                msg.sender,
                caseId,
                resolutionTime,
                wasSuccessful,
                wasTimely
            );
        }

        // Handle payments based on verdict
        _handleCasePayments(caseId, verdict);

        emit CaseResolved(caseId, verdict);
    }

    /**
     * @dev Calculate arbitration fee based on dispute amount
     * @param disputeAmount Amount in dispute
     * @return Calculated arbitration fee
     */
    function calculateArbitrationFee(uint256 disputeAmount) public pure returns (uint256) {
        // Fee is 5% of dispute amount, minimum 0.01 ETH
        uint256 fee = (disputeAmount * 500) / 10000; // 5%
        uint256 minFee = 0.01 ether;
        return fee > minFee ? fee : minFee;
    }

    /**
     * @dev Handle payments after case resolution
     * @param caseId ID of the resolved case
     * @param verdict The verdict of the case
     */
    function _handleCasePayments(uint256 caseId, ICase.Verdict verdict) internal {
        ICase.Case storage disputeCase = cases[caseId];
        uint256 totalAmount = disputeCase.disputeAmount;
        uint256 fee = disputeCase.arbitrationFee;

        // Pay arbitrator fee
        (bool feeSuccess, ) = disputeCase.arbitrator.call{value: fee}("");
        require(feeSuccess, "Arbitrator fee payment failed");

        // Handle dispute amount based on verdict
        if (verdict == ICase.Verdict.InFavorOfClaimant) {
            // Claimant wins, gets dispute amount back
            (bool success, ) = disputeCase.claimant.call{value: totalAmount}("");
            require(success, "Payment to claimant failed");
        } else if (verdict == ICase.Verdict.InFavorOfRespondent) {
            // Respondent wins, gets dispute amount
            (bool success, ) = disputeCase.respondent.call{value: totalAmount}("");
            require(success, "Payment to respondent failed");
        } else if (verdict == ICase.Verdict.Dismissed) {
            // Case dismissed, split amount
            uint256 half = totalAmount / 2;
            (bool success1, ) = disputeCase.claimant.call{value: half}("");
            (bool success2, ) = disputeCase.respondent.call{value: totalAmount - half}("");
            require(success1 && success2, "Payment split failed");
        }
    }

    /**
     * @dev Get case details
     * @param caseId ID of the case
     * @return Case struct
     */
    function getCase(uint256 caseId) external view returns (ICase.Case memory) {
        return cases[caseId];
    }

    /**
     * @dev Get arbitrator profile
     * @param arbitrator Address of the arbitrator
     * @return ArbitratorProfile struct
     */
    function getArbitratorProfile(address arbitrator)
        external
        view
        returns (IArbitrator.ArbitratorProfile memory)
    {
        return arbitrators[arbitrator];
    }

    /**
     * @dev Get active arbitrators
     * @return Array of active arbitrator addresses
     */
    function getActiveArbitrators() external view returns (address[] memory) {
        return activeArbitrators;
    }

    /**
     * @dev Check if address is active arbitrator
     * @param arbitrator Address to check
     * @return True if active
     */
    function isActiveArbitrator(address arbitrator) external view returns (bool) {
        return arbitrators[arbitrator].isActive;
    }

    // Events
    event ArbitratorRegistered(address indexed arbitrator, uint256 stake, string publicKey);
    event EvidenceSubmitted(uint256 indexed caseId, address indexed submitter, string evidenceHash);
}
