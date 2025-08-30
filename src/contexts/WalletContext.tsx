import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectedWallet, clearConnectedWallet } from '../store/slices/portfolioSlice';
import { RootState, AppDispatch } from '../store/types';

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  balance: string | undefined;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connectedWallet = useSelector((state: RootState) => state.portfolio.connectedWallet);

  const { data: balanceData } = useBalance({
    address,
  });

  const connect = () => {
    if (openConnectModal) {
      setIsConnecting(true);
      openConnectModal();
    }
  };

  const handleDisconnect = () => {
    wagmiDisconnect();
    dispatch(clearConnectedWallet());
  };

  // Sync wallet connection state with Redux
  useEffect(() => {
    if (isConnected && address) {
      dispatch(setConnectedWallet(address));
      setIsConnecting(false);
    } else if (!isConnected) {
      dispatch(clearConnectedWallet());
      setIsConnecting(false);
    }
  }, [isConnected, address, dispatch]);

  // Restore wallet connection from localStorage on mount
  useEffect(() => {
    if (connectedWallet && !isConnected) {
      // Wallet was previously connected, but not currently connected
      // This handles the case where user refreshes the page
      console.log('Restoring wallet connection from localStorage:', connectedWallet);
    }
  }, [connectedWallet, isConnected]);

  const value: WalletContextType = {
    isConnected,
    address,
    balance: balanceData?.formatted,
    connect,
    disconnect: handleDisconnect,
    isConnecting,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
