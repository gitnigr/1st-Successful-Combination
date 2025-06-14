'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface TokenData {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  marketCap?: number;
  price?: number;
  change24h?: number;
  volume24h?: number;
  createdAt?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

interface TokenCardProps {
  token: TokenData;
  onClick?: (token: TokenData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TokenCard = React.memo(function TokenCard({ token, onClick, variant = 'default' }: TokenCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(token);
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
    return `$${marketCap.toFixed(2)}`;
  };

  const isPositiveChange = (token.change24h || 0) >= 0;

  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3
        } : {}
      }}
      onClick={handleCardClick}
    >
      {token.image && (
        <CardMedia
          component="img"
          height="120"
          image={token.image}
          alt={token.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" component="div" noWrap>
              {token.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${token.symbol}
            </Typography>
          </Box>
          
          {token.change24h !== undefined && (
            <Chip
              icon={isPositiveChange ? <TrendingUp /> : <TrendingDown />}
              label={`${isPositiveChange ? '+' : ''}${token.change24h.toFixed(2)}%`}
              color={isPositiveChange ? 'success' : 'error'}
              size="small"
            />
          )}
        </Box>

        {token.description && variant !== 'compact' && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {token.description.length > 100 
              ? `${token.description.substring(0, 100)}...` 
              : token.description
            }
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {token.price && (
              <Typography variant="body2" fontWeight="bold">
                {formatPrice(token.price)}
              </Typography>
            )}
            {token.marketCap && (
              <Typography variant="caption" color="text.secondary">
                MC: {formatMarketCap(token.marketCap)}
              </Typography>
            )}
          </Box>
          
          {variant === 'detailed' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {token.website && (
                <Button size="small" href={token.website} target="_blank">
                  Website
                </Button>
              )}
              {token.twitter && (
                <Button size="small" href={token.twitter} target="_blank">
                  Twitter
                </Button>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

export default TokenCard; 