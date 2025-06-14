"use client"

import { useEffect } from "react"

export default function LiquidityPage() {
  useEffect(() => {
    // Redirect to the original working HTML file
    window.location.href = '/liquidity.html'
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Redirecting to liquidity management...
    </div>
  )
} 