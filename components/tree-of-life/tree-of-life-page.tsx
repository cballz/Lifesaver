

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TreePine, Plus, Calendar, Target, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function TreeOfLifePage() {
  const [selectedView, setSelectedView] = useState<'tree' | 'timeline'>('tree')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <TreePine className="h-8 w-8 mr-3 text-green-500" />
            Tree of Life
          </h1>
          <p className="text-gray-600 mt-2">Track your recovery journey, milestones, and personal growth</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border">
            <Button 
              variant={selectedView === 'tree' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setSelectedView('tree')}
            >
              Tree View
            </Button>
            <Button 
              variant={selectedView === 'timeline' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setSelectedView('timeline')}
            >
              Timeline
            </Button>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Recovery Tree</span>
                <Button size="sm" onClick={() => alert('Add Entry form will open here!')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedView === 'tree' ? (
                <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-lg p-8 min-h-[500px]">
                  <div className="relative h-96 flex items-center justify-center">
                    <motion.div 
                      className="relative w-64 h-64 rounded-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="/tree.jpg"
                        alt="Your Tree of Life"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Sample entries floating around the tree */}
                      {[
                        { id: 1, title: '30 Days Sober', type: 'milestone', color: 'gold', angle: 0 },
                        { id: 2, title: 'Find Sponsor', type: 'goal', color: 'blue', angle: 60 },
                        { id: 3, title: 'First Meeting', type: 'reflection', color: 'green', angle: 120 },
                        { id: 4, title: '90 Days Clean', type: 'milestone', color: 'purple', angle: 180 },
                        { id: 5, title: 'Rebuild Relationships', type: 'goal', color: 'pink', angle: 240 },
                        { id: 6, title: 'Gratitude Practice', type: 'reflection', color: 'blue', angle: 300 }
                      ].map((entry, index) => {
                        const angle = (entry.angle) * (Math.PI / 180)
                        const radius = 100 + (index % 2) * 20
                        const x = Math.cos(angle) * radius
                        const y = Math.sin(angle) * radius

                        const getIcon = (type: string) => {
                          switch (type) {
                            case 'milestone': return Star
                            case 'goal': return Target
                            case 'reflection': return BookOpen
                            default: return Star
                          }
                        }

                        const getColor = (color: string) => {
                          const colors: { [key: string]: string } = {
                            gold: 'bg-yellow-500',
                            blue: 'bg-blue-500',
                            green: 'bg-green-500',
                            purple: 'bg-purple-500',
                            pink: 'bg-pink-500'
                          }
                          return colors[color] || 'bg-blue-500'
                        }

                        const Icon = getIcon(entry.type)

                        return (
                          <motion.div
                            key={entry.id}
                            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg ${getColor(entry.color)}`}
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            title={entry.title}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </div>

                  <div className="mt-8 text-center">
                    <div className="text-4xl font-bold text-green-700 mb-2">127 Days</div>
                    <div className="text-green-600">Days of Sobriety</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Timeline view placeholder */}
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Timeline view coming soon</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-xs text-yellow-700">Milestones</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-xs text-blue-700">Active Goals</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-xs text-purple-700">Reflections</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Milestone form will open here!')}>
                <Star className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Goal setting form will open here!')}>
                <Target className="h-4 w-4 mr-2" />
                Set New Goal
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Reflection form will open here!')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Write Reflection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
