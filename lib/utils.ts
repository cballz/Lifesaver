
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function calculateDistance(zipCode1: string, zipCode2: string): number {
  // Simplified distance calculation based on zip code proximity
  // In a real app, this would use actual geocoding
  const zip1 = parseInt(zipCode1)
  const zip2 = parseInt(zipCode2)
  const diff = Math.abs(zip1 - zip2)
  
  if (diff === 0) return 0
  if (diff <= 5) return Math.random() * 3 + 1 // 1-4 miles
  if (diff <= 20) return Math.random() * 10 + 5 // 5-15 miles
  return Math.random() * 50 + 15 // 15-65 miles
}

export function getAlertLevelColor(level: 'GREEN' | 'YELLOW' | 'RED'): string {
  switch (level) {
    case 'GREEN':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'YELLOW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'RED':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function generateBiometricReading(profile: any) {
  const variance = 0.1 // 10% variance
  
  return {
    heartRate: Math.floor(
      profile.heartRateMin + 
      Math.random() * (profile.heartRateMax - profile.heartRateMin) +
      (Math.random() - 0.5) * variance * profile.heartRateMin
    ),
    respiratoryRate: Math.floor(
      profile.respiratoryRateMin + 
      Math.random() * (profile.respiratoryRateMax - profile.respiratoryRateMin)
    ),
    bloodOxygen: Math.round(
      (profile.bloodOxygenMin + Math.random() * 5) * 10
    ) / 10,
    motionLevel: Math.random(),
    timestamp: new Date(),
    source: 'simulated' as const
  }
}

export function detectAnomalies(reading: any, profile: any): boolean {
  if (reading.heartRate < profile.heartRateMin || reading.heartRate > profile.heartRateMax) {
    return true
  }
  if (reading.respiratoryRate < profile.respiratoryRateMin || reading.respiratoryRate > profile.respiratoryRateMax) {
    return true
  }
  if (reading.bloodOxygen < profile.bloodOxygenMin) {
    return true
  }
  if (reading.motionLevel < profile.motionThreshold) {
    return true
  }
  return false
}

export function getSobrietyDays(sobrietyDate: Date | null): number {
  if (!sobrietyDate) return 0
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - sobrietyDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function formatEmergencyTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date)
}

export function getResponseStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'acknowledged':
      return 'text-blue-600 bg-blue-50'
    case 'en_route':
      return 'text-orange-600 bg-orange-50'
    case 'arrived':
      return 'text-green-600 bg-green-50'
    case 'completed':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-500 bg-gray-50'
  }
}
