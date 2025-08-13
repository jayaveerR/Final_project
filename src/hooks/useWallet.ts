import { useState, useEffect } from 'react';
import { getWalletAddress, getWalletBalance } from '../utils/wallet';
import { WalletState } from '../types';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0
  });

  const checkConnection = async () => {
    const address = await getWalletAddress();
    if (address) {
      const balance = await getWalletBalance(address);
      setWalletState({
        connected: true,
        address,
        balance
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const updateBalance = async () => {
    if (walletState.address) {
      const balance = await getWalletBalance(walletState.address);
      setWalletState(prev => ({ ...prev, balance }));
    }
  };

  return { walletState, setWalletState, updateBalance };
};