
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Send, 
  ArrowLeft,
  AlertTriangle,
  Heart,
  Activity,
  Clock,
  Shield,
  Zap,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatDistanceToNow } from '@/lib/utils'
import Link from 'next/link'

interface AIChatInterfaceProps {
  aiAgent: any
  currentSession: any
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatInterface({ aiAgent, currentSession }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    currentSession?.messages || []
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(currentSession?.id)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText: string, sessionType: string = 'GENERAL') => {
    if (!messageText.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          sessionType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let aiResponseContent = ''
      let currentSessionId = sessionId
      let partialRead = ''

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      while (true) {
        const { done, value } = await reader?.read() || { done: true, value: undefined }
        if (done) break

        partialRead += decoder.decode(value, { stream: true })
        let lines = partialRead.split('\n')
        partialRead = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                aiResponseContent += parsed.content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, content: aiResponseContent }
                      : msg
                  )
                )
              }
              if (parsed.sessionId && !currentSessionId) {
                currentSessionId = parsed.sessionId
                setSessionId(parsed.sessionId)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again, and if this persists, consider reaching out to your emergency contacts.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
    }
  }

  const triggerEmergencyAlert = () => {
    setIsEmergencyMode(true)
    sendMessage('I\'m having thoughts of using. I need help right now.', 'PRE_USE_ALERT')
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{aiAgent.name}</h1>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Online & Ready to Help
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isEmergencyMode && (
                <Badge variant="destructive" className="animate-pulse">
                  Emergency Mode
                </Badge>
              )}
              <Button
                onClick={triggerEmergencyAlert}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                GO Button
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                AI Guardian Chat
              </div>
              <div className="text-sm text-gray-600">
                Session started {formatDistanceToNow(new Date(currentSession?.startedAt || aiAgent.createdAt))}
              </div>
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getGreeting()}! I'm {aiAgent.name}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  I'm your personal AI guardian angel, here 24/7 to support you on your recovery journey. 
                  How can I help you today?
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage('How are you monitoring my wellbeing?')}
                    className="text-left h-auto p-4"
                  >
                    <Activity className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Check Status</div>
                      <div className="text-xs text-gray-500">Current monitoring</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage('I\'m having a difficult day and could use some support.')}
                    className="text-left h-auto p-4"
                  >
                    <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Need Support</div>
                      <div className="text-xs text-gray-500">I'm struggling</div>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Chat Messages */}
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-last' : 'order-first'}`}>
                    <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}>
                        {message.role === 'user' ? (
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        ) : (
                          <Brain className="h-4 w-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-lg p-4 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                          {message.content}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatDistanceToNow(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Emergency Alert */}
          {isEmergencyMode && (
            <Alert className="mx-6 mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Emergency mode activated. Your responders may be notified if you need immediate help.
              </AlertDescription>
            </Alert>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick Actions */}
            <div className="flex space-x-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage('I need some coping strategies.')}
                disabled={loading}
              >
                Coping Help
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage('Can you check my current status?')}
                disabled={loading}
              >
                Status Check
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage('I\'m feeling anxious right now.')}
                disabled={loading}
              >
                Feeling Anxious
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Agent Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Always confidential
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Available 24/7
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Here to support you
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
