# Decentralized Digital Justice Platform (DDJB)

## 🌐 Vision
A decentralized, transparent, and manipulation-resistant system for resolving disputes through anonymous arbitration, enforced by a public, verifiable reputation market. The goal is to eliminate central authority abuse in justice services by creating market-driven, cryptographically secure accountability.

## 🔍 Features
- **Anonymous Arbitration**: Zero-knowledge proof-based identity system for privacy-preserving dispute resolution
- **Reputation-Based Marketplace**: Dynamic scoring system that rewards honest arbitrators and penalizes misconduct
- **Cryptographic Evidence**: Immutable case handling with verifiable proof and audit trails
- **Decentralized Governance**: Community-driven protocol upgrades and parameter adjustments
- **Multi-Chain Support**: Built for Polygon with extensibility to other EVM networks

## 🏗️ Architecture

### Smart Contracts
- **DecentralizedJusticeCore**: Main contract handling case lifecycle and arbitrator management
- **IArbitrator**: Interface for arbitrator registration and reputation tracking
- **ICase**: Interface for dispute case management and evidence handling
- **IReputationToken**: Interface for reputation scoring and token rewards

### Frontend
- **Next.js 15**: React-based web application with TypeScript
- **Tailwind CSS**: Responsive UI components and styling
- **Lucide React**: Icon library for consistent design
- **Web3 Integration**: Ethereum wallet connectivity and transaction handling

### Blockchain Layer
- **Hardhat**: Development environment for smart contract testing and deployment
- **OpenZeppelin**: Security-audited contract libraries
- **Polygon Network**: Layer 2 scaling solution for reduced gas costs
- **IPFS**: Decentralized storage for encrypted evidence and case data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ddjb
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. In a separate terminal, start the local blockchain:
```bash
npx hardhat node
```

6. Deploy contracts to local network:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

## 📋 Available Scripts

### Frontend Development
- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Blockchain Development
- `npx hardhat compile` - Compile smart contracts
- `npx hardhat test` - Run contract tests
- `npx hardhat node` - Start local blockchain
- `npx hardhat run scripts/deploy.ts` - Deploy contracts

## 🧪 Testing

Run the smart contract test suite:
```bash
npx hardhat test
```

Run frontend tests:
```bash
npm run test
```

## 🛡️ Safe Testing Guide

To test the application without risking real funds or compromising your main wallet, follow these recommended practices:

### 1. Use Hardhat Local Network (Recommended)
The safest way to test is using the local Hardhat network, which provides 20 pre-funded accounts with 10,000 ETH each.

1. Start the local node:
   ```bash
   npx hardhat node
   ```
2. Import one of the generated private keys into MetaMask.
   - **Network Name**: Localhost 8545
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337` (or `1337` if configured)
   - **Currency Symbol**: ETH

### 2. Use a Dedicated Development Browser Profile
Create a separate Chrome/Firefox profile specifically for development.
- Install MetaMask only in this profile.
- **NEVER** import your mainnet seed phrase or private keys into this profile.
- Only import test accounts (like the ones from Hardhat) or create new accounts for Testnets.

### 3. Use Testnets (Mumbai/Amoy)
If you need to test on a public network, use the Polygon Testnet (Amoy).
- Get free test MATIC from a [faucet](https://faucet.polygon.technology/).
- **DO NOT** send real funds to these addresses.

### ⚠️ Security Warning
- **NEVER** share your private keys or seed phrases.
- **NEVER** commit `.env` files containing real keys to version control.
- Always verify the network ID before confirming transactions.

## 🌍 Deployment

### Testnet Deployment (Mumbai)
1. Configure Mumbai network in `hardhat.config.ts`
2. Fund your wallet with test MATIC
3. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

### Mainnet Deployment (Polygon)
1. Configure Polygon network in `hardhat.config.ts`
2. Fund your wallet with MATIC
3. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network polygon
```

## 🔧 Configuration

### Environment Variables
- `POLYGON_RPC_URL`: Polygon network RPC endpoint
- `MUMBAI_RPC_URL`: Mumbai testnet RPC endpoint
- `PRIVATE_KEY`: Deployment wallet private key
- `POLYGONSCAN_API_KEY`: PolygonScan API key for verification
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed contract address

## 🛠️ Core Components

### Case Lifecycle
1. **Submission**: Claimant creates dispute with evidence commitment
2. **Arbitrator Selection**: Parties choose from qualified arbitrators
3. **Evidence Phase**: Encrypted evidence submission with cryptographic proofs
4. **Deliberation**: Private arbitrator review and decision making
5. **Resolution**: Public verdict with encrypted reasoning
6. **Appeal**: Optional appeal process with different arbitrator panel

### Reputation System
- Dynamic scoring based on case outcomes and timeliness
- Stake-weighted reputation for enhanced credibility
- Time-decay mechanism to maintain recent performance focus
- Slashing conditions for misconduct or poor performance

## 🔐 Security Features

- **Cryptographic Commitments**: Evidence integrity verification
- **Zero-Knowledge Proofs**: Anonymous identity preservation
- **Multi-Signature Escrow**: Secure fund management
- **Time-Locked Withdrawals**: Protection against malicious arbitrator behavior
- **Reputation Staking**: Economic incentives for honest behavior

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin**: Security-focused smart contract libraries
- **Hardhat**: Ethereum development environment
- **Next.js**: React framework for production applications
- **Polygon**: Scaling solution for Ethereum
- **IPFS**: Decentralized storage network
