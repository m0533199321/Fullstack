import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from 'react-redux';
import { forgotPasswordUser, loginUser, sendEmail, sendEmailForgot } from "./Redux/AuthSlice";
import { UserLogin } from "../models/AuthType";
import { Button, Typography, Container, Box, Link, Alert, Snackbar, TextField } from '@mui/material';
import { CreateTextField } from "./LoginGenericTextField";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; random?: string }>({});
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const [showPassword, setShowPassword] = useState(false);
    const [showSendToEmail, setShowSendToEmail] = useState(false);
    const [randomServer, setRandomServer] = useState('');
    const [random, setRandom] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "random") setRandom(value);
        setErrors({ ...errors, [name]: undefined });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
        if (password.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של 6 תווים לפחות';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const user: UserLogin = { email, password };
            const result = await dispatch(forgotPasswordUser({ user }));
            if (result.meta.requestStatus === 'fulfilled') {
                console.log(result.payload.token);
                setRandomServer(result.payload.token);
                setShowPassword(true)
            }

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

    const handleForgotPassword = async () => {
        setShowSendToEmail(true)
        const newErrors: { email?: string; password?: string; random?: string } = {};

        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            const result = await dispatch(sendEmailForgot({ to: email, subject: 'שחזור סיסמה', body: 'שחזור סיסמה' }));
            console.log(result.payload);
            setRandomServer(result.payload);
        }
    }

    const handleCheckRandom = () => {
        console.log(random);
        console.log(randomServer);
        console.log(typeof(random));
        console.log(typeof(randomServer));

        if (randomServer == random) {
            setShowPassword(true)
        }
        else {
            const newErrors: { email?: string; password?: string; random?: string } = {};

            newErrors.random = 'מספר אימות לא תקין';
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            }
        }
    }

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
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: '15vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3
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
                            name="random"
                            label="מספר אימות"
                            type="text"
                            value={random}
                            handleChange={handleChange}
                            error={!!errors.random}
                            helperText={errors.random}
                        />
                        <div style={{ height: '2vh' }}></div>
                        {showPassword &&
                            <CreateTextField
                                name="password"
                                label="סיסמה"
                                type="password"
                                value={password}
                                handleChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />}

                        <div style={{ height: '3vh' }}></div>
                        {!showSendToEmail && <Button onClick={handleForgotPassword} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                            לקבלת מספר אימות
                        </Button>}
                        {showSendToEmail && !showPassword && <Button onClick={handleCheckRandom} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                            אימות
                        </Button>}
                        {showPassword && <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                            כניסה
                        </Button>}
                    </form>
                </Box>
            </Container>
        </>
    );

};

export default LoginForm;
