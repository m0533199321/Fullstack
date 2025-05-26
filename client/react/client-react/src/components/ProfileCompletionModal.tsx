"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft } from "lucide-react"
import AllergiesForm from "./AllergiesForm"
import PreferencesForm from "./PreferencesForm"
import "../styles/ProfileCompletionModal.css"

interface ProfileCompletionModalProps {
  userId: number
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  isUpdateMode?: boolean
}

export default function ProfileCompletionModal({
  userId,
  isOpen,
  onClose,
  onComplete,
  isUpdateMode = false,
}: ProfileCompletionModalProps) {
  const [activeTab, setActiveTab] = useState<string>("allergies")
  const [completed, setCompleted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (isUpdateMode) {
        setCompleted(false)
      }

      setTimeout(() => {
        setIsVisible(true)
      }, 10)
    } else {
      setIsVisible(false)
    }
  }, [isOpen, isUpdateMode])

  const handleAllergiesSaved = () => {
    setActiveTab("preferences")
  }

  const handlePreferencesSaved = () => {
    setCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`profile-modal-container ${isVisible ? "visible" : ""}`}>
        <div className="profile-modal-header">
          <h2 className="profile-modal-title">{isUpdateMode ? "עדכון פרטים אישיים" : "השלמת פרטים אישיים"}</h2>
          <p className="profile-modal-description">
            {isUpdateMode
              ? "כאן תוכל לעדכן את האלרגיות וההעדפות שלך לקבלת מתכונים מותאמים אישית"
              : "כדי שנוכל להתאים לך מתכונים בצורה מיטבית, אנא השלם את הפרטים הבאים"}
          </p>
          <button className="profile-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {completed ? (
          <div className="profile-modal-success">
            <div className="success-icon">
              <svg
                className="check-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="success-title">תודה!</h3>
            <p className="success-message">
              {isUpdateMode
                ? "הפרטים עודכנו בהצלחה. כעת נוכל להתאים לך מתכונים טובים יותר."
                : "הפרטים נשמרו בהצלחה. כעת נוכל להתאים לך מתכונים טובים יותר."}
            </p>
          </div>
        ) : (
          <div className="profile-modal-content">
            <div className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === "allergies" ? "active" : ""}`}
                onClick={() => setActiveTab("allergies")}
              >
                אלרגיות
              </button>
              <button
                className={`profile-tab ${activeTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                העדפות
              </button>
            </div>

            <div className="profile-tab-content">
              {activeTab === "allergies" && (
                <div className="tab-panel">
                  <div className="form-wrapper">
                    <AllergiesForm userId={userId} onSaved={handleAllergiesSaved} />
                  </div>
                  <div className="tab-actions">
                    <button className="next-button" onClick={() => setActiveTab("preferences")}>
                      המשך להעדפות
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="tab-panel">
                  <div className="form-wrapper">
                    <PreferencesForm userId={userId} onSaved={handlePreferencesSaved} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
