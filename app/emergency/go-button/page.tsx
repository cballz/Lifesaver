
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { EmergencyGOButton } from '@/components/emergency/emergency-go-button'

export const dynamic = 'force-dynamic'

export default async function EmergencyGOButtonPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user's complete emergency data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      responderNetworks: {
        include: {
          responder: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              zipCode: true,
              narcanTrained: true
            }
          }
        },
        orderBy: { priority: 'asc' }
      },
      aiAgent: true,
      biometricProfile: true,
      emergenciesAsUser: {
        where: {
          status: { in: ['ACTIVE', 'RESPONDING'] }
        },
        include: {
          responses: {
            include: {
              responder: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return <EmergencyGOButton user={user} />
}
