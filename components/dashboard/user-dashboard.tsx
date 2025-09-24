
'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Activity, 
  Users, 
  Shield, 
  Heart, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Phone,
  Zap,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertStatusIndicator } from '@/components/dashboard/alert-status-indicator'
import { BiometricMonitor } from '@/components/dashboard/biometric-monitor'
import { ResponderNetwork } from '@/components/dashboard/responder-network'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TreeOfLifePreview } from '@/components/dashboard/tree-of-life-preview'
import { SocialFeed } from '@/components/dashboard/social-feed'
import { AIGuardianCard } from '@/components/dashboard/ai-guardian-card'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'

interface UserDashboardProps {
  user: any
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [currentAlert, setCurrentAlert] = useState<'GREEN' | 'YELLOW' | 'RED'>('GREEN')
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  
  useEffect(() => {
    // Simulate biometric monitoring updates
    const interval = setInterval(() => {
      // Randomly trigger check-ins for demo
      if (Math.random() < 0.1) { // 10% chance every interval
        setCurrentAlert(Math.random() < 0.1 ? 'YELLOW' : 'GREEN')
        setLastCheckIn(new Date())
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: 'Days Protected',
      value: Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      title: 'Response Network',
      value: user.responderNetworks?.length || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'AI Check-ins',
      value: user.biometricProfile?.checkIns?.length || 0,
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Community Posts',
      value: user.socialPosts?.length || 0,
      icon: Heart,
      color: 'text-pink-600'
    }
  ]

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Talk to your Guardian Angel',
      icon: MessageSquare,
      href: '/ai-chat',
      color: 'bg-blue-500'
    },
    {
      title: 'Emergency GO',
      description: 'Pre-use alert system',
      icon: AlertTriangle,
      href: '/emergency/go-button',
      color: 'bg-red-500'
    },
    {
      title: 'Manage Network',
      description: 'Add/edit responders',
      icon: Users,
      href: '/responders',
      color: 'bg-green-500'
    },
    {
      title: 'Tree of Life',
      description: 'Track your journey',
      icon: TrendingUp,
      href: '/tree-of-life',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LifeSaver ERN</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.firstName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <AlertStatusIndicator level={currentAlert} />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">You're Protected 24/7</h2>
                <p className="opacity-90">
                  Your AI Guardian Angel is monitoring, and {user.responderNetworks?.length || 0} responders are standing by
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {currentAlert}
                </div>
                <div className="text-sm opacity-75">Current Status</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* AI Guardian Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <AIGuardianCard 
            aiAgent={user.aiAgent} 
            lastCheckIn={lastCheckIn}
            currentAlert={currentAlert}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biometric Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <BiometricMonitor 
                biometricProfile={user.biometricProfile}
                currentAlert={currentAlert}
              />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <RecentActivity 
                checkIns={user.biometricProfile?.checkIns || []}
                emergencies={user.emergenciesAsUser || []}
              />
            </motion.div>

            {/* Social Feed Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialFeed 
                posts={user.socialPosts || []}
                isPreview={true}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Responder Network */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ResponderNetwork 
                responders={user.responderNetworks || []}
                userZipCode={user.zipCode}
              />
            </motion.div>

            {/* Tree of Life Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TreeOfLifePreview 
                entries={user.treeOfLifeEntries || []}
                sobrietyDate={user.treeOfLifeEntries?.find((entry: any) => entry.entryType === 'milestone')?.dateAchieved}
              />
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-red-500" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-red-800 mb-2">Crisis Hotline</div>
                    <div className="text-red-700">
                      <div>988 - Suicide & Crisis Lifeline</div>
                      <div className="text-sm opacity-75">Available 24/7</div>
                    </div>
                  </div>
                  
                  {user.emergencyContact && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-800 mb-2">Personal Emergency Contact</div>
                      <div className="text-blue-700">
                        <div>{user.emergencyContact}</div>
                        {user.emergencyContactPhone && (
                          <div className="text-sm">{user.emergencyContactPhone}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href="/emergency/go-button">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Zap className="h-4 w-4 mr-2" />
                      Emergency GO Button
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
