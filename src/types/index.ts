export interface StudentDetails {
  studentName: string;
  collegeName: string;
  rollNumber: string;
  feeType: string;
  amount: number;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
}