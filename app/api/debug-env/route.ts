export async function GET() {
  console.log('=== Environment Debug ===');
  console.log('process.env.HELIUS_API_KEY:', process.env.HELIUS_API_KEY);
  console.log('process.env.NEXT_PUBLIC_HELIUS_API_KEY:', process.env.NEXT_PUBLIC_HELIUS_API_KEY);
  console.log('All env vars starting with HELIUS:', Object.keys(process.env).filter(key => key.includes('HELIUS')));
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  return Response.json({
    helius_api_key: process.env.HELIUS_API_KEY || 'not found',
    next_public_helius_api_key: process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'not found',
    all_helius_vars: Object.keys(process.env).filter(key => key.includes('HELIUS')),
    node_env: process.env.NODE_ENV,
    env_keys_sample: Object.keys(process.env).slice(0, 10)
  });
} 