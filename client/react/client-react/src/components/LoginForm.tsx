// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppDispatch } from "./Redux/Store";
// import { useDispatch } from 'react-redux';
// import { loginUser } from "./Redux/AuthSlice";
// import { UserLogin } from "../models/AuthType";
// import { Button, Typography, Container, Box, Link, Alert, Snackbar } from '@mui/material';
// import { CreateTextField } from "./LoginGenericTextField";
// import Google from "./Google";

// const LoginForm: React.FC = () => {
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//     const [snackOpen, setSnackOpen] = useState(false);
//     const [snackMessage, setSnackMessage] = useState('');
//     const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         if (name === "email") setEmail(value);
//         if (name === "password") setPassword(value);
//         setErrors({ ...errors, [name]: undefined });
//     };

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const newErrors: { email?: string; password?: string } = {};

//         if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
//         if (password.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של 6 תווים לפחות';

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//         } else {
//             const user: UserLogin = { email, password };
//             const result = await dispatch(loginUser({ user }));
//             console.log(result);

//             if (result.meta.requestStatus === 'fulfilled') {
//                 setSnackMessage('התחברות בוצעה בהצלחה');
//                 setSnackSeverity('success');
//                 setSnackOpen(true);
//                 setTimeout(() => { navigate('/'); }, 1500);
//             }
//             else {
//                 setSnackMessage('התחברות נכשלה');
//                 setSnackSeverity('error');
//                 setSnackOpen(true);
//             }
//         }
//     };

//     const handleSnackClose = () => {
//         setSnackOpen(false);
//     };

//     const handleForgotPassword = async () => {
//         navigate('/forgot-password');
//     }

//     return (
//         <>
//             <Snackbar
//                 open={snackOpen}
//                 autoHideDuration={6000}
//                 onClose={handleSnackClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
//                     {snackMessage}
//                 </Alert>
//             </Snackbar>
//             <Container component="main" maxWidth="xs">
//                 <Box sx={{
//                     marginTop: '8vh',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     padding: 3,
//                     borderRadius: 2,
//                     boxShadow: 3
//                 }}>
//                     <div style={{ height: '2vh' }}></div>
//                     <Typography component="h1" variant="h4" sx={{ color: 'orange' }}>טופס התחברות</Typography> {/* צבע טקסט כתום */}
//                     <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
//                         <CreateTextField
//                             name="email"
//                             label="מייל"
//                             type="email"
//                             value={email}
//                             handleChange={handleChange}
//                             error={!!errors.email}
//                             helperText={errors.email}
//                         />
//                         <div style={{ height: '2vh' }}></div>
//                         <CreateTextField
//                             name="password"
//                             label="סיסמה"
//                             type="password"
//                             value={password}
//                             handleChange={handleChange}
//                             error={!!errors.password}
//                             helperText={errors.password}
//                         />
//                         <Button onClick={() => handleForgotPassword()} sx={{ color: 'orange', marginLeft: '35%', textDecorationColor: 'gray' }}>
//                             ?שכחת סיסמה
//                         </Button>
//                         <div style={{ height: '0.2vh' }}></div>
//                         <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
//                             התחבר
//                         </Button>
//                         <Google />
//                         <Typography variant="body2" sx={{ marginTop: 2, color: 'white', textAlign: 'center' }}>
//                             עדיין לא נרשמת?{''}
//                             <Link href="/register" sx={{ color: 'orange', marginRight: '1vw', textDecorationColor: 'gray' }}>
//                                 להרשמה לחץ כאן
//                             </Link>
//                         </Typography>
//                     </form>
//                 </Box>
//             </Container>
//         </>
//     );

// };

// export default LoginForm;


import { useState, type ChangeEvent, type FormEvent } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "./Redux/Store"
import { loginUser } from "./Redux/AuthSlice"
import type { UserLogin } from "../models/AuthType"
import { Mail, Lock, Check, AlertCircle, Loader2 } from "lucide-react"
import GoogleAuth from "./Google"
import { useNavigate } from "react-router-dom"
import "../styles/LoginForm.css"

const LoginForm = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
          setSnackMessage("התחברות בוצעה בהצלחה")
          setSnackSeverity("success")
          setSnackOpen(true)
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          setSnackMessage("התחברות נכשלה")
          setSnackSeverity("error")
          setSnackOpen(true)
        }
      } catch (error) {
        console.error("Login error:", error)
        setSnackMessage("שגיאה בתהליך ההתחברות")
        setSnackSeverity("error")
        setSnackOpen(true)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <>
      {snackOpen && (
        <div className={`login-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
          <div className="login-snackbar-content">
            {snackSeverity === "success" ? (
              <Check className="login-snackbar-icon" size={20} />
            ) : (
              <AlertCircle className="login-snackbar-icon" size={20} />
            )}
            <span>{snackMessage}</span>
            <button className="login-snackbar-close" onClick={handleSnackClose}>
              ×
            </button>
          </div>
        </div>
      )}

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
                className={`login-input-container ${focusedField === "email" ? "focused" : ""} ${
                  errors.email ? "error" : ""
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
                className={`login-input-container ${focusedField === "password" ? "focused" : ""} ${
                  errors.password ? "error" : ""
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
