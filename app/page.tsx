"use client"
import { Stack, useMediaQuery, useTheme, Box } from "@mui/material"
import List from "./modules/list"
import "./style.scss"
import Detail from "./modules/list/detail"
import useSWR from "swr"
import { PumpCoin } from "common/types"
import Loading from "./modules/loading"
import { useState, useMemo, useEffect, useRef } from "react"
import Filter, { FilterOptions, applyFilters } from "./modules/filter"
import { Layout } from "../components/Layout"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ErrorBoundary } from "../components/ErrorBoundary"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API returned ${res.status} error`)
  }
  return res.json()
}

// Fallback data for initial load only
const getFallbackData = (): PumpCoin[] => [
  {
    address: "EDuHvMKwAddbhxN8CsFzKA38uBL9iEz8ToHB97ZDpump",
    name: "DEMO TOKEN", 
    symbol: "DEMO",
    created_timestamp: Date.now() / 1000,
    complete: 0,
    last_trade_timestamp: Date.now() / 1000,
    usd_market_cap: "50000.00",
    price: 0.00005,
    progress: 0.85,
    total_supply: 1000000000,
    status: 0,
    logo: "https://via.placeholder.com/150x150/4338ca/ffffff?text=DEMO",
    holder_count: 125,
    volume_24h: "25000.00",
    description: "This is a demonstration token showing how descriptions appear when the external API is unavailable. Real token descriptions are scraped from pump.fun pages."
  } as any
]

const defaultFilters: FilterOptions = {
  timeFilter: 'all',
  hasTwitter: false,
  hasTelegram: false,
  hasWebsite: false,
  hasDescription: false,
  minMarketCap: 0,
  maxMarketCap: 0,
}

export default function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const lastGoodDataRef = useRef<PumpCoin[]>([])
  
  const { data, error, isLoading } = useSWR<PumpCoin[]>(
    '/api/pump',
    fetcher,
    {
      refreshInterval: 7000, // Refresh every 7 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true, // Keep previous data when refresh fails
      shouldRetryOnError: true, // Allow retries to keep refreshing
      errorRetryCount: 0, // Don't do immediate retries on error
      refreshWhenHidden: false, // Don't refresh when tab is hidden
      refreshWhenOffline: false, // Don't refresh when offline
      // Optional: Add logging for debugging
      // onSuccess: (data) => console.log('SWR Success:', data?.length || 0, 'tokens'),
      // onError: (error) => console.log('SWR Error:', error.message || error)
    }
  )

  // Keep track of last good data and use it when API fails
  useEffect(() => {
    if (data && data.length > 0) {
      lastGoodDataRef.current = data
    }
  }, [data])

  // Use last good data if current data is empty, or fallback for initial load
  const displayData = useMemo(() => {
    if (data && data.length > 0) {
      return data // Current data is good, use it
    }
    if (lastGoodDataRef.current.length > 0) {
      return lastGoodDataRef.current // Use last good data when API fails
    }
    return getFallbackData() // First load fallback when no previous data exists
  }, [data])

  const filteredData = useMemo(() => {
    if (!displayData) return []
    return applyFilters(displayData, filters)
  }, [displayData, filters])

  if (isLoading) {
    return (
      <Layout title="Solana Pump Platform - Dashboard">
        <ErrorBoundary>
          <LoadingSpinner message="Loading pump data..." />
        </ErrorBoundary>
      </Layout>
    )
  }

  return (
    <Layout title="Solana Pump Platform - Dashboard">
      <ErrorBoundary>
        <Stack 
          className="app"
          sx={{
            gap: { xs: 1, sm: 2 },
            px: { xs: 0, sm: 1 }
          }}
        >
          {/* Filter Controls - Responsive Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignItems: { xs: 'stretch', sm: 'center' },
              p: { xs: 1, sm: 1.5 },
              pb: 0,
              gap: { xs: 1, sm: 0 }
            }}
          >
            <Filter 
              filters={filters}
              onFiltersChange={setFilters}
              coinCount={displayData?.length || 0}
              filteredCount={filteredData.length}
            />
          </Box>
          
          {/* Main Content - Responsive Grid */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 1, sm: 2 },
              minHeight: 0, // Allow flex items to shrink
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0, // Prevent overflow
                order: { xs: 1, lg: 0 }
              }}
            >
              <List data={filteredData} />
            </Box>
            
            {/* Detail Panel - Responsive */}
            <Box
              sx={{
                width: { xs: '100%', lg: '400px' },
                flexShrink: 0,
                order: { xs: 0, lg: 1 },
                maxHeight: { xs: '300px', lg: 'none' },
                overflow: { xs: 'auto', lg: 'visible' }
              }}
            >
              <Detail />
            </Box>
          </Box>
        </Stack>
      </ErrorBoundary>
    </Layout>
  )
}

export const dynamic = "force-dynamic"
