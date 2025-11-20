'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Scale, Shield, Users, FileText, TrendingUp, Loader, AlertCircle } from 'lucide-react';
import { useBlockchain } from '@/lib/blockchain/BlockchainProvider';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TopBar } from '@/components/TopBar';

interface DashboardProps {
  userAddress?: string;
  isArbitrator?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ userAddress, isArbitrator = false }) => {
  const router = useRouter();
  const { t } = useLanguage();
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
      type: t.caseTypes.freelanceDispute,
      amount: '0.5 ETH',
      status: t.status.evidencePhase,
      deadline: '2025-08-05',
      arbitrators: 2
    },
    {
      id: '0x4d5e6f',
      type: t.caseTypes.daoGovernance,
      amount: '2.3 ETH',
      status: t.status.arbitratorSelection,
      deadline: '2025-08-03',
      arbitrators: 0
    },
    {
      id: '0x7g8h9i',
      type: t.caseTypes.p2pMarketplace,
      amount: '0.2 ETH',
      status: t.status.resolved,
      deadline: '2025-07-28',
      arbitrators: 3
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TopBar>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t.subtitle}
            </p>
            {userAddress && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.connectedAddress}</p>
                <p className="font-mono text-sm dark:text-gray-200">{userAddress}</p>
                {isArbitrator && (
                  <div className="mt-2 flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600 font-medium">
                      {t.verifiedArbitrator}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </TopBar>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalCases}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.activeCases}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeDisputes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.arbitrators}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalArbitrators}</p>
              </div>
            </div>
          </div>

          {isArbitrator && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.yourReputation}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">850</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.recentCases}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCases.map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{case_.type}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.caseId}: {case_.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t.amount}: {case_.amount}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${case_.status === t.status.resolved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : case_.status === t.status.evidencePhase
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                        >
                          {case_.status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.due}: {case_.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.quickActions}</h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => router.push('/cases/create')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t.createNewCase}
                </button>
                <button
                  onClick={() => router.push('/cases')}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t.browseActiveCases}
                </button>
                {!isArbitrator && (
                  <button
                    onClick={() => router.push('/arbitrator/register')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.becomeArbitrator}
                  </button>
                )}
                {isArbitrator && (
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    {t.viewAssignedCases}
                  </button>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.systemStatus}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.network}</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Polygon</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.blockHeight}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">52,847,293</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.gasPrice}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">25 gwei</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.ipfsStatus}</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{t.connected}</span>
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
