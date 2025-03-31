import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    LinearProgress
} from '@mui/material';
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from "react-redux";
import { fetchUser, registerUser, sendEmail } from "./Redux/AuthSlice";
import { UserRegister } from "../models/AuthType";
import ProfilePicture from './ProfilePicture';
import { uploadProfilePictureService } from "./Services/ProfileService";
import { CreateTextField } from "./RegisterGenericTextField";
import axios from "axios";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string | null;
    allergies: string[];
    preferences: string;
    additionalNotes: string;
}

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profilePicture: null,
        allergies: [],
        preferences: '',
        additionalNotes: ''
    });

    const [showProfilePicture, setShowProfilePicture] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [upProfile, setUpProfile] = useState(false);
    const [finishProfile, setFinishProfile] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPasswordValid = (password: string) => {
        return password.length >= 6;
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => {
                const allergies = target.checked
                    ? [...prev.allergies, value]
                    : prev.allergies.filter(allergy => allergy !== value);
                return { ...prev, allergies };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleProfilePictureSelect = (file: File | null) => {
        if (file) {
            setUpProfile(true);
            setFinishProfile(false);
            uploadProfilePictureService(file).then(async presignedUrl => {
                if (presignedUrl) {
                    await axios.put(presignedUrl, file, {
                        headers: { "Content-Type": file.type },
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                            setProgress(percent);
                        },
                    }).then(() => {
                        setProgress(0);
                        setFinishProfile(true);
                        setUpProfile(false);
                        setFormData(prev => ({ ...prev, profilePicture: presignedUrl.split('?')[0] })); });  
                } else {
                    console.error("Failed to upload profile picture.");
                }
            });
        }
        setShowProfilePicture(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailError = isEmailValid(formData.email) ? '' : 'אימייל לא תקין';
        const passwordError = isPasswordValid(formData.password) ? '' : 'סיסמה חייבת להיות באורך של לפחות 6 תווים';

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setErrors({});

         if (!finishProfile) {
            setSnackMessage('תמונה לא הועלתה');
            setSnackSeverity('error');
            setSnackOpen(true);
            return;
        }
        // if (step === 2) {
            const user: UserRegister = {
                fName: formData.firstName,
                lName: formData.lastName,
                email: formData.email,
                password: formData.password,
                profile: formData.profilePicture,
                information: ""
                // information: "sensitivities: " + formData.allergies.join(', ') + " preferences: " + formData.preferences + " additionalNotes: " + formData.additionalNotes
            };
            const result = await dispatch(registerUser({ user }));
            console.log(result);
            
            if (result.meta.requestStatus === 'fulfilled') {
            setSnackMessage('הרשמה בוצעה בהצלחה');
            setSnackSeverity('success');
            setSnackOpen(true);
            setTimeout(() => {navigate('/');}, 1500);
            const subject = "ברוכים הבאים למשפחה שלנו";
            const body = `
            <div style='text-align: right; font-family: Arial, sans-serif;'>
                <h1 style='font-size: 28px; color: #FFA500;'>!ברוכים הבאים</h1>
                <p style='font-size: 20px; color: #333;'>,היי ${user.fName}</p>
                <p style='font-size: 18px; color: #333;'>.איזה כיף שאת/ה כאן! אנחנו שמחים מאוד שהצטרפת לקהילה שלנו</p>
                <p style='font-size: 18px; color: #333;'>:מעכשיו, תוכל/י ליהנות ממגוון רחב של פיצ'רים שישדרגו את חוויית הבישול שלך</p>
                <ul style='font-size: 18px; color: #333;'>
                    <li>🍽️ <strong>.מתכונים טעימים ומגוונים:</strong> קבל/י גישה למאגר עשיר של מתכונים, מכל הסוגים ולכל הטעמים</li>
                    <li>🛒 <strong>.ניהול מתכונים קל ונוח:</strong> שמור/י את המתכונים האהובים עליך, צור/י רשימות קניות ושתף/י מתכונים עם חברים</li>
                    <li>👩‍🍳 <strong>.קהילה חמה ותומכת:</strong> הצטרף/י לקהילה של אוהבי בישול, שתף/י מתכונים וטיפים, וקבל/י השראה</li>
                </ul>
                <p style='font-size: 18px; color: #333;'>.אנו מזמינים אותך להתחיל לחקור את האפליקציה, לגלות מתכונים חדשים, ולשתף את היצירות שלך איתנו</p>
                <p style='font-size: 18px; color: #333;'>.אם יש לך שאלות או בקשות, אנחנו כאן בשבילך</p>
                <p style='font-size: 20px; color: #FFA500;'>,בתיאבון</p>
                <p style='font-size: 20px; color: #FFA500;'>smart-chef</p>
            </div>
            `;
            
            const result2 = await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
            if(result2.meta.requestStatus === 'fulfilled'){
                console.log("mail sent!");
                // window.location.reload();
                dispatch(fetchUser() as any);}
            else{
                console.log("mail not sent!");}
            }
            else{   
            setSnackMessage('הרשמה נכשלה');
            setSnackSeverity('error');
            setSnackOpen(true);
            }

            // await dispatch(fetchUser() as any);

        // } else {
        //     setStep(2);
        // }
    };

    const handleNavigateToProfilePicture = () => {
        setShowProfilePicture(true);
    };

    return (
        <>
         <Snackbar 
                open={snackOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // מיקום בראש העמוד
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        <div style={{marginTop: '12vh', direction: 'rtl'}}>
        <Container component="main" maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'black' }}>
                <Typography component="h1" variant="h4" sx={{ color: 'orange', marginBottom: 0 }}>
                    טופס הרשמה{/* {step === 1 ? 'שלב 1: פרטים אישיים' : 'שלב 2: רגישויות והערות'} */}
                </Typography>
                <div style={{height: '2vh'}}></div>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                    <CreateTextField 
                        name="firstName" 
                        label="שם פרטי" 
                        type="text" 
                        value={formData.firstName} 
                        handleChange={handleChange}
                    />
                    <CreateTextField 
                        name="lastName" 
                        label="שם משפחה" 
                        type="text" 
                        value={formData.lastName} 
                        handleChange={handleChange}
                    />
                    <CreateTextField 
                        name="email" 
                        label="מייל" 
                        type="email" 
                        value={formData.email} 
                        error={!!errors.email} 
                        helperText={errors.email}
                        handleChange={handleChange}
                    />
                    <CreateTextField 
                        name="password" 
                        label="סיסמה" 
                        type="password" 
                        value={formData.password} 
                        error={!!errors.password} 
                        helperText={errors.password}
                        handleChange={handleChange}
                    />
                    <div style={{height: '2vh'}}></div>
                    {!upProfile && !finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
                        בחר תמונת פרופיל
                    </Button>}
                    {!upProfile && finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
                        עדכן תמונת פרופיל
                    </Button>}
            {/* {step === 2 && (
            <>
            <Button onClick={handleBackToStep1} variant="outlined" sx={{ marginBottom: 2, border: 'none', marginRight: '34vw' }}>
            <ArrowBackIcon sx={{ left: 0, color: 'orange' }}/>
            </Button>
            <Typography variant="body1" sx={{ marginBottom: 2, color: '#777' }}>סימון אלרגניים:</Typography>
            {['אגוזים', 'חלב', 'גלוטן', 'ביצים'].map(allergy => (
                <FormControlLabel
                    key={allergy}
                    control={
                        <Checkbox
                            checked={formData.allergies.includes(allergy)}
                            onChange={handleChange}
                            name={allergy}
                            value={allergy}
                            sx={{ '&.Mui-checked': { color: 'orange' } }}
                        />
                    }
                    label={allergy}
                    sx={{ color: '#777' }}
                />
            ))}
            <CustomTextField 
                name="preferences" 
                label="מצרכים נגישים" 
                value={formData.preferences}
                handleChange={handleChange} 
            />
            <CustomTextField 
                name="additionalNotes" 
                label="הערות נוספות" 
                value={formData.additionalNotes}
                handleChange={handleChange} 
            />
            </>
                    )}
                    <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff9800' } }}>
                        {step === 1 ? 'המשך לשלב 2' : 'שלח'}
                    </Button> */}
                    {upProfile && !finishProfile && (
                            <Box sx={{ width: "100%", marginTop: "15px" }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: "8px",
                                        borderRadius: "4px",
                                        backgroundColor: "#333",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: "#FFA500",
                                        },
                                    }}
                                />
                                <Typography sx={{ marginTop: "5px", fontSize: "14px", color: "#FFA726" }}>{progress}%</Typography>
                            </Box>
                        // <div style={{width:'100%',display:'flex', alignItems:'center'}}>
                        // <img src="../../images/GIF/Spinner-2.gif"/>
                        // <div>{progress}</div>
                        // <p>תמונה בהעלאה</p>
                        // </div>
                    )}
                    <Button type="submit" disabled={!finishProfile} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff9800' }, '&.Mui-disabled': {  backgroundColor: '#e0e0e0', color: '#b0b0b0' } }}>
                        להרשמה
                    </Button>

                </form>
                <Dialog open={showProfilePicture} onClose={() => setShowProfilePicture(false)}>
                    <DialogTitle sx={{ color: 'orange' }}>בחירת תמונת פרופיל</DialogTitle>
                    <DialogContent>
                        <ProfilePicture onSelect={handleProfilePictureSelect} onClose={() => setShowProfilePicture(false)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowProfilePicture(false)} sx={{ color: 'orange' }}>סגור</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
        </div>
        </>
    );
};

