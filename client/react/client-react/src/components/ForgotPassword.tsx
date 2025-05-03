// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppDispatch } from "./Redux/Store";
// import { useDispatch } from 'react-redux';
// import { forgotPasswordUser, sendEmailForgot } from "./Redux/AuthSlice";
// import { UserLogin } from "../models/AuthType";
// import { Button, Typography, Container, Box, Alert, Snackbar } from '@mui/material';
// import { CreateTextField } from "./ForgotGenericTextField";

// const LoginForm: React.FC = () => {
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [random, setRandom] = useState<string>('');
//     const [randomServer, setRandomServer] = useState<string>('');
//     const [errors, setErrors] = useState<{ email?: string; password?: string; random?: string }>({});
//     const [snackOpen, setSnackOpen] = useState(false);
//     const [snackMessage, setSnackMessage] = useState('');
//     const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
//     const [step, setStep] = useState(1); // 1: Email, 2: Random Code, 3: Password

//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         if (name === "email") setEmail(value);
//         if (name === "password") setPassword(value);
//         if (name === "random") setRandom(value);
//         setErrors({ ...errors, [name]: undefined });
//     };

//     const handleForgotPassword = async () => {
//         const newErrors: { email?: string; password?: string; random?: string } = {};

//         if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//         }
//         else {
//             setSnackMessage('בודק הרשאות כתובת מייל');
//             setSnackSeverity('success');
//             setSnackOpen(true);
//             const result = await dispatch(sendEmailForgot({ to: email, subject: 'שחזור סיסמה', body: 'שחזור סיסמה' }));
//             console.log(result.payload);
//             setRandomServer(result.payload);
//             if (result.meta.requestStatus === 'fulfilled') {
//                 setSnackMessage('קוד אימות נשלח למייל');
//                 setSnackSeverity('success');
//                 setSnackOpen(true);
//                 setStep(2);
//             }
//             else {
//                 setSnackMessage('שליחה למייל נכשלה יש לנסות שוב');
//                 setSnackSeverity('error');
//                 setSnackOpen(true);
//                 setStep(1);
//             }
//         }
//     }

//     const handleCheckRandom = () => {
//         console.log(random);
//         console.log(randomServer);
//         console.log(typeof (random));
//         console.log(typeof (randomServer));

//         if (randomServer == random) {

//             setSnackMessage('אימות עבר בהצלחה');
//             setSnackSeverity('success');
//             setSnackOpen(true);
//             setStep(3);
//         }
//         else {
//             setSnackMessage('אימות נכשל יש לנסות שוב');
//             setSnackSeverity('error');
//             setSnackOpen(true);
//             setStep(2);
//         }
//     }

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const newErrors: { email?: string; password?: string } = {};

//         if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
//         if (password.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של 6 תווים לפחות';

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//         } else {
//             const user: UserLogin = { email, password };
//             const result = await dispatch(forgotPasswordUser({ user }));

//             if (result.meta.requestStatus === 'fulfilled') {
//                 setSnackMessage('התחברות בוצעה בהצלחה');
//                 setSnackSeverity('success');
//                 setSnackOpen(true);
//                 setTimeout(() => {
//                     navigate('/');
//                     // window.localStorage.setItem('token', result.payload.token);
//                     window.location.reload();
//                 }, 1500);
//             }
//             else {
//                 setSnackMessage('התחברות נכשלה');
//                 setSnackSeverity('error');
//                 setSnackOpen(true);
//                 setStep(1);
//             }
//         }
//     };

