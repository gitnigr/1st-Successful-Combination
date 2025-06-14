// Transaction handling utilities for Solana operations
// This preserves existing transaction patterns from both projects

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface TransactionStatus {
  pending: boolean;
  confirmed: boolean;
  failed: boolean;
  signature?: string;
  error?: string;
}

// Transaction state management
export class TransactionManager {
  private static instance: TransactionManager;
  private pendingTransactions: Map<string, TransactionStatus> = new Map();

  static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  addPendingTransaction(id: string, signature?: string): void {
    this.pendingTransactions.set(id, {
      pending: true,
      confirmed: false,
      failed: false,
      signature
    });
  }

  updateTransactionStatus(id: string, status: Partial<TransactionStatus>): void {
    const existing = this.pendingTransactions.get(id);
    if (existing) {
      this.pendingTransactions.set(id, { ...existing, ...status });
    }
  }

  getTransactionStatus(id: string): TransactionStatus | null {
    return this.pendingTransactions.get(id) || null;
  }

  removeTransaction(id: string): void {
    this.pendingTransactions.delete(id);
  }

  getPendingTransactions(): Map<string, TransactionStatus> {
    return new Map(this.pendingTransactions);
  }
}

// Export singleton instance
export const transactionManager = TransactionManager.getInstance();

// Utility functions for transaction operations
export async function executeTransaction(
  transactionFn: () => Promise<string | null>,
  transactionId: string
): Promise<TransactionResult> {
  try {
    transactionManager.addPendingTransaction(transactionId);
    
    const signature = await transactionFn();
    
    if (signature) {
      transactionManager.updateTransactionStatus(transactionId, {
        pending: false,
        confirmed: true,
        signature
      });
      
      return {
        success: true,
        signature
      };
    } else {
      transactionManager.updateTransactionStatus(transactionId, {
        pending: false,
        failed: true,
        error: 'Transaction failed'
      });
      
      return {
        success: false,
        error: 'Transaction failed'
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    transactionManager.updateTransactionStatus(transactionId, {
      pending: false,
      failed: true,
      error: errorMessage
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Transaction confirmation utilities
export async function waitForTransactionConfirmation(
  signature: string,
  timeout: number = 30000
): Promise<boolean> {
  // This will be enhanced with actual Solana transaction confirmation
  // For now, providing the structure that matches existing patterns
  console.log(`Waiting for transaction confirmation: ${signature}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Placeholder - will be replaced with actual confirmation logic
    }, 2000);
  });
}

// Transaction retry utilities
export async function retryTransaction(
  transactionFn: () => Promise<string | null>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<string | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transactionFn();
      if (result) {
        return result;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Transaction attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after all retries');
}

// Transaction fee estimation
export async function estimateTransactionFee(): Promise<number> {
  // This will be enhanced with actual Solana fee estimation
  // For now, providing a reasonable default
  return 0.000005; // 5000 lamports
}

// Transaction validation
export function validateTransactionParams(params: any): boolean {
  // Basic validation - will be enhanced based on specific transaction types
  if (!params) return false;
  
  // Add specific validation logic based on transaction type
  return true;
}

// Export utility functions
export const addPendingTransaction = (id: string, signature?: string) => 
  transactionManager.addPendingTransaction(id, signature);

export const getTransactionStatus = (id: string) => 
  transactionManager.getTransactionStatus(id);

export const updateTransactionStatus = (id: string, status: Partial<TransactionStatus>) => 
  transactionManager.updateTransactionStatus(id, status); 