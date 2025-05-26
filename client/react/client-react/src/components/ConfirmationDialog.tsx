import { useEffect, useState } from "react"
import "../styles/ConfirmationDialog.css"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  cancelText: string
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
}: ConfirmationDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true)
      }, 10)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="confirmation-overlay">
      <div className={`confirmation-dialog ${isVisible ? "visible" : ""}`}>
        <div className="confirmation-content">
          <h2 className="confirmation-title">{title}</h2>
          <p className="confirmation-description">{description}</p>
          <div className="confirmation-actions">
            <button className="confirmation-button cancel" onClick={onClose}>
              {cancelText}
            </button>
            <button className="confirmation-button confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
