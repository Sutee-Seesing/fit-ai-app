'use client'

import { SessionProvider } from 'next-auth/react'
import { UserProfileProvider } from '@/contexts/UserProfileContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProfileProvider>
        {children}
      </UserProfileProvider>
    </SessionProvider>
  )
}
