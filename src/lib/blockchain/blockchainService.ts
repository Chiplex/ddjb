import { ethers } from 'ethers';

// Contract ABI excerpts - in a real project, import full ABIs from artifacts
export const JUSTICE_CORE_ABI = [
  // Read functions
  "function getCase(uint256 caseId) external view returns (tuple)",
  "function getArbitratorProfile(address arbitrator) external view returns (tuple)",
  "function getActiveArbitrators() external view returns (address[])",
  "function isActiveArbitrator(address arbitrator) external view returns (bool)",
  "function calculateArbitrationFee(uint256 disputeAmount) public pure returns (uint256)",
  
  // Write functions
  "function registerArbitrator(uint256 stake, string calldata publicKey, uint256 minimumStake) external",
  "function createCase(address respondent, uint256 disputeAmount, string calldata publicDescription, bytes32 evidenceCommitment, bool isAnonymous) external payable returns (uint256)",
  "function selectArbitrator(uint256 caseId, address arbitrator) external",
  "function submitEvidence(uint256 caseId, string calldata encryptedEvidence, bytes32 commitment) external",
  "function resolveCase(uint256 caseId, uint8 verdict, string calldata reasoning) external",
  
  // Events
  "event CaseCreated(uint256 indexed caseId, address indexed claimant, address indexed respondent)",
  "event ArbitratorAssigned(uint256 indexed caseId, address indexed arbitrator)",
  "event CaseResolved(uint256 indexed caseId, uint8 verdict)",
  "event ArbitratorRegistered(address indexed arbitrator, uint256 stake, string publicKey)"
];

export interface ContractAddresses {
  justiceCore: string;
  reputationToken: string;
  stakingToken: string;
}

export interface CaseData {
  caseId: number;
  claimant: string;
  respondent: string;
  arbitrator: string;
  disputeAmount: bigint;
  arbitrationFee: bigint;
  status: number;
  verdict: number;
  publicDescription: string;
  createdAt: bigint;
  evidenceDeadline: bigint;
  isAnonymous: boolean;
}

export interface ArbitratorProfile {
  arbitrator: string;
  stake: bigint;
  reputationScore: bigint;
  totalCasesHandled: bigint;
  successfulResolutions: bigint;
  isActive: boolean;
  publicKey: string;
  minimumStake: bigint;
  averageResolutionTime: bigint;
}

export class BlockchainService {
  private provider?: ethers.Provider;
  private signer?: ethers.Signer;
  private contracts?: ContractAddresses;

  constructor(provider?: ethers.Provider, contracts?: ContractAddresses) {
    this.provider = provider;
    this.contracts = contracts;
  }

