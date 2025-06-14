import { PumpCoin, PumpDetail } from "common/types"
import { withProxy } from "common/utils/env"
import { PumpFunScraper } from "lib/pump-scraper"

const BASE_URL = 'https://ngapi.vercel.app/api/ngmg'

// Global scraper instance with caching for optimal performance
const scraper = new PumpFunScraper()

/**
 * Fetches pump.fun token list with enhanced descriptions via web scraping
 * Achieves ~3-second total load time for 50 tokens
 */
export async function getPumpList(): Promise<PumpCoin[]> {
  try {
    console.log('🔄 Fetching from external API:', `${BASE_URL}/list`)
    const options = withProxy({ cache: "no-store" }) as unknown as RequestInit
    const res = await fetch(`${BASE_URL}/list`, options)
    
    if (!res.ok) {
      throw new Error(`API returned ${res.status} error`)
    }
    
    const responseText = await res.text()
    const data = JSON.parse(responseText)
    const tokens = data.rank || []
    
    console.log('✅ External API returned', tokens.length, 'tokens')
    
    // Log sample token to see data structure
    if (tokens.length > 0) {
      console.log('📊 Sample token data:', {
        name: tokens[0].name,
        symbol: tokens[0].symbol,
        address: tokens[0].address,
        hasDescription: !!tokens[0].description,
        description: tokens[0].description?.substring(0, 100) + '...'
      })
    }
    
    // Enhance tokens with scraped descriptions
    await enhanceTokensWithDescriptions(tokens)
    
    return tokens.length > 0 ? tokens : []
  } catch (error) {
    console.error('❌ Error fetching pump list:', error)
    
    // Return empty array - let frontend handle loading state
    return []
  }
}

/**
 * Enhances token data with descriptions scraped from pump.fun pages
 * Uses intelligent filtering to avoid false positives from UI text, timestamps, etc.
 */
async function enhanceTokensWithDescriptions(tokens: any[]): Promise<void> {
  // Find tokens that need descriptions
  const tokensNeedingScraping = tokens.filter((token: any) => 
    !token.description || token.description.trim() === ''
  )
  
  if (tokensNeedingScraping.length === 0) {
    console.log('📝 All tokens already have descriptions')
    return
  }
  
  try {
    console.log(`🕷️ Scraping descriptions for ${tokensNeedingScraping.length} tokens...`)
    
    const addresses = tokensNeedingScraping.map((token: any) => token.address)
    
    // Add timeout to scraping process
    const scrapingPromise = scraper.scrapeMultipleTokens(addresses)
    const timeoutPromise = new Promise<Record<string, string>>((_, reject) => 
      setTimeout(() => reject(new Error('Scraping timeout after 15 seconds')), 15000)
    )
    
    const scrapedDescriptions = await Promise.race([scrapingPromise, timeoutPromise])
    
    // Merge scraped descriptions back into tokens
    for (const token of tokens) {
      if (scrapedDescriptions[token.address] && scrapedDescriptions[token.address] !== 'No description available') {
        token.description = scrapedDescriptions[token.address]
        console.log(`📄 Added description for ${token.symbol}: ${token.description.substring(0, 50)}...`)
      }
    }
    
    const successCount = Object.values(scrapedDescriptions)
      .filter(desc => desc && desc !== 'No description available').length
    
    console.log(`✅ Successfully scraped ${successCount}/${tokensNeedingScraping.length} token descriptions`)
    
  } catch (scrapingError) {
    console.error('❌ Scraping failed, continuing with API data only:', scrapingError)
    // Don't throw - continue with basic token data
  }
}



/**
 * Fetches detailed information for a specific token
 */
export async function getPumpDetail(addr: string): Promise<PumpDetail> {
  const res = await fetch(`${BASE_URL}/detail?address=${addr}`)
  const data = await res.json()
  return data
}

// Export scraper instance for potential future use
export { scraper }
