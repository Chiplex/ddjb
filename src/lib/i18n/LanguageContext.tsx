'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
    title: string;
    subtitle: string;
    connectedAddress: string;
    verifiedArbitrator: string;
    totalCases: string;
    activeCases: string;
    arbitrators: string;
    yourReputation: string;
    recentCases: string;
    quickActions: string;
    createNewCase: string;
    browseActiveCases: string;
    becomeArbitrator: string;
    viewAssignedCases: string;
    systemStatus: string;
    network: string;
    blockHeight: string;
    gasPrice: string;
    ipfsStatus: string;
    connected: string;
    caseId: string;
    amount: string;
    due: string;
    status: {
        evidencePhase: string;
        arbitratorSelection: string;
        resolved: string;
    };
    caseTypes: {
        freelanceDispute: string;
        daoGovernance: string;
        p2pMarketplace: string;
    };
    createCase: {
        title: string;
        backToDashboard: string;
        caseTitle: string;
        caseTitlePlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        disputeAmount: string;
        evidence: string;
        evidencePlaceholder: string;
        submitButton: string;
        submitting: string;
    };
    browseCases: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        filter: string;
        viewDetails: string;
        backToDashboard: string;
    };
    arbitrator: {
        title: string;
        subtitle: string;
        backToDashboard: string;
        requirements: string;
        req1: string;
        req2: string;
        req3: string;
        terms: string;
        term1: string;
        term2: string;
        term3: string;
        term4: string;
        term5: string;
        agreeTerms: string;
        registerButton: string;
        processing: string;
        successTitle: string;
        successMessage: string;
        returnDashboard: string;
    };
    wallet: {
        connectTitle: string;
        connectSubtitle: string;
        connectButton: string;
        connecting: string;
        connectedTitle: string;
        connected: string;
        address: string;
        copy: string;
        network: string;
        unknownNetwork: string;
        switchNetwork: string;
        unsupportedNetwork: string;
        disconnect: string;
    };
}

