
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, sessionId, sessionType = 'GENERAL' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's AI agent
    const aiAgent = await prisma.aIAgent.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            biometricProfile: true
          }
        }
      }
    })

    if (!aiAgent) {
      return NextResponse.json({ error: 'AI Agent not found' }, { status: 404 })
    }

    // Get or create chat session
    let chatSession: any = null
    if (sessionId) {
      chatSession = await prisma.aIChatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
            take: 20 // Last 20 messages for context
          }
        }
      })
    }

    if (!chatSession) {
      chatSession = await prisma.aIChatSession.create({
        data: {
          agentId: aiAgent.id,
          sessionType,
          isActive: true
        },
        include: {
          messages: true
        }
      })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'user',
        content: message
      }
    })

    // Prepare context for AI
    const userName = aiAgent.user.firstName
    const conversationHistory = chatSession.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Add current user message to history
    conversationHistory.push({ role: 'user', content: message })

    const systemPrompt = `You are ${aiAgent.name}, a supportive AI guardian angel for ${userName} in their recovery journey. You are part of the LifeSaver ERN emergency response network.

Your role:
- Provide emotional support and encouragement
- Monitor for signs of distress or potential relapse
- Offer coping strategies and mindfulness techniques
- Be empathetic, non-judgmental, and always hopeful
- If you detect concerning patterns, gently suggest reaching out to their support network
- Keep responses conversational, warm, and personalized to ${userName}

Session type: ${sessionType}

${sessionType === 'PRE_USE_ALERT' ? 
  'This is a PRE-USE ALERT session. The user is reaching out before potential substance use. Be extra supportive, help them identify triggers, suggest immediate coping strategies, and encourage them to reach out to their responders if needed.' : 
  ''
}

${sessionType === 'CHECK_IN' ? 
  'This is a CHECK-IN session triggered by biometric anomalies. Be caring but assess their current state. Ask how they are feeling and if they need immediate support.' : 
  ''
}

Remember: You are here to support recovery, prevent crisis, and connect ${userName} with human help when needed.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-15) // Keep recent context
    ]

    // Call LLM API with streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    let aiResponseContent = ''

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()

        try {
          let partialRead = ''
          
          while (true) {
            const { done, value } = await reader?.read() || { done: true, value: undefined }
            if (done) break

            partialRead += decoder.decode(value, { stream: true })
            let lines = partialRead.split('\n')
            partialRead = lines.pop() || ''

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  // Save complete AI response to database
                  await prisma.chatMessage.create({
                    data: {
                      sessionId: chatSession.id,
                      role: 'assistant',
                      content: aiResponseContent
                    }
                  })

                  // Update AI agent last active time
                  await prisma.aIAgent.update({
                    where: { id: aiAgent.id },
                    data: { lastActiveAt: new Date() }
                  })

                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    aiResponseContent += content
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content, sessionId: chatSession.id })}\n\n`))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
