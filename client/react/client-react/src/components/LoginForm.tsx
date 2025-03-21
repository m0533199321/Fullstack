import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from 'react-redux';
import { loginUser } from "./Redux/AuthSlice";
import { UserLogin } from "../models/AuthType";
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import inputStyles from "./LoginGenericTextField";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        setErrors({ ...errors, [name]: undefined });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'אימייל לא תקין';
        if (password.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של 6 תווים לפחות';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const user: UserLogin = { email, password };
            dispatch(loginUser({ user }));
            navigate('/');
        }
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
        <Container component="main" maxWidth="xs">
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginTop: 8, 
                padding: 3, 
                borderRadius: 2, 
                boxShadow: 3, 
                backgroundColor: '#333' 
            }}>
                <Typography component="h1" variant="h5" sx={{ color: 'orange' }}>התחבר</Typography> {/* צבע טקסט כתום */}
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                    <TextField
                        {...inputStyles}
                        name="email"
                        label="מייל"
                        autoComplete="off"
                        autoFocus
                        value={email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        {...inputStyles}
                        name="password"
                        label="סיסמה"
                        type="password"
                        autoComplete="off"
                        value={password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'orange', color: 'black', '&:hover': { backgroundColor: '#ff8800' } }}>
                        התחבר
                    </Button>
                </form>
            </Box>
        </Container>
    );
    
};

export default LoginForm;
