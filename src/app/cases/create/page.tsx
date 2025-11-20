'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TopBar } from '@/components/TopBar';
import { useCaseStorage } from '@/lib/hooks/useCaseStorage';
import { useWallet } from '@/lib/blockchain/useWallet';

export default function CreateCasePage() {
    const router = useRouter();
    const { t } = useLanguage();
    const { isConnected } = useWallet();
    const { createCase, isCreating, error, success, caseId, ipfsCid } = useCaseStorage();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            alert(t.createCase.walletNotConnected || 'Please connect your wallet first');
            return;
        }

        await createCase({
            title,
            description,
            amount,
        });
    };

    // Redirect to dashboard on success
    React.useEffect(() => {
        if (success && caseId) {
            console.log('Case created successfully!', { caseId: caseId.toString(), ipfsCid });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    }, [success, caseId, ipfsCid, router]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <TopBar>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.createCase.backToDashboard}
                    </button>
                </TopBar>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.createCase.title}</h1>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                                    {t.createCase.successTitle || 'Case Created Successfully!'}
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                                    {t.createCase.successMessage || `Case ID: ${caseId?.toString()}`}
                                </p>
                                {ipfsCid && (
                                    <p className="text-xs text-green-600 dark:text-green-500 mt-1 font-mono">
                                        IPFS: {ipfsCid}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                    {t.createCase.errorTitle || 'Error Creating Case'}
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-500 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t.createCase.caseTitle}
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={t.createCase.caseTitlePlaceholder}
                                required
                                disabled={isCreating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t.createCase.description}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={t.createCase.descriptionPlaceholder}
                                required
                                disabled={isCreating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t.createCase.disputeAmount}
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.0"
                                required
                                disabled={isCreating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t.createCase.evidence}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.createCase.evidencePlaceholder}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isCreating || success}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isCreating ? (t.createCase.submitting || 'Creating Case...') : (t.createCase.submitButton || 'Submit Case')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