export default RegisterForm;





// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Container,
//     Box,
//     Button,
//     Typography,
//     FormControlLabel,
//     Checkbox,
//     TextField,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions
// } from '@mui/material';
// import { AppDispatch } from "./Redux/Store";
// import { useDispatch } from "react-redux";
// import { registerUser } from "./Redux/AuthSlice";
// import { UserRegister } from "../models/AuthType";
// import createTextField from './CreateTextFieldRegister';
// import ProfilePicture from './ProfilePicture';
// import { uploadProfilePicture } from "./Redux/ProfileSlice";
// import uploadSlice, { fetchUploadUrl } from "./Redux/P";

// interface FormData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     profilePicture: File | null;
//     allergies: string[];
//     preferences: string;
//     additionalNotes: string;
// }

// const RegisterForm: React.FC = () => {
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
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();

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

//     const handleProfilePictureSelect = (file: File | null) => {
//         if (file) {
//             // שלח את הקובץ ל-Slice להעלאה
//             // dispatch(uploadProfilePicture(file));
//             dispatch(fetchUploadUrl(file))
//             setFormData(prev => ({ ...prev, profilePicture: file }));
//         }
//         setShowProfilePicture(false);
//     };

//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (step === 2) {
//             // // בדוק אם תמונת הפרופיל נבחרה
//             // if (!formData.profilePicture) {
//             //     alert('נא לבחור תמונת פרופיל'); // ניתן לשפר את ההודעה או להשתמש בהודעה גרפית
//             //     return; // עצור את השליחה אם לא נבחרה תמונה
//             // }
    
