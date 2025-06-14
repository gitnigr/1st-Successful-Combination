"use client"

import { useEffect, useState } from "react"
// TokenCreationForm will be added here

interface Coin {
  address: string
  name: string
  symbol: string
  usd_market_cap: string
  holder_count: number
  created_timestamp: number
  description?: string
  logo?: string
  price?: number
  volume_24h?: string
  progress?: number
  twitter?: string
  telegram?: string
  website?: string
}

export default function CreateTokenPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)

  // Utility functions
  const formatMarketCap = (value: string | number) => {
    const num = parseFloat(String(value || 0))
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return `${num.toFixed(0)}`
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    
    if (diff < 60) return `${Math.floor(diff)}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    return address.substring(0, 4) + '...' + address.slice(-4)
  }

  // Fetch trending data
  const fetchTrendingData = async () => {
    try {
      console.log('🔄 Fetching trending data...')
      const response = await fetch('/api/pump')
      if (!response.ok) {
        throw new Error(`API returned ${response.status} error`)
      }
      const data = await response.json()
      console.log('✅ Successfully fetched', data.length, 'coins')
      setCoins(data)
    } catch (error) {
      console.error('❌ Error fetching trending data:', error)
      console.log('🔄 Using fallback data...')
      // Fallback data will be provided by the API
      setCoins([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingData()
    // Refresh every 7 seconds
    const interval = setInterval(fetchTrendingData, 7000)
    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log('Copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative h-screen bg-neutral-900">
      {/* Main Content - Token Creation */}
      <main className="h-screen flex flex-col items-center bg-neutral-900 p-4 pr-96 pt-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white bg-indigo-600 px-4 py-2 rounded-lg text-center">
          Create Your Own Coin FAST ⚡
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 text-center mb-6">
          Launch your own coin on Solana in seconds. No coding required.
        </p>
        {/* Token Creation Form */}
        <div className="w-full max-w-md bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="text-center mb-4">
            <p className="text-neutral-400 text-sm">
              The full token creation functionality is available at:
            </p>
            <button 
              onClick={() => window.location.href = '/create-coin.html'}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Open Token Creator
            </button>
          </div>
        </div>
      </main>

      {/* Trending Sidebar - Absolutely positioned */}
      <aside className="absolute top-0 right-0 w-96 h-screen bg-neutral-800 border-l border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Trending Coins</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-neutral-400 text-center">Loading trending data...</div>
          ) : coins.length === 0 ? (
            <div className="text-neutral-400 text-center">No trending data available</div>
          ) : (
            <div className="space-y-4">
              {coins.map((coin) => (
                <div
                  key={coin.address}
                  className="bg-neutral-700 rounded-lg p-4 hover:bg-neutral-600 transition-all duration-200 cursor-pointer border border-neutral-600"
                  onClick={() => setSelectedCoin(coin)}
                >
                  <div className="flex space-x-4">
                    {/* Coin Image */}
                    <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {coin.logo ? (
                        <img 
                          src={coin.logo} 
                          alt={coin.name} 
                          className="w-16 h-16 rounded-lg object-cover"
                                                     onError={(e) => {
                             const img = e.currentTarget as HTMLImageElement
                             const span = img.nextElementSibling as HTMLSpanElement
                             img.style.display = 'none'
                             if (span) span.style.display = 'block'
                           }}
                        />
                      ) : null}
                      <span style={{ display: coin.logo ? 'none' : 'block' }}>
                        {(coin.symbol || 'T').charAt(0)}
                      </span>
                    </div>
                    
                    {/* Coin Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold truncate text-lg">{coin.name}</h3>
                        <span className="text-sm text-neutral-400 font-mono">{coin.symbol}</span>
                      </div>
                      
                      <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                        {coin.description && coin.description.trim() !== '' ? coin.description : 'No description available'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-neutral-500">Market Cap:</span>
                          <span className="text-green-400 ml-1 font-semibold">{formatMarketCap(coin.usd_market_cap)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Holders:</span>
                          <span className="text-white ml-1">{coin.holder_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Created:</span>
                          <span className="text-neutral-400 ml-1">{formatTimeAgo(coin.created_timestamp)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Address:</span>
                          <span className="text-neutral-400 ml-1 font-mono">{formatAddress(coin.address)}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-600 rounded-full h-2 mb-3">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((coin.progress || 0) * 100, 100)}%` }}
                        ></div>
                      </div>
                      
                      {/* Social Links */}
                      <div className="flex items-center space-x-2 flex-wrap">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://pump.fun/${coin.address}`, '_blank')
                          }}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
                        >
                          🌐 Pump.fun
                        </button>
                        {coin.twitter && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`https://x.com/${coin.twitter}`, '_blank')
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                          >
                            🐦 Twitter
                          </button>
                        )}
                        {coin.telegram && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(coin.telegram, '_blank')
                            }}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                          >
                            📱 Telegram
                          </button>
                        )}
                        {coin.website && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(coin.website, '_blank')
                            }}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            🌍 Website
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(coin.address)
                          }}
                          className="px-2 py-1 bg-neutral-600 hover:bg-neutral-500 text-white rounded text-xs transition-colors"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Modal for coin details */}
      {selectedCoin && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedCoin(null)}
        >
          <div 
            className="bg-neutral-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Token Details</h2>
              <button 
                onClick={() => setSelectedCoin(null)}
                className="text-neutral-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{selectedCoin.name}</h3>
                <p className="text-neutral-400">{selectedCoin.symbol}</p>
              </div>
              
              {/* Description */}
              {selectedCoin.description && selectedCoin.description.trim() !== '' && (
                <div className="bg-neutral-700 p-3 rounded">
                  <p className="text-neutral-400 mb-2">Description</p>
                  <p className="text-white text-sm">{selectedCoin.description}</p>
                </div>
              )}
              
              {/* GMGN Chart */}
              <div className="bg-neutral-700 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-neutral-600">
                  <p className="text-neutral-400 text-sm font-medium">Price Chart</p>
                </div>
                <iframe 
                  src={`https://www.gmgn.cc/kline/sol/${selectedCoin.address}`}
                  width="100%" 
                  height="300" 
                  style={{ border: 'none' }}
                  className="bg-neutral-700"
                />
              </div>
              
              {/* Basic Info */}
              <div className="bg-neutral-700 p-3 rounded">
                <p className="text-neutral-400 mb-3 font-medium">Basic Info</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Holders:</span>
                    <span className="text-white">{parseInt(String(selectedCoin.holder_count || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Price:</span>
                    <span className="text-white">${parseFloat(String(selectedCoin.price || 0)).toFixed(8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Market Cap:</span>
                    <span className="text-green-400">${parseFloat(String(selectedCoin.usd_market_cap || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">24h Volume:</span>
                    <span className="text-white">${parseFloat(String(selectedCoin.volume_24h || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contract Address */}
              <div className="bg-neutral-700 p-3 rounded">
                <p className="text-neutral-400 mb-2">Contract Address</p>
                <p className="text-white text-xs font-mono break-all">{selectedCoin.address}</p>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => copyToClipboard(selectedCoin.address)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Copy Address
              </button>
              <button 
                onClick={() => window.open(`https://pump.fun/${selectedCoin.address}`, '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View on Pump.fun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}