import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Cropper from "react-easy-crop"
import { Upload, X, Camera, Trash, Check, Loader2, AlertCircle } from "lucide-react"
import "../styles/ProfilePicture.css"
import chef1 from "../../images/profiles/1.jpg"
import chef2 from "../../images/profiles/2.jpg"
import chef3 from "../../images/profiles/3.jpg"
import chef4 from "../../images/profiles/4.jpg"

interface ProfilePictureEnhancedProps {
  onSelect: (file: File | null) => void
  onClose: () => void
  currentProfilePic?: string
}

const ProfileUpdate = ({ onSelect, onClose, currentProfilePic }: ProfilePictureEnhancedProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<"idle" | "cropping" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const originalOnSelect = useRef(onSelect)
  const originalOnClose = useRef(onClose)

  const defaultImages = [chef1, chef2, chef3, chef4]

  useEffect(() => {
    originalOnSelect.current = onSelect
    originalOnClose.current = onClose
  }, [onSelect, onClose])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileProcessing(file)
    }
  }

  const handleFileProcessing = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDefaultImageSelect = async (index: number) => {
    setSelectedIndex(index)
    setUploadState("uploading")
    setUploadProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10 * (1 - prev / 100)
          const newProgress = Math.min(prev + increment, 99)
          return newProgress
        })
      }, 300)

      const awsDefaultImages = [
        "https://malismartchef.s3.us-east-1.amazonaws.com/images/1.jpg",
        "https://malismartchef.s3.us-east-1.amazonaws.com/images/2.jpg",
        "https://malismartchef.s3.us-east-1.amazonaws.com/images/3.jpg",
        "https://malismartchef.s3.us-east-1.amazonaws.com/images/4.jpg",
      ]

      const awsImageUrl = awsDefaultImages[index]

      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)
        setUploadState("success")

        const dummyFile = {
          _isDefaultProfile: true,
          _defaultUrl: awsImageUrl,
        }

        originalOnSelect.current(dummyFile as any)

        setTimeout(() => {
          originalOnClose.current()
        }, 1500)
      }, 1500)
    } catch (error) {
      setUploadState("error")
      setErrorMessage("שגיאה בבחירת התמונה. אנא נסה שוב.")
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcessing(e.dataTransfer.files[0])
    }
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return null

    setIsLoading(true)
    setUploadState("cropping")

    try {
      const canvas = document.createElement("canvas")
      const img = new Image()
      img.src = image

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      ctx.drawImage(
        img,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      )

      return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return
          const file = new File([blob], "profile-picture.png", { type: "image/png" })
          resolve(file)
        }, "image/png")
      })
    } catch (error) {
      setUploadState("error")
      setErrorMessage("שגיאה בעיבוד התמונה. אנא נסה שוב.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    const croppedFile = await createCroppedImage()
    if (croppedFile) {
      setUploadState("uploading")
      setUploadProgress(0)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10 * (1 - prev / 100)
          const newProgress = Math.min(prev + increment, 99)
          return newProgress
        })
      }, 300)

      const wrappedOnSelect = (file: File | null) => {
        try {
          originalOnSelect.current(file)

          clearInterval(progressInterval)
          setUploadProgress(100)
          setUploadState("success")

          setTimeout(() => {
            originalOnClose.current()
          }, 1500)
        } catch (error) {
          clearInterval(progressInterval)
          setUploadState("error")
          setErrorMessage("שגיאה בהעלאת התמונה. אנא נסה שוב.")
        }
      }

      setTimeout(() => {
        wrappedOnSelect(croppedFile)
      }, 1500)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleRetry = () => {
    setUploadState("idle")
    setErrorMessage(null)
  }

  const handleClose = () => {
    if (uploadState !== "uploading" && uploadState !== "cropping") {
      originalOnClose.current()
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } },
  }

  const dropzoneVariants = {
    default: { scale: 1 },
    dragging: { scale: 1.05, boxShadow: "0 0 25px rgba(255, 149, 0, 0.5)" },
  }

  return (
    <div className="profile-selector-content">
      <AnimatePresence>
        <motion.div
          className="profile-selector-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="profile-selector-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="profile-selector-header">
              <h2 className="profile-selector-title">בחירת תמונת פרופיל</h2>
              {uploadState !== "uploading" && uploadState !== "cropping" && (
                <motion.button
                  className="profile-selector-close"
                  onClick={handleClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              )}
            </div>

            {(uploadState === "uploading" || uploadState === "cropping" || uploadState === "success") && (
              <div className="upload-progress-container">
                <div
                  className={`upload-progress-bar ${uploadState === "success" ? "success" : ""}`}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <div className="upload-progress-text">
                  {uploadState === "cropping" && "מעבד תמונה..."}
                  {uploadState === "uploading" && `מעלה תמונה... ${Math.round(uploadProgress)}%`}
                  {uploadState === "success" && "התמונה הועלתה בהצלחה!"}
                </div>
              </div>
            )}

            <div className="profile-selector-content">
              {uploadState === "error" ? (
                <div className="error-container">
                  <div className="error-icon">
                    <AlertCircle size={40} />
                  </div>
                  <h3>שגיאה בהעלאת התמונה</h3>
                  <p>{errorMessage || "אירעה שגיאה בלתי צפויה. אנא נסה שוב."}</p>
                  <button className="retry-button" onClick={handleRetry}>
                    נסה שוב
                  </button>
                </div>
              ) : uploadState === "success" ? (
                <div className="success-container">
                  <div className="success-icon">
                    <Check size={40} />
                  </div>
                  <h3>התמונה הועלתה בהצלחה!</h3>
                  <div className="success-preview">
                    {currentProfilePic && (
                      <img
                        src={currentProfilePic || "/placeholder.svg"}
                        alt="תמונת פרופיל חדשה"
                        className="success-image"
                      />
                    )}
                  </div>
                </div>
              ) : image ? (
                <div className="cropper-container">
                  <div className="cropper-wrapper">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      cropShape="round"
                      showGrid={false}
                    />
                  </div>

                  <div className="zoom-control">
                    <span>הגדלה:</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
                      className="zoom-slider"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <motion.div
                    className={`profile-selector-dropzone ${isDragging ? "dragging" : ""}`}
                    variants={dropzoneVariants}
                    animate={isDragging ? "dragging" : "default"}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="upload-content">
                      <div className="upload-icon">
                        <Upload size={40} />
                      </div>
                      <p className="profile-selector-dropzone-text">גרור ושחרר תמונה כאן</p>
                      <span className="profile-selector-dropzone-subtext">או</span>
                      <button className="upload-button" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={18} />
                        <span>בחר תמונה</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="profile-selector-file-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </motion.div>

                  <div className="profile-selector-divider">
                    <span className="profile-selector-divider-text">או בחר מהגלריה</span>
                  </div>

                  <div className="profile-selector-gallery">
                    {defaultImages.map((image, index) => (
                      <motion.div
                        key={index}
                        className={`profile-selector-image-container ${selectedIndex === index ? "selected" : ""}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDefaultImageSelect(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`תמונת פרופיל ${index + 1}`}
                          className="profile-selector-image"
                        />
                        {selectedIndex === index && (
                          <div className="profile-selector-image-selected">
                            <Check size={24} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="profile-selector-footer">
              {uploadState === "error" ? (
                <button className="action-button cancel" onClick={handleClose}>
                  <X size={18} />
                  <span>סגור</span>
                </button>
              ) : uploadState === "success" ? (
                <button className="action-button success" onClick={handleClose}>
                  <Check size={18} />
                  <span>סיום</span>
                </button>
              ) : uploadState === "uploading" || uploadState === "cropping" ? (
                <div className="upload-status">
                  <Loader2 size={24} className="spinner" />
                  <span>{uploadState === "cropping" ? "מעבד תמונה..." : "מעלה תמונה..."}</span>
                </div>
              ) : image ? (
                <>
                  <button className="action-button remove" onClick={handleRemoveImage}>
                    <Trash size={18} />
                    <span>הסר תמונה</span>
                  </button>
                  <button className="action-button save" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        <span>מעבד...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>שמור תמונה</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>

            {isLoading && (
              <div className="profile-selector-loading">
                <div className="profile-selector-spinner"></div>
                <p>מעבד תמונה...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProfileUpdate
