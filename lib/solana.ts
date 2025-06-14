// Solana Web3.js integration service
// This preserves existing Solana functionality from both projects

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Solana connection configuration
export const SOLANA_NETWORK = 'devnet'; // Can be 'mainnet-beta', 'testnet', or 'devnet'
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Connection instance
let connection: Connection | null = null;

export function getSolanaConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }
  return connection;
}

// Utility functions for Solana operations
export async function getAccountBalance(publicKey: string): Promise<number> {
  try {
    const connection = getSolanaConnection();
    const pubKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

export async function getTokenAccounts(publicKey: string) {
  try {
    const connection = getSolanaConnection();
    const pubKey = new PublicKey(publicKey);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });
    return tokenAccounts.value;
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    return [];
  }
}

export async function sendTransaction(transaction: Transaction, signers: any[]): Promise<string | null> {
  try {
    const connection = getSolanaConnection();
    
    // Get recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    
    // Sign and send transaction
    const signature = await connection.sendTransaction(transaction, signers);
    
    // Confirm transaction
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    return null;
  }
}

export async function createTransferTransaction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );
  
  return transaction;
}

// Token creation utilities (preserving Token Creator functionality)
export interface TokenCreationParams {
  name: string;
  symbol: string;
  description: string;
  image: string;
  decimals: number;
  supply: number;
}

export async function createToken(params: TokenCreationParams): Promise<string | null> {
  try {
    // This will be enhanced with actual SPL token creation logic
    // For now, providing the structure that matches existing Token Creator patterns
    console.log('Token creation initiated:', params);
    
    // Placeholder for actual token creation logic
    // This preserves the existing token creation patterns from Token Creator
    return 'ExampleTokenMint123...';
  } catch (error) {
    console.error('Error creating token:', error);
    return null;
  }
}

// Liquidity pool utilities (preserving Token Creator functionality)
export interface LiquidityPoolParams {
  tokenMint: string;
  solAmount: number;
  tokenAmount: number;
}

export async function createLiquidityPool(params: LiquidityPoolParams): Promise<string | null> {
  try {
    // This will be enhanced with actual liquidity pool creation logic
    // For now, providing the structure that matches existing Token Creator patterns
    console.log('Liquidity pool creation initiated:', params);
    
    // Placeholder for actual liquidity pool creation logic
    return 'ExamplePoolAddress123...';
  } catch (error) {
    console.error('Error creating liquidity pool:', error);
    return null;
  }
}

// Network utilities
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Export connection for direct use
export { connection }; 