
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Star, 
  Calendar,
  Users,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'

interface SocialFeedProps {
  posts: any[]
  isPreview?: boolean
}

export function SocialFeed({ posts, isPreview = false }: SocialFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'MILESTONE':
        return 'bg-yellow-100 text-yellow-800'
      case 'STORY':
        return 'bg-blue-100 text-blue-800'
      case 'SUPPORT_REQUEST':
        return 'bg-red-100 text-red-800'
      case 'ENCOURAGEMENT':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const displayPosts = isPreview ? posts?.slice(0, 3) : posts

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-500" />
            {isPreview ? 'Community Feed' : 'Recovery Community'}
            <Badge variant="outline" className="ml-2">
              {posts?.length || 0} posts
            </Badge>
          </div>
          {isPreview ? (
            <Link href="/community">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!displayPosts?.length ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Join the Community</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share your journey, celebrate milestones, and support others in recovery
            </p>
            <Link href="/community">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayPosts.map((post, index) => {
              const isLiked = likedPosts.has(post.id)
              const userInitials = `${post.user?.firstName?.[0] || ''}${post.user?.lastName?.[0] || 'A'}`.toUpperCase()

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarContent src={""} />
                        <AvatarFallback className="bg-pink-500 text-white text-xs">
                          {post.isAnonymous ? '?' : userInitials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {post.isAnonymous ? 'Anonymous' : `${post.user?.firstName || 'Community'} ${post.user?.lastName?.[0] || 'M'}.`}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={getPostTypeColor(post.postType)}
                          >
                            {post.postType.toLowerCase().replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(post.createdAt))}
                          {post.isAnonymous ? (
                            <EyeOff className="h-3 w-3 ml-2" />
                          ) : (
                            <Eye className="h-3 w-3 ml-2" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Badge */}
                    {post.postType === 'MILESTONE' && post.sobrietyDate && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">
                          {Math.floor((new Date().getTime() - new Date(post.sobrietyDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-yellow-600">days</div>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Milestones */}
                    {post.milestones && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {Object.entries(post.milestones).map(([key, value]: [string, any]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {Array.isArray(value) ? value.join(', ') : `${key}: ${value}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          isLiked 
                            ? 'text-pink-600 hover:text-pink-700' 
                            : 'text-gray-500 hover:text-pink-600'
                        }`}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                        />
                        <span>{post.likes + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Public/Private Indicator */}
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      post.isPublic 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>

                  {/* Comments Preview */}
                  {post.comments?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="space-y-2">
                        {post.comments.slice(0, 2).map((comment: any) => (
                          <div key={comment.id} className="flex items-start space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarContent src={""} />
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {comment.user?.firstName?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-medium text-gray-900 mr-2">
                                  {comment.user?.firstName || 'User'}
                                </span>
                                <span className="text-gray-700">{comment.content}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(comment.createdAt))}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {post.comments.length > 2 && (
                          <button className="text-xs text-blue-600 hover:text-blue-800 ml-8">
                            View {post.comments.length - 2} more comments
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}

            {/* Load More / View All */}
            {isPreview && posts?.length > 3 && (
              <div className="text-center pt-4">
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    View All Community Posts ({posts.length - 3} more)
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
