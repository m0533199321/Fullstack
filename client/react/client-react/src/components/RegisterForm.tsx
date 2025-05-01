// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Box, Button, Typography, Dialog, DialogTitle, DialogContent,
//         DialogActions, Snackbar, Alert, LinearProgress} from '@mui/material';
// import { AppDispatch } from "./Redux/Store";
// import { useDispatch } from "react-redux";
// import { fetchUser, registerUser, sendEmail } from "./Redux/AuthSlice";
// import { UserRegister } from "../models/AuthType";
// import ProfilePicture from './ProfilePicture';
// import { uploadProfilePictureService } from "./Services/ProfileService";
// import axios from "axios";
// import Google from "./Google";
// import RegisterFromFields from "./RegisterFormFields";
// import { registerEmailBody } from "./RegisterEmailBody";
// import { isEmailValid, isPasswordValid } from "./RegisterValidations";

// export interface FormData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     profilePicture: string | null;
// }

// const RegisterForm: React.FC = () => {
//     const [formData, setFormData] = useState<FormData>({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         profilePicture: null
//     });

//     const [showProfilePicture, setShowProfilePicture] = useState<boolean>(false);
//     const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//     const [upProfile, setUpProfile] = useState(false);
//     const [finishProfile, setFinishProfile] = useState(false);
//     const [snackOpen, setSnackOpen] = useState(false);
//     const [snackMessage, setSnackMessage] = useState('');
//     const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
//     const [progress, setProgress] = useState(0);
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();

//     const handleSnackClose = () => {
//         setSnackOpen(false);
//     };

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value,
//             }));
//     };

//     const handleProfilePictureSelect = (file: File | null) => {
//         if (file) {
//             setUpProfile(true);
//             setFinishProfile(false);
//             uploadProfilePictureService(file).then(async presignedUrl => {
//                 if (presignedUrl) {
//                     await axios.put(presignedUrl, file, {
//                         headers: { "Content-Type": file.type },
//                         onUploadProgress: (progressEvent) => {
//                             const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
//                             setProgress(percent);
//                         },
//                     }).then(() => {
//                         setProgress(0);
//                         setFinishProfile(true);
//                         setUpProfile(false);
//                         setFormData(prev => ({ ...prev, profilePicture: presignedUrl.split('?')[0] })); });  
//                 } else {
//                     console.error("Failed to upload profile picture.");
//                 }
//             });
//         }
//         setShowProfilePicture(false);
//     };

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const emailError = isEmailValid(formData.email) ? '' : 'אימייל לא תקין';
//         const passwordError = isPasswordValid(formData.password) ? '' : 'סיסמה חייבת להיות באורך של לפחות 6 תווים';

//         if (emailError || passwordError) {
//             setErrors({ email: emailError, password: passwordError });
//             return;
//         }

//         setErrors({});

//          if (!finishProfile) {
//             setSnackMessage('תמונה לא הועלתה');
//             setSnackSeverity('error');
//             setSnackOpen(true);
//             return;
//         }
//             const user: UserRegister = {
//                 fName: formData.firstName,
//                 lName: formData.lastName,
//                 email: formData.email,
//                 password: formData.password,
//                 profile: formData.profilePicture
//             };
//             const result = await dispatch(registerUser({ user }));
            
//             if (result.meta.requestStatus === 'fulfilled') {
//             setSnackMessage('הרשמה בוצעה בהצלחה');
//             setSnackSeverity('success');
//             setSnackOpen(true);
//             setTimeout(() => {navigate('/');}, 1500);
//             const subject = "ברוכים הבאים למשפחה שלנו";
//             const body = registerEmailBody(user.fName);
            
//             const result2 = await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
//             if(result2.meta.requestStatus === 'fulfilled'){
//                 console.log("mail sent!");
//                 // window.location.reload();
//                 dispatch(fetchUser() as any);}
//             else{
//                 console.log("mail not sent!");}
//             }
//             else{   
//             setSnackMessage('הרשמה נכשלה');
//             setSnackSeverity('error');
//             setSnackOpen(true);
//             }
//     };

//     const handleNavigateToProfilePicture = () => {
//         setShowProfilePicture(true);
//     };