  setProvider(provider: ethers.Provider) {
    this.provider = provider;
  }

  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }

  setContracts(contracts: ContractAddresses) {
    this.contracts = contracts;
  }

  private getJusticeCoreContract(withSigner = false): ethers.Contract {
    if (!this.provider || !this.contracts) {
      throw new Error('Provider and contracts must be set before using BlockchainService');
    }

    const contract = new ethers.Contract(
      this.contracts.justiceCore,
      JUSTICE_CORE_ABI,
      withSigner && this.signer ? this.signer : this.provider
    );
    
    return contract;
  }

  // Read functions
  async getCase(caseId: number): Promise<CaseData | null> {
    try {
      const contract = this.getJusticeCoreContract();
      const caseData = await contract.getCase(caseId);
      return caseData;
    } catch (error) {
      console.error('Error fetching case:', error);
      return null;
    }
  }

  async getArbitratorProfile(address: string): Promise<ArbitratorProfile | null> {
    try {
      const contract = this.getJusticeCoreContract();
      const profile = await contract.getArbitratorProfile(address);
      return profile;
    } catch (error) {
      console.error('Error fetching arbitrator profile:', error);
      return null;
    }
  }

  async getActiveArbitrators(): Promise<string[]> {
    try {
      const contract = this.getJusticeCoreContract();
      return await contract.getActiveArbitrators();
    } catch (error) {
      console.error('Error fetching active arbitrators:', error);
      return [];
    }
  }

  async isActiveArbitrator(address: string): Promise<boolean> {
    try {
      const contract = this.getJusticeCoreContract();
      return await contract.isActiveArbitrator(address);
    } catch (error) {
      console.error('Error checking arbitrator status:', error);
      return false;
    }
  }

  async calculateArbitrationFee(disputeAmount: bigint): Promise<bigint> {
    try {
      const contract = this.getJusticeCoreContract();
      return await contract.calculateArbitrationFee(disputeAmount);
    } catch (error) {
      console.error('Error calculating arbitration fee:', error);
      return BigInt(0);
    }
  }

  // Write functions (require signer)
  async registerArbitrator(
    stakeAmount: bigint,
    publicKey: string,
    minimumStake: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }

    try {
      const contract = this.getJusticeCoreContract(true);
      return await contract.registerArbitrator(stakeAmount, publicKey, minimumStake);
    } catch (error) {
      console.error('Error registering arbitrator:', error);
      return null;
    }
  }

  async createCase(
    respondent: string,
    disputeAmount: bigint,
    publicDescription: string,
    evidenceCommitment: string,
    isAnonymous: boolean,
    paymentAmount: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }

    try {
      const contract = this.getJusticeCoreContract(true);
      return await contract.createCase(
        respondent,
        disputeAmount,
        publicDescription,
        evidenceCommitment,
        isAnonymous,
        { value: paymentAmount }
      );
    } catch (error) {
      console.error('Error creating case:', error);
      return null;
    }
  }

  async selectArbitrator(
    caseId: number,
    arbitratorAddress: string
  ): Promise<ethers.ContractTransactionResponse | null> {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }

    try {
      const contract = this.getJusticeCoreContract(true);
      return await contract.selectArbitrator(caseId, arbitratorAddress);
    } catch (error) {
      console.error('Error selecting arbitrator:', error);
      return null;
    }
  }

  async submitEvidence(
    caseId: number,
    encryptedEvidence: string,
    commitment: string
  ): Promise<ethers.ContractTransactionResponse | null> {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }

    try {
      const contract = this.getJusticeCoreContract(true);
      return await contract.submitEvidence(caseId, encryptedEvidence, commitment);
    } catch (error) {
      console.error('Error submitting evidence:', error);
      return null;
    }
  }

  async resolveCase(
    caseId: number,
    verdict: number,
    reasoning: string
  ): Promise<ethers.ContractTransactionResponse | null> {
    if (!this.signer) {
      throw new Error('Signer required for write operations');
    }

    try {
      const contract = this.getJusticeCoreContract(true);
      return await contract.resolveCase(caseId, verdict, reasoning);
    } catch (error) {
      console.error('Error resolving case:', error);
      return null;
    }
  }

  // Event listeners
  onCaseCreated(callback: (caseId: number, claimant: string, respondent: string) => void) {
    const contract = this.getJusticeCoreContract();
    contract.on('CaseCreated', callback);
    return () => contract.off('CaseCreated', callback);
  }

  onArbitratorAssigned(callback: (caseId: number, arbitrator: string) => void) {
    const contract = this.getJusticeCoreContract();
    contract.on('ArbitratorAssigned', callback);
    return () => contract.off('ArbitratorAssigned', callback);
  }

  onCaseResolved(callback: (caseId: number, verdict: number) => void) {
    const contract = this.getJusticeCoreContract();
    contract.on('CaseResolved', callback);
    return () => contract.off('CaseResolved', callback);
  }

  onArbitratorRegistered(callback: (arbitrator: string, stake: bigint, publicKey: string) => void) {
    const contract = this.getJusticeCoreContract();
    contract.on('ArbitratorRegistered', callback);
    return () => contract.off('ArbitratorRegistered', callback);
  }

  // Statistics methods for dashboard
  async getTotalArbitrators(contractAddress: string): Promise<number> {
    try {
      const arbitrators = await this.getActiveArbitrators();
      return arbitrators.length;
    } catch (error) {
      console.error('Error getting total arbitrators:', error);
      return 0;
    }
  }

  async getTotalCases(contractAddress: string): Promise<number> {
    try {
      // This would require a counter in the smart contract or event parsing
      // For now, return mock data
      return 128;
    } catch (error) {
      console.error('Error getting total cases:', error);
      return 0;
    }
  }

  async getActiveDisputes(contractAddress: string): Promise<number> {
    try {
      // This would require filtering cases by status
      // For now, return mock data
      return 15;
    } catch (error) {
      console.error('Error getting active disputes:', error);
      return 0;
    }
  }

  // Event listener management
  removeAllListeners(contractAddress: string) {
    try {
      const contract = this.getJusticeCoreContract();
      contract.removeAllListeners();
    } catch (error) {
      console.error('Error removing listeners:', error);
    }
  }

  // Utility functions
  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  static formatAmount(amount: bigint, decimals = 18): string {
    return ethers.formatUnits(amount, decimals);
  }

  static parseAmount(amount: string, decimals = 18): bigint {
    return ethers.parseUnits(amount, decimals);
  }
}

// Factory function to create blockchain service instance
export function createBlockchainService(
  providerUrl: string,
  contracts: ContractAddresses
): BlockchainService {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  return new BlockchainService(provider, contracts);
}

// Hook for connecting wallet
export async function connectWallet(): Promise<ethers.Signer | null> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider.getSigner();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }
  return null;
}

// Types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
