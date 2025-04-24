import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from 'react-redux';
import { forgotPasswordUser, sendEmailForgot } from "./Redux/AuthSlice";
import { UserLogin } from "../models/AuthType";
import { Button, Typography, Container, Box, Alert, Snackbar } from '@mui/material';
import { CreateTextField } from "./ForgotGenericTextField";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [random, setRandom] = useState<string>('');
    const [randomServer, setRandomServer] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; random?: string }>({});
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const [step, setStep] = useState(1); // 1: Email, 2: Random Code, 3: Password

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "random") setRandom(value);
        setErrors({ ...errors, [name]: undefined });
    };

    const handleForgotPassword = async () => {
        const newErrors: { email?: string; password?: string; random?: string } = {};

        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            setSnackMessage('בודק הרשאות כתובת מייל');
            setSnackSeverity('success');
            setSnackOpen(true);
            const result = await dispatch(sendEmailForgot({ to: email, subject: 'שחזור סיסמה', body: 'שחזור סיסמה' }));
            console.log(result.payload);
            setRandomServer(result.payload);
            if (result.meta.requestStatus === 'fulfilled') {
                setSnackMessage('קוד אימות נשלח למייל');
                setSnackSeverity('success');
                setSnackOpen(true);
                setStep(2);
            }
            else {
                setSnackMessage('שליחה למייל נכשלה יש לנסות שוב');
                setSnackSeverity('error');
                setSnackOpen(true);
                setStep(1);
            }
        }
    }

    const handleCheckRandom = () => {
        console.log(random);
        console.log(randomServer);
        console.log(typeof (random));
        console.log(typeof (randomServer));

        if (randomServer == random) {

            setSnackMessage('אימות עבר בהצלחה');
            setSnackSeverity('success');
            setSnackOpen(true);
            setStep(3);
        }
        else {
            setSnackMessage('אימות נכשל יש לנסות שוב');
            setSnackSeverity('error');
            setSnackOpen(true);
            setStep(2);
        }
    }

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
                setSnackMessage('התחברות בוצעה בהצלחה');
                setSnackSeverity('success');
                setSnackOpen(true);
                setTimeout(() => {
                    navigate('/');
                    // window.localStorage.setItem('token', result.payload.token);
                    window.location.reload();
                }, 1500);
            }
            else {
                setSnackMessage('התחברות נכשלה');
                setSnackSeverity('error');
                setSnackOpen(true);
                setStep(1);
            }
        }
    };

    return (
        <>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
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
                    <Typography component="h1" variant="h4" sx={{ color: 'orange' }}>שכחת סיסמה</Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                        <CreateTextField
                            name="email"
                            label="מייל"
                            type="email"
                            value={email}
                            handleChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={step !== 1}
                        />
                        <div style={{ height: '2vh' }}></div>
                        <CreateTextField
                            name="random"
                            label="קוד אימות"
                            type="text"
                            value={random}
                            handleChange={handleChange}
                            error={!!errors.random}
                            helperText={errors.random}
                            disabled={step !== 2}
                        />
                        <div style={{ height: '2vh' }}></div>
                        <CreateTextField
                            name="password"
                            label="סיסמה חדשה"
                            type="password"
                            value={password}
                            handleChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={step !== 3}
                        />
                        <div style={{ height: '3vh' }}></div>
                        {step === 1 &&
                            <Button onClick={handleForgotPassword} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                                לקבלת קוד אימות
                            </Button>}
                        {step === 2 &&
                            <Button onClick={handleCheckRandom} fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                                אימות
                            </Button>}
                        {step === 3 &&
                            <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                                כניסה
                            </Button>}
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default LoginForm;

