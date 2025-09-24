

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, MessageCircle, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'
import { EmergencyTreeMorph } from '@/components/emergency/emergency-tree-morph'

export function CommunityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-600 mt-2">Connect with others on their recovery journey</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Community Feed
                </div>
                <Button size="sm" onClick={() => alert('Share post form will open here!')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    SM
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">Sarah M.</span>
                      <Badge variant="outline" className="text-xs">30 Days Sober</Badge>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm">
                      Hit my 30-day milestone today! The Tree of Life visualization has been so helpful in tracking my progress. 
                      Grateful for this community and everyone's support. 🌱
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <button 
                        className="flex items-center space-x-1 hover:text-green-600"
                        onClick={() => alert('Heart functionality will be added!')}
                      >
                        <Heart className="h-3 w-3" />
                        <span>12 hearts</span>
                      </button>
                      <button 
                        className="hover:text-blue-600"
                        onClick={() => alert('Reply form will open here!')}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MJ
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">Mike J.</span>
                      <Badge variant="outline" className="text-xs">6 Months Sober</Badge>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm">
                      Reminder that recovery isn't linear. Had a tough day yesterday but my sponsor and this network 
                      helped me through it. The AI check-ins actually helped a lot. One day at a time. 💪
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <button 
                        className="flex items-center space-x-1 hover:text-green-600"
                        onClick={() => alert('Heart functionality will be added!')}
                      >
                        <Heart className="h-3 w-3" />
                        <span>8 hearts</span>
                      </button>
                      <button 
                        className="hover:text-blue-600"
                        onClick={() => alert('Reply form will open here!')}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">247</div>
                <div className="text-xs text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,023</div>
                <div className="text-xs text-gray-600">Days Sober Collectively</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-xs text-gray-600">Lives Saved This Month</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-sm">Virtual Meeting</div>
                <div className="text-xs text-gray-600">Today, 7:00 PM</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-sm">Narcan Training</div>
                <div className="text-xs text-gray-600">Tomorrow, 2:00 PM</div>
              </div>
            </CardContent>
          </Card>

          <div>
            <EmergencyTreeMorph 
              emergencyLevel="GREEN" 
              showControls={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
