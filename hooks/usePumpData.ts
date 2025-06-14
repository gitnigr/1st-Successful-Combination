// Data fetching hooks for unified data management
// This preserves existing API patterns from both projects

import { useState, useEffect, useCallback } from 'react';
import { appStore, updateTokenState, setLoading, setError } from '../lib/store';

// Hook for Pump Data API (preserving existing functionality)
export function usePumpData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchPumpData = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);
    setLoading(true);

    try {
      // This preserves the existing API call from Pump Data project
      const response = await fetch('/api/pump');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        setLastUpdated(Date.now());
        
        // Update global state
        updateTokenState({
          pumpTokens: result.data,
          lastUpdated: Date.now(),
          loading: false
        });
        
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch pump data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(errorMessage);
      setError(errorMessage);
      console.error('Error fetching pump data:', err);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  }, []);

  // Auto-refresh functionality (preserving existing 7-second interval)
  useEffect(() => {
    fetchPumpData();
    
    const interval = setInterval(fetchPumpData, 7000);
    
    return () => clearInterval(interval);
  }, [fetchPumpData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchPumpData
  };
}

// Hook for token filtering and searching
export function useTokenFilters() {
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);
  const tokenState = appStore.getTokenState();

  const applyFilters = useCallback((tokens: any[]) => {
    let filtered = [...tokens];
    const { filters } = tokenState;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(token => 
        token.name?.toLowerCase().includes(searchLower) ||
        token.symbol?.toLowerCase().includes(searchLower) ||
        token.description?.toLowerCase().includes(searchLower)
      );
    }

    // Market cap filters
    if (filters.minMarketCap !== undefined) {
      filtered = filtered.filter(token => 
        (token.marketCap || 0) >= filters.minMarketCap!
      );
    }

    if (filters.maxMarketCap !== undefined) {
      filtered = filtered.filter(token => 
        (token.marketCap || 0) <= filters.maxMarketCap!
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy] || 0;
      const bValue = b[filters.sortBy] || 0;
      
      if (filters.sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [tokenState.filters]);

  useEffect(() => {
    const filtered = applyFilters(tokenState.pumpTokens);
    setFilteredTokens(filtered);
  }, [tokenState.pumpTokens, tokenState.filters, applyFilters]);

  return {
    filteredTokens,
    filters: tokenState.filters,
    updateFilters: (updates: any) => {
      appStore.updateTokenFilters(updates);
    }
  };
}

// Hook for wallet data
export function useWalletData() {
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLocalLoading] = useState(false);
  
  const walletState = appStore.getWalletState();

  const fetchWalletData = useCallback(async () => {
    if (!walletState.connected || !walletState.publicKey) {
      return;
    }

    setLocalLoading(true);

    try {
      // This will be enhanced with actual Solana wallet data fetching
      // For now, providing the structure that matches existing patterns
      console.log('Fetching wallet data for:', walletState.publicKey);
      
      // Placeholder for actual wallet data fetching
      setBalance(walletState.balance);
      setTokens([]);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [walletState.connected, walletState.publicKey, walletState.balance]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return {
    balance,
    tokens,
    loading,
    refetch: fetchWalletData
  };
}

// Hook for transaction history
export function useTransactionHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLocalLoading] = useState(false);
  
  const transactionState = appStore.getTransactionState();

  const fetchTransactionHistory = useCallback(async () => {
    const walletState = appStore.getWalletState();
    
    if (!walletState.connected || !walletState.publicKey) {
      return;
    }

    setLocalLoading(true);

    try {
      // This will be enhanced with actual Solana transaction history fetching
      // For now, providing the structure that matches existing patterns
      console.log('Fetching transaction history for:', walletState.publicKey);
      
      // Use existing transaction history from state
      setHistory(transactionState.history);
      
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [transactionState.history]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  return {
    history,
    loading,
    refetch: fetchTransactionHistory
  };
}

// Hook for real-time updates
export function useRealTimeUpdates() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // This will be enhanced with actual WebSocket or polling for real-time updates
    // For now, providing the structure for real-time functionality
    console.log('Real-time updates initialized');
    setConnected(true);

    return () => {
      console.log('Real-time updates disconnected');
      setConnected(false);
    };
  }, []);

  return {
    connected
  };
}

// Export all hooks
export default {
  usePumpData,
  useTokenFilters,
  useWalletData,
  useTransactionHistory,
  useRealTimeUpdates
}; 