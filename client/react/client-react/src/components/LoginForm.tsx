import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from 'react-redux';
import { loginUser } from "./Redux/AuthSlice";
import { UserLogin } from "../models/AuthType";
import { Button, Typography, Container, Box, Link, Alert, Snackbar } from '@mui/material';
import { CreateTextField } from "./LoginGenericTextField";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        setErrors({ ...errors, [name]: undefined });
    };

    // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value, type } = e.target;

    //     if (type === 'checkbox') {
    //         const target = e.target as HTMLInputElement;
    //         setFormData(prev => {
    //             const allergies = target.checked
    //                 ? [...prev.allergies, value]
    //                 : prev.allergies.filter(allergy => allergy !== value);
    //             return { ...prev, allergies };
    //         });
    //     } else {
    //         setFormData(prev => ({
    //             ...prev,
    //             [name]: value,
    //         }));
    //     }
    // };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
        if (password.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של 6 תווים לפחות';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const user: UserLogin = { email, password };
            const result = await dispatch(loginUser({ user }));
            console.log(result);

            if (result.meta.requestStatus === 'fulfilled') {
                setSnackMessage('התחברות בוצעה בהצלחה');
                setSnackSeverity('success');
                setSnackOpen(true);
                setTimeout(() => { navigate('/'); }, 1500);
            }
            else {
                setSnackMessage('התחברות נכשלה');
                setSnackSeverity('error');
                setSnackOpen(true);
            }
        }
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    // const inputStyles = {
    //     input: { color: 'black' },
    //     label: { color: 'black' },
    //     '& .MuiOutlinedInput-root': {
    //         '& fieldset': { borderColor: 'black' },
    //         '&:hover fieldset': { borderColor: 'black' },
    //         '&.Mui-focused fieldset': { borderColor: 'black' },
    //     },
    //     '& .MuiInputLabel-root': { color: 'black' }, // שינוי צבע הלייבלים
    //     '& .MuiInputLabel-root.Mui-focused': { color: 'black' }, // צבע הלייבל במיקוד
    // };

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
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: '15vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // marginTop: 8,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    // backgroundColor: '#333'
                }}>
                    <div style={{ height: '2vh' }}></div>
                    <Typography component="h1" variant="h4" sx={{ color: 'orange' }}>טופס התחברות</Typography> {/* צבע טקסט כתום */}
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                        <CreateTextField
                            name="email"
                            label="מייל"
                            type="email"
                            value={email}
                            handleChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <div style={{ height: '2vh' }}></div>
                        <CreateTextField
                            name="password"
                            label="סיסמה"
                            type="password"
                            value={password}
                            handleChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <div style={{ height: '3vh' }}></div>
                        <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                            התחבר
                        </Button>
                        <Typography variant="body2" sx={{ marginTop: 2, color: 'white', textAlign: 'center' }}>
                            עדיין לא נרשמת?{''}
                            <Link href="/register" sx={{ color: 'orange', marginRight: '1vw', textDecorationColor: 'gray' }}>
                                להרשמה לחץ כאן
                            </Link>
                        </Typography>
                    </form>
                </Box>
            </Container>
        </>
    );

};

export default LoginForm;
