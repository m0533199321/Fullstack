import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from "react-redux";
import { registerUser } from "./Redux/AuthSlice";
import { UserRegister } from "../models/AuthType";
import ProfilePicture from './ProfilePicture';
import { uploadProfilePictureService } from "./Services/ProfileService";
import { CustomTextField, CreateTextField } from "./RegisterGenericTextField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

    const [step, setStep] = useState<number>(1);
    const [showProfilePicture, setShowProfilePicture] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPasswordValid = (password: string) => {
        return password.length >= 6;
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
            uploadProfilePictureService(file).then(path => {
                if (path) {
                    setFormData(prev => ({ ...prev, profilePicture: path }));   
                } else {
                    console.error("Failed to upload profile picture.");
                }
            });
        }
        setShowProfilePicture(false);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailError = isEmailValid(formData.email) ? '' : 'אימייל לא תקין';
        const passwordError = isPasswordValid(formData.password) ? '' : 'סיסמה חייבת להיות באורך של לפחות 6 תווים';

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setErrors({});

        if (step === 2) {
            const user: UserRegister = {
                fName: formData.firstName,
                lName: formData.lastName,
                email: formData.email,
                password: formData.password,
                profile: formData.profilePicture,
                information: "sensitivities: " + formData.allergies.join(', ') + " preferences: " + formData.preferences + " additionalNotes: " + formData.additionalNotes
            };
            dispatch(registerUser({ user }));
            navigate('/');
        } else {
            setStep(2);
        }
    };

    const handleNavigateToProfilePicture = () => {
        setShowProfilePicture(true);
    };

    const handleBackToStep1 = () => {
        setStep(1);
    };

    return (
        <div style={{direction: 'rtl'}}>
        <Container component="main" maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#222' }}>
                <Typography component="h1" variant="h5" sx={{ color: 'orange', marginBottom: 0 }}>
                    {step === 1 ? 'שלב 1: פרטים אישיים' : 'שלב 2: רגישויות והערות'}
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                {step === 1 && (
                <>
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
                    <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
                        בחר תמונת פרופיל
                    </Button>
                </>
            )}
            {step === 2 && (
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
