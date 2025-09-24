
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Heart, 
  Wind, 
  Droplets, 
  Zap, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { generateBiometricReading, detectAnomalies } from '@/lib/utils'

interface BiometricMonitorProps {
  biometricProfile: any
  currentAlert: 'GREEN' | 'YELLOW' | 'RED'
}

export function BiometricMonitor({ biometricProfile, currentAlert }: BiometricMonitorProps) {
  const [currentReading, setCurrentReading] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])

  useEffect(() => {
    if (!biometricProfile) return

    // Generate initial reading
    const reading = generateBiometricReading(biometricProfile)
    setCurrentReading(reading)

    // Set up interval for new readings
    const interval = setInterval(() => {
      const newReading = generateBiometricReading(biometricProfile)
      setCurrentReading(newReading)
      
      // Add to historical data (keep last 20 readings)
      setHistoricalData(prev => 
        [...prev, newReading].slice(-20)
      )
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [biometricProfile])

  if (!biometricProfile || !currentReading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Biometric Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No biometric data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isAnomalous = detectAnomalies(currentReading, biometricProfile)

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: currentReading.heartRate,
      unit: 'bpm',
      range: `${biometricProfile.heartRateMin}-${biometricProfile.heartRateMax}`,
      color: currentReading.heartRate >= biometricProfile.heartRateMin && 
             currentReading.heartRate <= biometricProfile.heartRateMax 
             ? 'text-green-600' : 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Wind,
      label: 'Respiratory',
      value: currentReading.respiratoryRate,
      unit: '/min',
      range: `${biometricProfile.respiratoryRateMin}-${biometricProfile.respiratoryRateMax}`,
      color: currentReading.respiratoryRate >= biometricProfile.respiratoryRateMin && 
             currentReading.respiratoryRate <= biometricProfile.respiratoryRateMax 
             ? 'text-green-600' : 'text-red-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Droplets,
      label: 'Blood O₂',
      value: currentReading.bloodOxygen,
      unit: '%',
      range: `>${biometricProfile.bloodOxygenMin}%`,
      color: currentReading.bloodOxygen >= biometricProfile.bloodOxygenMin 
             ? 'text-green-600' : 'text-red-600',
      bgColor: 'bg-sky-50'
    },
    {
      icon: Zap,
      label: 'Motion',
      value: Math.round(currentReading.motionLevel * 100),
      unit: '%',
      range: `>${Math.round(biometricProfile.motionThreshold * 100)}%`,
      color: currentReading.motionLevel >= biometricProfile.motionThreshold 
             ? 'text-green-600' : 'text-yellow-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Biometric Monitor
            <Badge 
              variant={biometricProfile.wearableConnected ? "default" : "secondary"} 
              className="ml-3"
            >
              {biometricProfile.wearableConnected 
                ? `Connected - ${biometricProfile.wearableType || 'Device'}` 
                : 'Simulated Data'
              }
            </Badge>
          </div>
          {isAnomalous ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Current Status Alert */}
        {isAnomalous && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <div className="font-medium text-yellow-800">Anomaly Detected</div>
                <div className="text-sm text-yellow-700">
                  One or more biometric values are outside normal range. AI monitoring activated.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${metric.bgColor} rounded-lg p-4 text-center`}
            >
              <metric.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className={`text-2xl font-bold ${metric.color}`}>
                {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                <span className="text-sm font-normal ml-1">{metric.unit}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                Normal: {metric.range}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Chart Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Recent Trend</h4>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </div>
          
          {/* Simple heart rate trend line */}
          <div className="h-20 bg-gray-50 rounded-lg p-4 flex items-end space-x-1">
            {Array.from({ length: 20 }, (_, i) => {
              const height = Math.random() * 60 + 20 // Random height between 20-80%
              return (
                <motion.div
                  key={i}
                  className="bg-blue-500 rounded-t flex-1 opacity-70"
                  style={{ height: `${height}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              )
            })}
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Last updated: {new Date(currentReading.timestamp).toLocaleTimeString()}
          </div>
          <div className={`font-medium ${currentAlert === 'GREEN' ? 'text-green-600' : currentAlert === 'YELLOW' ? 'text-yellow-600' : 'text-red-600'}`}>
            Status: {currentAlert}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
