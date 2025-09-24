
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Zap, 
  Phone, 
  MapPin,
  Shield,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  User,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { calculateDistance } from '@/lib/utils'
import Link from 'next/link'

interface EmergencyGOButtonProps {
  user: any
}

export function EmergencyGOButton({ user }: EmergencyGOButtonProps) {
  const [step, setStep] = useState<'ready' | 'confirm' | 'triggered' | 'active'>('ready')
  const [selectedLevel, setSelectedLevel] = useState<'GREEN' | 'YELLOW' | 'RED' | null>(null)
  const [location, setLocation] = useState<any>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeEmergency, setActiveEmergency] = useState<any>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing active emergency
    if (user.emergenciesAsUser?.length > 0) {
      setActiveEmergency(user.emergenciesAsUser[0])
      setStep('active')
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => console.log('Location access denied:', error)
      )
    }
  }, [user.emergenciesAsUser])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev !== null ? prev - 1 : 0)
      }, 1000)
    } else if (countdown === 0) {
      triggerEmergency()
    }
    return () => clearInterval(interval)
  }, [countdown])

  const startCountdown = (level: 'GREEN' | 'YELLOW' | 'RED') => {
    setSelectedLevel(level)
    const countdownTime = level === 'RED' ? 10 : level === 'YELLOW' ? 15 : 20
    setCountdown(countdownTime)
    setStep('confirm')
  }

  const cancelCountdown = () => {
    setCountdown(null)
    setSelectedLevel(null)
    setStep('ready')
  }

  const triggerEmergency = async () => {
    if (!selectedLevel) return
    
    setLoading(true)
    setCountdown(null)

    try {
      const response = await fetch('/api/emergency/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alertLevel: selectedLevel,
          location,
          description,
          triggerType: 'manual'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger emergency')
      }

      setActiveEmergency(data.emergency)
      setStep('active')
    } catch (error) {
      console.error('Error triggering emergency:', error)
      alert('Failed to trigger emergency alert. Please call emergency services directly if needed.')
      setStep('ready')
    } finally {
      setLoading(false)
    }
  }

  const resolveEmergency = async () => {
    if (!activeEmergency) return

    try {
      const response = await fetch(`/api/emergency/${activeEmergency.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setActiveEmergency(null)
        setStep('ready')
        router.refresh()
      }
    } catch (error) {
      console.error('Error resolving emergency:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-red-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency GO Button</h1>
                <p className="text-sm text-gray-600">Pre-use alert and emergency response system</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-700 border-green-300">
                {user.responderNetworks?.length || 0} Responders Ready
              </Badge>
              
              {activeEmergency && (
                <Badge variant="destructive" className="animate-pulse">
                  Active Emergency
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Ready State */}
          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-green-500" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{user.responderNetworks?.length || 0}</div>
                      <div className="text-sm text-gray-600">Responders Ready</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{location ? '✓' : '?'}</div>
                      <div className="text-sm text-gray-600">Location {location ? 'Available' : 'Unknown'}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {user.responderNetworks?.filter((r: any) => r.responder.narcanTrained).length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Narcan Trained</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Levels */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Alert Level</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Select the appropriate alert level based on your current situation. 
                    Your response network will be notified immediately.
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* GREEN - Pre-use Alert */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card 
                      className="border-green-200 hover:border-green-300 hover:shadow-lg cursor-pointer transition-all"
                      onClick={() => startCountdown('GREEN')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <Zap className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-green-800">GREEN - Pre-use Alert</h3>
                              <p className="text-green-600 mt-1">
                                "I'm thinking about using and need support"
                              </p>
                              <div className="flex items-center mt-2 text-sm text-green-700">
                                <Users className="h-4 w-4 mr-1" />
                                Notifies 1 primary responder
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Prevention
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* YELLOW - Check-in Alert */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card 
                      className="border-yellow-200 hover:border-yellow-300 hover:shadow-lg cursor-pointer transition-all"
                      onClick={() => startCountdown('YELLOW')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-yellow-800">YELLOW - Check-in Alert</h3>
                              <p className="text-yellow-600 mt-1">
                                "I need someone to check on me"
                              </p>
                              <div className="flex items-center mt-2 text-sm text-yellow-700">
                                <Users className="h-4 w-4 mr-1" />
                                Notifies 2 priority responders
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                            Check-in
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* RED - Emergency Alert */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card 
                      className="border-red-200 hover:border-red-300 hover:shadow-lg cursor-pointer transition-all"
                      onClick={() => startCountdown('RED')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-red-800">RED - Emergency Alert</h3>
                              <p className="text-red-600 mt-1">
                                "Medical emergency - I need help now"
                              </p>
                              <div className="flex items-center mt-2 text-sm text-red-700">
                                <Users className="h-4 w-4 mr-1" />
                                Notifies ALL responders
                              </div>
                            </div>
                          </div>
                          <Badge variant="destructive">
                            Emergency
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-500" />
                    Crisis Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="font-medium text-red-800 mb-2">Emergency Services</div>
                      <div className="text-red-700">
                        <div className="text-xl font-bold">911</div>
                        <div className="text-sm">For immediate medical emergencies</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-800 mb-2">Crisis Support</div>
                      <div className="text-blue-700">
                        <div className="text-xl font-bold">988</div>
                        <div className="text-sm">Suicide & Crisis Lifeline</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Confirmation State */}
          {step === 'confirm' && selectedLevel && countdown !== null && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-orange-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Clock className="h-12 w-12 text-orange-600" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedLevel} Alert Starting
                  </h2>

                  <div className="text-6xl font-bold text-orange-600 mb-4">
                    {countdown}
                  </div>

                  <p className="text-gray-600 mb-6">
                    Your responders will be notified automatically. 
                    Cancel if this was triggered by accident.
                  </p>

                  <textarea
                    placeholder="Optional: Add details about your situation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                    rows={3}
                  />

                  <div className="flex space-x-4">
                    <Button 
                      onClick={cancelCountdown}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={triggerEmergency}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={loading}
                    >
                      Trigger Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Active Emergency State */}
          {step === 'active' && activeEmergency && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  Emergency alert active - Your responders have been notified
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 mr-2 text-red-500" />
                      Active Emergency
                    </div>
                    <Badge variant="destructive" className="animate-pulse">
                      {activeEmergency.alertLevel}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-600">Alert triggered</div>
                    <div className="text-lg font-semibold">
                      {new Date(activeEmergency.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {activeEmergency.description && (
                    <div>
                      <div className="text-sm text-gray-600">Description</div>
                      <div className="text-gray-900">{activeEmergency.description}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {activeEmergency.alerts?.length || 0}
                      </div>
                      <div className="text-sm text-blue-700">Alerts Sent</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {activeEmergency.responses?.filter((r: any) => r.status === 'acknowledged').length || 0}
                      </div>
                      <div className="text-sm text-green-700">Acknowledged</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {activeEmergency.responses?.filter((r: any) => r.status === 'en_route').length || 0}
                      </div>
                      <div className="text-sm text-purple-700">En Route</div>
                    </div>
                  </div>

                  {/* Responder Status */}
                  {activeEmergency.responses && activeEmergency.responses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Responder Status</h4>
                      <div className="space-y-2">
                        {activeEmergency.responses.map((response: any) => (
                          <div key={response.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {response.responder.firstName} {response.responder.lastName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {response.responder.phone}
                                </div>
                              </div>
                            </div>
                            <Badge variant={
                              response.status === 'acknowledged' ? 'default' :
                              response.status === 'en_route' ? 'secondary' :
                              'outline'
                            }>
                              {response.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button 
                      onClick={resolveEmergency}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 911
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
