# Copilot Instructions - Decentralized Digital Justice Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a decentralized digital justice platform built on blockchain technology. The system provides anonymous reputation-based arbitration through a cryptographic marketplace where disputes can be resolved without centralized authority.

## Core Architecture
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Smart Contracts**: Solidity on Polygon network
- **Development Framework**: Hardhat for contract development and testing
- **Privacy Layer**: Zero-knowledge proofs using Semaphore.js
- **Data Storage**: IPFS with OrbitDB for decentralized reputation storage
- **Authentication**: Anonymous identity system with stealth addresses

## Key Components to Implement
1. **Reputation System**: Anonymous identity management with dynamic reputation scores
2. **Arbitration Market**: Open marketplace for arbiters to register and bid on cases
3. **Case Lifecycle Management**: Complete dispute resolution workflow
4. **Proof & Audit System**: Cryptographic verification and auditability
5. **Governance Layer**: Community-driven proposals and upgrades

## Smart Contract Architecture
- `IArbitrator.sol`: Interface for arbiter registration and case handling
- `ICase.sol`: Interface for dispute case management
- `IReputationToken.sol`: Interface for reputation scoring and rewards
- `ArbitratorRegistry.sol`: Registry of verified arbitrators
- `CaseManager.sol`: Core dispute resolution logic
- `ReputationSystem.sol`: Reputation calculation and storage

## Development Guidelines
- Follow the principle of transparency without compromising privacy
- Implement accountability through stake and audit trails
- Ensure anonymity of actors while maintaining verifiability of actions
- Design for voluntary participation and market competition
- Use cryptographic commitments for case integrity
- Implement incentive-compatible staking systems

## Technology Stack Preferences
- Use ethers.js for blockchain interactions
- Implement zk-SNARKs for privacy-preserving proofs
- Design responsive UI components with Tailwind CSS
- Create comprehensive test suites with Hardhat
- Use TypeScript for type safety across the entire stack

## Coding Standards
- Write comprehensive JSDoc comments for all functions
- Follow clean architecture principles
- Implement proper error handling and validation
- Use environment variables for configuration
- Create modular, reusable components
- Ensure gas optimization in smart contracts
