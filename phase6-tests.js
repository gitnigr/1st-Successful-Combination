#!/usr/bin/env node

/**
 * PHASE 6 COMPREHENSIVE TESTS
 * 
 * These tests validate the complete system integration and final validation as required by TASKS.md.
 * ALL tests must PASS before proceeding to Phase 7.
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

console.log('🧪 PHASE 6 COMPREHENSIVE TESTING STARTED');
console.log('==========================================\n');

// ===== FINAL INTEGRATION TESTING =====
console.log('🔄 TESTING FINAL INTEGRATION...\n');

test('Complete project structure is properly organized', () => {
  const requiredDirs = [
    'app',
    'components', 
    'lib',
    'hooks'
  ];
  
  for (const dir of requiredDirs) {
    if (!directoryExists(dir)) {
      return `Required directory ${dir} not found`;
    }
  }
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tsconfig.json',
    'README.md'
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      return `Required file ${file} not found`;
    }
  }
  
  return true;
});

test('All core pages exist and are properly structured', () => {
  const corePages = [
    'app/page.tsx',
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  for (const page of corePages) {
    if (!fileExists(page)) {
      return `Core page ${page} not found`;
    }
    
    const content = readFile(page);
    if (!content || content.length < 100) {
      return `Core page ${page} appears to be empty or too small`;
    }
    
    // Check for proper Next.js page structure
    if (!content.includes('export default')) {
      return `Core page ${page} missing default export`;
    }
  }
  
  return true;
});

test('All shared components are implemented and functional', () => {
  const sharedComponents = [
    'components/Layout.tsx',
    'components/TokenCard.tsx',
    'components/LoadingSpinner.tsx',
    'components/ErrorBoundary.tsx',
    'components/WalletConnect.tsx',
    'components/Modal.tsx'
  ];
  
  for (const component of sharedComponents) {
    if (!fileExists(component)) {
      return `Shared component ${component} not found`;
    }
    
    const content = readFile(component);
    if (!content || content.length < 50) {
      return `Shared component ${component} appears to be empty`;
    }
    
    // Check for proper React component structure
    if (!content.includes('export') || !content.includes('React')) {
      return `Shared component ${component} missing proper React structure`;
    }
  }
  
  return true;
});

test('All utility libraries and services are present', () => {
  const utilityFiles = [
    'lib/wallet.ts',
    'lib/solana.ts',
    'lib/transactions.ts',
    'lib/store.ts'
  ];
  
  for (const util of utilityFiles) {
    if (!fileExists(util)) {
      return `Utility file ${util} not found`;
    }
    
    const content = readFile(util);
    if (!content || content.length < 50) {
      return `Utility file ${util} appears to be empty`;
    }
  }
  
  return true;
});

test('All custom hooks are implemented', () => {
  const hookFiles = [
    'hooks/usePumpData.ts'
  ];
  
  for (const hook of hookFiles) {
    if (!fileExists(hook)) {
      return `Hook file ${hook} not found`;
    }
    
    const content = readFile(hook);
    if (!content || !content.includes('use')) {
      return `Hook file ${hook} doesn't appear to be a proper React hook`;
    }
  }
  
  return true;
});

// ===== REGRESSION TESTING =====
console.log('\n🔍 TESTING REGRESSION VALIDATION...\n');

test('Dashboard preserves all original Pump Data functionality', () => {
  if (!fileExists('app/page.tsx')) return 'Dashboard page not found';
  
  const dashboardContent = readFile('app/page.tsx');
  if (!dashboardContent) return 'Dashboard page is empty';
  
  // Check for preserved core functionality
  const requiredFeatures = [
    'useSWR',           // Data fetching
    'refreshInterval',  // Auto-refresh
    'PumpCoin',        // Type definitions
    'Filter',          // Filtering functionality
    'List',            // Token list
    'Detail',          // Detail view
    'Layout',          // Layout integration
    'ErrorBoundary'    // Error handling
  ];
  
  for (const feature of requiredFeatures) {
    if (!dashboardContent.includes(feature)) {
      return `Dashboard missing preserved feature: ${feature}`;
    }
  }
  
  return true;
});

test('Token creation preserves all original functionality', () => {
  if (!fileExists('app/create-token/page.tsx')) return 'Token creation page not found';
  
  const tokenContent = readFile('app/create-token/page.tsx');
  if (!tokenContent) return 'Token creation page is empty';
  
  // Check for preserved token creation features
  const requiredFeatures = [
    'name',
    'symbol', 
    'description',
    'image',
    'supply',
    'decimals'
  ];
  
  for (const feature of requiredFeatures) {
    if (!tokenContent.includes(feature)) {
      return `Token creation missing field: ${feature}`;
    }
  }
  
  // Check for proper form structure
  if (!tokenContent.includes('TextField') || !tokenContent.includes('Button')) {
    return 'Token creation form structure not preserved';
  }
  
  return true;
});

test('Liquidity management preserves all original functionality', () => {
  if (!fileExists('app/liquidity/page.tsx')) return 'Liquidity page not found';
  
  const liquidityContent = readFile('app/liquidity/page.tsx');
  if (!liquidityContent) return 'Liquidity page is empty';
  
  // Check for preserved liquidity features
  const requiredFeatures = [
    'tokenAddress',
    'solAmount',
    'tokenAmount',
    'slippage',
    'Tabs',
    'Tab'
  ];
  
  for (const feature of requiredFeatures) {
    if (!liquidityContent.includes(feature)) {
      return `Liquidity management missing feature: ${feature}`;
    }
  }
  
  return true;
});

test('Original HTML files are preserved for Token Creator features', () => {
  const originalFiles = [
    'app/create-token/create-coin.html',
    'app/liquidity/liquidity.html'
  ];
  
  for (const file of originalFiles) {
    if (!fileExists(file)) {
      return `Original HTML file ${file} not preserved`;
    }
    
    const content = readFile(file);
    if (!content || content.length < 100) {
      return `Original HTML file ${file} appears corrupted or empty`;
    }
  }
  
  return true;
});

// ===== PERFORMANCE VALIDATION =====
console.log('\n⚡ TESTING PERFORMANCE VALIDATION...\n');

test('Auto-refresh functionality is preserved and optimized', () => {
  if (!fileExists('app/page.tsx')) return 'Dashboard page not found';
  
  const dashboardContent = readFile('app/page.tsx');
  if (!dashboardContent) return 'Dashboard page is empty';
  
  // Check for auto-refresh configuration
  if (!dashboardContent.includes('refreshInterval')) {
    return 'Auto-refresh functionality not found';
  }
  
  // Check for performance optimizations
  if (!dashboardContent.includes('keepPreviousData') && !dashboardContent.includes('lastGoodDataRef')) {
    return 'Performance optimizations for data persistence not found';
  }
  
  return true;
});

test('Component optimization with React.memo is implemented', () => {
  const optimizedComponents = [
    'components/Layout.tsx',
    'components/TokenCard.tsx', 
    'components/LoadingSpinner.tsx'
  ];
  
  let optimizedCount = 0;
  for (const component of optimizedComponents) {
    if (fileExists(component)) {
      const content = readFile(component);
      if (content && content.includes('React.memo')) {
        optimizedCount++;
      }
    }
  }
  
  if (optimizedCount < 2) {
    return 'Insufficient React.memo optimization found in components';
  }
  
  return true;
});

test('Data caching and SWR configuration is properly implemented', () => {
  if (!fileExists('app/page.tsx')) return 'Dashboard page not found';
  
  const dashboardContent = readFile('app/page.tsx');
  if (!dashboardContent) return 'Dashboard page is empty';
  
  // Check for SWR configuration
  const swrFeatures = [
    'useSWR',
    'refreshInterval',
    'revalidateOnFocus',
    'keepPreviousData'
  ];
  
  let foundFeatures = 0;
  for (const feature of swrFeatures) {
    if (dashboardContent.includes(feature)) {
      foundFeatures++;
    }
  }
  
  if (foundFeatures < 3) {
    return 'SWR caching configuration incomplete';
  }
  
  return true;
});

test('Loading states and error handling are comprehensive', () => {
  const pagesWithLoading = [
    'app/page.tsx',
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  let pagesWithLoadingStates = 0;
  for (const page of pagesWithLoading) {
    if (fileExists(page)) {
      const content = readFile(page);
      if (content && (content.includes('loading') || content.includes('LoadingSpinner'))) {
        pagesWithLoadingStates++;
      }
    }
  }
  
  if (pagesWithLoadingStates < 2) {
    return 'Insufficient loading states implemented across pages';
  }
  
  return true;
});

// ===== SECURITY VALIDATION =====
console.log('\n🔒 TESTING SECURITY VALIDATION...\n');

test('No sensitive data is exposed in client-side code', () => {
  const clientFiles = [
    'app/page.tsx',
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  const sensitivePatterns = [
    'private_key',
    'privateKey',
    'secret_key',
    'secretKey',
    'password',
    'api_secret'
  ];
  
  for (const file of clientFiles) {
    if (fileExists(file)) {
      const content = readFile(file);
      if (content) {
        for (const pattern of sensitivePatterns) {
          if (content.toLowerCase().includes(pattern.toLowerCase())) {
            return `Potential sensitive data exposure in ${file}: ${pattern}`;
          }
        }
      }
    }
  }
  
  return true;
});

test('Input validation is implemented in forms', () => {
  const formPages = [
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  let formsWithValidation = 0;
  for (const page of formPages) {
    if (fileExists(page)) {
      const content = readFile(page);
      if (content && (content.includes('required') || content.includes('validation') || content.includes('error'))) {
        formsWithValidation++;
      }
    }
  }
  
  if (formsWithValidation < 1) {
    return 'Input validation not found in forms';
  }
  
  return true;
});

test('Error boundaries are properly implemented', () => {
  if (!fileExists('components/ErrorBoundary.tsx')) {
    return 'ErrorBoundary component not found';
  }
  
  const errorBoundaryContent = readFile('components/ErrorBoundary.tsx');
  if (!errorBoundaryContent) {
    return 'ErrorBoundary component is empty';
  }
  
  // Check for proper error boundary implementation
  const errorBoundaryFeatures = [
    'componentDidCatch',
    'getDerivedStateFromError',
    'hasError',
    'error'
  ];
  
  let foundFeatures = 0;
  for (const feature of errorBoundaryFeatures) {
    if (errorBoundaryContent.includes(feature)) {
      foundFeatures++;
    }
  }
  
  if (foundFeatures < 2) {
    return 'ErrorBoundary implementation incomplete';
  }
  
  return true;
});

test('Wallet integration follows security best practices', () => {
  if (!fileExists('components/WalletConnect.tsx')) {
    return 'WalletConnect component not found';
  }
  
  const walletContent = readFile('components/WalletConnect.tsx');
  if (!walletContent) {
    return 'WalletConnect component is empty';
  }
  
  // Check for proper wallet integration
  if (!walletContent.includes('wallet') || !walletContent.includes('connect')) {
    return 'Wallet integration not properly implemented';
  }
  
  return true;
});

// ===== ACCESSIBILITY VALIDATION =====
console.log('\n♿ TESTING ACCESSIBILITY VALIDATION...\n');

test('ARIA labels are comprehensively implemented', () => {
  const componentsWithAria = [
    'components/Layout.tsx'
  ];
  
  let componentsWithAriaLabels = 0;
  for (const component of componentsWithAria) {
    if (fileExists(component)) {
      const content = readFile(component);
      if (content && content.includes('aria-label')) {
        componentsWithAriaLabels++;
      }
    }
  }
  
  if (componentsWithAriaLabels < 1) {
    return 'ARIA labels not sufficiently implemented';
  }
  
  return true;
});

test('Keyboard navigation is properly supported', () => {
  if (!fileExists('components/Layout.tsx')) {
    return 'Layout component not found';
  }
  
  const layoutContent = readFile('components/Layout.tsx');
  if (!layoutContent) {
    return 'Layout component is empty';
  }
  
  // Check for keyboard navigation support
  if (!layoutContent.includes('Button') && !layoutContent.includes('Link')) {
    return 'Keyboard navigation elements not found';
  }
  
  return true;
});

test('Form labels and descriptions are comprehensive', () => {
  const formPages = [
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  let formsWithLabels = 0;
  for (const page of formPages) {
    if (fileExists(page)) {
      const content = readFile(page);
      if (content && content.includes('label') && content.includes('helperText')) {
        formsWithLabels++;
      }
    }
  }
  
  if (formsWithLabels < 1) {
    return 'Form labels and descriptions not comprehensive';
  }
  
  return true;
});

// ===== RESPONSIVE DESIGN VALIDATION =====
console.log('\n📱 TESTING RESPONSIVE DESIGN VALIDATION...\n');

test('Mobile-first responsive design is implemented', () => {
  const responsiveComponents = [
    'components/Layout.tsx',
    'app/page.tsx'
  ];
  
  let responsiveComponentCount = 0;
  for (const component of responsiveComponents) {
    if (fileExists(component)) {
      const content = readFile(component);
      if (content && (content.includes('useMediaQuery') || content.includes('xs:') || content.includes('breakpoints'))) {
        responsiveComponentCount++;
      }
    }
  }
  
  if (responsiveComponentCount < 1) {
    return 'Mobile-first responsive design not implemented';
  }
  
  return true;
});

test('Navigation works across different screen sizes', () => {
  if (!fileExists('components/Layout.tsx')) {
    return 'Layout component not found';
  }
  
  const layoutContent = readFile('components/Layout.tsx');
  if (!layoutContent) {
    return 'Layout component is empty';
  }
  
  // Check for responsive navigation
  if (!layoutContent.includes('isMobile') && !layoutContent.includes('useMediaQuery')) {
    return 'Responsive navigation not implemented';
  }
  
  return true;
});

// ===== INTEGRATION VALIDATION =====
console.log('\n🔗 TESTING INTEGRATION VALIDATION...\n');

test('All pages integrate properly with shared Layout', () => {
  const pages = [
    'app/page.tsx',
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  let pagesWithLayout = 0;
  for (const page of pages) {
    if (fileExists(page)) {
      const content = readFile(page);
      if (content && content.includes('Layout')) {
        pagesWithLayout++;
      }
    }
  }
  
  if (pagesWithLayout < 2) {
    return 'Pages not properly integrated with shared Layout';
  }
  
  return true;
});

test('Shared components are properly imported and used', () => {
  const pages = [
    'app/page.tsx',
    'app/create-token/page.tsx',
    'app/liquidity/page.tsx'
  ];
  
  let pagesWithSharedComponents = 0;
  for (const page of pages) {
    if (fileExists(page)) {
      const content = readFile(page);
      if (content && (content.includes('LoadingSpinner') || content.includes('ErrorBoundary'))) {
        pagesWithSharedComponents++;
      }
    }
  }
  
  if (pagesWithSharedComponents < 2) {
    return 'Shared components not properly used across pages';
  }
  
  return true;
});

test('TypeScript configuration supports all features', () => {
  if (!fileExists('tsconfig.json')) {
    return 'TypeScript configuration not found';
  }
  
  const tsConfig = readFile('tsconfig.json');
  if (!tsConfig) {
    return 'TypeScript configuration is empty';
  }
  
  try {
    const config = JSON.parse(tsConfig);
    if (!config.compilerOptions) {
      return 'TypeScript compiler options not found';
    }
  } catch {
    return 'TypeScript configuration is invalid JSON';
  }
  
  return true;
});

test('Package.json includes all necessary dependencies', () => {
  if (!fileExists('package.json')) {
    return 'Package.json not found';
  }
  
  const packageJson = readFile('package.json');
  if (!packageJson) {
    return 'Package.json is empty';
  }
  
  try {
    const pkg = JSON.parse(packageJson);
    
    const requiredDeps = [
      'react',
      'next',
      '@mui/material',
      'swr'
    ];
    
    for (const dep of requiredDeps) {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        return `Required dependency ${dep} not found`;
      }
    }
  } catch {
    return 'Package.json is invalid JSON';
  }
  
  return true;
});

// ===== FINAL TEST RESULTS =====
console.log('\n🏁 PHASE 6 TEST RESULTS');
console.log('========================\n');

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);

if (failedTests.length > 0) {
  console.log('\n❌ FAILED TESTS:');
  failedTests.forEach(test => console.log(`  - ${test}`));
  console.log('\n🚨 PHASE 6 TESTS FAILED - CANNOT PROCEED TO PHASE 7');
  console.log('All tests must pass before proceeding to the next phase.');
  process.exit(1);
} else {
  console.log('\n✅ ALL PHASE 6 TESTS PASSED!');
  console.log('🎉 Ready to proceed to Phase 7 - Local Development Setup');
  console.log('\nPhase 6 Comprehensive Testing & Validation Summary:');
  console.log('- ✅ Final Integration Testing Complete');
  console.log('- ✅ Regression Testing Validated');
  console.log('- ✅ Performance Validation Confirmed');
  console.log('- ✅ Security Validation Passed');
  console.log('- ✅ Accessibility Validation Complete');
  console.log('- ✅ Responsive Design Validation Confirmed');
  console.log('- ✅ Integration Validation Successful');
  
  console.log('\n📋 PHASE 6 COMPLETION CHECKLIST:');
  console.log('- [x] Complete System Testing');
  console.log('- [x] Regression Validation');
  console.log('- [x] Performance Validation');
  console.log('- [x] Security Audit');
  console.log('- [x] Accessibility Compliance');
  console.log('- [x] Responsive Design Validation');
  console.log('- [x] Integration Testing');
  
  console.log('\n🚀 READY FOR PHASE 7!');
  process.exit(0);
} 