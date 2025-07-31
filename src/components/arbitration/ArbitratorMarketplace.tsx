import React, { useState } from 'react';
import { Gavel, Users, Clock, AlertCircle } from 'lucide-react';

interface ArbitratorCardProps {
  arbitrator: {
    address: string;
    reputationScore: number;
    totalCases: number;
    successRate: number;
    stake: string;
    averageTime: string;
    specialties: string[];
    publicKey: string;
  };
  onSelect?: (address: string) => void;
  isSelected?: boolean;
}

const ArbitratorCard: React.FC<ArbitratorCardProps> = ({ 
  arbitrator, 
  onSelect, 
  isSelected = false 
}) => {
  const getReputationColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReputationBadge = (score: number) => {
    if (score >= 800) return 'Expert';
    if (score >= 600) return 'Experienced';
    return 'Novice';
  };

  return (
    <div 
      className={`border rounded-lg p-6 transition-all hover:shadow-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      onClick={() => onSelect?.(arbitrator.address)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-3">
            <Gavel className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {arbitrator.address.slice(0, 6)}...{arbitrator.address.slice(-4)}
            </h3>
            <span className={`text-sm font-medium ${getReputationColor(arbitrator.reputationScore)}`}>
              {getReputationBadge(arbitrator.reputationScore)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getReputationColor(arbitrator.reputationScore)}`}>
            {arbitrator.reputationScore}
          </div>
          <div className="text-xs text-gray-500">Reputation</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{arbitrator.totalCases} cases</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{arbitrator.averageTime}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Success Rate</span>
          <span className="font-medium">{arbitrator.successRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${arbitrator.successRate}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Stake: {arbitrator.stake}</div>
        <div className="flex flex-wrap gap-1">
          {arbitrator.specialties.map((specialty, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-center text-blue-800 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Selected as arbitrator for this case
          </div>
        </div>
      )}
    </div>
  );
};

interface ArbitratorMarketplaceProps {
  onArbitratorSelect?: (address: string) => void;
  selectedArbitrator?: string;
  filterByReputation?: number;
}

const ArbitratorMarketplace: React.FC<ArbitratorMarketplaceProps> = ({
  onArbitratorSelect,
  selectedArbitrator,
  filterByReputation = 0
}) => {
  const [sortBy, setSortBy] = useState<'reputation' | 'cases' | 'successRate'>('reputation');
  const [minReputation, setMinReputation] = useState(filterByReputation);

  // Mock data - in real implementation, this would come from blockchain
  const arbitrators = [
    {
      address: '0xa1b2c3d4e5f6789012345678901234567890abcd',
      reputationScore: 950,
      totalCases: 127,
      successRate: 94,
      stake: '50,000 USDC',
      averageTime: '2.3 days',
      specialties: ['Smart Contracts', 'DeFi', 'NFTs'],
      publicKey: '0x...'
    },
    {
      address: '0xb2c3d4e5f6789012345678901234567890abcdef',
      reputationScore: 820,
      totalCases: 89,
      successRate: 87,
      stake: '25,000 USDC',
      averageTime: '1.8 days',
      specialties: ['Freelance', 'E-commerce', 'Services'],
      publicKey: '0x...'
    },
    {
      address: '0xc3d4e5f6789012345678901234567890abcdef12',
      reputationScore: 750,
      totalCases: 45,
      successRate: 91,
      stake: '15,000 USDC',
      averageTime: '3.1 days',
      specialties: ['Legal Tech', 'IP Rights', 'Privacy'],
      publicKey: '0x...'
    },
    {
      address: '0xd4e5f6789012345678901234567890abcdef1234',
      reputationScore: 680,
      totalCases: 23,
      successRate: 83,
      stake: '10,000 USDC',
      averageTime: '2.7 days',
      specialties: ['Gaming', 'Metaverse', 'DAOs'],
      publicKey: '0x...'
    }
  ];

  const filteredArbitrators = arbitrators
    .filter(arb => arb.reputationScore >= minReputation)
    .sort((a, b) => {
      switch (sortBy) {
        case 'cases':
          return b.totalCases - a.totalCases;
        case 'successRate':
          return b.successRate - a.successRate;
        default:
          return b.reputationScore - a.reputationScore;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Arbitrator Marketplace</h2>
        
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'reputation' | 'cases' | 'successRate')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="reputation">Sort by Reputation</option>
            <option value="cases">Sort by Experience</option>
            <option value="successRate">Sort by Success Rate</option>
          </select>
          
          <select
            value={minReputation}
            onChange={(e) => setMinReputation(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>All Arbitrators</option>
            <option value={600}>Experienced+ (600+)</option>
            <option value={800}>Expert+ (800+)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArbitrators.map((arbitrator) => (
          <ArbitratorCard
            key={arbitrator.address}
            arbitrator={arbitrator}
            onSelect={onArbitratorSelect}
            isSelected={selectedArbitrator === arbitrator.address}
          />
        ))}
      </div>

      {filteredArbitrators.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No arbitrators found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more options.</p>
        </div>
      )}
    </div>
  );
};

export default ArbitratorMarketplace;
