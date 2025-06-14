'use client';

import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';

interface WalletConnectProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export function WalletConnect({ variant = 'outlined', size = 'medium' }: WalletConnectProps) {
  // This will be enhanced with actual Solana wallet integration
  // For now, providing the basic structure that matches existing patterns
  
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

  const handleConnect = async () => {
    // Placeholder for wallet connection logic
    // This will be implemented with actual Solana wallet adapter
    console.log('Wallet connection initiated');
    setIsConnected(true);
    setWalletAddress('Example...Address');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
  };

  if (isConnected && walletAddress) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'inherit' }}>
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </Typography>
        <Button
          variant={variant}
          size={size}
          onClick={handleDisconnect}
          sx={{ color: 'inherit', borderColor: 'inherit' }}
        >
          Disconnect
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={<AccountBalanceWallet />}
      onClick={handleConnect}
      sx={{ color: 'inherit', borderColor: 'inherit' }}
    >
      Connect Wallet
    </Button>
  );
}

export default WalletConnect; 