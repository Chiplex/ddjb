"use client";

import React from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface TopBarProps {
    children?: React.ReactNode;
    className?: string;
}

export function TopBar({ children, className = "" }: TopBarProps) {
    return (
        <div className={`flex justify-between items-start mb-8 ${className}`}>
            <div className="flex-1">
                {children}
            </div>
            <div className="flex items-center gap-3 ml-4">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
        </div>
    );
}
