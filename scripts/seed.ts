
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding LifeSaver ERN database...')

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('emergency123', 12)

  // Create test users
  const testUser = await prisma.user.create({
    data: {
      id: 'user-1',
      email: 'alex@lifesaver.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Johnson',
      name: 'Alex Johnson',
      phone: '555-0123',
      zipCode: '90210',
      emergencyContact: 'Sarah Johnson',
      emergencyContactPhone: '555-0456',
      consentToShare: true,
      consentDate: new Date(),
      narcanTrained: true,
      trainingExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    }
  })

  const responder1 = await prisma.user.create({
    data: {
      id: 'responder-1',
      email: 'sarah@lifesaver.com', 
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
      phone: '555-0456',
      zipCode: '90210',
      role: 'RESPONDER',
      consentToShare: true,
      narcanTrained: true,
      trainingExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    }
  })

  const responder2 = await prisma.user.create({
    data: {
      id: 'responder-2',
      email: 'mike@lifesaver.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Chen',
      name: 'Mike Chen',
      phone: '555-0789',
      zipCode: '90211', 
      role: 'RESPONDER',
      consentToShare: true,
      narcanTrained: true,
      trainingExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      id: 'admin-1',
      email: 'admin@lifesaver.com',
      password: hashedPassword,
      firstName: 'Emergency',
      lastName: 'Admin',
      name: 'Emergency Admin',
      phone: '555-ADMIN',
      zipCode: '90210',
      role: 'ADMIN',
      consentToShare: true,
      narcanTrained: true,
    }
  })

  // Test account as requested (hidden from user)
  const testAccount = await prisma.user.create({
    data: {
      id: 'test-account',
      email: 'john@doe.com',
      password: await bcrypt.hash('johndoe123', 12),
      firstName: 'John',
      lastName: 'Doe', 
      name: 'John Doe',
      phone: '555-TEST',
      zipCode: '90210',
      role: 'ADMIN',
      consentToShare: true,
      narcanTrained: true,
    }
  })

  console.log('✅ Users created')

  // Create AI Agents for users
  const aiAgent1 = await prisma.aIAgent.create({
    data: {
      id: 'agent-1',
      userId: testUser.id,
      name: 'Guardian Angel',
      personalityType: 'supportive',
      configData: {
        checkInFrequency: 30, // minutes
        escalationThreshold: 300, // seconds
        personalizedGreeting: "Hey Alex, I'm here to support you on your journey."
      }
    }
  })

  await prisma.aIAgent.create({
    data: {
      id: 'agent-2',
      userId: testAccount.id,
      name: 'Life Companion',
      personalityType: 'encouraging'
    }
  })

  console.log('✅ AI Agents created')

  // Create Biometric Profiles
  await prisma.biometricProfile.create({
    data: {
      id: 'bio-1',
      userId: testUser.id,
      heartRateMin: 60,
      heartRateMax: 100,
      respiratoryRateMin: 12,
      respiratoryRateMax: 20,
      bloodOxygenMin: 95.0,
      isMonitoringEnabled: true,
      wearableConnected: true,
      wearableType: 'Apple Watch'
    }
  })

  await prisma.biometricProfile.create({
    data: {
      id: 'bio-2', 
      userId: testAccount.id,
      isMonitoringEnabled: true,
      wearableConnected: false
    }
  })

  console.log('✅ Biometric Profiles created')

  // Create sample biometric data
  const now = new Date()
  for (let i = 0; i < 20; i++) {
    await prisma.biometricData.create({
      data: {
        profileId: 'bio-1',
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
        respiratoryRate: Math.floor(Math.random() * 8) + 12, // 12-20  
        bloodOxygen: Math.random() * 5 + 95, // 95-100
        motionLevel: Math.random(),
        timestamp: new Date(now.getTime() - i * 30 * 60 * 1000), // Every 30 minutes
        source: 'simulated'
      }
    })
  }

  console.log('✅ Sample biometric data created')

  // Create Responder Networks
  await prisma.responderNetwork.create({
    data: {
      userId: testUser.id,
      responderId: responder1.id,
      relationship: 'family',
      priority: 1,
      distance: 2.5,
      responseRate: 0.95
    }
  })

  await prisma.responderNetwork.create({
    data: {
      userId: testUser.id,
      responderId: responder2.id, 
      relationship: 'friend',
      priority: 2,
      distance: 5.2,
      responseRate: 0.85
    }
  })

  await prisma.responderNetwork.create({
    data: {
      userId: testAccount.id,
      responderId: responder1.id,
      relationship: 'volunteer',
      priority: 1,
      distance: 3.1,
      responseRate: 0.88
    }
  })

  console.log('✅ Responder Networks created')

  // Create Training Modules
  const narcanModule = await prisma.trainingModule.create({
    data: {
      id: 'training-narcan',
      name: 'Narcan Administration Training',
      description: 'Complete training on how to properly administer Narcan (naloxone) during an opioid overdose emergency.',
      content: {
        sections: [
          {
            title: 'Recognizing Overdose Signs',
            content: 'Learn to identify the critical signs of opioid overdose including blue lips, slow/absent breathing, unconsciousness, and cold skin.',
            questions: [
              {
                question: 'What is the most critical sign of opioid overdose?',
                options: ['Blue lips', 'Slow or absent breathing', 'Unconsciousness', 'Cold skin'],
                correct: 1
              }
            ]
          },
          {
            title: 'Narcan Administration Steps', 
            content: 'Step-by-step process for administering intranasal naloxone safely and effectively.',
            questions: [
              {
                question: 'How long should you wait before giving a second dose of Narcan?',
                options: ['30 seconds', '2-3 minutes', '5 minutes', '10 minutes'],
                correct: 1
              }
            ]
          }
        ]
      },
      passingScore: 80
    }
  })

  await prisma.trainingModule.create({
    data: {
      id: 'training-cpr',
      name: 'CPR Basics for Emergencies',
      description: 'Essential CPR techniques for emergency response situations.',
      content: {
        sections: [
          {
            title: 'CPR Fundamentals',
            content: 'Learn the basics of cardiopulmonary resuscitation for emergency situations.',
            questions: [
              {
                question: 'What is the correct compression rate for CPR?',
                options: ['80-100 per minute', '100-120 per minute', '120-140 per minute', '60-80 per minute'],
                correct: 1
              }
            ]
          }
        ]
      },
      passingScore: 85
    }
  })

  console.log('✅ Training Modules created')

  // Create Training Completions
  await prisma.trainingCompletion.create({
    data: {
      userId: responder1.id,
      moduleId: narcanModule.id,
      score: 95,
      passed: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  })

  await prisma.trainingCompletion.create({
    data: {
      userId: responder2.id,
      moduleId: narcanModule.id,
      score: 88,
      passed: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  })

  console.log('✅ Training Completions created')

  // Create sample Social Posts
  await prisma.socialPost.create({
    data: {
      userId: testUser.id,
      content: 'Today marks 90 days clean. Every day is a victory, and I\'m grateful for the support system that keeps me going. The LifeSaver network gives me confidence knowing help is always nearby.',
      postType: 'MILESTONE',
      sobrietyDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      milestones: {
        days: 90,
        achievements: ['First month', 'First 90 days', 'Found support group']
      },
      likes: 15
    }
  })

  await prisma.socialPost.create({
    data: {
      userId: responder1.id,
      content: 'Completed my Narcan training today! Proud to be part of this amazing community helping each other stay safe. Knowledge is power, and this training could save lives.',
      postType: 'STORY',
      likes: 23
    }
  })

  console.log('✅ Social Posts created')

  // Create Tree of Life Entries
  await prisma.treeOfLifeEntry.create({
    data: {
      userId: testUser.id,
      entryType: 'milestone',
      title: 'First Month Clean', 
      description: 'Reached my first major milestone - 30 days without using. The hardest part is behind me.',
      dateAchieved: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      sobrietyDays: 30,
      isPublic: true,
      color: 'blue',
      position: { x: 100, y: 200 }
    }
  })

  await prisma.treeOfLifeEntry.create({
    data: {
      userId: testUser.id,
      entryType: 'milestone',
      title: '90 Days Strong',
      description: 'Three months of sobriety! Feeling stronger every day and building a life I can be proud of.',
      dateAchieved: new Date(),
      sobrietyDays: 90,
      isPublic: true,
      color: 'green',
      position: { x: 150, y: 150 }
    }
  })

  await prisma.treeOfLifeEntry.create({
    data: {
      userId: testUser.id,
      entryType: 'goal',
      title: 'One Year Vision',
      description: 'My goal is to reach one full year of sobriety and help others on their journey.',
      isPublic: false,
      color: 'gold',
      position: { x: 200, y: 100 }
    }
  })

  console.log('✅ Tree of Life Entries created')

  // Create sample AI Chat Sessions and Messages
  const chatSession = await prisma.aIChatSession.create({
    data: {
      id: 'chat-1',
      agentId: aiAgent1.id,
      sessionType: 'GENERAL',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  })

  await prisma.chatMessage.create({
    data: {
      sessionId: chatSession.id,
      role: 'assistant',
      content: 'Hey Alex! How are you feeling today? I noticed your heart rate has been stable - that\'s great to see.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  })

  await prisma.chatMessage.create({
    data: {
      sessionId: chatSession.id,
      role: 'user', 
      content: 'I\'m doing okay, thanks for checking in. Had some cravings earlier but I made it through.',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    }
  })

  await prisma.chatMessage.create({
    data: {
      sessionId: chatSession.id,
      role: 'assistant',
      content: 'I\'m proud of you for pushing through those cravings. That takes real strength. Remember, your support network is here for you. Would you like to practice some coping strategies?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  })

  console.log('✅ Chat Sessions and Messages created')

  // Create sample Check-ins
  await prisma.aICheckIn.create({
    data: {
      agentId: aiAgent1.id,
      biometricProfileId: 'bio-1',
      triggerReason: 'Elevated heart rate detected (110 bpm)',
      checkInType: 'BIOMETRIC_TRIGGER',
      status: 'responded',
      userResponse: 'Just finished exercising, all good!',
      responseTime: 45,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  })

  await prisma.aICheckIn.create({
    data: {
      agentId: aiAgent1.id,
      triggerReason: 'Routine wellness check',
      checkInType: 'ROUTINE', 
      status: 'responded',
      userResponse: 'Feeling strong today, thanks for checking!',
      responseTime: 120,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  })

  console.log('✅ Check-ins created')

  console.log('🎉 LifeSaver ERN database seeding completed successfully!')
  console.log(`
  Test Accounts Created:
  - alex@lifesaver.com (User) - password: emergency123
  - sarah@lifesaver.com (Responder) - password: emergency123  
  - mike@lifesaver.com (Responder) - password: emergency123
  - admin@lifesaver.com (Admin) - password: emergency123
  - john@doe.com (Admin) - password: johndoe123
  
  The emergency response network is ready for testing!
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
