import { Connection, PublicKey } from '@solana/web3.js';

interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url?: string;
  creator?: {
    name?: string;
    site?: string;
  };
}

interface SolanaTokenMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
}

export class SolanaMetadataFetcher {
  private connection: Connection;
  
  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl);
  }

  /**
   * Get token metadata from Solana blockchain
   */
  async getTokenMetadata(mintAddress: string): Promise<TokenMetadata | null> {
    try {
      const mintPubKey = new PublicKey(mintAddress);
      
      // Get metadata account PDA (Program Derived Address)
      const metadataPDA = await this.getMetadataPDA(mintPubKey);
      
      // Fetch account info
      const metadataAccount = await this.connection.getAccountInfo(metadataPDA);
      
      if (!metadataAccount) {
        console.log('No metadata account found for token:', mintAddress);
        return null;
      }

      // Deserialize the metadata
      const metadata = this.deserializeMetadata(metadataAccount.data);
      
      if (!metadata) {
        console.log('Failed to deserialize metadata for token:', mintAddress);
        return null;
      }

      // Fetch off-chain metadata JSON
      if (metadata.uri) {
        try {
          const offChainMetadata = await this.fetchOffChainMetadata(metadata.uri);
          return {
            name: metadata.name.replace(/\0/g, '').trim(),
            symbol: metadata.symbol.replace(/\0/g, '').trim(),
            description: offChainMetadata?.description,
            image: offChainMetadata?.image,
            attributes: offChainMetadata?.attributes,
            external_url: offChainMetadata?.external_url,
            creator: offChainMetadata?.creator
          };
        } catch (error) {
          console.log('Failed to fetch off-chain metadata:', error);
          return {
            name: metadata.name.replace(/\0/g, '').trim(),
            symbol: metadata.symbol.replace(/\0/g, '').trim(),
            description: 'Failed to load description'
          };
        }
      }

      return {
        name: metadata.name.replace(/\0/g, '').trim(),
        symbol: metadata.symbol.replace(/\0/g, '').trim(),
        description: 'No description available'
      };

    } catch (error) {
      console.error('Error fetching metadata for token:', mintAddress, error);
      return null;
    }
  }

  /**
   * Get metadata Program Derived Address
   */
  private async getMetadataPDA(mintPubKey: PublicKey): Promise<PublicKey> {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPubKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    return metadataPDA;
  }

  /**
   * Deserialize on-chain metadata
   */
  private deserializeMetadata(data: Buffer): SolanaTokenMetadata | null {
    try {
      // Simple metadata deserialization
      // Note: This is a simplified version. For production, use @metaplex-foundation/mpl-token-metadata
      let offset = 1; // Skip account discriminator
      
      // Skip update authority (32 bytes)
      offset += 32;
      
      // Skip mint (32 bytes)
      offset += 32;
      
      // Read name (32 bytes, null-terminated)
      const nameBytes = data.subarray(offset, offset + 32);
      const name = nameBytes.toString('utf8');
      offset += 32;
      
      // Read symbol (10 bytes, null-terminated)
      const symbolBytes = data.subarray(offset, offset + 10);
      const symbol = symbolBytes.toString('utf8');
      offset += 10;
      
      // Read URI length (4 bytes)
      const uriLength = data.readUInt32LE(offset);
      offset += 4;
      
      // Read URI
      const uriBytes = data.subarray(offset, offset + uriLength);
      const uri = uriBytes.toString('utf8');
      offset += uriLength;
      
      // Read seller fee basis points (2 bytes)
      const sellerFeeBasisPoints = data.readUInt16LE(offset);
      offset += 2;
      
      // Skip creators (variable length, complex to parse)
      
      return {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints,
        creators: [] // Simplified
      };
    } catch (error) {
      console.error('Error deserializing metadata:', error);
      return null;
    }
  }

  /**
   * Fetch off-chain metadata JSON
   */
  private async fetchOffChainMetadata(uri: string): Promise<any> {
    try {
      // Handle IPFS URIs
      if (uri.startsWith('ipfs://')) {
        uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      const response = await fetch(uri, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
        }
      } as any);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching off-chain metadata:', error);
      throw error;
    }
  }

  /**
   * Batch fetch metadata for multiple tokens
   */
  async getMultipleTokenMetadata(mintAddresses: string[]): Promise<Map<string, TokenMetadata | null>> {
    const results = new Map<string, TokenMetadata | null>();
    
    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < mintAddresses.length; i += batchSize) {
      const batch = mintAddresses.slice(i, i + batchSize);
      
      const promises = batch.map(async (address) => {
        const metadata = await this.getTokenMetadata(address);
        return { address, metadata };
      });
      
      const batchResults = await Promise.all(promises);
      
      batchResults.forEach(({ address, metadata }) => {
        results.set(address, metadata);
      });
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < mintAddresses.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Helius integration for easier metadata fetching
export class HeliusMetadataFetcher {
  constructor(private apiKey: string) {}

  async getTokenMetadata(mintAddress: string): Promise<TokenMetadata | null> {
    try {
      const response = await fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mintAccounts: [mintAddress]
        })
      });

      const data = await response.json();
      const tokenData = data[0];

      if (!tokenData) {
        return null;
      }

      // Fetch off-chain metadata if URI exists
      let offChainData = null;
      if (tokenData.offChainMetadata?.metadata?.uri) {
        try {
          const metadataResponse = await fetch(tokenData.offChainMetadata.metadata.uri);
          offChainData = await metadataResponse.json();
        } catch (error) {
          console.log('Failed to fetch off-chain metadata via Helius');
        }
      }

             return {
         name: tokenData.onChainMetadata?.metadata?.name || 'Unknown',
         symbol: tokenData.onChainMetadata?.metadata?.symbol || 'UNK',
         description: (offChainData as any)?.description || 'No description available',
         image: (offChainData as any)?.image,
         attributes: (offChainData as any)?.attributes,
         external_url: (offChainData as any)?.external_url
       };

    } catch (error) {
      console.error('Helius metadata fetch error:', error);
      return null;
    }
  }

  async getMultipleTokenMetadata(mintAddresses: string[]): Promise<Map<string, TokenMetadata | null>> {
    const results = new Map<string, TokenMetadata | null>();
    
    // Helius supports batch requests up to 100 tokens
    const batchSize = 100;
    for (let i = 0; i < mintAddresses.length; i += batchSize) {
      const batch = mintAddresses.slice(i, i + batchSize);
      
      try {
        const response = await fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mintAccounts: batch
          })
        });

        const data = await response.json();
        
        for (let j = 0; j < batch.length; j++) {
          const address = batch[j];
          const tokenData = data[j];
          
          if (tokenData) {
            // Fetch off-chain metadata
            let offChainData = null;
            if (tokenData.offChainMetadata?.metadata?.uri) {
              try {
                const metadataResponse = await fetch(tokenData.offChainMetadata.metadata.uri);
                offChainData = await metadataResponse.json();
              } catch (error) {
                // Ignore off-chain fetch errors
              }
            }

                         results.set(address, {
               name: tokenData.onChainMetadata?.metadata?.name || 'Unknown',
               symbol: tokenData.onChainMetadata?.metadata?.symbol || 'UNK',
               description: (offChainData as any)?.description || 'No description available',
               image: (offChainData as any)?.image,
               attributes: (offChainData as any)?.attributes,
               external_url: (offChainData as any)?.external_url
             });
          } else {
            results.set(address, null);
          }
        }
      } catch (error) {
        console.error('Batch metadata fetch error:', error);
        // Mark all tokens in this batch as failed
        batch.forEach(address => results.set(address, null));
      }
    }
    
    return results;
  }
}

export default SolanaMetadataFetcher; 