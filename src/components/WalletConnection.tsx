'use client';

import React from 'react';
import { Wallet, Check, AlertCircle, Loader } from 'lucide-react';
import { useWallet } from '../lib/blockchain/useWallet';

export function WalletConnection() {
  const { 
    address, 
    chainId, 
    isConnected, 
    isConnecting, 
    error, 
    connect, 
    disconnect,
    switchNetwork 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isCorrectNetwork = () => {
    // Check if we're on Polygon (137), Mumbai (80001), or localhost (1337)
    return chainId === 137 || chainId === 80001 || chainId === 1337;
  };

  const getNetworkName = (id: number) => {
    switch (id) {
      case 137: return 'Polygon Mainnet';
      case 80001: return 'Mumbai Testnet';
      case 1337: return 'Localhost';
      default: return 'Unknown Network';
    }
  };

  const handleNetworkSwitch = async () => {
    // Switch to Mumbai testnet by default
    await switchNetwork(80001);
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conectar Wallet
          </h3>
          <p className="text-gray-600 mb-4">
            Para acceder a la plataforma de justicia descentralizada, necesitas conectar tu wallet.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={connect}
            disabled={isConnecting}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Conectar MetaMask
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wallet Conectada</h3>
        <div className="flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-green-600 font-medium">Conectada</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="font-mono text-sm text-gray-900">
              {address && formatAddress(address)}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(address || '')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Copiar
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Red
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                isCorrectNetwork() ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-900">
                {chainId ? getNetworkName(chainId) : 'Desconocida'}
              </span>
            </div>
            {!isCorrectNetwork() && (
              <button
                onClick={handleNetworkSwitch}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Cambiar Red
              </button>
            )}
          </div>
        </div>
      </div>

      {!isCorrectNetwork() && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 text-sm">
              Red no soportada. Cambia a Polygon, Mumbai o Localhost para continuar.
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={disconnect}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Desconectar Wallet
        </button>
      </div>
    </div>
  );
}

export default WalletConnection;
