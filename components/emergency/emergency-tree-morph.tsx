

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Heart, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmergencyTreeMorphProps {
  emergencyLevel: 'GREEN' | 'YELLOW' | 'RED'
  userName?: string
  location?: string
  isEmergencyActive?: boolean
  onAcknowledge?: () => void
  showControls?: boolean
}

export function EmergencyTreeMorph({ 
  emergencyLevel, 
  userName, 
  location,
  isEmergencyActive = false,
  onAcknowledge,
  showControls = false
}: EmergencyTreeMorphProps) {
  const [morphing, setMorphing] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)
  
  useEffect(() => {
    if (emergencyLevel === 'RED' || emergencyLevel === 'YELLOW') {
      setMorphing(true)
      setPulseEffect(true)
    } else {
      setMorphing(false)
      setPulseEffect(false)
    }
  }, [emergencyLevel])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (pulseEffect) {
      interval = setInterval(() => {
        setPulseEffect(false)
        setTimeout(() => setPulseEffect(true), 100)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [pulseEffect])

  const getTreeImage = () => {
    if (emergencyLevel === 'RED') {
      return '/treedying.png'
    }
    return '/tree.jpg'
  }

  const getBackgroundColor = () => {
    switch (emergencyLevel) {
      case 'RED':
        return 'from-red-900 via-red-800 to-black'
      case 'YELLOW':
        return 'from-yellow-100 via-orange-200 to-red-200'
      default:
        return 'from-sky-100 to-green-100'
    }
  }

  const getStatusText = () => {
    switch (emergencyLevel) {
      case 'RED':
        return 'CRITICAL EMERGENCY'
      case 'YELLOW':
        return 'CHECK-IN REQUIRED'
      default:
        return 'ALL CLEAR'
    }
  }

  return (
    <div className={`relative bg-gradient-to-b ${getBackgroundColor()} rounded-lg overflow-hidden`}>
      {/* Emergency Alert Header */}
      {emergencyLevel !== 'GREEN' && (
        <motion.div
          className={`p-4 ${emergencyLevel === 'RED' ? 'bg-red-600' : 'bg-yellow-500'} text-white`}
          animate={emergencyLevel === 'RED' ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-bold">{getStatusText()}</span>
            </div>
            {userName && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                {userName}
              </Badge>
            )}
          </div>
          
          {location && (
            <div className="flex items-center mt-2 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
          )}
        </motion.div>
      )}

      {/* Tree Morphing Container */}
      <div className="relative p-6 min-h-[300px] flex items-center justify-center">
        <motion.div
          className={`relative w-64 h-64 ${emergencyLevel === 'RED' ? 'filter' : ''}`}
          animate={pulseEffect ? { 
            scale: [1, 1.05, 1],
            filter: emergencyLevel === 'RED' ? [
              'brightness(1) contrast(1) saturate(1)',
              'brightness(0.5) contrast(1.5) saturate(0)',
              'brightness(1) contrast(1) saturate(1)'
            ] : []
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`${emergencyLevel}-${getTreeImage()}`}
              src={getTreeImage()}
              alt={`Tree of Life - ${getStatusText()}`}
              className="w-full h-full object-cover rounded-full"
              initial={{ 
                opacity: 0, 
                scale: emergencyLevel === 'RED' ? 1.2 : 0.8,
                rotate: emergencyLevel === 'RED' ? 5 : -5
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: emergencyLevel === 'RED' ? 0.8 : 1.2,
                rotate: emergencyLevel === 'RED' ? -5 : 5
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </AnimatePresence>

          {/* Emergency Overlay Effects */}
          {emergencyLevel === 'RED' && (
            <>
              {/* Pulsing Red Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-red-500 rounded-full"
                animate={{ 
                  borderColor: ['#ef4444', '#dc2626', '#b91c1c', '#dc2626', '#ef4444'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Alert Icons */}
              <motion.div
                className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full"
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [-5, 5, -5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4" />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            emergencyLevel === 'RED' ? 'bg-red-600 text-white' :
            emergencyLevel === 'YELLOW' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {emergencyLevel}
          </div>
        </motion.div>
      </div>

      {/* Emergency Controls */}
      {showControls && emergencyLevel !== 'GREEN' && (
        <motion.div
          className="p-4 bg-white/90 backdrop-blur-sm border-t"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {emergencyLevel === 'RED' && (
              <>
                <Button
                  onClick={onAcknowledge}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  I'm Responding
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`tel:911`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 911
                </Button>
              </>
            )}
            
            {emergencyLevel === 'YELLOW' && (
              <Button
                onClick={onAcknowledge}
                className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Acknowledge Check-in
              </Button>
            )}
          </div>
          
          {emergencyLevel === 'RED' && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Emergency services have been notified. Narcan-trained responders in the area are being alerted.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
