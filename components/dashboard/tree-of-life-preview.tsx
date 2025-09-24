
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TreePine, 
  Star, 
  Target, 
  BookOpen, 
  Plus,
  Calendar,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSobrietyDays } from '@/lib/utils'
import Link from 'next/link'

interface TreeOfLifePreviewProps {
  entries: any[]
  sobrietyDate?: Date
}

export function TreeOfLifePreview({ entries, sobrietyDate }: TreeOfLifePreviewProps) {
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  
  const sobrietyDays = sobrietyDate ? getSobrietyDays(sobrietyDate) : 0

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return Star
      case 'goal':
        return Target
      case 'reflection':
        return BookOpen
      default:
        return Star
    }
  }

  const getEntryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      gold: 'bg-yellow-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500'
    }
    return colors[color] || 'bg-blue-500'
  }

  const milestones = entries?.filter(entry => entry.entryType === 'milestone') || []
  const goals = entries?.filter(entry => entry.entryType === 'goal') || []
  const reflections = entries?.filter(entry => entry.entryType === 'reflection') || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TreePine className="h-5 w-5 mr-2 text-green-500" />
            Tree of Life
            <Badge variant="outline" className="ml-2">
              {entries?.length || 0} entries
            </Badge>
          </div>
          <Link href="/tree-of-life">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Sobriety Counter */}
        {sobrietyDays > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 mb-1">
                {sobrietyDays}
              </div>
              <div className="text-sm text-green-600">
                Days of Sobriety
              </div>
              <div className="text-xs text-green-600 mt-1">
                Since {sobrietyDate?.toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {!entries?.length ? (
          <div className="text-center py-8">
            <TreePine className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Grow Your Tree</h3>
            <p className="text-sm text-gray-600 mb-4">
              Track milestones, set goals, and reflect on your recovery journey
            </p>
            <Link href="/tree-of-life">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Plant Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tree of Life Image */}
            <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-lg p-6 overflow-hidden">
              <div className="relative h-64 flex items-center justify-center">
                <motion.div 
                  className="relative w-48 h-48 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/tree.jpg"
                    alt="Tree of Life - Your Recovery Journey"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay tree entries as floating elements */}
                  {entries.slice(0, 8).map((entry, index) => {
                    const Icon = getEntryIcon(entry.entryType)
                    const angle = (index * (360 / Math.min(entries.length, 8))) * (Math.PI / 180)
                    const radius = 80 + (index % 2) * 15
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius

                    return (
                      <motion.div
                        key={entry.id}
                        className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg ${getEntryColor(entry.color)}`}
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        onHoverStart={() => setHoveredEntry(entry.id)}
                        onHoverEnd={() => setHoveredEntry(null)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Icon className="h-3 w-3" />
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>

              {/* Hover Tooltip */}
              {hoveredEntry && (
                <motion.div
                  className="absolute top-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {(() => {
                    const entry = entries.find(e => e.id === hoveredEntry)
                    return entry ? (
                      <div>
                        <div className="font-medium text-gray-900">{entry.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{entry.description}</div>
                        {entry.dateAchieved && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(entry.dateAchieved).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : null
                  })()}
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{milestones.length}</div>
                <div className="text-xs text-yellow-700">Milestones</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
                <div className="text-xs text-blue-700">Goals</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reflections.length}</div>
                <div className="text-xs text-purple-700">Reflections</div>
              </div>
            </div>

            {/* Recent Entries */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Entries</h4>
              <div className="space-y-2">
                {entries.slice(0, 3).map((entry, index) => {
                  const Icon = getEntryIcon(entry.entryType)
                  return (
                    <motion.div
                      key={entry.id}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${getEntryColor(entry.color)}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {entry.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.entryType} • {entry.sobrietyDays && `Day ${entry.sobrietyDays}`}
                        </div>
                      </div>
                      {entry.isPublic && (
                        <Award className="h-4 w-4 text-green-500" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <Link href="/tree-of-life">
              <Button variant="outline" className="w-full">
                View Full Tree of Life
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
