"use client"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton,
} from "@mui/material"
import { FilterList, Close } from "@mui/icons-material"
import { useState } from "react"
import { PumpCoin } from "common/types"

export interface FilterOptions {
  timeFilter: 'all' | '15m' | '30m' | '1h' | '2h' | '6h' | '12h' | '18h' | '24h' | '2d' | '3d' | '4d' | '5d' | '6d' | '7d'
  hasTwitter: boolean
  hasTelegram: boolean
  hasWebsite: boolean
  hasDescription: boolean
  minMarketCap: number
  maxMarketCap: number
}

const defaultFilters: FilterOptions = {
  timeFilter: 'all',
  hasTwitter: false,
  hasTelegram: false,
  hasWebsite: false,
  hasDescription: false,
  minMarketCap: 0,
  maxMarketCap: 0,
}

interface FilterProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  coinCount: number
  filteredCount: number
}

export default function Filter({ filters, onFiltersChange, coinCount, filteredCount }: FilterProps) {
  const [open, setOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters)

  const handleOpen = () => {
    setTempFilters(filters)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleApply = () => {
    onFiltersChange(tempFilters)
    setOpen(false)
  }

  const handleReset = () => {
    setTempFilters(defaultFilters)
  }

  const hasActiveFilters = filters.timeFilter !== 'all' || 
    filters.hasTwitter || 
    filters.hasTelegram || 
    filters.hasWebsite ||
    filters.hasDescription ||
    filters.minMarketCap > 0 ||
    filters.maxMarketCap > 0

  return (
    <>
      <Button
        variant={hasActiveFilters ? "contained" : "outlined"}
        startIcon={<FilterList />}
        onClick={handleOpen}
        color={hasActiveFilters ? "primary" : "inherit"}
      >
        Filter {hasActiveFilters && `(${filteredCount}/${coinCount})`}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Filter Coins
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Time Filter */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Time Since Creation
              </Typography>
              <TextField
                select
                fullWidth
                value={tempFilters.timeFilter}
                onChange={(e) => setTempFilters({ 
                  ...tempFilters, 
                  timeFilter: e.target.value as FilterOptions['timeFilter'] 
                })}
                suppressHydrationWarning
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="15m">Last 15 Minutes</MenuItem>
                <MenuItem value="30m">Last 30 Minutes</MenuItem>
                <MenuItem value="1h">Last Hour</MenuItem>
                <MenuItem value="2h">Last 2 Hours</MenuItem>
                <MenuItem value="6h">Last 6 Hours</MenuItem>
                <MenuItem value="12h">Last 12 Hours</MenuItem>
                <MenuItem value="18h">Last 18 Hours</MenuItem>
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="2d">Last 2 Days</MenuItem>
                <MenuItem value="3d">Last 3 Days</MenuItem>
                <MenuItem value="4d">Last 4 Days</MenuItem>
                <MenuItem value="5d">Last 5 Days</MenuItem>
                <MenuItem value="6d">Last 6 Days</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
              </TextField>
            </div>

            {/* Social Media Filters */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Content & Social Media
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempFilters.hasDescription}
                      onChange={(e) => setTempFilters({ 
                        ...tempFilters, 
                        hasDescription: e.target.checked 
                      })}
                    />
                  }
                  label="Has Description"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempFilters.hasTwitter}
                      onChange={(e) => setTempFilters({ 
                        ...tempFilters, 
                        hasTwitter: e.target.checked 
                      })}
                    />
                  }
                  label="Has Twitter"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempFilters.hasTelegram}
                      onChange={(e) => setTempFilters({ 
                        ...tempFilters, 
                        hasTelegram: e.target.checked 
                      })}
                    />
                  }
                  label="Has Telegram"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempFilters.hasWebsite}
                      onChange={(e) => setTempFilters({ 
                        ...tempFilters, 
                        hasWebsite: e.target.checked 
                      })}
                    />
                  }
                  label="Has Website"
                />
              </FormGroup>
            </div>

            {/* Market Cap Filter */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Market Cap Range (USD)
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Min"
                  type="number"
                  value={tempFilters.minMarketCap}
                  onChange={(e) => setTempFilters({ 
                    ...tempFilters, 
                    minMarketCap: Math.max(0, Number(e.target.value)) 
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                  suppressHydrationWarning
                />
                <TextField
                  label="Max"
                  type="number"
                  value={tempFilters.maxMarketCap}
                  onChange={(e) => setTempFilters({ 
                    ...tempFilters, 
                    maxMarketCap: Math.max(0, Number(e.target.value)) 
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                  helperText="0 = no limit"
                  suppressHydrationWarning
                />
              </Stack>
            </div>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleReset} color="secondary">
            Reset
          </Button>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export function applyFilters(coins: PumpCoin[], filters: FilterOptions): PumpCoin[] {
  return coins.filter(coin => {
    // Time filter
    if (filters.timeFilter !== 'all') {
      const now = Date.now() / 1000 // Current time in seconds
      const coinAge = now - coin.created_timestamp
      
      switch (filters.timeFilter) {
        case '15m':
          if (coinAge > 900) return false
          break
        case '30m':
          if (coinAge > 1800) return false
          break
        case '1h':
          if (coinAge > 3600) return false
          break
        case '2h':
          if (coinAge > 7200) return false
          break
        case '6h':
          if (coinAge > 21600) return false
          break
        case '12h':
          if (coinAge > 43200) return false
          break
        case '18h':
          if (coinAge > 64800) return false
          break
        case '24h':
          if (coinAge > 86400) return false
          break
        case '2d':
          if (coinAge > 172800) return false
          break
        case '3d':
          if (coinAge > 259200) return false
          break
        case '4d':
          if (coinAge > 345600) return false
          break
        case '5d':
          if (coinAge > 432000) return false
          break
        case '6d':
          if (coinAge > 518400) return false
          break
        case '7d':
          if (coinAge > 604800) return false
          break
      }
    }

    // Content and social media filters
    if (filters.hasDescription) {
      const hasRealDescription = coin.description && 
                                coin.description.trim() !== '' && 
                                coin.description.trim() !== 'No description available'
      if (!hasRealDescription) {
        return false
      }
    }
    if (filters.hasTwitter && (!coin.twitter || coin.twitter.trim() === '')) {
      return false
    }
    if (filters.hasTelegram && (!coin.telegram || coin.telegram.trim() === '')) {
      return false
    }
    if (filters.hasWebsite && (!coin.website || coin.website.trim() === '')) {
      return false
    }

    // Market cap filters
    const marketCap = Number(coin.usd_market_cap)
    if (filters.minMarketCap > 0 && marketCap < filters.minMarketCap) {
      return false
    }
    if (filters.maxMarketCap > 0 && marketCap > filters.maxMarketCap) {
      return false
    }

    return true
  })
} 