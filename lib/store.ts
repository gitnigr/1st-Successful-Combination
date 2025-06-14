// State management for the unified Solana Pump Platform
// This preserves existing state patterns from both projects

import { WalletState } from './wallet';
import { TransactionStatus } from './transactions';

// Global application state interface
export interface AppState {
  wallet: WalletState;
  ui: UIState;
  tokens: TokenState;
  transactions: TransactionState;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface TokenState {
  pumpTokens: any[];
  userTokens: any[];
  selectedToken: any | null;
  filters: TokenFilters;
  loading: boolean;
  lastUpdated: number;
}

export interface TokenFilters {
  search: string;
  sortBy: 'marketCap' | 'price' | 'change24h' | 'volume' | 'created';
  sortOrder: 'asc' | 'desc';
  minMarketCap?: number;
  maxMarketCap?: number;
}

export interface TransactionState {
  pending: Map<string, TransactionStatus>;
  history: TransactionHistory[];
  loading: boolean;
}

export interface TransactionHistory {
  id: string;
  type: 'token_creation' | 'liquidity_add' | 'transfer' | 'swap';
  signature: string;
  timestamp: number;
  status: 'confirmed' | 'failed';
  details: any;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// State management class
export class AppStore {
  private static instance: AppStore;
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor() {
    this.state = this.getInitialState();
  }

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  private getInitialState(): AppState {
    return {
      wallet: {
        connected: false,
        publicKey: null,
        balance: 0,
        connecting: false
      },
      ui: {
        loading: false,
        error: null,
        theme: 'light',
        sidebarOpen: false,
        notifications: []
      },
      tokens: {
        pumpTokens: [],
        userTokens: [],
        selectedToken: null,
        filters: {
          search: '',
          sortBy: 'marketCap',
          sortOrder: 'desc'
        },
        loading: false,
        lastUpdated: 0
      },
      transactions: {
        pending: new Map(),
        history: [],
        loading: false
      }
    };
  }

  // State getters
  getState(): AppState {
    return { ...this.state };
  }

  getWalletState(): WalletState {
    return { ...this.state.wallet };
  }

  getUIState(): UIState {
    return { ...this.state.ui };
  }

  getTokenState(): TokenState {
    return { ...this.state.tokens };
  }

  getTransactionState(): TransactionState {
    return { ...this.state.transactions };
  }

  // State setters
  updateWalletState(updates: Partial<WalletState>): void {
    this.state.wallet = { ...this.state.wallet, ...updates };
    this.notifyListeners();
  }

  updateUIState(updates: Partial<UIState>): void {
    this.state.ui = { ...this.state.ui, ...updates };
    this.notifyListeners();
  }

  updateTokenState(updates: Partial<TokenState>): void {
    this.state.tokens = { ...this.state.tokens, ...updates };
    this.notifyListeners();
  }

  updateTransactionState(updates: Partial<TransactionState>): void {
    this.state.transactions = { ...this.state.transactions, ...updates };
    this.notifyListeners();
  }

  // Specific actions
  setLoading(loading: boolean): void {
    this.updateUIState({ loading });
  }

  setError(error: string | null): void {
    this.updateUIState({ error });
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    this.updateUIState({
      notifications: [...this.state.ui.notifications, newNotification]
    });
  }

  removeNotification(id: string): void {
    this.updateUIState({
      notifications: this.state.ui.notifications.filter(n => n.id !== id)
    });
  }

  updateTokenFilters(filters: Partial<TokenFilters>): void {
    this.updateTokenState({
      filters: { ...this.state.tokens.filters, ...filters }
    });
  }

  setSelectedToken(token: any): void {
    this.updateTokenState({ selectedToken: token });
  }

  // Subscription management
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Persistence (optional)
  saveToLocalStorage(): void {
    try {
      const persistentState = {
        ui: {
          theme: this.state.ui.theme,
          sidebarOpen: this.state.ui.sidebarOpen
        },
        tokens: {
          filters: this.state.tokens.filters
        }
      };
      localStorage.setItem('solana-pump-platform-state', JSON.stringify(persistentState));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('solana-pump-platform-state');
      if (saved) {
        const persistentState = JSON.parse(saved);
        
        if (persistentState.ui) {
          this.updateUIState(persistentState.ui);
        }
        
        if (persistentState.tokens) {
          this.updateTokenState(persistentState.tokens);
        }
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
  }
}

// Export singleton instance
export const appStore = AppStore.getInstance();

// Utility functions
export const getAppState = () => appStore.getState();
export const getWalletState = () => appStore.getWalletState();
export const getUIState = () => appStore.getUIState();
export const getTokenState = () => appStore.getTokenState();
export const getTransactionState = () => appStore.getTransactionState();

export const updateWalletState = (updates: Partial<WalletState>) => 
  appStore.updateWalletState(updates);

export const updateUIState = (updates: Partial<UIState>) => 
  appStore.updateUIState(updates);

export const updateTokenState = (updates: Partial<TokenState>) => 
  appStore.updateTokenState(updates);

export const setLoading = (loading: boolean) => appStore.setLoading(loading);
export const setError = (error: string | null) => appStore.setError(error);
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => 
  appStore.addNotification(notification);

export const subscribeToStore = (listener: (state: AppState) => void) => 
  appStore.subscribe(listener); 