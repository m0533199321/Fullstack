import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Typography, Dialog, DialogTitle, DialogContent,
        DialogActions, Snackbar, Alert, LinearProgress} from '@mui/material';
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from "react-redux";
import { fetchUser, registerUser, sendEmail } from "./Redux/AuthSlice";
import { UserRegister } from "../models/AuthType";
import ProfilePicture from './ProfilePicture';
import { uploadProfilePictureService } from "./Services/ProfileService";
import axios from "axios";
import Google from "./Google";
import RegisterFromFields from "./RegisterFormFields";
import { registerEmailBody } from "./RegisterEmailBody";
import { isEmailValid, isPasswordValid } from "./RegisterValidations";

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string | null;
}

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profilePicture: null
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

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
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
            const user: UserRegister = {
                fName: formData.firstName,
                lName: formData.lastName,
                email: formData.email,
                password: formData.password,
                profile: formData.profilePicture
            };
            const result = await dispatch(registerUser({ user }));
            
            if (result.meta.requestStatus === 'fulfilled') {
            setSnackMessage('הרשמה בוצעה בהצלחה');
            setSnackSeverity('success');
            setSnackOpen(true);
            setTimeout(() => {navigate('/');}, 1500);
            const subject = "ברוכים הבאים למשפחה שלנו";
            const body = registerEmailBody(user.fName);
            
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        <div style={{marginTop: '3vh', direction: 'rtl'}}>
        <Container component="main" maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'black' }}>
                <Typography component="h1" variant="h4" sx={{ color: 'orange', marginBottom: 0 }}>
                    טופס הרשמה
                </Typography>
                <div style={{height: '2vh'}}></div>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                    <RegisterFromFields 
                        firstName={formData.firstName}
                        lastName={formData.lastName}
                        email={formData.email}
                        password={formData.password}
                        handleChange={handleChange}
                        errorsEmail={errors.email}
                        errorsPassword={errors.password}
                    />
                    <div style={{height: '0.2vh'}}></div>
                    {!upProfile && !finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
                        בחר תמונת פרופיל
                    </Button>}
                    {!upProfile && finishProfile && <Button onClick={handleNavigateToProfilePicture} sx={{ color: 'orange' , marginRight: 14}}>
                        עדכן תמונת פרופיל
                    </Button>}
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
                    )}
                    <Button type="submit" disabled={!finishProfile} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff9800' }, '&.Mui-disabled': {  backgroundColor: '#e0e0e0', color: '#b0b0b0' } }}>
                        להרשמה
                    </Button>
                    <Google />
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
