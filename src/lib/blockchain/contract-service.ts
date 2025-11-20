/**
 * Smart Contract Service for DecentralizedJusticeCore
 * Handles blockchain interactions for case management
 */

import { ethers } from 'ethers';
import type { CaseMetadata } from '../storage/types';
import { ipfsService } from '../storage/ipfs-service';
import { getContractAddress } from '../storage/config';

// ABI for DecentralizedJusticeCore contract
export const JUSTICE_CORE_ABI = [
    // createCase function
    {
        inputs: [
            { internalType: 'address', name: 'respondent', type: 'address' },
            { internalType: 'uint256', name: 'disputeAmount', type: 'uint256' },
            { internalType: 'string', name: 'publicDescription', type: 'string' },
            { internalType: 'bytes32', name: 'evidenceCommitment', type: 'bytes32' },
            { internalType: 'bool', name: 'isAnonymous', type: 'bool' },
        ],
        name: 'createCase',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
    },
    // getCase function
    {
        inputs: [{ internalType: 'uint256', name: 'caseId', type: 'uint256' }],
        name: 'getCase',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'caseId', type: 'uint256' },
                    { internalType: 'address', name: 'claimant', type: 'address' },
                    { internalType: 'address', name: 'respondent', type: 'address' },
                    { internalType: 'address', name: 'arbitrator', type: 'address' },
                    { internalType: 'uint256', name: 'disputeAmount', type: 'uint256' },
                    { internalType: 'uint256', name: 'arbitrationFee', type: 'uint256' },
                    { internalType: 'uint8', name: 'status', type: 'uint8' },
                    { internalType: 'uint8', name: 'verdict', type: 'uint8' },
                    { internalType: 'string', name: 'encryptedEvidence', type: 'string' },
                    { internalType: 'string', name: 'publicDescription', type: 'string' },
                    { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
                    { internalType: 'uint256', name: 'evidenceDeadline', type: 'uint256' },
                    { internalType: 'uint256', name: 'deliberationDeadline', type: 'uint256' },
                    { internalType: 'uint256', name: 'resolutionDeadline', type: 'uint256' },
                    { internalType: 'bool', name: 'isAnonymous', type: 'bool' },
                    { internalType: 'bytes32', name: 'evidenceCommitment', type: 'bytes32' },
                ],
                internalType: 'struct ICase.Case',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    // Events
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'caseId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'claimant', type: 'address' },
            { indexed: true, internalType: 'address', name: 'respondent', type: 'address' },
        ],
        name: 'CaseCreated',
        type: 'event',
    },
] as const;

export interface CreateCaseParams {
    title: string;
    description: string;
    amount: string;
    respondent?: string;
    isAnonymous?: boolean;
}

export interface BlockchainCase {
    caseId: bigint;
    claimant: string;
    respondent: string;
    arbitrator: string;
    disputeAmount: bigint;
    arbitrationFee: bigint;
    status: number;
    verdict: number;
    encryptedEvidence: string;
    publicDescription: string;
    createdAt: bigint;
    evidenceDeadline: bigint;
    deliberationDeadline: bigint;
    resolutionDeadline: bigint;
    isAnonymous: boolean;
    evidenceCommitment: string;
}

export class ContractService {
    private contract: ethers.Contract | null = null;

    /**
     * Initialize contract instance
     */
    initialize(signer: ethers.Signer, chainId: number): void {
        const contractAddress = getContractAddress(chainId);
        this.contract = new ethers.Contract(contractAddress, JUSTICE_CORE_ABI, signer);
    }

    /**
     * Create a new case with IPFS metadata
     */
    async createCase(
        params: CreateCaseParams,
        signer: ethers.Signer,
        chainId: number
    ): Promise<{ caseId: bigint; ipfsCid: string; txHash: string }> {
        this.initialize(signer, chainId);

        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        // 1. Prepare metadata for IPFS
        const metadata: CaseMetadata = {
            title: params.title,
            description: params.description,
            amount: params.amount,
            createdAt: Date.now(),
            metadata: {
                version: '1.0',
                type: 'dispute',
            },
        };

        // 2. Upload to IPFS
        const ipfsResult = await ipfsService.uploadCaseMetadata(metadata);
        console.log('Case metadata uploaded to IPFS:', ipfsResult.cid);

        // 3. Prepare blockchain transaction
        const respondent = params.respondent || ethers.ZeroAddress;
        const disputeAmount = ethers.parseEther(params.amount);
        const publicDescription = ipfsResult.cid; // Store IPFS CID as public description
        const evidenceCommitment = ethers.keccak256(ethers.toUtf8Bytes(ipfsResult.cid));
        const isAnonymous = params.isAnonymous || false;

        // 4. Send transaction
        const tx = await this.contract.createCase(
            respondent,
            disputeAmount,
            publicDescription,
            evidenceCommitment,
            isAnonymous,
            {
                value: disputeAmount, // Send ETH with transaction
            }
        );

        console.log('Transaction sent:', tx.hash);

        // 5. Wait for confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.hash);

        // 6. Extract case ID from event
        const event = receipt.logs.find((log: ethers.Log) => {
            try {
                const parsed = this.contract!.interface.parseLog({
                    topics: [...log.topics],
                    data: log.data,
                });
                return parsed?.name === 'CaseCreated';
            } catch {
                return false;
            }
        });

        let caseId = BigInt(1);
        if (event) {
            const parsed = this.contract.interface.parseLog({
                topics: [...event.topics],
                data: event.data,
            });
            caseId = parsed?.args[0] as bigint;
        }

        return {
            caseId,
            ipfsCid: ipfsResult.cid,
            txHash: receipt.hash,
        };
    }

    /**
     * Get case from blockchain
     */
    async getCase(
        caseId: number,
        provider: ethers.Provider,
        chainId: number
    ): Promise<BlockchainCase> {
        const contractAddress = getContractAddress(chainId);
        const contract = new ethers.Contract(contractAddress, JUSTICE_CORE_ABI, provider);

        const caseData = await contract.getCase(caseId);
        return caseData as BlockchainCase;
    }

    /**
     * Get case with IPFS metadata
     */
    async getCaseWithMetadata(
        caseId: number,
        provider: ethers.Provider,
        chainId: number
    ): Promise<{ case: BlockchainCase; metadata: CaseMetadata | null }> {
        const caseData = await this.getCase(caseId, provider, chainId);

        // Try to fetch metadata from IPFS using publicDescription as CID
        let metadata: CaseMetadata | null = null;
        if (caseData.publicDescription) {
            try {
                const result = await ipfsService.getCaseMetadata(caseData.publicDescription);
                metadata = result.data;
            } catch (error) {
                console.error('Failed to fetch IPFS metadata:', error);
            }
        }

        return { case: caseData, metadata };
    }
}

export const contractService = new ContractService();
