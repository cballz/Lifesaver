
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { AIChatInterface } from '@/components/ai-chat/ai-chat-interface'

export const dynamic = 'force-dynamic'

export default async function AIChatPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user's AI agent and recent chat sessions
  const aiAgent = await prisma.aIAgent.findUnique({
    where: { userId: session.user.id },
    include: {
      chatSessions: {
        where: { isActive: true },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
            take: 50 // Last 50 messages
          }
        },
        orderBy: { startedAt: 'desc' },
        take: 1 // Most recent active session
      }
    }
  })

  if (!aiAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Agent Not Found</h1>
          <p className="text-gray-600">Your AI Guardian Angel needs to be set up first.</p>
        </div>
      </div>
    )
  }

  const currentSession = aiAgent.chatSessions[0] || null

  return <AIChatInterface aiAgent={aiAgent} currentSession={currentSession} />
}
