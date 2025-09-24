
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  MessageSquare, 
  Activity, 
  Clock, 
  Zap,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'

interface AIGuardianCardProps {
  aiAgent: any
  lastCheckIn: Date | null
  currentAlert: 'GREEN' | 'YELLOW' | 'RED'
}

export function AIGuardianCard({ aiAgent, lastCheckIn, currentAlert }: AIGuardianCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!aiAgent) return null

  const getStatusColor = () => {
    if (currentAlert === 'RED') return 'text-red-500'
    if (currentAlert === 'YELLOW') return 'text-yellow-500'
    return 'text-green-500'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning!'
    if (hour < 17) return 'Good afternoon!'
    return 'Good evening!'
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{aiAgent.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${aiAgent.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {aiAgent.isOnline ? 'Online & Monitoring' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor()}>
              <Activity className="h-3 w-3 mr-1" />
              {currentAlert}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI Message */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">AI Message</div>
                <div className="text-gray-900">
                  {getGreeting()} I'm here monitoring your wellbeing. 
                  {currentAlert === 'GREEN' && " Everything looks great! "}
                  {currentAlert === 'YELLOW' && " I noticed some changes - let's check in. "}
                  {currentAlert === 'RED' && " I'm concerned and reaching out immediately. "}
                  How are you feeling? 💙
                </div>
                {lastCheckIn && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last check-in: {formatDistanceToNow(lastCheckIn)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-xs text-gray-600">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor((new Date().getTime() - new Date(aiAgent.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-gray-600">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link href="/ai-chat" className="flex-1">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
            </Link>
            <Link href="/emergency/go-button" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                Emergency GO
              </Button>
            </Link>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-white/20">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last active: {formatDistanceToNow(new Date(aiAgent.lastActiveAt))}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-pink-500" />
              Always here for you
            </div>
          </div>
        </CardContent>

        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  )
}
