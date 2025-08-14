import { useState, useEffect, useCallback } from 'react';
import { getWalletAddress, getWalletBalance } from '../utils/wallet';
import { WalletState } from '../types';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });

  // Check wallet connection once
  const checkConnection = useCallback(async () => {
    try {
      if (walletState.connected && walletState.address) {
        // Already connected → skip re-check
        return;
      }

      const address = await getWalletAddress();
      if (address) {
        const balance = await getWalletBalance(address);
        setWalletState({
          connected: true,
          address,
          balance,
        });
      }
    } catch (err) {
      console.error('Wallet connection check failed:', err);
    }
  }, [walletState.connected, walletState.address]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Manually update wallet balance
  const updateBalance = useCallback(async () => {
    if (walletState.address) {
      try {
        const balance = await getWalletBalance(walletState.address);
        setWalletState((prev) => ({ ...prev, balance }));
      } catch (err) {
        console.error('Failed to update wallet balance:', err);
      }
    }
  }, [walletState.address]);

  return { walletState, setWalletState, updateBalance, checkConnection };
};
