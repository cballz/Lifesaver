

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { TreeOfLifePage } from '@/components/tree-of-life/tree-of-life-page'

export default async function TreeOfLife() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <TreeOfLifePage />
}