const translations: Record<Language, Translations> = {
    en: {
        title: 'Decentralized Digital Justice',
        subtitle: 'Anonymous reputation-based arbitration marketplace',
        connectedAddress: 'Connected Address:',
        verifiedArbitrator: 'Verified Arbitrator',
        totalCases: 'Total Cases',
        activeCases: 'Active Cases',
        arbitrators: 'Arbitrators',
        yourReputation: 'Your Reputation',
        recentCases: 'Recent Cases',
        quickActions: 'Quick Actions',
        createNewCase: 'Create New Case',
        browseActiveCases: 'Browse Active Cases',
        becomeArbitrator: 'Become an Arbitrator',
        viewAssignedCases: 'View Assigned Cases',
        systemStatus: 'System Status',
        network: 'Network',
        blockHeight: 'Block Height',
        gasPrice: 'Gas Price',
        ipfsStatus: 'IPFS Status',
        connected: 'Connected',
        caseId: 'Case ID',
        amount: 'Amount',
        due: 'Due',
        status: {
            evidencePhase: 'Evidence Phase',
            arbitratorSelection: 'Arbitrator Selection',
            resolved: 'Resolved',
        },
        caseTypes: {
            freelanceDispute: 'Freelance Dispute',
            daoGovernance: 'DAO Governance',
            p2pMarketplace: 'P2P Marketplace',
        },
        createCase: {
            title: 'Create New Dispute Case',
            backToDashboard: 'Back to Dashboard',
            caseTitle: 'Case Title',
            caseTitlePlaceholder: 'e.g., Freelance Contract Breach',
            description: 'Description',
            descriptionPlaceholder: 'Describe the details of the dispute...',
            disputeAmount: 'Dispute Amount (ETH)',
            evidence: 'Evidence',
            evidencePlaceholder: 'Click to upload relevant documents (PDF, PNG, JPG)',
            submitButton: 'Submit Case',
            submitting: 'Creating Case...',
        },
        browseCases: {
            title: 'Active Cases',
            subtitle: 'Browse and filter available disputes',
            searchPlaceholder: 'Search cases...',
            filter: 'Filter',
            viewDetails: 'View Details',
            backToDashboard: 'Back to Dashboard',
        },
        arbitrator: {
            title: 'Become an Arbitrator',
            subtitle: 'Join the decentralized justice network and earn rewards',
            backToDashboard: 'Back to Dashboard',
            requirements: 'Requirements',
            req1: 'Minimum stake of 1000 DDJB tokens',
            req2: 'Clean history (no previous slashing)',
            req3: 'Commitment to fair and timely resolution',
            terms: 'Terms of Service',
            term1: 'Review cases impartially and thoroughly.',
            term2: 'Maintain confidentiality of sensitive evidence.',
            term3: 'Submit verdicts within the specified timeframe.',
            term4: 'Accept slashing penalties for proven misconduct.',
            term5: 'Participate in the governance of the protocol.',
            agreeTerms: 'I have read and agree to the terms',
            registerButton: 'Stake & Register',
            processing: 'Processing Registration...',
            successTitle: 'Registration Successful!',
            successMessage: 'You are now a verified arbitrator. You can start accepting cases to build your reputation.',
            returnDashboard: 'Return to Dashboard',
        },
        wallet: {
            connectTitle: 'Connect Wallet',
            connectSubtitle: 'To access the decentralized justice platform, you need to connect your wallet.',
            connectButton: 'Connect MetaMask',
            connecting: 'Connecting...',
            connectedTitle: 'Wallet Connected',
            connected: 'Connected',
            address: 'Address',
            copy: 'Copy',
            network: 'Network',
            unknownNetwork: 'Unknown Network',
            switchNetwork: 'Switch Network',
            unsupportedNetwork: 'Unsupported network. Switch to Polygon, Mumbai or Localhost to continue.',
            disconnect: 'Disconnect Wallet',
        },
    },
    es: {
        title: 'Justicia Digital Descentralizada',
        subtitle: 'Mercado de arbitraje anónimo basado en reputación',
        connectedAddress: 'Dirección Conectada:',
        verifiedArbitrator: 'Árbitro Verificado',
        totalCases: 'Casos Totales',
        activeCases: 'Casos Activos',
        arbitrators: 'Árbitros',
        yourReputation: 'Tu Reputación',
        recentCases: 'Casos Recientes',
        quickActions: 'Acciones Rápidas',
        createNewCase: 'Crear Nuevo Caso',
        browseActiveCases: 'Explorar Casos Activos',
        becomeArbitrator: 'Convertirse en Árbitro',
        viewAssignedCases: 'Ver Casos Asignados',
        systemStatus: 'Estado del Sistema',
        network: 'Red',
        blockHeight: 'Altura del Bloque',
        gasPrice: 'Precio del Gas',
        ipfsStatus: 'Estado IPFS',
        connected: 'Conectado',
        caseId: 'ID Caso',
        amount: 'Monto',
        due: 'Vence',
        status: {
            evidencePhase: 'Fase de Evidencia',
            arbitratorSelection: 'Selección de Árbitro',
            resolved: 'Resuelto',
        },
        caseTypes: {
            freelanceDispute: 'Disputa Freelance',
            daoGovernance: 'Gobernanza DAO',
            p2pMarketplace: 'Mercado P2P',
        },
        createCase: {
            title: 'Crear Nuevo Caso de Disputa',
            backToDashboard: 'Volver al Panel',
            caseTitle: 'Título del Caso',
            caseTitlePlaceholder: 'ej., Incumplimiento de Contrato Freelance',
            description: 'Descripción',
            descriptionPlaceholder: 'Describe los detalles de la disputa...',
            disputeAmount: 'Monto en Disputa (ETH)',
            evidence: 'Evidencia',
            evidencePlaceholder: 'Clic para subir documentos relevantes (PDF, PNG, JPG)',
            submitButton: 'Enviar Caso',
            submitting: 'Creando Caso...',
        },
        browseCases: {
            title: 'Casos Activos',
            subtitle: 'Explora y filtra las disputas disponibles',
            searchPlaceholder: 'Buscar casos...',
            filter: 'Filtrar',
            viewDetails: 'Ver Detalles',
            backToDashboard: 'Volver al Panel',
        },
        arbitrator: {
            title: 'Convertirse en Árbitro',
            subtitle: 'Únete a la red de justicia descentralizada y gana recompensas',
            backToDashboard: 'Volver al Panel',
            requirements: 'Requisitos',
            req1: 'Stake mínimo de 1000 tokens DDJB',
            req2: 'Historial limpio (sin penalizaciones previas)',
            req3: 'Compromiso con una resolución justa y oportuna',
            terms: 'Términos de Servicio',
            term1: 'Revisar casos de manera imparcial y exhaustiva.',
            term2: 'Mantener la confidencialidad de la evidencia sensible.',
            term3: 'Enviar veredictos dentro del plazo especificado.',
            term4: 'Aceptar penalizaciones por mala conducta comprobada.',
            term5: 'Participar en la gobernanza del protocolo.',
            agreeTerms: 'He leído y acepto los términos',
            registerButton: 'Apostar y Registrarse',
            processing: 'Procesando Registro...',
            successTitle: '¡Registro Exitoso!',
            successMessage: 'Ahora eres un árbitro verificado. Puedes comenzar a aceptar casos para construir tu reputación.',
            returnDashboard: 'Volver al Panel',
        },
        wallet: {
            connectTitle: 'Conectar Wallet',
            connectSubtitle: 'Para acceder a la plataforma de justicia descentralizada, necesitas conectar tu wallet.',
            connectButton: 'Conectar MetaMask',
            connecting: 'Conectando...',
            connectedTitle: 'Wallet Conectada',
            connected: 'Conectada',
            address: 'Dirección',
            copy: 'Copiar',
            network: 'Red',
            unknownNetwork: 'Red Desconocida',
            switchNetwork: 'Cambiar Red',
            unsupportedNetwork: 'Red no soportada. Cambia a Polygon, Mumbai o Localhost para continuar.',
            disconnect: 'Desconectar Wallet',
        },
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
