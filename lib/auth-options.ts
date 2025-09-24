
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            aiAgent: true,
            biometricProfile: true
          }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone || undefined,
          zipCode: user.zipCode,
          narcanTrained: user.narcanTrained,
          consentToShare: user.consentToShare,
          hasAIAgent: !!user.aiAgent,
          hasBiometricProfile: !!user.biometricProfile
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.zipCode = user.zipCode
        token.narcanTrained = user.narcanTrained
        token.consentToShare = user.consentToShare
        token.hasAIAgent = user.hasAIAgent
        token.hasBiometricProfile = user.hasBiometricProfile
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.phone = token.phone
        session.user.zipCode = token.zipCode
        session.user.narcanTrained = token.narcanTrained
        session.user.consentToShare = token.consentToShare
        session.user.hasAIAgent = token.hasAIAgent
        session.user.hasBiometricProfile = token.hasBiometricProfile
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  secret: process.env.NEXTAUTH_SECRET
}
