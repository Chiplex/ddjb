'use client';

import React from 'react';
import { Scale, Shield, Users, FileText, TrendingUp, Loader, AlertCircle } from 'lucide-react';
import { useBlockchain } from '@/lib/blockchain/BlockchainProvider';

interface DashboardProps {
  userAddress?: string;
  isArbitrator?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ userAddress, isArbitrator = false }) => {
  const { 
    totalArbitrators, 
    totalCases, 
    activeDisputes, 
    isLoading, 
    error,
    refreshData 
  } = useBlockchain();

  // Calculate resolved cases (total - active)
  const resolvedCases = totalCases - activeDisputes;

  const recentCases = [
    {
      id: '0x1a2b3c',
      type: 'Freelance Dispute',
      amount: '0.5 ETH',
      status: 'Evidence Phase',
      deadline: '2025-08-05',
    },
    {
      id: '0x4d5e6f',
      type: 'DAO Governance',
      amount: '2.3 ETH',
      status: 'Arbitrator Selection',
      deadline: '2025-08-03',
    },
    {
      id: '0x7g8h9i',
      type: 'P2P Marketplace',
      amount: '0.2 ETH',
      status: 'Resolved',
      deadline: '2025-07-28',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Decentralized Digital Justice
          </h1>
          <p className="text-gray-600">
            Anonymous reputation-based arbitration marketplace
          </p>
          {userAddress && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">Connected Address:</p>
              <p className="font-mono text-sm">{userAddress}</p>
              {isArbitrator && (
                <div className="mt-2 flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-green-600 font-medium">
                    Verified Arbitrator
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">{activeDisputes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Arbitrators</p>
                <p className="text-2xl font-bold text-gray-900">{totalArbitrators}</p>
              </div>
            </div>
          </div>

          {isArbitrator && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Your Reputation</p>
                  <p className="text-2xl font-bold text-gray-900">850</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCases.map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{case_.type}</h3>
                        <p className="text-sm text-gray-500">Case ID: {case_.id}</p>
                        <p className="text-sm text-gray-600">Amount: {case_.amount}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            case_.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : case_.status === 'Evidence Phase'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {case_.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Due: {case_.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Case
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Browse Active Cases
                </button>
                {!isArbitrator && (
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Become an Arbitrator
                  </button>
                )}
                {isArbitrator && (
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    View Assigned Cases
                  </button>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-sm font-medium text-green-600">Polygon</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Block Height</span>
                    <span className="text-sm font-medium text-gray-900">52,847,293</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gas Price</span>
                    <span className="text-sm font-medium text-gray-900">25 gwei</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IPFS Status</span>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
