
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const emergencyId = params.id

    // Verify the emergency belongs to the user
    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
      include: {
        user: true
      }
    })

    if (!emergency) {
      return NextResponse.json({ error: 'Emergency not found' }, { status: 404 })
    }

    if (emergency.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Update emergency status
    const updatedEmergency = await prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedBy: session.user.id
      }
    })

    // Log the resolution
    await prisma.emergencyLog.create({
      data: {
        emergencyId,
        action: 'EMERGENCY_RESOLVED',
        details: 'Emergency resolved by user',
        performedBy: session.user.id
      }
    })

    // Update all pending alerts
    await prisma.alert.updateMany({
      where: {
        emergencyId,
        status: { in: ['PENDING', 'SENT'] }
      },
      data: {
        status: 'ACKNOWLEDGED'
      }
    })

    // Update all response statuses
    await prisma.emergencyResponse.updateMany({
      where: { emergencyId },
      data: {
        status: 'completed'
      }
    })

    return NextResponse.json({
      success: true,
      emergency: updatedEmergency,
      message: 'Emergency resolved successfully'
    })

  } catch (error) {
    console.error('Emergency resolution error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve emergency' },
      { status: 500 }
    )
  }
}
