import * as cheerio from 'cheerio'

interface ScrapedTokenData {
  description?: string
  error?: string
}

interface ScraperConfig {
  rateLimitDelay: number
  batchSize: number
  batchDelay: number
  maxDescriptionLength: number
  minDescriptionLength: number
  requestTimeout: number
}

export class PumpFunScraper {
  private readonly baseUrl = 'https://pump.fun'
  private readonly cache = new Map<string, ScrapedTokenData>()
  
  // Production-optimized configuration for maximum performance
  private readonly config: ScraperConfig = {
    rateLimitDelay: 75,           // Not used in current implementation (all simultaneous)
    batchSize: 50,                // Process all tokens in single batch
    batchDelay: 0,                // No delay between batches
    maxDescriptionLength: 2500,   // Allow detailed project descriptions
    minDescriptionLength: 0,      // Allow any length descriptions
    requestTimeout: 4000          // 4-second timeout for optimal speed
  }

  async scrapeTokenDescription(tokenAddress: string, skipDelay = false): Promise<string> {
    // Check cache first
    const cached = this.cache.get(tokenAddress)
    if (cached) {
      return cached.description || 'No description available'
    }

    try {
      // Rate limiting (skip delay for batch processing)
      if (!skipDelay) {
        await this.delay(this.config.rateLimitDelay)
      }
      
      const url = `${this.baseUrl}/${tokenAddress}`
      const html = await this.fetchTokenPage(url)
      const description = this.extractDescription(html)
      
      // Cache the result
      this.cache.set(tokenAddress, { description: description || undefined })
      
      return description || 'No description available'
      
    } catch (error) {
      console.error(`Failed to scrape ${tokenAddress}:`, error instanceof Error ? error.message : error)
      
      // Cache the error to avoid repeated attempts
      this.cache.set(tokenAddress, { error: error instanceof Error ? error.message : 'Unknown error' })
      
      return 'No description available'
    }
  }

  async scrapeMultipleTokens(tokenAddresses: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {}
    
    console.log(`🚀 Starting to scrape ${tokenAddresses.length} tokens...`)
    
    // Process tokens in batches
    for (let i = 0; i < tokenAddresses.length; i += this.config.batchSize) {
      const batch = tokenAddresses.slice(i, i + this.config.batchSize)
      
      console.log(`📦 Processing batch ${Math.floor(i/this.config.batchSize) + 1}/${Math.ceil(tokenAddresses.length/this.config.batchSize)} (${batch.length} tokens)`)
      
      const batchResults = await this.processBatch(batch)
      Object.assign(results, batchResults)
      
      // Add delay between batches (currently disabled for single batch mode)
      if (i + this.config.batchSize < tokenAddresses.length) {
        await this.delay(this.config.batchDelay)
      }
    }
    
    const successCount = Object.values(results)
      .filter(desc => desc !== 'No description available').length
    
    console.log(`✅ Completed scraping. Found descriptions for ${successCount}/${tokenAddresses.length} tokens`)
    
    return results
  }

