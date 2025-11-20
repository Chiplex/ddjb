/**
 * Custom hook for case storage operations
 * Combines IPFS and blockchain interactions
 */

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '../blockchain/useWallet';
import { contractService, type CreateCaseParams } from '../blockchain/contract-service';
import type { IPFSError } from '../storage/types';

export interface UseCaseStorageReturn {
    createCase: (params: CreateCaseParams) => Promise<void>;
    isCreating: boolean;
    error: string | null;
    success: boolean;
    caseId: bigint | null;
    ipfsCid: string | null;
    txHash: string | null;
    reset: () => void;
}

export function useCaseStorage(): UseCaseStorageReturn {
    const { signer, chainId, isConnected } = useWallet();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [caseId, setCaseId] = useState<bigint | null>(null);
    const [ipfsCid, setIpfsCid] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const createCase = useCallback(
        async (params: CreateCaseParams) => {
            // Reset state
            setIsCreating(true);
            setError(null);
            setSuccess(false);
            setCaseId(null);
            setIpfsCid(null);
            setTxHash(null);

            try {
                // Validate wallet connection
                if (!isConnected || !signer || !chainId) {
                    throw new Error('Wallet not connected. Please connect your wallet first.');
                }

                // Validate params
                if (!params.title || params.title.trim() === '') {
                    throw new Error('Case title is required');
                }

                if (!params.description || params.description.trim() === '') {
                    throw new Error('Case description is required');
                }

                if (!params.amount || parseFloat(params.amount) <= 0) {
                    throw new Error('Valid dispute amount is required');
                }

                console.log('Creating case with params:', params);

                // Create case (uploads to IPFS and creates blockchain transaction)
                const result = await contractService.createCase(params, signer, chainId);

                console.log('Case created successfully:', result);

                // Update state with results
                setCaseId(result.caseId);
                setIpfsCid(result.ipfsCid);
                setTxHash(result.txHash);
                setSuccess(true);
            } catch (err) {
                console.error('Failed to create case:', err);

                // Handle different error types
                let errorMessage = 'Failed to create case. Please try again.';

                if (err instanceof Error) {
                    // Check for specific error types
                    if ('type' in err) {
                        const ipfsError = err as IPFSError;
                        switch (ipfsError.type) {
                            case 'TIMEOUT':
                                errorMessage = 'IPFS upload timed out. Please check your connection and try again.';
                                break;
                            case 'NETWORK':
                                errorMessage = 'Network error. Please check your connection and try again.';
                                break;
                            default:
                                errorMessage = err.message;
                        }
                    } else if (err.message.includes('user rejected')) {
                        errorMessage = 'Transaction was rejected. Please try again.';
                    } else if (err.message.includes('insufficient funds')) {
                        errorMessage = 'Insufficient funds to create case.';
                    } else {
                        errorMessage = err.message;
                    }
                }

                setError(errorMessage);
            } finally {
                setIsCreating(false);
            }
        },
        [signer, chainId, isConnected]
    );

    const reset = useCallback(() => {
        setIsCreating(false);
        setError(null);
        setSuccess(false);
        setCaseId(null);
        setIpfsCid(null);
        setTxHash(null);
    }, []);

    return {
        createCase,
        isCreating,
        error,
        success,
        caseId,
        ipfsCid,
        txHash,
        reset,
    };
}
