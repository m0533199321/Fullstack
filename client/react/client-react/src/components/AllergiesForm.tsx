import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, AlertCircle } from "lucide-react"
import { getAllergies, updateUserAllergies } from "./Services/AllergiesService"
import "../styles/AllergiesForm.css"

// Enum מקביל ל-C# enum בצד הקליינט
export enum AllergyType {
  None = 0,
  Gluten = 1,
  Dairy = 2,
  Eggs = 3,
  Peanuts = 4,
  Soy = 5,
  Sesame = 6,
  Fish = 7,
  Shellfish = 8,
  Mustard = 9,
  Corn = 10,
}

// ממיר את ה-enum לאובייקט שניתן להציג בממשק
const allergyOptions = Object.entries(AllergyType)
  .filter(([key]) => isNaN(Number(key))) // מסנן את המפתחות המספריים
  .map(([key, value]) => ({
    id: Number(value),
    name: key,
    label: getAllergyLabel(key),
  }))

// פונקציה להמרת שמות האלרגיות לעברית
function getAllergyLabel(allergyName: string): string {
  const hebrewLabels: Record<string, string> = {
    None: "ללא אלרגיות",
    Gluten: "גלוטן",
    Dairy: "חלב ומוצריו",
    Eggs: "ביצים",
    Peanuts: "בוטנים",
    Soy: "סויה",
    Sesame: "שומשום",
    Fish: "דגים",
    Shellfish: "פירות ים",
    Mustard: "חרדל",
    Corn: "תירס",
  }

  return hebrewLabels[allergyName] || allergyName
}

interface AllergiesFormProps {
  userId: number
  onSaved?: () => void
}

const AllergiesForm = ({ userId, onSaved }: AllergiesFormProps) => {
  const [selectedAllergies, setSelectedAllergies] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // טעינת האלרגיות הקיימות של המשתמש
  useEffect(() => {
    const fetchUserAllergies = async () => {
      try {
        setIsLoading(true)
        const userAllergies = await getAllergies(userId)
        setSelectedAllergies(userAllergies.map((a) => a.allergyId))
      } catch (error) {
        console.error("שגיאה בטעינת אלרגיות:", error)
        setNotification({
          message: "שגיאה בטעינת האלרגיות הקיימות",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUserAllergies()
    }
  }, [userId])

  // טיפול בשינוי בחירת אלרגיה
  const handleAllergyChange = (allergyId: number) => {
    setSelectedAllergies((prev) => {
      // אם האלרגיה כבר נבחרה, הסר אותה
      if (prev.includes(allergyId)) {
        return prev.filter((id) => id !== allergyId)
      }
      // אם בחרנו "ללא אלרגיות", נקה את כל הבחירות האחרות
      if (allergyId === AllergyType.None) {
        return [AllergyType.None]
      }
      // אם בחרנו אלרגיה אחרת, הסר את האופציה "ללא אלרגיות" אם היא נבחרה
      const newSelected = prev.filter((id) => id !== AllergyType.None)
      return [...newSelected, allergyId]
    })
  }

  // שליחת הטופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await updateUserAllergies(userId, selectedAllergies)

      setNotification({
        message: "האלרגיות נשמרו בהצלחה",
        type: "success",
      })

      if (onSaved) {
        onSaved()
      }
    } catch (error) {
      console.error("שגיאה בשמירת אלרגיות:", error)
      setNotification({
        message: "שגיאה בשמירת האלרגיות",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // סגירת ההודעה
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="allergies-form-container" style={{ direction: "rtl" }}>
      <h2 className="allergies-title">אלרגיות ורגישויות</h2>
      <p className="allergies-description">בחר את האלרגיות או הרגישויות שלך כדי שנוכל להתאים את המתכונים עבורך</p>

      {notification && (
        <motion.div
          className={`allergies-notification ${notification.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {notification.type === "success" ? (
            <Check className="notification-icon" size={20} />
          ) : (
            <AlertCircle className="notification-icon" size={20} />
          )}
          <span>{notification.message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="allergies-form">
        <div className="allergies-grid">
          {allergyOptions.map((allergy) => (
            <label key={allergy.id} className="allergy-checkbox-label">
              <input
                type="checkbox"
                className="allergy-checkbox"
                checked={selectedAllergies.includes(allergy.id)}
                onChange={() => handleAllergyChange(allergy.id)}
              />
              <span className="allergy-name">{allergy.label}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="allergies-submit-button" disabled={isLoading}>
          {isLoading ? "שומר..." : "שמור אלרגיות"}
        </button>
      </form>
    </div>
  )
}

export default AllergiesForm