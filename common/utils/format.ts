import dayjs from "dayjs"

export function formatMarketCap(vol: number | string){
  const val = Number(vol)
  if(!val){
    return "0"
  }
  if(val < 1000){
    return val.toFixed(2)
  }
  return (val / 1000).toFixed(2) + "k"
}

export function formatTime(time: number){
  return dayjs(time * 1000).format("MM-DD HH:mm")
}

export function formatTimeAgo(time: number): string {
  const now = Date.now() / 1000 // Current time in seconds
  const ageInSeconds = now - time
  
  if (ageInSeconds < 60) {
    return `created ${Math.floor(ageInSeconds)} seconds ago`
  } else if (ageInSeconds < 3600) {
    const minutes = Math.floor(ageInSeconds / 60)
    return `created ${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (ageInSeconds < 86400) {
    const hours = Math.floor(ageInSeconds / 3600)
    return `created ${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (ageInSeconds < 604800) {
    const days = Math.floor(ageInSeconds / 86400)
    return `created ${days} day${days !== 1 ? 's' : ''} ago`
  } else if (ageInSeconds < 2592000) {
    const weeks = Math.floor(ageInSeconds / 604800)
    return `created ${weeks} week${weeks !== 1 ? 's' : ''} ago`
  } else {
    const months = Math.floor(ageInSeconds / 2592000)
    return `created ${months} month${months !== 1 ? 's' : ''} ago`
  }
}

export function formatAddress(addr: string){
  return addr.substring(0, 5) + "..." + addr.substr(-4)
}

export function formatPrice(price: number){
  return price.toFixed(8)
}

export function formatPercent(val: string | number){
  return (Number(val) * 100).toFixed(2) + "%"
}
