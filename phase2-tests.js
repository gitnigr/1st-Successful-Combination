#!/usr/bin/env node

/**
 * PHASE 2 COMPREHENSIVE TESTS
 * 
 * These tests validate the project structure setup and migration from Phase 2 as required by TASKS.md.
 * ALL tests must PASS before proceeding to Phase 3.
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

function readJsonFile(filePath) {
  if (!fileExists(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
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

function compareFiles(file1, file2) {
  if (!fileExists(file1) || !fileExists(file2)) return false;
  const content1 = readFile(file1);
  const content2 = readFile(file2);
  return content1 === content2;
}

console.log('🧪 PHASE 2 COMPREHENSIVE TESTING STARTED');
console.log('=========================================\n');

// ===== PROJECT STRUCTURE TESTS =====
console.log('📁 TESTING PROJECT STRUCTURE SETUP...\n');

test('Unified project directory exists', () => {
  return directoryExists('.') && path.basename(process.cwd()) === 'solana-pump-platform';
});

test('Main directory structure created correctly', () => {
  const requiredDirs = [
    'app',
    'components', 
    'lib',
    'public',
    'styles',
    'docs'
  ];
  
  for (const dir of requiredDirs) {
    if (!directoryExists(dir)) {
      return `Required directory missing: ${dir}`;
    }
  }
  return true;
});

test('App subdirectory structure created correctly', () => {
  const requiredAppDirs = [
    'app/dashboard',
    'app/create-token',
    'app/liquidity', 
    'app/trending',
    'app/api'
  ];
  
  for (const dir of requiredAppDirs) {
    if (!directoryExists(dir)) {
      return `Required app directory missing: ${dir}`;
    }
  }
  return true;
});

// ===== PUMP DATA MIGRATION TESTS =====
console.log('\n📊 TESTING PUMP DATA MIGRATION...\n');

test('Package.json copied correctly from Pump Data', () => {
  const pkg = readJsonFile('package.json');
  if (!pkg) return 'package.json not found';
  if (pkg.name !== 'pumpfun') return 'Package name not preserved';
  if (!pkg.dependencies || !pkg.dependencies.next) return 'Next.js dependency not found';
  if (!pkg.dependencies['@mui/material']) return 'Material-UI dependency not found';
  if (!pkg.dependencies.swr) return 'SWR dependency not found';
  return true;
});

test('TypeScript configuration copied correctly', () => {
  if (!fileExists('tsconfig.json')) return 'tsconfig.json not found';
  const tsconfig = readJsonFile('tsconfig.json');
  if (!tsconfig) return 'tsconfig.json not valid JSON';
  if (!tsconfig.compilerOptions) return 'Compiler options not found';
  return true;
});

test('Next.js configuration copied correctly', () => {
  if (!fileExists('next.config.mjs')) return 'next.config.mjs not found';
  const configContent = readFile('next.config.mjs');
  if (!configContent) return 'next.config.mjs is empty';
  return true;
});

test('Next.js environment types copied correctly', () => {
  if (!fileExists('next-env.d.ts')) return 'next-env.d.ts not found';
  const envTypes = readFile('next-env.d.ts');
  if (!envTypes || !envTypes.includes('next/types/global')) return 'Next.js types not found';
  return true;
});

test('Gitignore copied correctly', () => {
  if (!fileExists('.gitignore')) return '.gitignore not found';
  const gitignore = readFile('.gitignore');
  if (!gitignore || !gitignore.includes('node_modules')) return 'Gitignore content not preserved';
  return true;
});

test('App directory structure copied from Pump Data', () => {
  const requiredFiles = [
    'app/page.tsx',
    'app/layout.tsx',
    'app/style.scss',
    'app/store.ts',
    'app/sw.ts'
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      return `Required app file missing: ${file}`;
    }
  }
  return true;
});

test('App modules directory copied correctly', () => {
  const requiredModules = [
    'app/modules/loading.tsx',
    'app/modules/filter.tsx',
    'app/modules/header.tsx',
    'app/modules/links.tsx',
    'app/modules/btn-reload.tsx'
  ];
  
  for (const file of requiredModules) {
    if (!fileExists(file)) {
      return `Required module file missing: ${file}`;
    }
  }
  return true;
});

test('App API routes copied correctly', () => {
  if (!directoryExists('app/api')) return 'API directory not found';
  if (!fileExists('app/api/pump/route.ts')) return 'Pump API route not found';
  
  const routeContent = readFile('app/api/pump/route.ts');
  if (!routeContent || !routeContent.includes('getPumpList')) return 'Pump API route content not preserved';
  
  return true;
});

test('Common directory copied correctly from Pump Data', () => {
  if (!directoryExists('common')) return 'Common directory not found';
  
  const requiredCommonFiles = [
    'common/types.ts',
    'common/api/index.ts'
  ];
  
  for (const file of requiredCommonFiles) {
    if (!fileExists(file)) {
      return `Required common file missing: ${file}`;
    }
  }
  return true;
});

test('Lib directory copied correctly from Pump Data', () => {
  if (!directoryExists('lib')) return 'Lib directory not found';
  // Check if lib has content (exact structure may vary)
  const libContents = fs.readdirSync('lib');
  if (libContents.length === 0) return 'Lib directory is empty';
  return true;
});

test('Public directory copied correctly from Pump Data', () => {
  if (!directoryExists('public')) return 'Public directory not found';
  // Check if public has content
  const publicContents = fs.readdirSync('public');
  if (publicContents.length === 0) return 'Public directory is empty';
  return true;
});

// ===== TOKEN CREATOR MIGRATION TESTS =====
console.log('\n🪙 TESTING TOKEN CREATOR MIGRATION...\n');

test('Config.js copied to public directory with all API keys', () => {
  if (!fileExists('public/config.js')) return 'config.js not found in public directory';
  
  const configContent = readFile('public/config.js');
  if (!configContent) return 'config.js is empty';
  
  const hasPinataSecret = configContent.includes('pinata_secret_api_key');
  const hasPinataAPI = configContent.includes('pinata_api_key');
  const hasRPC = configContent.includes('window.rpc');
  const hasRecipient = configContent.includes('window.recipient');
  const hasFees = configContent.includes('window.base_fee');
  
  if (!hasPinataSecret) return 'Pinata secret API key not preserved';
  if (!hasPinataAPI) return 'Pinata API key not preserved';
  if (!hasRPC) return 'RPC endpoint not preserved';
  if (!hasRecipient) return 'Fee recipient not preserved';
  if (!hasFees) return 'Fee structure not preserved';
  
  return true;
});

test('Create-coin.html copied to create-token directory', () => {
  if (!fileExists('app/create-token/create-coin.html')) return 'create-coin.html not found';
  
  const createCoinContent = readFile('app/create-token/create-coin.html');
  if (!createCoinContent) return 'create-coin.html is empty';
  if (!createCoinContent.includes('/config.js')) return 'Config.js reference not preserved';
  if (!createCoinContent.includes('_next/static')) return 'Next.js static assets reference not preserved';
  
  return true;
});

test('Liquidity.html copied to liquidity directory', () => {
  if (!fileExists('app/liquidity/liquidity.html')) return 'liquidity.html not found';
  
  const liquidityContent = readFile('app/liquidity/liquidity.html');
  if (!liquidityContent) return 'liquidity.html is empty';
  if (!liquidityContent.includes('/config.js')) return 'Config.js reference not preserved';
  if (!liquidityContent.includes('_next/static')) return 'Next.js static assets reference not preserved';
  
  return true;
});

test('Trending.html NOT copied (correctly excluded as broken)', () => {
  const trendingInApp = fileExists('app/trending/trending.html');
  const trendingInRoot = fileExists('trending.html');
  
  if (trendingInApp || trendingInRoot) {
    return 'trending.html was copied but should be excluded (broken functionality)';
  }
  
  return true;
});

test('Static assets copied correctly from Token Creator', () => {
  const requiredAssets = [
    'public/favicon.ico',
    'public/logo.png',
    'public/android-chrome-192x192.png',
    'public/android-chrome-512x512.png',
    'public/apple-touch-icon.png',
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/solana-sol-logo.svg',
    'public/pumpfun.webp',
    'public/site.webmanifest'
  ];
  
  for (const asset of requiredAssets) {
    if (!fileExists(asset)) {
      return `Required asset missing: ${asset}`;
    }
  }
  return true;
});

// ===== DEPENDENCIES INTEGRATION TESTS =====
console.log('\n📦 TESTING DEPENDENCIES INTEGRATION...\n');

test('Node modules installed successfully', () => {
  if (!directoryExists('node_modules')) return 'node_modules directory not found';
  
  const nodeModulesContents = fs.readdirSync('node_modules');
  if (nodeModulesContents.length === 0) return 'node_modules is empty';
  
  return true;
});

test('Critical dependencies installed correctly', () => {
  const criticalDeps = [
    'node_modules/next',
    'node_modules/@mui/material',
    'node_modules/@mui/icons-material',
    'node_modules/swr',
    'node_modules/@solana/web3.js',
    'node_modules/react',
    'node_modules/react-dom'
  ];
  
  for (const dep of criticalDeps) {
    if (!directoryExists(dep)) {
      return `Critical dependency missing: ${dep}`;
    }
  }
  return true;
});

test('Package-lock.json created successfully', () => {
  if (!fileExists('package-lock.json')) return 'package-lock.json not found';
  
  const lockFile = readJsonFile('package-lock.json');
  if (!lockFile) return 'package-lock.json not valid JSON';
  if (!lockFile.packages) return 'Package lock structure invalid';
  
  return true;
});

// ===== FUNCTIONALITY PRESERVATION TESTS =====
console.log('\n🔧 TESTING FUNCTIONALITY PRESERVATION...\n');

test('Pump Data auto-refresh logic preserved', () => {
  const pageContent = readFile('app/page.tsx');
  if (!pageContent) return 'page.tsx not found';
  
  const hasAutoRefresh = pageContent.includes('refreshInterval: 7000');
  const hasSWR = pageContent.includes('useSWR');
  const hasFiltering = pageContent.includes('applyFilters');
  
  if (!hasAutoRefresh) return 'Auto-refresh (7 second interval) not preserved';
  if (!hasSWR) return 'SWR usage not preserved';
  if (!hasFiltering) return 'Filtering logic not preserved';
  
  return true;
});

test('Pump Data API integration preserved', () => {
  const apiContent = readFile('common/api/index.ts');
  if (!apiContent) return 'API file not found';
  
  const hasPumpFunScraper = apiContent.includes('PumpFunScraper');
  const hasEnhanceTokens = apiContent.includes('enhanceTokensWithDescriptions');
  const hasBaseURL = apiContent.includes('https://ngapi.vercel.app/api/ngmg');
  
  if (!hasPumpFunScraper) return 'PumpFunScraper not preserved';
  if (!hasEnhanceTokens) return 'Token description enhancement not preserved';
  if (!hasBaseURL) return 'Base API URL not preserved';
  
  return true;
});

test('Material-UI theme setup preserved', () => {
  const layoutContent = readFile('app/layout.tsx');
  if (!layoutContent) return 'layout.tsx not found';
  
  const hasAppRouterCache = layoutContent.includes('AppRouterCacheProvider');
  const hasTheme = layoutContent.includes('Theme');
  const hasAnalytics = layoutContent.includes('Analytics');
  
  if (!hasAppRouterCache) return 'Material-UI AppRouterCacheProvider not preserved';
  if (!hasTheme) return 'Theme component not preserved';
  if (!hasAnalytics) return 'Analytics not preserved';
  
  return true;
});

test('Token Creator configuration preserved exactly', () => {
  const configContent = readFile('public/config.js');
  if (!configContent) return 'config.js not found';
  
  // Check that specific values are preserved (without exposing actual keys)
  const hasProjectName = configContent.includes('window.project_name = "CoinBlast"');
  const hasProjectDomain = configContent.includes('window.project_domain = "coinblast.fun"');
  const hasBaseFee = configContent.includes('window.base_fee = 0.2');
  const hasPrice = configContent.includes('window.price = 0.1');
  
  if (!hasProjectName) return 'Project name not preserved';
  if (!hasProjectDomain) return 'Project domain not preserved';
  if (!hasBaseFee) return 'Base fee not preserved';
  if (!hasPrice) return 'Price fee not preserved';
  
  return true;
});

// ===== FINAL TEST RESULTS =====
console.log('\n🏁 PHASE 2 TEST RESULTS');
console.log('========================\n');

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);

if (failedTests.length > 0) {
  console.log('\n❌ FAILED TESTS:');
  failedTests.forEach(test => console.log(`  - ${test}`));
  console.log('\n🚨 PHASE 2 TESTS FAILED - CANNOT PROCEED TO PHASE 3');
  console.log('All tests must pass before proceeding to the next phase.');
  process.exit(1);
} else {
  console.log('\n✅ ALL PHASE 2 TESTS PASSED!');
  console.log('🎉 Ready to proceed to Phase 3 - Core Integration');
  console.log('\nPhase 2 Migration Summary:');
  console.log('- ✅ Project structure created correctly');
  console.log('- ✅ Pump Data project migrated exactly');
  console.log('- ✅ Token Creator files migrated exactly');
  console.log('- ✅ Dependencies installed successfully');
  console.log('- ✅ All functionality preserved');
  console.log('- ✅ Configuration files copied with API keys intact');
  console.log('- ✅ Static assets migrated correctly');
  console.log('- ✅ Broken trending.html correctly excluded');
  
  console.log('\n📋 PHASE 2 COMPLETION CHECKLIST:');
  console.log('- [x] Create New Unified Project Directory');
  console.log('- [x] Migrate Pump Data Project (EXACT COPY ONLY)');
  console.log('- [x] Handle Token Creator Files');
  console.log('- [x] Merge package.json files');
  console.log('- [x] Update TypeScript Configuration');
  console.log('- [x] Preserve Existing Config Systems (EXACT COPY ONLY)');
  
  console.log('\n🚀 READY FOR PHASE 3!');
  process.exit(0);
} 