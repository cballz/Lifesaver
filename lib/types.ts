
import { User, AIAgent, BiometricProfile, Emergency, Alert, ResponderNetwork } from '@prisma/client'

export type UserWithRelations = User & {
  aiAgent?: AIAgent | null
  biometricProfile?: BiometricProfile | null
  responderNetworks?: ResponderNetwork[]
  emergenciesAsUser?: Emergency[]
}

export type EmergencyWithRelations = Emergency & {
  user: User
  alerts: Alert[]
  responses: any[]
}

export type BiometricThresholds = {
  heartRateMin: number
  heartRateMax: number
  respiratoryRateMin: number
  respiratoryRateMax: number
  bloodOxygenMin: number
  motionThreshold: number
}

export type AlertLevelType = 'GREEN' | 'YELLOW' | 'RED'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type BiometricReading = {
  heartRate?: number
  respiratoryRate?: number
  bloodOxygen?: number
  motionLevel?: number
  timestamp: Date
  source: 'wearable' | 'simulated'
  alertTriggered?: boolean
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      role: string
      phone?: string
      zipCode: string
      narcanTrained: boolean
      consentToShare: boolean
      hasAIAgent: boolean
      hasBiometricProfile: boolean
    }
  }

  interface User {
    role: string
    firstName: string
    lastName: string
    phone?: string
    zipCode: string
    narcanTrained: boolean
    consentToShare: boolean
    hasAIAgent: boolean
    hasBiometricProfile: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    firstName: string
    lastName: string
    phone?: string
    zipCode: string
    narcanTrained: boolean
    consentToShare: boolean
    hasAIAgent: boolean
    hasBiometricProfile: boolean
  }
}
