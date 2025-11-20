/**
 * Configuration for storage and blockchain services
 */

export const STORAGE_CONFIG = {
    ipfs: {
        timeout: 30000, // 30 seconds
        retries: 3,
        gateway: 'https://ipfs.io',
    },
} as const;

export const CONTRACT_ADDRESSES: Record<number, string> = {
    // Localhost Hardhat
    1337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // Deployed address
    31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // Hardhat network chainId
    // Mumbai Testnet
    80001: '', // Add after deployment
    // Polygon Mainnet
    137: '', // Add after deployment
};

export const NETWORK_NAMES: Record<number, string> = {
    1337: 'Localhost',
    31337: 'Localhost (Hardhat)',
    80001: 'Mumbai Testnet',
    137: 'Polygon Mainnet',
};

export function getContractAddress(chainId: number): string {
    const address = CONTRACT_ADDRESSES[chainId];
    if (!address) {
        throw new Error(`No contract address configured for chain ID ${chainId}`);
    }
    return address;
}

export function getNetworkName(chainId: number): string {
    return NETWORK_NAMES[chainId] || 'Unknown Network';
}
