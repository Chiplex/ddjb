'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState, UseWalletReturn } from './types';

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    signer: null,
    provider: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const updateState = useCallback((updates: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      updateState({ error: 'MetaMask is not installed' });
      return;
    }

    updateState({ isConnecting: true, error: null });

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      updateState({
        address,
        signer,
        provider,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      updateState({
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      });
    }
  }, [updateState]);

  const disconnect = useCallback(() => {
    updateState({
      address: null,
      signer: null,
      provider: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, [updateState]);

  const switchNetwork = useCallback(async (targetChainId: number): Promise<boolean> => {
    if (!window.ethereum) {
      updateState({ error: 'MetaMask is not installed' });
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      // Chain not added to MetaMask
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          // Add the network
          const networkConfig = getNetworkConfig(targetChainId);
          if (networkConfig) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkConfig],
            });
            return true;
          }
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
      console.error('Failed to switch network:', error);
      updateState({ error: 'Failed to switch network' });
      return false;
    }
  }, [updateState]);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.address) {
        // Re-connect with new account
        connect();
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainId = args[0] as string;
      updateState({ chainId: parseInt(chainId, 16) });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.address, connect, disconnect, updateState]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          await connect();
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
      }
    };

    checkConnection();
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
}

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

function getNetworkConfig(chainId: number): NetworkConfig | undefined {
  const configs: Record<number, NetworkConfig> = {
    137: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/'],
    },
    80001: {
      chainId: '0x13881',
      chainName: 'Mumbai Testnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    },
    1337: {
      chainId: '0x539',
      chainName: 'Localhost 8545',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['http://127.0.0.1:8545/'],
      blockExplorerUrls: [],
    },
  };

  return configs[chainId];
}

// Utility hook for contract interactions
export function useContract(
  address: string,
  abi: ethers.InterfaceAbi,
  signer?: ethers.Signer | null
) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { provider } = useWallet();

  useEffect(() => {
    if (!address || !abi || !provider) {
      setContract(null);
      return;
    }

    try {
      const contractInstance = new ethers.Contract(
        address,
        abi,
        signer || provider
      );
      setContract(contractInstance);
    } catch (error) {
      console.error('Failed to create contract instance:', error);
      setContract(null);
    }
  }, [address, abi, provider, signer]);

  return contract;
}
