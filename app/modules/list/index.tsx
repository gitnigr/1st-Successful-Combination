import { Stack, Typography, Alert } from "@mui/material"
import { PumpCoin } from "common/types"
import CoinCard from "./item"

export default function List({ data }: { data: PumpCoin[] }) {
  if (!data || data.length === 0) {
    return (
      <Stack p={1.5} alignItems="center">
        <Alert severity="warning" sx={{ maxWidth: 600 }}>
          <Typography variant="h6">No Data Available</Typography>
          <Typography>
            Unable to load pump.fun data at the moment. This could be due to:
          </Typography>
          <ul>
            <li>API endpoint is temporarily down</li>
            <li>Network connectivity issues</li>
            <li>Rate limiting</li>
            <li>All coins filtered out by current filter settings</li>
          </ul>
          <Typography>Please try refreshing the page or adjusting your filters.</Typography>
        </Alert>
      </Stack>
    )
  }

  return (
    <Stack p={1.5} direction="row" flexWrap="wrap" gap={1.5}>
      {data.map(t => (
        <CoinCard key={t.address} data={t} />
      ))}
    </Stack>
  )
}
