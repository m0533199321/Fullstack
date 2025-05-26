import { useState, type ChangeEvent, type FormEvent, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "./Redux/Store"
import { fetchUser, registerUser, sendEmail } from "./Redux/AuthSlice"
import type { UserRegister } from "../models/AuthType"
import ProfilePicture from "./ProfilePicture"
import { uploadProfilePictureService } from "./Services/ProfileService"
import axios from "axios"
import { registerEmailBody } from "./RegisterEmailBody"
import { isEmailValid, isPasswordValid } from "./RegisterValidations"
import { User, Mail, Lock, Upload, AlertCircle, Loader2 } from "lucide-react"
import GoogleAuth from "./Google"
import "../styles/RegisterForm.css"
import { useNavigate } from "react-router-dom"

export interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  profilePicture: string | null
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: null,
  })

  const [showProfilePicture, setShowProfilePicture] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [upProfile, setUpProfile] = useState(false)
  const [finishProfile, setFinishProfile] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorOpen, setErrorOpen] = useState<boolean>(false)

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus()
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "email" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleProfilePictureSelect = (file: File | null) => {
    if (file && (file as any)._isDefaultProfile) {
      const defaultProfileUrl = (file as any)._defaultUrl

      setFormData((prev) => ({ ...prev, profilePicture: defaultProfileUrl }))
      setFinishProfile(true)
      setUpProfile(false)
      setShowProfilePicture(false)

      return
    }

    if (file) {
      setUpProfile(true)
      setFinishProfile(false)
      uploadProfilePictureService(file)
        .then(async (presignedUrl) => {
          if (presignedUrl) {
            await axios
              .put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (progressEvent) => {
                  const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                  setProgress(percent)
                },
              })
              .then(() => {
                setProgress(0)
                setFinishProfile(true)
                setUpProfile(false)
                setFormData((prev) => ({ ...prev, profilePicture: presignedUrl.split("?")[0] }))
                setShowProfilePicture(false)

              })
          } else {
            setErrorMessage("נכשל בהעלאת תמונת פרופיל")
            setTimeout(() => {
              setErrorOpen(false);
            }, 3000);
            setUpProfile(false)
            setShowProfilePicture(false)
          }
        })
        .catch(() => {
          setErrorMessage("שגיאה בהעלאת תמונת פרופיל")
          setTimeout(() => {
            setErrorOpen(false);
          }, 3000);
          setUpProfile(false)
          setShowProfilePicture(false)
        })
    } else {
      setShowProfilePicture(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailError = isEmailValid(formData.email) ? "" : "אימייל לא תקין"
    const passwordError = isPasswordValid(formData.password)
      ? ""
      : "הסיסמה חייבת להיות באורך של לפחות 6 תווים ולהכיל אות וספרה."
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setErrors({})

    if (!finishProfile) {
      setErrorMessage("תמונה לא הועלתה")
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
      return
    }

    setIsSubmitting(true)

    try {
      const user: UserRegister = {
        fName: formData.firstName,
        lName: formData.lastName,
        email: formData.email,
        password: formData.password,
        profile: formData.profilePicture,
      }

      const result = await dispatch(registerUser({ user }))

      if (result.meta.requestStatus === "fulfilled") {
        const subject = "ברוכים הבאים למשפחה שלנו"
        const body = registerEmailBody(user.fName)

        try {
          const emailResult = await dispatch(sendEmail({ to: user.email, subject: subject, body: body }))
          if (emailResult.meta.requestStatus === "fulfilled") {
            dispatch(fetchUser() as any)
          }
        } catch (error) {
        }

        setTimeout(() => {
          navigate("/")
        }, 1500)
      } else {
        setErrorMessage("הרשמה נכשלה")
        setTimeout(() => {
          setErrorOpen(false);
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("שגיאה בתהליך ההרשמה")
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">טופס הרשמה</h1>
            <p className="register-subtitle">צרו חשבון חדש ותתחילו את המסע</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="firstName" className="register-form-label">
                  שם פרטי
                </label>
                <div className={`register-input-container ${focusedField === "firstName" ? "focused" : ""}`}>
                  <User className="register-input-icon" size={18} />
                  <input
                    ref={firstNameRef}
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("firstName")}
                    onBlur={handleBlur}
                    required
                    className="register-form-input"
                    placeholder="הזן שם פרטי"
                  />
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="lastName" className="register-form-label">
                  שם משפחה
                </label>
                <div className={`register-input-container ${focusedField === "lastName" ? "focused" : ""}`}>
                  <User className="register-input-icon" size={18} />
                  <input
                    ref={lastNameRef}
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("lastName")}
                    onBlur={handleBlur}
                    required
                    className="register-form-input"
                    placeholder="הזן שם משפחה"
                  />
                </div>
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="email" className="register-form-label">
                אימייל
              </label>
              <div
                className={`register-input-container ${focusedField === "email" ? "focused" : ""} ${errors.email ? "error" : ""}`}
              >
                <Mail className="register-input-icon" size={18} />
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  required
                  className="register-form-input"
                  placeholder="הזן כתובת אימייל"
                />
              </div>
              {errors.email && <div className="register-error-message">{errors.email}</div>}
            </div>

            <div className="register-form-group">
              <label htmlFor="password" className="register-form-label">
                סיסמה
              </label>
              <div
                className={`register-input-container ${focusedField === "password" ? "focused" : ""} ${errors.password ? "error" : ""}`}
              >
                <Lock className="register-input-icon" size={18} />
                <input
                  ref={passwordRef}
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  required
                  className="register-form-input"
                  placeholder="הזן סיסמה (לפחות 6 תווים)"
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {passwordVisible ? "הסתר" : "הצג"}
                </button>
              </div>
              {errors.password && <div className="register-error-message">{errors.password}</div>}
            </div>

            <div className="register-profile-section">
              <div className="register-profile-container">
                {formData.profilePicture ? (
                  <div className="register-profile-preview">
                    <img
                      src={formData.profilePicture || "/placeholder.svg"}
                      alt="תמונת פרופיל"
                      className="register-profile-image"
                    />
                    <div className="register-profile-overlay">
                      <button
                        type="button"
                        className="register-change-profile-btn"
                        onClick={() => setShowProfilePicture(true)}
                      >
                        שנה
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="register-upload-profile-btn"
                    onClick={() => setShowProfilePicture(true)}
                  >
                    <Upload size={24} />
                    <span>העלה תמונת פרופיל</span>
                  </button>
                )}
              </div>

              {upProfile && (
                <div className="register-upload-progress">
                  <div className="register-progress-bar">
                    <div className="register-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="register-progress-text">{progress}%</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !finishProfile}
              className={`register-submit-button ${isSubmitting ? "loading" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="register-spinner" size={20} />
                  מבצע הרשמה...
                </>
              ) : (
                "הירשם"
              )}
            </button>
            {errorOpen && errorMessage && (
              <div className="register-error-message">
                <AlertCircle className="register-error-icon" size={18} />
                {errorMessage}
              </div>
            )}

            <GoogleAuth />

            <p className="register-login-link">
              כבר יש לך חשבון? <a href="/login">התחבר כאן</a>
            </p>
          </form>
        </div>
      </div>

      {showProfilePicture && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <ProfilePicture onSelect={handleProfilePictureSelect} onClose={() => setShowProfilePicture(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default RegisterForm