'use client';

import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { WalletConnect } from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout = React.memo(function Layout({ children, title = 'Solana Pump Platform' }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Trending', href: '/trending' },
    { label: 'Create Token', href: '/create-token' },
    { label: 'Liquidity', href: '/liquidity' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }} role="banner">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
            aria-label="Site title"
          >
            {title}
          </Typography>
          
          {isMobile ? (
            <>
              <WalletConnect />
              <IconButton
                color="inherit"
                aria-label="Open navigation menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                aria-label="Navigation menu"
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.href} 
                    onClick={handleMobileMenuClose}
                    component={Link}
                    href={item.href}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
              {navigationItems.map((item) => (
                <Button 
                  key={item.href}
                  color="inherit" 
                  component={Link} 
                  href={item.href}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Button>
              ))}
              <WalletConnect />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 }
        }}
        component="main"
        role="main"
        aria-label="Main content"
      >
        {children}
      </Container>
      
      <Box 
        component="footer" 
        role="contentinfo"
        sx={{ 
          backgroundColor: '#f5f5f5', 
          py: { xs: 1.5, sm: 2 }, 
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Solana Pump Platform - Personal Development Environment
        </Typography>
      </Box>
    </Box>
  );
});

export default Layout; 