//     return (
//         <>
//          <Snackbar 
//                 open={snackOpen} 
//                 autoHideDuration={6000} 
//                 onClose={handleSnackClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
//                     {snackMessage}
//                 </Alert>
//             </Snackbar>
//         <div style={{marginTop: '3vh', direction: 'rtl'}}>
//         <Container component="main" maxWidth="xs">
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'black' }}>
//                 <Typography component="h1" variant="h4" sx={{ color: 'orange', marginBottom: 0 }}>
//                     טופס הרשמה
//                 </Typography>
//                 <div style={{height: '2vh'}}></div>
//                 <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
//                     <RegisterFromFields 
//                         firstName={formData.firstName}
//                         lastName={formData.lastName}
//                         email={formData.email}
//                         password={formData.password}
//                         handleChange={handleChange}
//                         errorsEmail={errors.email}
//                         errorsPassword={errors.password}
//                     />
//                     <div style={{height: '0.2vh'}}></div>
//                     {!upProfile && !finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
//                         בחר תמונת פרופיל
//                     </Button>}
//                     {!upProfile && finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
//                         עדכן תמונת פרופיל
//                     </Button>}
//                     {upProfile && !finishProfile && (
//                             <Box sx={{ width: "100%", marginTop: "15px" }}>
//                                 <LinearProgress
//                                     variant="determinate"
//                                     value={progress}
//                                     sx={{
//                                         height: "8px",
//                                         borderRadius: "4px",
//                                         backgroundColor: "#333",
//                                         "& .MuiLinearProgress-bar": {
//                                             backgroundColor: "#FFA500",
//                                         },
//                                     }}
//                                 />
//                                 <Typography sx={{ marginTop: "5px", fontSize: "14px", color: "#FFA726" }}>{progress}%</Typography>
//                             </Box>
//                     )}
//                     <Button type="submit" disabled={!finishProfile} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff9800' }, '&.Mui-disabled': {  backgroundColor: '#e0e0e0', color: '#b0b0b0' } }}>
//                         להרשמה
//                     </Button>
//                     <Google />
//                 </form>
//                 <Dialog open={showProfilePicture} onClose={() => setShowProfilePicture(false)}>
//                     <DialogTitle sx={{ color: 'orange' }}>בחירת תמונת פרופיל</DialogTitle>
//                     <DialogContent>
//                         <ProfilePicture onSelect={handleProfilePictureSelect} onClose={() => setShowProfilePicture(false)} />
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setShowProfilePicture(false)} sx={{ color: 'orange' }}>סגור</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </Container>
//         </div>
//         </>
//     );
// };

// export default RegisterForm;

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
import { Check, User, Mail, Lock, Upload, AlertCircle, Loader2 } from "lucide-react"
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
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Auto-focus the first name field on component mount
    if (firstNameRef.current) {
      firstNameRef.current.focus()
    }
  }, [])

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user types
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
              })
          } else {
            console.error("Failed to upload profile picture.")
            setSnackMessage("נכשל בהעלאת תמונת פרופיל")
            setSnackSeverity("error")
            setSnackOpen(true)
            setUpProfile(false)
          }
        })
        .catch((error) => {
          console.error("Error uploading profile picture:", error)
          setSnackMessage("שגיאה בהעלאת תמונת פרופיל")
          setSnackSeverity("error")
          setSnackOpen(true)
          setUpProfile(false)
        })
    }
    setShowProfilePicture(false)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailError = isEmailValid(formData.email) ? "" : "אימייל לא תקין"
    const passwordError = isPasswordValid(formData.password) ? "" : "סיסמה חייבת להיות באורך של לפחות 6 תווים"

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setErrors({})

    if (!finishProfile) {
      setSnackMessage("תמונה לא הועלתה")
      setSnackSeverity("error")
      setSnackOpen(true)
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
        setSnackMessage("הרשמה בוצעה בהצלחה")
        setSnackSeverity("success")
        setSnackOpen(true)

        const subject = "ברוכים הבאים למשפחה שלנו"
        const body = registerEmailBody(user.fName)

        try {
          const emailResult = await dispatch(sendEmail({ to: user.email, subject: subject, body: body }))
          if (emailResult.meta.requestStatus === "fulfilled") {
            console.log("mail sent!")
            dispatch(fetchUser() as any)
          } else {
            console.log("mail not sent!")
          }
        } catch (error) {
          console.error("Error sending welcome email:", error)
        }

        setTimeout(() => {
          navigate("/");
        }, 1500)
      } else {
        setSnackMessage("הרשמה נכשלה")
        setSnackSeverity("error")
        setSnackOpen(true)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setSnackMessage("שגיאה בתהליך ההרשמה")
      setSnackSeverity("error")
      setSnackOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <>
      {snackOpen && (
        <div className={`register-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
          <div className="register-snackbar-content">
            {snackSeverity === "success" ? (
              <Check className="register-snackbar-icon" size={20} />
            ) : (
              <AlertCircle className="register-snackbar-icon" size={20} />
            )}
            <span>{snackMessage}</span>
            <button className="register-snackbar-close" onClick={handleSnackClose}>
              ×
            </button>
          </div>
        </div>
      )}

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

            <GoogleAuth />

            <p className="register-login-link">
              כבר יש לך חשבון? <a href="/login">התחבר כאן</a>
            </p>
          </form>
        </div>
      </div>

      {showProfilePicture && (
        <div className="register-modal-overlay">
          <div className="register-modal-container">
            <div className="register-modal-header">
              <h2>בחירת תמונת פרופיל</h2>
              <button className="register-modal-close" onClick={() => setShowProfilePicture(false)}>
                ×
              </button>
            </div>
            <div className="register-modal-content">
              <ProfilePicture onSelect={handleProfilePictureSelect} onClose={() => setShowProfilePicture(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RegisterForm