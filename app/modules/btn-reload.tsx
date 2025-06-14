"use client"
import { Refresh } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { mutate } from "swr"

export default function Reload() {
  function refresh() {
    // Trigger SWR revalidation for the pump data
    mutate('/api/pump')
  }
  
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="refresh"
      onClick={refresh}
    >
      <Refresh />
    </IconButton>
  )
}
