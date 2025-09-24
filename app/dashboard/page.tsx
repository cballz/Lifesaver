
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { UserDashboard } from '@/components/dashboard/user-dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch user data with all relationships
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      aiAgent: true,
      biometricProfile: {
        include: {
          biometricData: {
            orderBy: { timestamp: 'desc' },
            take: 20
          },
          checkIns: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      },
      responderNetworks: {
        include: {
          responder: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              zipCode: true,
              narcanTrained: true,
              role: true
            }
          }
        },
        orderBy: { priority: 'asc' }
      },
      emergenciesAsUser: {
        include: {
          alerts: true,
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
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      socialPosts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      },
      treeOfLifeEntries: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return <UserDashboard user={user} />
}
