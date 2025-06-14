'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  variant?: 'default' | 'overlay' | 'inline';
}

export const LoadingSpinner = React.memo(function LoadingSpinner({ 
  message = 'Loading...', 
  size = 40, 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(variant === 'overlay' && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
        ...(variant === 'inline' && {
          py: 2,
        }),
        ...(variant === 'default' && {
          minHeight: '200px',
        }),
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
});

export default LoadingSpinner; 