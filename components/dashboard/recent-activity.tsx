
'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User,
  Brain,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from '@/lib/utils'

interface RecentActivityProps {
  checkIns: any[]
  emergencies: any[]
}

export function RecentActivity({ checkIns, emergencies }: RecentActivityProps) {
  // Combine and sort activities
  const activities = [
    ...checkIns.map(checkIn => ({
      id: checkIn.id,
      type: 'checkin',
      title: getCheckInTitle(checkIn),
      description: checkIn.triggerReason,
      timestamp: new Date(checkIn.createdAt),
      status: checkIn.status,
      icon: getCheckInIcon(checkIn.checkInType),
      color: getCheckInColor(checkIn.status),
      data: checkIn
    })),
    ...emergencies.map(emergency => ({
      id: emergency.id,
      type: 'emergency',
      title: `Emergency Alert - ${emergency.alertLevel}`,
      description: emergency.description || `${emergency.alertLevel} level emergency activated`,
      timestamp: new Date(emergency.createdAt),
      status: emergency.status,
      icon: AlertTriangle,
      color: getEmergencyColor(emergency.alertLevel),
      data: emergency
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

  function getCheckInTitle(checkIn: any) {
    switch (checkIn.checkInType) {
      case 'ROUTINE':
        return 'Routine Check-in'
      case 'BIOMETRIC_TRIGGER':
        return 'Biometric Alert'
      case 'PRE_USE_ALERT':
        return 'Pre-use Alert'
      case 'MISSED_CHECKIN':
        return 'Missed Check-in'
      default:
        return 'AI Check-in'
    }
  }

  function getCheckInIcon(type: string) {
    switch (type) {
      case 'ROUTINE':
        return Clock
      case 'BIOMETRIC_TRIGGER':
        return Activity
      case 'PRE_USE_ALERT':
        return AlertTriangle
      case 'MISSED_CHECKIN':
        return MessageSquare
      default:
        return Brain
    }
  }

  function getCheckInColor(status: string) {
    switch (status) {
      case 'responded':
        return 'text-green-600 bg-green-50'
      case 'escalated':
        return 'text-red-600 bg-red-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  function getEmergencyColor(level: string) {
    switch (level) {
      case 'GREEN':
        return 'text-green-600 bg-green-50'
      case 'YELLOW':
        return 'text-yellow-600 bg-yellow-50'
      case 'RED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          Recent Activity
          <Badge variant="outline" className="ml-2">
            {activities.length} events
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!activities.length ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">All Quiet</h3>
            <p className="text-sm text-gray-600">
              No recent activity. Your AI guardian is monitoring quietly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate">
                        {activity.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${activity.color} border-current`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(activity.timestamp)}
                      
                      {activity.type === 'checkin' && activity.data.responseTime && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Response: {activity.data.responseTime}s</span>
                        </>
                      )}
                      
                      {activity.type === 'emergency' && activity.data.responses?.length > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{activity.data.responses.length} responders notified</span>
                        </>
                      )}
                    </div>

                    {/* User Response */}
                    {activity.type === 'checkin' && activity.data.userResponse && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <div className="flex items-center text-blue-700">
                          <User className="h-3 w-3 mr-1" />
                          Your response:
                        </div>
                        <p className="text-blue-900 mt-1">"{activity.data.userResponse}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* View All Link */}
            <div className="text-center pt-4 border-t">
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                View all activity
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
