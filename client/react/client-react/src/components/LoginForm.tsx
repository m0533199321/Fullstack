import { useState, type ChangeEvent, type FormEvent } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "./Redux/Store"
import { loginUser } from "./Redux/AuthSlice"
import type { UserLogin } from "../models/AuthType"
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react"
import GoogleAuth from "./Google"
import { useNavigate } from "react-router-dom"
import "../styles/LoginForm.css"

const LoginForm = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorOpen, setErrorOpen] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email") setEmail(value)
    if (name === "password") setPassword(value)
    setErrors({ ...errors, [name]: undefined })
  }

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
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
        const result = await dispatch(loginUser({ user }))

        if (result.meta.requestStatus === "fulfilled") {
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          setErrorMessage("התחברות נכשלה")
          setErrorOpen(true)
          setTimeout(() => {
            setErrorOpen(false);
          }, 3000);
        }
      } catch (error) {
        setErrorMessage("שגיאה בתהליך ההתחברות")
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
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">טופס התחברות</h1>
            <p className="login-subtitle">התחבר לחשבון שלך</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                אימייל
              </label>
              <div
                className={`login-input-container ${focusedField === "email" ? "focused" : ""} ${errors.email ? "error" : ""
                  }`}
              >
                <Mail className="login-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  required
                  className="login-form-input"
                  placeholder="הזן כתובת אימייל"
                  autoFocus
                />
              </div>
              {errors.email && <div className="login-error-message">{errors.email}</div>}
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                סיסמה
              </label>
              <div
                className={`login-input-container ${focusedField === "password" ? "focused" : ""} ${errors.password ? "error" : ""
                  }`}
              >
                <Lock className="login-input-icon" size={18} />
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  required
                  className="login-form-input"
                  placeholder="הזן סיסמה"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {passwordVisible ? "הסתר" : "הצג"}
                </button>
              </div>
              {errors.password && <div className="login-error-message">{errors.password}</div>}
            </div>

            <div className="login-forgot-password">
              <a href="/forgot-password" className="login-forgot-link">
                שכחת סיסמה?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`login-submit-button ${isSubmitting ? "loading" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="login-spinner" size={20} />
                  מתחבר...
                </>
              ) : (
                "התחבר"
              )}
            </button>
            {errorOpen && errorMessage && (
              <div className="login-error-message">
                <AlertCircle className="login-error-icon" size={18} />
                {errorMessage}
              </div>
            )}
            <GoogleAuth />

            <p className="login-register-link">
              עדיין לא נרשמת? <a href="/register">להרשמה לחץ כאן</a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginForm
