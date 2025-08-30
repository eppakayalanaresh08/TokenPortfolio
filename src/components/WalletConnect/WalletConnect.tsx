import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { Button } from '../ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const WalletConnect: React.FC = () => {
  const { isConnected, address, balance, connect, disconnect, isConnecting } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string | undefined) => {
    if (!bal) return '0.00';
    const num = parseFloat(bal);
    if (num < 0.01) return '< 0.01';
    return num.toFixed(2);
  };

  if (isConnected && address) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Wallet Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#ffffff0a] rounded-lg px-4 py-3 border border-[#ffffff14] w-full sm:w-auto">
          {/* Balance */}
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-sm text-zinc-400">Balance</div>
            <div className="text-lg font-semibold text-white">
              {formatBalance(balance)} ETH
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-2 h-2 bg-[#a9e851] rounded-full flex-shrink-0"></div>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-sm text-zinc-300 hover:text-white transition-colors flex-1 sm:flex-none text-left"
            >
              {showAddress ? address : formatAddress(address)}
            </button>
            <button
              onClick={handleCopyAddress}
              className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              title="Copy address"
            >
              {copied ? <Check className="w-4 h-4 text-[#a9e851]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Disconnect Button */}
        <Button
          onClick={disconnect}
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-[#ffffff0a] px-3 py-2 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="bg-[#a9e851] hover:bg-[#98d645] text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};