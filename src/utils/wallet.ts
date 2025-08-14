import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize Aptos client (Testnet for now)
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

// Check if Petra Wallet is installed
export const isPetraInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).aptos;
};

// Connect to Petra Wallet
export const connectPetraWallet = async (): Promise<string> => {
  if (!isPetraInstalled()) {
    throw new Error('Petra Wallet is not installed. Please install it first.');
  }

  try {
    // If already connected, return the existing address
    const existing = await getWalletAddress();
    if (existing) return existing;

    const response = await (window as any).aptos.connect();
    return response.address;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to connect to Petra Wallet');
  }
};

// Get wallet address (if already connected)
export const getWalletAddress = async (): Promise<string | null> => {
  if (!isPetraInstalled()) return null;

  try {
    const response = await (window as any).aptos.account();
    return response?.address || null;
  } catch {
    return null;
  }
};

// Get wallet balance (APT)
export const getWalletBalance = async (address: string): Promise<number> => {
  try {
    const resources = await aptos.getAccountResources({ accountAddress: address });
    const coinResource = resources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );

    if (coinResource) {
      const balance = (coinResource.data as any).coin.value;
      return Number(balance) / 1e8; // Convert Octas → APT
    }
    return 0;
  } catch {
    return 0;
  }
};

// Send transaction (APT transfer)
export const sendTransaction = async (
  toAddress: string,
  amount: number
): Promise<{ success: boolean; hash?: string; error?: string }> => {
  if (!isPetraInstalled()) {
    return { success: false, error: 'Petra Wallet not installed' };
  }

  try {
    const amountInOctas = Math.floor(amount * 1e8);

    const transaction = {
      type: 'entry_function_payload',
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [toAddress, amountInOctas.toString()],
    };

    const response = await (window as any).aptos.signAndSubmitTransaction(transaction);
    return { success: true, hash: response?.hash };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Transaction failed' };
  }
};

// Disconnect Petra Wallet
export const disconnectPetraWallet = async (): Promise<void> => {
  const petra = (window as any).aptos;
  if (petra?.disconnect) {
    await petra.disconnect();
  }
};

// Shorten wallet address for UI
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