//     return (
//         <>
//             <Snackbar
//                 open={snackOpen}
//                 autoHideDuration={6000}
//                 onClose={() => setSnackOpen(false)}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
//                     {snackMessage}
//                 </Alert>
//             </Snackbar>
//             <Container component="main" maxWidth="xs">
//                 <Box sx={{
//                     marginTop: '15vh',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     padding: 3,
//                     borderRadius: 2,
//                     boxShadow: 3
//                 }}>
//                     <Typography component="h1" variant="h4" sx={{ color: 'orange' }}>שכחת סיסמה</Typography>
//                     <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
//                         <CreateTextField
//                             name="email"
//                             label="מייל"
//                             type="email"
//                             value={email}
//                             handleChange={handleChange}
//                             error={!!errors.email}
//                             helperText={errors.email}
//                             disabled={step !== 1}
//                         />
//                         <div style={{ height: '2vh' }}></div>
//                         <CreateTextField
//                             name="random"
//                             label="קוד אימות"
//                             type="text"
//                             value={random}
//                             handleChange={handleChange}
//                             error={!!errors.random}
//                             helperText={errors.random}
//                             disabled={step !== 2}
//                         />
//                         <div style={{ height: '2vh' }}></div>
//                         <CreateTextField
//                             name="password"
//                             label="סיסמה חדשה"
//                             type="password"
//                             value={password}
//                             handleChange={handleChange}
//                             error={!!errors.password}
//                             helperText={errors.password}
//                             disabled={step !== 3}
//                         />
//                         <div style={{ height: '3vh' }}></div>
//                         {step === 1 &&
//                             <Button onClick={handleForgotPassword} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
//                                 לקבלת קוד אימות
//                             </Button>}
//                         {step === 2 &&
//                             <Button onClick={handleCheckRandom} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
//                                 אימות
//                             </Button>}
//                         {step === 3 &&
//                             <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
//                                 כניסה
//                             </Button>}
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
import { forgotPasswordUser, loginUser, sendEmailForgot } from "./Redux/AuthSlice"
import type { UserLogin } from "../models/AuthType"
import { Mail, Lock, Check, AlertCircle, Loader2, KeyRound } from "lucide-react"
import "../styles/ForgotPasswordForm.css"
import { useNavigate } from "react-router-dom"

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [random, setRandom] = useState<string>("")
  const [randomServer, setRandomServer] = useState<string>("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; random?: string }>({})
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
  const [step, setStep] = useState(1) // 1: Email, 2: Random Code, 3: Password
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
          setSnackMessage("שליחה למייל נכשלה יש לנסות שוב")
          setSnackSeverity("error")
          setSnackOpen(true)
          setTimeout(() => {
            setSnackOpen(false);
        }, 3000); // סגירה אוטומטית אחרי 3 שניות
          setStep(1)
        }
      } catch (error) {
        console.error("Error sending verification code:", error)
        setSnackMessage("שגיאה בשליחת קוד אימות")
        setSnackSeverity("error")
        setSnackOpen(true)
        setTimeout(() => {
          setSnackOpen(false);
      }, 3000); // סגירה אוטומטית אחרי 3 שניות
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
      setSnackMessage("אימות נכשל יש לנסות שוב")
      setSnackSeverity("error")
      setSnackOpen(true)
      setTimeout(() => {
        setSnackOpen(false);
    }, 3000); // סגירה אוטומטית אחרי 3 שניות
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
          console.log(user);
          if (loginResult.meta.requestStatus === "fulfilled") {
            setTimeout(() => {
              navigate("/");
            }, 1500);
          } else {
            setSnackMessage("התחברות נכשלת לאחר שינוי הסיסמה");
            setSnackSeverity("error");
            setSnackOpen(true);
            setTimeout(() => {
              setSnackOpen(false);
          }, 3000); // סגירה אוטומטית אחרי 3 שניות
          }
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          setSnackMessage("עדכון סיסמה נכשל")
          setSnackSeverity("error")
          setSnackOpen(true)
          setTimeout(() => {
            setSnackOpen(false);
        }, 3000); 
          setStep(1)
        }
      } catch (error) {
        console.error("Password reset error:", error)
        setSnackMessage("שגיאה בתהליך עדכון הסיסמה")
        setSnackSeverity("error")
        setSnackOpen(true)
        setTimeout(() => {
          setSnackOpen(false);
      }, 3000);
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
        <div className={`forgot-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
          <div className="forgot-snackbar-content">
            {snackSeverity === "success" ? (
              <Check className="forgot-snackbar-icon" size={20} />
            ) : (
              <AlertCircle className="forgot-snackbar-icon" size={20} />
            )}
            <span>{snackMessage}</span>
            <button className="forgot-snackbar-close" onClick={handleSnackClose}>
              ×
            </button>
          </div>
        </div>
      )}

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

