'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile } from '@/types/UserProfile'

interface UserProfileContextType {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  clearProfile: () => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null)

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        // แปลง Date strings กลับเป็น Date objects
        parsed.createdAt = new Date(parsed.createdAt)
        parsed.updatedAt = new Date(parsed.updatedAt)
        setProfileState(parsed)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
  }, [])

  const setProfile = (newProfile: UserProfile | null) => {
    setProfileState(newProfile)
    if (newProfile) {
      localStorage.setItem('userProfile', JSON.stringify(newProfile))
    } else {
      localStorage.removeItem('userProfile')
    }
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    }
    setProfile(updatedProfile)
  }

  const clearProfile = () => {
    setProfile(null)
  }

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, updateProfile, clearProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
