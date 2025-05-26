import { useState, type ChangeEvent, type FormEvent } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "./Redux/Store"
import { forgotPasswordUser, loginUser, sendEmailForgot } from "./Redux/AuthSlice"
import type { UserLogin } from "../models/AuthType"
import { Mail, Lock, AlertCircle, Loader2, KeyRound } from "lucide-react"
import "../styles/ForgotPasswordForm.css"
import { useNavigate } from "react-router-dom"

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [random, setRandom] = useState<string>("")
  const [randomServer, setRandomServer] = useState<string>("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; random?: string }>({})
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email") setEmail(value)
    if (name === "password") setPassword(value)
    if (name === "random") setRandom(value)
    setErrors({ ...errors, [name]: undefined })
  }

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleForgotPassword = async () => {
    const newErrors: { email?: string; password?: string; random?: string } = {}

    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "אימייל לא תקין"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setIsSubmitting(true)
      try {
        const result = await dispatch(sendEmailForgot({ to: email, subject: "שחזור סיסמה", body: "שחזור סיסמה" }))
        setRandomServer(result.payload)

        if (result.meta.requestStatus === "fulfilled") {
          setStep(2)
        } else {
          setErrorMessage("שליחה למייל נכשלה יש לנסות שוב")
          setErrorOpen(true)
          setTimeout(() => {
            setErrorOpen(false);
          }, 3000);
          setStep(1)
        }
      } catch (error) {
        setErrorMessage("שגיאה בשליחת קוד אימות")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false);
        }, 3000);
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCheckRandom = () => {
    setIsSubmitting(true)

    if (randomServer == random) {
      setStep(3)
    } else {
      setErrorMessage("אימות נכשל יש לנסות שוב")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
    }

    setIsSubmitting(false)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "אימייל לא תקין"
    if (password.length < 6) newErrors.password = "הסיסמה חייבת להיות באורך של 6 תווים לפחות"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setIsSubmitting(true)
      const user: UserLogin = { email, password }

      try {
        const result = await dispatch(forgotPasswordUser({ user }))

        if (result.meta.requestStatus === "fulfilled") {
          const loginResult = await dispatch(loginUser({ user }));
          if (loginResult.meta.requestStatus === "fulfilled") {
            setTimeout(() => {
              navigate("/");
            }, 1500);
          } else {
            setErrorMessage("התחברות נכשלת לאחר שינוי הסיסמה");
            setErrorOpen(true)
            setTimeout(() => {
              setErrorOpen(false);
            }, 3000);
          }
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          setErrorMessage("עדכון סיסמה נכשל")
          setErrorOpen(true)
          setTimeout(() => {
            setErrorOpen(false);
          }, 3000);
          setStep(1)
        }
      } catch (error) {
        setErrorMessage("שגיאה בתהליך עדכון הסיסמה")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false);
        }, 3000);
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <>
      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-header">
            <h1 className="forgot-title">שחזור סיסמה</h1>
            <p className="forgot-subtitle">אפס את הסיסמה שלך בשלושה שלבים פשוטים</p>
          </div>

          <div className="forgot-steps">
            <div className={`forgot-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
              <div className="forgot-step-number">1</div>
              <div className="forgot-step-label">אימייל</div>
            </div>
            <div className="forgot-step-connector"></div>
            <div className={`forgot-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
              <div className="forgot-step-number">2</div>
              <div className="forgot-step-label">אימות</div>
            </div>
            <div className="forgot-step-connector"></div>
            <div className={`forgot-step ${step >= 3 ? "active" : ""}`}>
              <div className="forgot-step-number">3</div>
              <div className="forgot-step-label">סיסמה חדשה</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="forgot-form-group" style={{ display: step === 1 ? "block" : "none" }}>
              <label htmlFor="email" className="forgot-form-label">
                אימייל
              </label>
              <div
                className={`forgot-input-container ${focusedField === "email" ? "focused" : ""} ${errors.email ? "error" : ""
                  }`}
              >
                <Mail className="forgot-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  required
                  className="forgot-form-input"
                  placeholder="הזן את כתובת האימייל שלך"
                  disabled={step !== 1}
                  autoFocus={step === 1}
                />
              </div>
              {errors.email && <div className="forgot-error-message">{errors.email}</div>}
            </div>

            <div className="forgot-form-group" style={{ display: step === 2 ? "block" : "none" }}>
              <label htmlFor="random" className="forgot-form-label">
                קוד אימות
              </label>
              <div
                className={`forgot-input-container ${focusedField === "random" ? "focused" : ""} ${errors.random ? "error" : ""
                  }`}
              >
                <KeyRound className="forgot-input-icon" size={18} />
                <input
                  type="text"
                  id="random"
                  name="random"
                  value={random}
                  onChange={handleChange}
                  onFocus={() => handleFocus("random")}
                  onBlur={handleBlur}
                  required
                  className="forgot-form-input"
                  placeholder="הזן את קוד האימות שנשלח לאימייל שלך"
                  disabled={step !== 2}
                  autoFocus={step === 2}
                />
              </div>
              {errors.random && <div className="forgot-error-message">{errors.random}</div>}
            </div>

            <div className="forgot-form-group" style={{ display: step === 3 ? "block" : "none" }}>
              <label htmlFor="password" className="forgot-form-label">
                סיסמה חדשה
              </label>
              <div
                className={`forgot-input-container ${focusedField === "password" ? "focused" : ""} ${errors.password ? "error" : ""
                  }`}
              >
                <Lock className="forgot-input-icon" size={18} />
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  required
                  className="forgot-form-input"
                  placeholder="הזן סיסמה חדשה (לפחות 6 תווים)"
                  disabled={step !== 3}
                  autoFocus={step === 3}
                />
                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  disabled={step !== 3}
                >
                  {passwordVisible ? "הסתר" : "הצג"}
                </button>
              </div>
              {errors.password && <div className="forgot-error-message">{errors.password}</div>}
            </div>

            <div className="forgot-actions">
              {step === 1 && (
                <button
                  type="button"
                  className={`forgot-submit-button ${isSubmitting ? "loading" : ""}`}
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="forgot-spinner" size={20} />
                      שולח קוד אימות...
                    </>
                  ) : (
                    "שלח קוד אימות"
                  )}
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  className={`forgot-submit-button ${isSubmitting ? "loading" : ""}`}
                  onClick={handleCheckRandom}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="forgot-spinner" size={20} />
                      מאמת...
                    </>
                  ) : (
                    "אמת קוד"
                  )}
                </button>
              )}

              {step === 3 && (
                <button
                  type="submit"
                  className={`forgot-submit-button ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="forgot-spinner" size={20} />
                      מעדכן סיסמה...
                    </>
                  ) : (
                    "עדכן סיסמה"
                  )}
                </button>
              )}
            </div>

            {errorOpen && errorMessage && (
              <div className="forgot-error-message">
                <AlertCircle className="forgot-error-icon" size={18} />
                {errorMessage}
              </div>
            )}

            <div className="forgot-login-link">
              <a href="/login">חזרה להתחברות</a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordForm

