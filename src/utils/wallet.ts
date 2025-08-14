import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// ===== Aptos Client Setup (Testnet for now) =====
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

// ===== Utility: Check Petra Wallet =====
export const isPetraInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).aptos;
};

// ===== Connect to Petra Wallet =====
export const connectPetraWallet = async (): Promise<string> => {
  if (!isPetraInstalled()) {
    throw new Error('Petra Wallet is not installed. Please install it from https://petra.app/');
  }

  try {
    const response = await (window as any).aptos.connect();
    if (!response?.address) throw new Error('No address returned from Petra Wallet');
    return response.address;
  } catch (error: any) {
    console.error('Petra Wallet connection failed:', error);
    throw new Error(error?.message || 'Failed to connect to Petra Wallet');
  }
};

// ===== Get Wallet Address (if already connected) =====
export const getWalletAddress = async (): Promise<string | null> => {
  if (!isPetraInstalled()) return null;

  try {
    const response = await (window as any).aptos.account();
    return response?.address || null;
  } catch {
    return null; // Not connected
  }
};

// ===== Get Wallet Balance =====
export const getWalletBalance = async (address: string): Promise<number> => {
  if (!address) return 0;

  try {
    const resources = await aptos.getAccountResources({ accountAddress: address });
    const coinResource = resources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );

    if (!coinResource) return 0;

    const balance = (coinResource.data as any)?.coin?.value || '0';
    return parseInt(balance, 10) / 100_000_000; // Convert from Octas to APT
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
};

// ===== Send Transaction =====
export const sendTransaction = async (
  toAddress: string,
  amount: number
): Promise<{ success: boolean; hash?: string; error?: string }> => {
  if (!isPetraInstalled()) {
    return { success: false, error: 'Petra Wallet not installed' };
  }

  if (!toAddress || amount <= 0) {
    return { success: false, error: 'Invalid recipient address or amount' };
  }

  try {
    const amountInOctas = Math.floor(amount * 100_000_000); // Convert APT → Octas

    const transaction = {
      type: 'entry_function_payload',
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [toAddress, amountInOctas.toString()],
    };

    const response = await (window as any).aptos.signAndSubmitTransaction(transaction);

    if (!response?.hash) {
      return { success: false, error: 'Transaction submitted but no hash returned' };
    }

    return { success: true, hash: response.hash };
  } catch (error: any) {
    console.error('Transaction failed:', error);
    return { success: false, error: error?.message || 'Transaction failed' };
  }
};

// ===== Disconnect Petra Wallet =====
export const disconnectPetraWallet = async (): Promise<void> => {
  const aptosWallet = (window as any).aptos;
  if (aptosWallet?.disconnect) {
    await aptosWallet.disconnect();
  }
};

// ===== Shorten Wallet Address for UI =====
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
