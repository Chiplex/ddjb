'use client';

import { useWallet } from "@/lib/blockchain/useWallet";
import Dashboard from "@/components/Dashboard";
import WalletConnection from "@/components/WalletConnection";

export default function Home() {
  const { isConnected, address } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <WalletConnection />
        </div>
      </div>
    );
  }

  return <Dashboard userAddress={address || ""} isArbitrator={false} />;
}
