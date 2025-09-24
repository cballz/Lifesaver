
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      zipCode, 
      emergencyContact,
      emergencyContactPhone,
      consentToShare 
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phone,
        zipCode,
        emergencyContact,
        emergencyContactPhone,
        consentToShare: !!consentToShare,
        consentDate: consentToShare ? new Date() : null
      }
    })

    // Create AI Agent for the user
    await prisma.aIAgent.create({
      data: {
        userId: user.id,
        name: 'Guardian Angel',
        personalityType: 'supportive',
        configData: {
          checkInFrequency: 30,
          escalationThreshold: 300,
          personalizedGreeting: `Hey ${firstName}, I'm here to support you on your journey.`
        }
      }
    })

    // Create Biometric Profile
    await prisma.biometricProfile.create({
      data: {
        userId: user.id,
        heartRateMin: 60,
        heartRateMax: 100,
        respiratoryRateMin: 12,
        respiratoryRateMax: 20,
        bloodOxygenMin: 95.0,
        isMonitoringEnabled: true,
        wearableConnected: false
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
