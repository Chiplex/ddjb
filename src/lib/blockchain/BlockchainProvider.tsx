'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useWallet } from './useWallet';
import { BlockchainService } from './blockchainService';

interface BlockchainContextType {
  // Core stats
  totalArbitrators: number;
  totalCases: number;
  activeDisputes: number;
  isLoading: boolean;
  error: string | null;
  
  // Contract addresses (will be loaded from deployed contracts)
  coreContractAddress: string | null;
  
  // Refresh function
  refreshData: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  totalArbitrators: 0,
  totalCases: 0,
  activeDisputes: 0,
  isLoading: false,
  error: null,
  coreContractAddress: null,
  refreshData: async () => {},
});

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}

interface BlockchainProviderProps {
  children: React.ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const { isConnected, provider, chainId } = useWallet();
  const [totalArbitrators, setTotalArbitrators] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [activeDisputes, setActiveDisputes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coreContractAddress, setCoreContractAddress] = useState<string | null>(null);
  const [blockchainService] = useState(() => new BlockchainService());

  // Load contract addresses from deployment
  useEffect(() => {
    const loadContractAddresses = async () => {
      try {
        // In a real app, you would load these from a deployment file or environment variables
        // For now, we'll use placeholder addresses that will be set when contracts are deployed
        if (chainId === 1337) {
          // Localhost - will be set after deployment
          setCoreContractAddress(process.env.NEXT_PUBLIC_LOCALHOST_CORE_ADDRESS || null);
        } else if (chainId === 80001) {
          // Mumbai testnet
          setCoreContractAddress(process.env.NEXT_PUBLIC_MUMBAI_CORE_ADDRESS || null);
        } else if (chainId === 137) {
          // Polygon mainnet
          setCoreContractAddress(process.env.NEXT_PUBLIC_POLYGON_CORE_ADDRESS || null);
        }
      } catch (err) {
        console.error('Failed to load contract addresses:', err);
      }
    };

    if (chainId) {
      loadContractAddresses();
    }
  }, [chainId]);

  const refreshData = useCallback(async () => {
    if (!isConnected || !provider || !coreContractAddress) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialize blockchain service with current provider
      blockchainService.setProvider(provider);

      // Load core statistics from the smart contract
      const [arbitratorsCount, casesCount, disputesCount] = await Promise.all([
        blockchainService.getTotalArbitrators(coreContractAddress),
        blockchainService.getTotalCases(coreContractAddress),
        blockchainService.getActiveDisputes(coreContractAddress),
      ]);

      setTotalArbitrators(arbitratorsCount);
      setTotalCases(casesCount);
      setActiveDisputes(disputesCount);
    } catch (err) {
      console.error('Failed to load blockchain data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      
      // Set mock data for development
      setTotalArbitrators(42);
      setTotalCases(128);
      setActiveDisputes(15);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, provider, coreContractAddress, blockchainService]);

  // Refresh data when connection state changes
  useEffect(() => {
    if (isConnected && coreContractAddress) {
      refreshData();
    } else {
      // Reset data when disconnected
      setTotalArbitrators(0);
      setTotalCases(0);
      setActiveDisputes(0);
      setError(null);
    }
  }, [isConnected, coreContractAddress, refreshData]);

  // Set up event listeners for contract events
  useEffect(() => {
    if (!isConnected || !provider || !coreContractAddress) {
      return;
    }

    const setupEventListeners = async () => {
      try {
        blockchainService.setProvider(provider);
        
        // Listen for new arbitrator registrations
        const arbitratorHandler = () => {
          console.log('New arbitrator registered');
          refreshData();
        };

        // Listen for new cases
        const caseHandler = () => {
          console.log('New case created');
          refreshData();
        };

        const removeArbitratorListener = blockchainService.onArbitratorRegistered(arbitratorHandler);
        const removeCaseListener = blockchainService.onCaseCreated(caseHandler);

        // Cleanup function
        return () => {
          removeArbitratorListener();
          removeCaseListener();
        };
      } catch (err) {
        console.error('Failed to setup event listeners:', err);
      }
    };

    const cleanup = setupEventListeners();
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [isConnected, provider, coreContractAddress, blockchainService, refreshData]);

  const value: BlockchainContextType = {
    totalArbitrators,
    totalCases,
    activeDisputes,
    isLoading,
    error,
    coreContractAddress,
    refreshData,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export default BlockchainProvider;