//             const user: UserRegister = {
//                 fName: formData.firstName,
//                 lName: formData.lastName,
//                 email: formData.email,
//                 password: formData.password,
//                 profile: formData.profilePicture,
//                 information: "sensitivities: " + formData.allergies.join(', ') + " preferences: " + formData.preferences + " additionalNotes: " + formData.additionalNotes
//             };
//             dispatch(registerUser({ user }));
//             navigate('/');
//         } else {
//             setStep(2);
//         }
//     };

//     const handleNavigateToProfilePicture = () => {
//         setShowProfilePicture(true);
//     };

//     const handleBackToStep1 = () => {
//         setStep(1);
//     };

//     return (
//         <Container component="main" maxWidth="xs">
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
//                 <Typography component="h1" variant="h5" sx={{ color: 'black', marginBottom: 2 }}>
//                     {step === 1 ? 'שלב 1: פרטים אישיים' : 'שלב 2: רגישויות והערות'}
//                 </Typography>
//                 <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
//                     {step === 1 && (
//                         <>
//                             {createTextField({
//                                 name: "firstName",
//                                 label: "שם פרטי",
//                                 value: formData.firstName,
//                                 onChange: handleChange,
//                                 required: true,
//                             })}
//                             {createTextField({
//                                 name: "lastName",
//                                 label: "שם משפחה",
//                                 value: formData.lastName,
//                                 onChange: handleChange,
//                                 required: true,
//                             })}
//                             {createTextField({
//                                 name: "email",
//                                 label: "מייל",
//                                 type: "email",
//                                 value: formData.email,
//                                 onChange: handleChange,
//                                 required: true,
//                             })}
//                             {createTextField({
//                                 name: "password",
//                                 label: "סיסמה",
//                                 type: "password",
//                                 value: formData.password,
//                                 onChange: handleChange,
//                                 required: true,
//                             })}
//                             <Button onClick={handleNavigateToProfilePicture}>
//                                 בחר תמונת פרופיל
//                             </Button>
//                         </>
//                     )}
//                     {step === 2 && (
//                         <>
//                             <Button onClick={handleBackToStep1} variant="outlined" sx={{ marginBottom: 2 }}>
//                                 חזור לשלב 1
//                             </Button>
//                             <Typography variant="body1" sx={{ marginBottom: 2 }}>סימון אלרגניים:</Typography>
//                             {['אגוזים', 'חלב', 'גלוטן', 'ביצים'].map(allergy => (
//                                 <FormControlLabel
//                                     key={allergy}
//                                     control={
//                                         <Checkbox
//                                             checked={formData.allergies.includes(allergy)}
//                                             onChange={handleChange}
//                                             name={allergy}
//                                             value={allergy}
//                                             sx={{ '&.Mui-checked': { color: 'black' } }}
//                                         />
//                                     }
//                                     label={allergy}
//                                 />
//                             ))}
//                             <TextField
//                                 variant="outlined"
//                                 margin="normal"
//                                 fullWidth
//                                 name="preferences"
//                                 label="מצרכים נגישים"
//                                 multiline
//                                 rows={4}
//                                 value={formData.preferences}
//                                 onChange={handleChange}
//                                 sx={{ input: { color: 'black' }, label: { color: 'black' } }}
//                             />
//                             <TextField
//                                 variant="outlined"
//                                 margin="normal"
//                                 fullWidth
//                                 name="additionalNotes"
//                                 label="הערות נוספות"
//                                 multiline
//                                 rows={4}
//                                 value={formData.additionalNotes}
//                                 onChange={handleChange}
//                                 sx={{ input: { color: 'black' }, label: { color: 'black' } }}
//                             />
//                         </>
//                     )}
//                     <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}>
//                         {step === 1 ? 'המשך לשלב 2' : 'שלח'}
//                     </Button>
//                 </form>
//                 <Dialog open={showProfilePicture} onClose={() => setShowProfilePicture(false)}>
//                     <DialogTitle>בחירת תמונת פרופיל</DialogTitle>
//                     <DialogContent>
//                         <ProfilePicture onSelect={handleProfilePictureSelect} onClose={() => setShowProfilePicture(false)} />
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setShowProfilePicture(false)}>סגור</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </Container>
//     );
// };

// export default RegisterForm;
