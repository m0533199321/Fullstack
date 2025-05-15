"use client"

import { useState, useEffect } from "react"
import { getAllergies } from "./Services/AllergiesService"
import { getPreferences } from "./Services/PreferencesService"

interface ProfileStatus {
  isComplete: boolean
  hasAllergies: boolean
  hasPreferences: boolean
  loading: boolean
}

export function useProfileCompletion(userId: number | null): ProfileStatus {
  const [status, setStatus] = useState<ProfileStatus>({
    isComplete: false,
    hasAllergies: false,
    hasPreferences: false,
    loading: true,
  })

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!userId) {
        setStatus({
          isComplete: false,
          hasAllergies: false,
          hasPreferences: false,
          loading: false,
        })
        return
      }

      try {
        // בדיקת אלרגיות
        const allergies = await getAllergies(userId)
        const hasAllergies = allergies && allergies.length > 0

        // בדיקת העדפות
        const preferences = await getPreferences(userId)
        const hasPreferences = preferences && preferences.length > 0

        setStatus({
          isComplete: hasAllergies && hasPreferences,
          hasAllergies,
          hasPreferences,
          loading: false,
        })
      } catch (error) {
        console.error("שגיאה בבדיקת שלמות הפרופיל:", error)
        setStatus({
          isComplete: false,
          hasAllergies: false,
          hasPreferences: false,
          loading: false,
        })
      }
    }

    checkProfileCompletion()
  }, [userId])

  return status
}
