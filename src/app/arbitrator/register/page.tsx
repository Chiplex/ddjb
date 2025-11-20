'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ArbitratorRegistrationPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRegister = async () => {
        setIsProcessing(true);

        // TODO: Implement contract interaction (staking and registration)
        console.log('Registering as arbitrator...');

        // Simulate delay
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.arbitrator.backToDashboard}
                </button>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white">
                        <div className="flex items-center mb-4">
                            <Shield className="w-8 h-8 mr-3" />
                            <h1 className="text-2xl font-bold">{t.arbitrator.title}</h1>
                        </div>
                        <p className="text-blue-100">
                            {t.arbitrator.subtitle}
                        </p>
                    </div>

                    <div className="p-8">
                        {step === 1 ? (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.arbitrator.requirements}</h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                            <span className="text-gray-600">{t.arbitrator.req1}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                            <span className="text-gray-600">{t.arbitrator.req2}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                            <span className="text-gray-600">{t.arbitrator.req3}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-yellow-800 mb-1">{t.arbitrator.terms}</h3>
                                            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                                                <li>{t.arbitrator.term1}</li>
                                                <li>{t.arbitrator.term2}</li>
                                                <li>{t.arbitrator.term3}</li>
                                                <li>{t.arbitrator.term4}</li>
                                                <li>{t.arbitrator.term5}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                        {t.arbitrator.agreeTerms}
                                    </label>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={isProcessing}
                                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {isProcessing ? t.arbitrator.processing : t.arbitrator.registerButton}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.arbitrator.successTitle}</h2>
                                <p className="text-gray-600 mb-8">
                                    {t.arbitrator.successMessage}
                                </p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {t.arbitrator.returnDashboard}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
