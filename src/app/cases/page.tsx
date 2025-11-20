'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function BrowseCasesPage() {
    const router = useRouter();
    const { t } = useLanguage();

    // Mock data - replace with contract calls
    const cases = [
        {
            id: '0x1a2b3c',
            title: 'Freelance Web Development Dispute',
            amount: '0.5 ETH',
            status: t.status.evidencePhase,
            deadline: '2025-08-05',
            arbitrators: 2
        },
        {
            id: '0x4d5e6f',
            title: 'DAO Governance Proposal 42',
            amount: '2.3 ETH',
            status: t.status.arbitratorSelection,
            deadline: '2025-08-03',
            arbitrators: 0
        },
        {
            id: '0x7g8h9i',
            title: 'NFT Marketplace Royalty Issue',
            amount: '0.2 ETH',
            status: t.status.resolved,
            deadline: '2025-07-28',
            arbitrators: 3
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.browseCases.backToDashboard}
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t.browseCases.title}</h1>
                        <p className="text-gray-600 mt-1">{t.browseCases.subtitle}</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder={t.browseCases.searchPlaceholder}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4 mr-2" />
                            {t.browseCases.filter}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {cases.map((case_) => (
                        <div key={case_.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${case_.status === t.status.resolved ? 'bg-green-100 text-green-800' :
                                                case_.status === t.status.evidencePhase ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {case_.status}
                                        </span>
                                        <span className="text-sm text-gray-500 font-mono">{case_.id}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{case_.title}</h3>
                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                        <span>{t.amount}: <span className="font-medium text-gray-900">{case_.amount}</span></span>
                                        <span>{t.due}: {case_.deadline}</span>
                                        <span>{t.arbitrators}: {case_.arbitrators}</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center">
                                    <button className="px-6 py-2 bg-white border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                                        {t.browseCases.viewDetails}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