  private async processBatch(tokenAddresses: string[]): Promise<Record<string, string>> {
    // Fire all requests simultaneously for maximum performance
    const batchPromises = tokenAddresses.map(address => 
      this.scrapeTokenDescription(address, true).then(desc => ({ address, desc }))
    )
    
    const batchResults = await Promise.allSettled(batchPromises)
    const results: Record<string, string> = {}
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results[result.value.address] = result.value.desc
      }
    }
    
    return results
  }

  private async fetchTokenPage(url: string): Promise<string> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout)
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private extractDescription(html: string): string | null {
    try {
      const $ = cheerio.load(html)
      
      // Try meta tags first (most reliable source)
      const metaSelectors = [
        'meta[name="description"]',
        'meta[property="og:description"]', 
        'meta[name="twitter:description"]'
      ]
      
      for (const selector of metaSelectors) {
        const content = $(selector).attr('content')
        if (content && this.isValidDescription(content, true)) {
          return content.replace(/\s+/g, ' ').trim()
        }
      }
      
      // Try structural selectors (optimized for speed)
      const structuralSelectors = [
        '[class*="description"]',
        '[data-testid*="description"]',
        'main p',
        '[class*="about"]'
      ]
      
      for (const selector of structuralSelectors) {
        const elements = $(selector)
        for (let i = 0; i < elements.length; i++) {
          const text = $(elements[i]).text().trim()
          if (this.isValidDescription(text, false)) {
            return text.replace(/\s+/g, ' ').trim()
          }
        }
      }

      // Last resort: search for standalone text blocks
      return this.findTextBlocks($)

    } catch (error) {
      console.error('Error parsing HTML:', error)
      return null
    }
  }

  private findTextBlocks($: cheerio.CheerioAPI): string | null {
    const allTextElements = $('p, div, span').toArray()
    
    for (const element of allTextElements) {
      const text = $(element).text().trim()
      const hasOnlyTextChildren = $(element).children().length === 0
      
      if (hasOnlyTextChildren && this.isValidTextBlock(text)) {
        return text.replace(/\s+/g, ' ').trim()
      }
    }
    
    return null
  }

  private isValidDescription(text: string, isMetaTag: boolean): boolean {
    if (!text || text.length < this.config.minDescriptionLength || text.length > this.config.maxDescriptionLength) {
      return false
    }

    // Time-related patterns that should be rejected
    const timePatterns = [
      /\b\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/i,
      /\babout\s+\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/i,
      /\b\d+[mhd]\s+ago\b/i,
      /^\s*\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago\s*$/i,
      /^(just now|moments? ago|recently created?)$/i,
      /^(yesterday|today|tomorrow)$/i  // Only reject if the entire text is just these words
    ]

    const lowerText = text.toLowerCase()
    
    // Check for time patterns first (most important)
    if (timePatterns.some(pattern => pattern.test(text))) {
      return false
    }

    // Common exclusions (only exact matches to avoid false positives)
    const commonExclusions = [
      'default description',
      'time since creation',
      'creation time'
    ]

    // UI text filters (more lenient for meta tags)
    const uiExclusions = [
      'connect wallet',
      'copy address',
      'click here',
      'sign in',
      'log in',
      'loading',
      'view more',
      'show more',
      'read more',
      'taking too long to load',
      'try refresh',
      'refresh the page',
      'page not found',
      'error loading',
      'failed to load',
      'try again'
    ]

    // Check common exclusions (exact matches only)
    if (commonExclusions.some(exclusion => lowerText === exclusion)) {
      return false
    }

    // Check UI exclusions (skip for meta tags)
    if (!isMetaTag && uiExclusions.some(exclusion => lowerText.includes(exclusion))) {
      return false
    }

    return true
  }

  private isValidTextBlock(text: string): boolean {
    // First check if it passes the main description validation (includes time filtering)
    if (!this.isValidDescription(text, false)) {
      return false
    }

    const lowerText = text.toLowerCase()
    
    return !text.match(/^\d+[.,]\d+/) &&            // Avoid pure numbers
           !text.match(/^\w+\s*$/) &&               // Avoid single words
           text.split(' ').length > 2 &&            // At least 3 words (reduced from 4)
           !lowerText.includes('market cap') &&     // Avoid market data
           !lowerText.includes('loading') &&        // Avoid loading messages
           !lowerText.includes('refresh') &&        // Avoid refresh instructions
           !lowerText.includes('try again')         // Avoid error messages
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Public utility methods
  clearCache(): void {
    this.cache.clear()
    console.log('🧹 Cache cleared')
  }

  clearTokenFromCache(tokenAddress: string): void {
    this.cache.delete(tokenAddress)
    console.log(`🧹 Cleared ${tokenAddress} from cache`)
  }

  getCacheStats(): { size: number, tokens: string[] } {
    return {
      size: this.cache.size,
      tokens: Array.from(this.cache.keys())
    }
  }
} 