// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Container,
//     Box,
//     Button,
//     Typography,
//     FormControlLabel,
//     Checkbox,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Snackbar,
//     Alert,
//     LinearProgress
// } from '@mui/material';
// import { AppDispatch } from "./Redux/Store";
// import { useDispatch } from "react-redux";
// import { registerUser } from "./Redux/AuthSlice";
// import { UserRegister } from "../models/AuthType";
// import ProfilePicture from './ProfilePicture';
// import { uploadProfilePictureService } from "./Services/ProfileService";
// import { CustomTextField, CreateTextField } from "./RegisterGenericTextField";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import axios from "axios";

// interface FormData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     profilePicture: string | null;
//     allergies: string[];
//     preferences: string;
//     additionalNotes: string;
// }

// const Register: React.FC = () => {
//     const [formData, setFormData] = useState<FormData>({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         profilePicture: null,
//         allergies: [],
//         preferences: '',
//         additionalNotes: ''
//     });

//     const [step, setStep] = useState<number>(1);
//     const [showProfilePicture, setShowProfilePicture] = useState<boolean>(false);
//     const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//     const [upProfile, setUpProfile] = useState(false);
//     const [finishProfile, setFinishProfile] = useState(false);
//     const [snackOpen, setSnackOpen] = useState(false);
//     const [snackMessage, setSnackMessage] = useState('');
//     const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
//     const [currentProfile, setCurrentProfile] = useState<File | null>(null);
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();

//     const isEmailValid = (email: string) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const isPasswordValid = (password: string) => {
//         return password.length >= 6;
//     };

//     const handleSnackClose = () => {
//         setSnackOpen(false);
//     };

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value, type } = e.target;

//         if (type === 'checkbox') {
//             const target = e.target as HTMLInputElement;
//             setFormData(prev => {
//                 const allergies = target.checked
//                     ? [...prev.allergies, value]
//                     : prev.allergies.filter(allergy => allergy !== value);
//                 return { ...prev, allergies };
//             });
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     const handleProfilePictureSelect = async (file: File | null) => {
//         if (file) {
//             try {
//                 const presignedUrl = await uploadProfilePictureService(file);
//                 if (presignedUrl) {
//                     setFormData(prev => ({ ...prev, profilePicture: presignedUrl }));
//                     await axios.put(presignedUrl, file, {
//                         headers: { "Content-Type": file.type },
//                     });
//                     console.log(presignedUrl);
//                     setFormData(prev => ({ ...prev, profilePicture: presignedUrl }));
//                     console.log("Profile picture uploaded successfully."); 
//                     console.log(formData);
                    
//                 } else {
//                     console.error("Failed to upload profile picture.");
//                 }
//             } catch (error) {
//                 console.error("Error uploading profile picture: ", error);
//             }
//         }
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

//         if (!upProfile) {
//             setSnackMessage('תמונה לא הועלתה');
//             setSnackSeverity('error');
//             setSnackOpen(true);
//             return;
//         }

//         await handleProfilePictureSelect(currentProfile);

//         console.log("profile picture: " + formData.profilePicture);

//         const user: UserRegister = {
//             fName: formData.firstName,
//             lName: formData.lastName,
//             email: formData.email,
//             password: formData.password,
//             profile: formData.profilePicture,
//             information: ""
//         };
//         const result = await dispatch(registerUser({ user }));
//         console.log(result);

//         if (result.meta.requestStatus === 'fulfilled') {
//             setSnackMessage('הרשמה בוצעה בהצלחה');
//             setSnackSeverity('success');
//             setSnackOpen(true);
//             setTimeout(() => { navigate('/'); }, 1500);
//         }
//         else {
//             setSnackMessage('הרשמה נכשלה');
//             setSnackSeverity('error');
//             setSnackOpen(true);
//         }
//     };

//     const handleCurrentProfilePicture = (file: File | null) => {
//         if (file) {
//             setUpProfile(true);
//             console.log(file.name);
//             setCurrentProfile(file);
//         }
//     }

//     const handleNavigateToProfilePicture = () => {
//         setShowProfilePicture(true);
//     };

//     return (
//         <>
//             <Snackbar
//                 open={snackOpen}
//                 autoHideDuration={6000}
//                 onClose={handleSnackClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // מיקום בראש העמוד
//             >
//                 <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
//                     {snackMessage}
//                 </Alert>
//             </Snackbar>
//             <div style={{ marginTop: '12vh', direction: 'rtl' }}>
//                 <Container component="main" maxWidth="xs">
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'black' }}>
//                         <Typography component="h1" variant="h4" sx={{ color: 'orange', marginBottom: 0 }}>
//                             טופס הרשמה{/* {step === 1 ? 'שלב 1: פרטים אישיים' : 'שלב 2: רגישויות והערות'} */}
//                         </Typography>
//                         <div style={{ height: '2vh' }}></div>
//                         <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
//                             {step === 1 && (
//                                 <>
//                                     <CreateTextField
//                                         name="firstName"
//                                         label="שם פרטי"
//                                         type="text"
//                                         value={formData.firstName}
//                                         handleChange={handleChange}
//                                     />
//                                     <CreateTextField
//                                         name="lastName"
//                                         label="שם משפחה"
//                                         type="text"
//                                         value={formData.lastName}
//                                         handleChange={handleChange}
//                                     />
//                                     <CreateTextField
//                                         name="email"
//                                         label="מייל"
//                                         type="email"
//                                         value={formData.email}
//                                         error={!!errors.email}
//                                         helperText={errors.email}
//                                         handleChange={handleChange}
//                                     />
//                                     <CreateTextField
//                                         name="password"
//                                         label="סיסמה"
//                                         type="password"
//                                         value={formData.password}
//                                         error={!!errors.password}
//                                         helperText={errors.password}
//                                         handleChange={handleChange}
//                                     />
//                                     <div style={{ height: '2vh' }}></div>
//                                     {!upProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange', marginRight: 14 }}>
//                                         בחר תמונת פרופיל
//                                     </Button>}
//                                     {upProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange', marginRight: 14 }}>
//                                         עדכן תמונת פרופיל
//                                     </Button>}
//                                 </>
//                             )}
//                             <Button type="submit" disabled={!upProfile} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff9800' }, '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#b0b0b0' } }}>
//                                 להרשמה
//                             </Button>

//                         </form>
//                         <Dialog open={showProfilePicture} onClose={() => setShowProfilePicture(false)}>
//                             <DialogTitle sx={{ color: 'orange' }}>בחירת תמונת פרופיל</DialogTitle>
//                             <DialogContent>
//                                 <ProfilePicture onSelect={handleCurrentProfilePicture} onClose={() => setShowProfilePicture(false)} />
//                             </DialogContent>
//                             <DialogActions>
//                                 <Button onClick={() => setShowProfilePicture(false)} sx={{ color: 'orange' }}>סגור</Button>
//                             </DialogActions>
//                         </Dialog>
//                     </Box>
//                 </Container>
//             </div>
//         </>
//     );
// };

// export default Register;

