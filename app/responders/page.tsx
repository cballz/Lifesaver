

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { ResponderNetworkPage } from '@/components/responders/responder-network-page'

export default async function RespondersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <ResponderNetworkPage />
}
