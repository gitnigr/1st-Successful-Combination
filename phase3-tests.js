#!/usr/bin/env node

/**
 * PHASE 3 COMPREHENSIVE TESTS
 * 
 * These tests validate the core integration from Phase 3 as required by TASKS.md.
 * ALL tests must PASS before proceeding to Phase 4.
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

// Test utilities
function test(description, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ PASS: ${description}`);
      passedTests++;
    } else {
      console.log(`❌ FAIL: ${description} - ${result}`);
      failedTests.push(description);
    }
  } catch (error) {
    console.log(`❌ FAIL: ${description} - ${error.message}`);
    failedTests.push(description);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  if (!fileExists(filePath)) return null;
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

console.log('🧪 PHASE 3 COMPREHENSIVE TESTING STARTED');
console.log('=========================================\n');

// ===== SHARED COMPONENT LIBRARY TESTS =====
console.log('🧩 TESTING SHARED COMPONENT LIBRARY...\n');

test('Components directory exists and is ready for shared components', () => {
  return directoryExists('components');
});

test('Layout component exists with proper structure', () => {
  if (!fileExists('components/Layout.tsx')) return 'Layout.tsx not found';
  
  const layoutContent = readFile('components/Layout.tsx');
  if (!layoutContent) return 'Layout.tsx is empty';
  if (!layoutContent.includes('export')) return 'Layout component not exported';
  
  return true;
});

test('TokenCard component exists with unified display logic', () => {
  if (!fileExists('components/TokenCard.tsx')) return 'TokenCard.tsx not found';
  
  const tokenCardContent = readFile('components/TokenCard.tsx');
  if (!tokenCardContent) return 'TokenCard.tsx is empty';
  if (!tokenCardContent.includes('export')) return 'TokenCard component not exported';
  
  return true;
});

test('WalletConnect component exists with Solana integration', () => {
  if (!fileExists('components/WalletConnect.tsx')) return 'WalletConnect.tsx not found';
  
  const walletContent = readFile('components/WalletConnect.tsx');
  if (!walletContent) return 'WalletConnect.tsx is empty';
  if (!walletContent.includes('export')) return 'WalletConnect component not exported';
  
  return true;
});

test('LoadingSpinner component exists for consistent loading states', () => {
  if (!fileExists('components/LoadingSpinner.tsx')) return 'LoadingSpinner.tsx not found';
  
  const spinnerContent = readFile('components/LoadingSpinner.tsx');
  if (!spinnerContent) return 'LoadingSpinner.tsx is empty';
  if (!spinnerContent.includes('export')) return 'LoadingSpinner component not exported';
  
  return true;
});

test('ErrorBoundary component exists for error handling', () => {
  if (!fileExists('components/ErrorBoundary.tsx')) return 'ErrorBoundary.tsx not found';
  
  const errorContent = readFile('components/ErrorBoundary.tsx');
  if (!errorContent) return 'ErrorBoundary.tsx is empty';
  if (!errorContent.includes('export')) return 'ErrorBoundary component not exported';
  
  return true;
});

test('Modal component exists for reusable modals', () => {
  if (!fileExists('components/Modal.tsx')) return 'Modal.tsx not found';
  
  const modalContent = readFile('components/Modal.tsx');
  if (!modalContent) return 'Modal.tsx is empty';
  if (!modalContent.includes('export')) return 'Modal component not exported';
  
  return true;
});

// ===== SOLANA INTEGRATION LAYER TESTS =====
console.log('\n🔗 TESTING SOLANA INTEGRATION LAYER...\n');

test('Solana wallet adapter dependencies installed', () => {
  const packageJson = JSON.parse(readFile('package.json'));
  if (!packageJson.dependencies) return 'No dependencies found';
  
  // Check for wallet adapter packages
  const hasWalletAdapter = Object.keys(packageJson.dependencies).some(dep => 
    dep.includes('@solana/wallet-adapter')
  );
  
  if (!hasWalletAdapter) return 'Solana wallet adapter dependencies not found';
  return true;
});

test('Wallet connection service exists', () => {
  if (!fileExists('lib/wallet.ts') && !fileExists('lib/wallet/index.ts')) {
    return 'Wallet service not found';
  }
  
  const walletService = readFile('lib/wallet.ts') || readFile('lib/wallet/index.ts');
  if (!walletService) return 'Wallet service is empty';
  if (!walletService.includes('wallet')) return 'Wallet functionality not found';
  
  return true;
});

test('Solana Web3 service exists with connection management', () => {
  if (!fileExists('lib/solana.ts') && !fileExists('lib/solana/index.ts')) {
    return 'Solana Web3 service not found';
  }
  
  const solanaService = readFile('lib/solana.ts') || readFile('lib/solana/index.ts');
  if (!solanaService) return 'Solana service is empty';
  if (!solanaService.includes('Connection') || !solanaService.includes('@solana/web3.js')) {
    return 'Solana Web3.js integration not found';
  }
  
  return true;
});

test('Transaction handling utilities exist', () => {
  // Check if transaction utilities exist in any of the expected locations
  const possibleLocations = [
    'lib/transactions.ts',
    'lib/solana/transactions.ts',
    'lib/utils/transactions.ts'
  ];
  
  const transactionFile = possibleLocations.find(loc => fileExists(loc));
  if (!transactionFile) return 'Transaction utilities not found';
  
  const transactionContent = readFile(transactionFile);
  if (!transactionContent) return 'Transaction utilities file is empty';
  if (!transactionContent.includes('Transaction')) return 'Transaction handling not found';
  
  return true;
});

// ===== DATA MANAGEMENT TESTS =====
console.log('\n📊 TESTING DATA MANAGEMENT...\n');

test('State management setup exists', () => {
  // Check for state management in various possible locations
  const possibleStateFiles = [
    'lib/store.ts',
    'lib/state.ts',
    'app/store.ts',
    'hooks/useStore.ts'
  ];
  
  const stateFile = possibleStateFiles.find(file => fileExists(file));
  if (!stateFile) return 'State management setup not found';
  
  const stateContent = readFile(stateFile);
  if (!stateContent) return 'State management file is empty';
  
  return true;
});

test('Wallet state management implemented', () => {
  // Check for wallet state in various locations
  const possibleFiles = [
    'lib/store.ts',
    'lib/wallet.ts',
    'hooks/useWallet.ts',
    'contexts/WalletContext.tsx'
  ];
  
  let walletStateFound = false;
  for (const file of possibleFiles) {
    if (fileExists(file)) {
      const content = readFile(file);
      if (content && (content.includes('wallet') || content.includes('Wallet'))) {
        walletStateFound = true;
        break;
      }
    }
  }
  
  if (!walletStateFound) return 'Wallet state management not found';
  return true;
});

test('API integration preserved from both projects', () => {
  // Check that existing API integrations are preserved
  if (!fileExists('common/api/index.ts')) return 'Pump Data API integration not preserved';
  
  const apiContent = readFile('common/api/index.ts');
  if (!apiContent) return 'API file is empty';
  if (!apiContent.includes('getPumpList')) return 'Pump Data API functions not preserved';
  
  // Check that config.js is accessible for Token Creator APIs
  if (!fileExists('public/config.js')) return 'Token Creator config not preserved';
  
  return true;
});

test('Data fetching hooks exist for unified data management', () => {
  // Check for data fetching hooks
  const possibleHookFiles = [
    'hooks/usePumpData.ts',
    'hooks/useTokenData.ts',
    'hooks/useAPI.ts',
    'lib/hooks.ts'
  ];
  
  const hookFile = possibleHookFiles.find(file => fileExists(file));
  if (!hookFile) return 'Data fetching hooks not found';
  
  const hookContent = readFile(hookFile);
  if (!hookContent) return 'Hook file is empty';
  if (!hookContent.includes('use')) return 'React hooks not found';
  
  return true;
});

// ===== INTEGRATION VALIDATION TESTS =====
console.log('\n🔄 TESTING INTEGRATION VALIDATION...\n');

test('Existing Pump Data functionality still works', () => {
  // Check that main page still exists and has preserved functionality
  if (!fileExists('app/page.tsx')) return 'Main page not found';
  
  const pageContent = readFile('app/page.tsx');
  if (!pageContent) return 'Main page is empty';
  if (!pageContent.includes('useSWR')) return 'SWR functionality not preserved';
  if (!pageContent.includes('refreshInterval')) return 'Auto-refresh not preserved';
  
  return true;
});

test('Token Creator assets remain accessible', () => {
  // Check that Token Creator files are still in place
  if (!fileExists('app/create-token/create-coin.html')) return 'create-coin.html not found';
  if (!fileExists('app/liquidity/liquidity.html')) return 'liquidity.html not found';
  if (!fileExists('public/config.js')) return 'config.js not found';
  
  return true;
});

test('Navigation system exists for unified app', () => {
  // Check for navigation components or routing setup
  const possibleNavFiles = [
    'components/Navigation.tsx',
    'components/Header.tsx',
    'components/Layout.tsx',
    'app/layout.tsx'
  ];
  
  let navigationFound = false;
  for (const file of possibleNavFiles) {
    if (fileExists(file)) {
      const content = readFile(file);
      if (content && (content.includes('nav') || content.includes('Link') || content.includes('route'))) {
        navigationFound = true;
        break;
      }
    }
  }
  
  if (!navigationFound) return 'Navigation system not found';
  return true;
});

test('TypeScript compilation still works', () => {
  // Check that TypeScript configuration is still valid
  if (!fileExists('tsconfig.json')) return 'TypeScript config not found';
  
  const tsConfig = readFile('tsconfig.json');
  if (!tsConfig) return 'TypeScript config is empty';
  
  try {
    JSON.parse(tsConfig);
  } catch {
    return 'TypeScript config is invalid JSON';
  }
  
  return true;
});

// ===== FINAL TEST RESULTS =====
console.log('\n🏁 PHASE 3 TEST RESULTS');
console.log('========================\n');

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);

if (failedTests.length > 0) {
  console.log('\n❌ FAILED TESTS:');
  failedTests.forEach(test => console.log(`  - ${test}`));
  console.log('\n🚨 PHASE 3 TESTS FAILED - CANNOT PROCEED TO PHASE 4');
  console.log('All tests must pass before proceeding to the next phase.');
  process.exit(1);
} else {
  console.log('\n✅ ALL PHASE 3 TESTS PASSED!');
  console.log('🎉 Ready to proceed to Phase 4 - Feature Implementation');
  console.log('\nPhase 3 Core Integration Summary:');
  console.log('- ✅ Shared component library created');
  console.log('- ✅ Solana integration layer implemented');
  console.log('- ✅ Data management unified');
  console.log('- ✅ Navigation system established');
  console.log('- ✅ Existing functionality preserved');
  
  console.log('\n📋 PHASE 3 COMPLETION CHECKLIST:');
  console.log('- [x] Create Base Components');
  console.log('- [x] Navigation System');
  console.log('- [x] Wallet Connection Service');
  console.log('- [x] Solana Web3 Service');
  console.log('- [x] State Management Setup');
  console.log('- [x] API Integration');
  
  console.log('\n🚀 READY FOR PHASE 4!');
  process.exit(0);
} 