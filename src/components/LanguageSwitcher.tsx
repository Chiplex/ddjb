'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{language}</span>
            </button>

            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 hidden group-hover:block z-50">
                <button
                    onClick={() => setLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    English
                </button>
                <button
                    onClick={() => setLanguage('es')}
                    className={`w-full text-left px-4 py-2 text-sm ${language === 'es' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    Español
                </button>
            </div>
        </div>
    );
}
