
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

    const { alertLevel, location, description, triggerType = 'manual' } = await request.json()

    if (!alertLevel) {
      return NextResponse.json({ error: 'Alert level is required' }, { status: 400 })
    }

    // Get user and their responder network
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        responderNetworks: {
          include: {
            responder: true
          },
          where: { isActive: true },
          orderBy: { priority: 'asc' }
        },
        aiAgent: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create emergency record
    const emergency = await prisma.emergency.create({
      data: {
        userId: user.id,
        alertLevel,
        location: location ? JSON.stringify(location) : null,
        description: description || `${alertLevel} level emergency triggered via ${triggerType}`,
        status: 'ACTIVE'
      }
    })

    // Log the emergency trigger
    await prisma.emergencyLog.create({
      data: {
        emergencyId: emergency.id,
        action: 'EMERGENCY_TRIGGERED',
        details: `${alertLevel} level emergency activated by user via ${triggerType}`,
        performedBy: user.id
      }
    })

    // Create check-in record if triggered by AI
    if (user.aiAgent && triggerType === 'ai_escalation') {
      await prisma.aICheckIn.create({
        data: {
          agentId: user.aiAgent.id,
          triggerReason: 'Emergency escalation from pre-use alert',
          checkInType: 'PRE_USE_ALERT',
          status: 'escalated',
          escalated: true,
          escalatedAt: new Date()
        }
      })
    }

    // Notify responders based on alert level
    let respondersToNotify = user.responderNetworks

    if (alertLevel === 'YELLOW') {
      // For yellow alerts, notify top 2 priority responders
      respondersToNotify = user.responderNetworks.slice(0, 2)
    } else if (alertLevel === 'GREEN') {
      // For green alerts (pre-use), notify top 1 responder
      respondersToNotify = user.responderNetworks.slice(0, 1)
    }

    const alertPromises = []

    for (const responderNetwork of respondersToNotify) {
      const responder = responderNetwork.responder

      // Create alert record
      const alertRecord = await prisma.alert.create({
        data: {
          emergencyId: emergency.id,
          senderId: user.id,
          receiverId: responder.id,
          alertType: 'SMS', // Primary notification method
          message: generateAlertMessage(user, emergency, responder),
          status: 'PENDING'
        }
      })

      // Create emergency response record
      await prisma.emergencyResponse.create({
        data: {
          emergencyId: emergency.id,
          responderId: responder.id,
          status: 'notified',
          hasNarcan: responder.narcanTrained || false
        }
      })

      // TODO: Send actual SMS/email when API keys are available
      // For now, just mark as sent
      alertPromises.push(
        prisma.alert.update({
          where: { id: alertRecord.id },
          data: { 
            status: 'SENT',
            sentAt: new Date()
          }
        })
      )

      // Log responder notification
      await prisma.emergencyLog.create({
        data: {
          emergencyId: emergency.id,
          action: 'RESPONDER_NOTIFIED',
          details: `${responder.firstName} ${responder.lastName} notified via SMS`,
          performedBy: user.id
        }
      })
    }

    await Promise.all(alertPromises)

    // Get complete emergency data for response
    const completeEmergency = await prisma.emergency.findUnique({
      where: { id: emergency.id },
      include: {
        alerts: {
          include: {
            receiver: {
              select: {
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        },
        responses: {
          include: {
            responder: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                narcanTrained: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      emergency: completeEmergency,
      message: `${alertLevel} alert activated. ${respondersToNotify.length} responders notified.`
    })

  } catch (error) {
    console.error('Emergency trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger emergency alert' },
      { status: 500 }
    )
  }
}

function generateAlertMessage(user: any, emergency: any, responder: any) {
  const urgencyText = {
    'GREEN': 'Pre-use Alert',
    'YELLOW': 'Check-in Alert', 
    'RED': 'EMERGENCY ALERT'
  }

  const actionText = {
    'GREEN': 'has activated a pre-use alert and may need support to avoid substance use',
    'YELLOW': 'needs someone to check on them - they may be in distress',
    'RED': 'is experiencing a medical emergency and needs immediate help'
  }

  return `🚨 ${urgencyText[emergency.alertLevel as keyof typeof urgencyText]} 

${user.firstName} ${user.lastName} ${actionText[emergency.alertLevel as keyof typeof actionText]}.

${emergency.location ? `Location: ${JSON.parse(emergency.location).address || 'Location shared'}` : 'Location: Not provided'}

${responder.narcanTrained ? '✓ You are Narcan trained' : '⚠️ Consider bringing Narcan if available'}

This is an automated alert from the LifeSaver ERN emergency response network.

Reply RESPOND if you can help, or call ${user.phone || 'the person'} directly.`
}
