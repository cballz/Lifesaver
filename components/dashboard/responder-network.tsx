
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Phone, 
  Shield, 
  Star, 
  Plus,
  UserCheck,
  Clock,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar'
import { calculateDistance, formatPhoneNumber } from '@/lib/utils'
import Link from 'next/link'

interface ResponderNetworkProps {
  responders: any[]
  userZipCode: string
}

export function ResponderNetwork({ responders, userZipCode }: ResponderNetworkProps) {
  const [selectedResponder, setSelectedResponder] = useState<string | null>(null)

  const getRelationshipColor = (relationship: string) => {
    switch (relationship?.toLowerCase()) {
      case 'family':
        return 'bg-pink-100 text-pink-800'
      case 'friend':
        return 'bg-blue-100 text-blue-800'
      case 'neighbor':
        return 'bg-green-100 text-green-800'
      case 'volunteer':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 1) return 'text-red-600'
    if (priority <= 3) return 'text-orange-600'
    return 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Response Network
            <Badge variant="outline" className="ml-2">
              {responders?.length || 0} Active
            </Badge>
          </div>
          <Link href="/responders">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!responders?.length ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Responders Yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Build your emergency response network by adding trusted contacts
            </p>
            <Link href="/responders">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Responder
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {responders.map((responderNetwork, index) => {
              const responder = responderNetwork.responder
              const distance = calculateDistance(userZipCode, responder.zipCode)
              const initials = `${responder.firstName?.[0] || ''}${responder.lastName?.[0] || ''}`.toUpperCase()

              return (
                <motion.div
                  key={responderNetwork.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedResponder === responderNetwork.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedResponder(
                    selectedResponder === responderNetwork.id ? null : responderNetwork.id
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarContent src={""} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {responder.firstName} {responder.lastName}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={getRelationshipColor(responderNetwork.relationship)}
                          >
                            {responderNetwork.relationship}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {distance.toFixed(1)} mi
                          </div>
                          
                          <div className={`flex items-center font-medium ${getPriorityColor(responderNetwork.priority)}`}>
                            <Star className="h-3 w-3 mr-1" />
                            Priority {responderNetwork.priority}
                          </div>
                          
                          {responder.narcanTrained && (
                            <div className="flex items-center text-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Narcan Trained
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {(responderNetwork.responseRate * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Response Rate</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedResponder === responderNetwork.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Contact Info</div>
                          <div className="flex items-center text-gray-900">
                            <Phone className="h-3 w-3 mr-1" />
                            {formatPhoneNumber(responder.phone || 'Not provided')}
                          </div>
                          <div className="text-gray-600 mt-1">Zip: {responder.zipCode}</div>
                        </div>
                        
                        <div>
                          <div className="text-gray-600 mb-1">Last Contact</div>
                          <div className="flex items-center text-gray-900">
                            <Clock className="h-3 w-3 mr-1" />
                            {responderNetwork.lastContacted 
                              ? new Date(responderNetwork.lastContacted).toLocaleDateString()
                              : 'Never'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Test Alert
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {/* Network Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium text-green-800">Network Ready</div>
                    <div className="text-sm text-green-700">
                      {responders.filter(r => r.responder.narcanTrained).length} Narcan-trained • 
                      Avg {Math.round(responders.reduce((acc, r) => acc + r.responseRate, 0) / responders.length * 100)}% response rate
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
