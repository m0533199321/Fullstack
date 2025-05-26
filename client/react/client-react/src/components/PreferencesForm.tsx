import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, AlertCircle } from 'lucide-react'
import { getPreferences, updateUserPreferences } from "./Services/PreferencesService"
import "../styles/PreferencesForm.css"

export enum PreferenceType {
    None = 0,
    Spicy = 1,
    Sweet = 2,
    Salty = 3,
    Sour = 4,
    Umami = 5,
    Tangy = 6,
    Herby = 7,
    Smoky = 8,
    ToastedCrunchy = 9,
    Aromatic = 10
}

const preferenceOptions = Object.entries(PreferenceType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
        id: Number(value),
        name: key,
        label: getPreferenceLabel(key),
    }))

function getPreferenceLabel(preferenceName: string): string {
    const hebrewLabels: Record<string, string> = {
        None: "ללא ההעדפות",
        Spicy: "חריף",
        Sweet: "מתוק",
        Salty: "מלוח",
        Sour: "חמוץ",
        Umami: "אומאמי",
        Tangy: "פיקנטי",
        Herby: "עשבוני",
        Smoky: "מעושן",
        ToastedCrunchy: "קלוי",
        Aromatic: "ארומטי",
    }

    return hebrewLabels[preferenceName] || preferenceName
}

interface PreferencesFormProps {
    userId: number
    onSaved?: () => void
}

const PreferencesForm = ({ userId, onSaved }: PreferencesFormProps) => {
    const [selectedPreferences, setSelectedPreferences] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                setIsLoading(true)
                const userPreferences = await getPreferences(userId)
                setSelectedPreferences(userPreferences.map((p) => p.preferenceId))
            } catch (error) {
                setNotification({
                    message: "שגיאה בטעינת ההעדפות הקיימות",
                    type: "error",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (userId) {
            fetchUserPreferences()
        }
    }, [userId])

    const handlePreferenceChange = (preferenceId: number) => {
        setSelectedPreferences((prev) => {
            if (prev.includes(preferenceId)) {
                return prev.filter((id) => id !== preferenceId)
            }
            if (preferenceId === PreferenceType.None) {
                return [PreferenceType.None]
            }
            const newSelected = prev.filter((id) => id !== PreferenceType.None)
            return [...newSelected, preferenceId]
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            await updateUserPreferences(userId, selectedPreferences)

            setNotification({
                message: "ההעדפות נשמרו בהצלחה",
                type: "success",
            })

            if (onSaved) {
                onSaved()
            }
        } catch (error) {
            console.error("שגיאה בשמירת העדפות:", error)
            setNotification({
                message: "שגיאה בשמירת ההעדפות",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    return (
        <div className="preferences-form-container" style={{ direction: "rtl" }}>
            <h2 className="preferences-title">העדפות תזונתיות</h2>
            <p className="preferences-description">בחר את ההעדפות התזונתיות שלך כדי שנוכל להתאים את המתכונים עבורך</p>

            {notification && (
                <motion.div
                    className={`preferences-notification ${notification.type}`}
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

            <form onSubmit={handleSubmit} className="preferences-form">
                <div className="preferences-grid">
                    {preferenceOptions.map((preference) => (
                        <label key={preference.id} className="preference-checkbox-label">
                            <input
                                type="checkbox"
                                className="preference-checkbox"
                                checked={selectedPreferences.includes(preference.id)}
                                onChange={() => handlePreferenceChange(preference.id)}
                            />
                            <span className="preference-name">{preference.label}</span>
                        </label>
                    ))}
                </div>

                <button type="submit" className="preferences-submit-button" disabled={isLoading}>
                    {isLoading ? "שומר..." : "שמור העדפות"}
                </button>
            </form>
        </div>
    )
}

export default PreferencesForm