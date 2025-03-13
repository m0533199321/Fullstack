import React, { useState, ChangeEvent, FormEvent } from "react";
import { FormDataRegister } from "../models/FormType";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./Redux/Store";
import { useDispatch } from "react-redux";
import { registerUser } from "./Redux/AuthSlice";
import { UserRegister } from "../models/AuthType";
import { TextField, Button, Typography, Container, Box, FormControlLabel, Checkbox } from '@mui/material';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<FormDataRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        allergies: [],
        preferences: '',
        profilePicture: null,
        additionalNotes: '',
    });

    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, files, checked } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            setFormData(prev => {
                const allergies = checked
                    ? [...prev.allergies, value]
                    : prev.allergies.filter(allergy => allergy !== value);
                return { ...prev, allergies };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'file' ? files![0] : value,
            }));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 2) {
            const text = formData.allergies.join(', ');
            const user: UserRegister = {
                fName: formData.firstName, lName: formData.lastName,
                email: formData.email, password: formData.password, profile: formData.profilePicture,
                information: "sensitivities: " + text + " preferences: " + formData.preferences + " additionalNotes: " + formData.additionalNotes
            }
            console.log(user);
            dispatch(registerUser({ user }));
            navigate('/');
        } else {
            setStep(2);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
                <Typography component="h1" variant="h5" sx={{ color: 'black' }}>{step === 1 ? 'שלב 1: פרטים אישיים' : 'שלב 2: רגישויות והערות'}</Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
                    {step === 1 && (
                        <>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="firstName"
                                label="שם פרטי"
                                value={formData.firstName}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="lastName"
                                label="שם משפחה"
                                value={formData.lastName}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="מייל"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="סיסמה"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Typography variant="body1" sx={{ marginBottom: 2 }}>רגישויות למאכלים:</Typography>
                            {['אגוזים', 'חלב', 'גלוטן', 'ביצים'].map(allergy => (
                                <FormControlLabel
                                    key={allergy}
                                    control={
                                        <Checkbox
                                            checked={formData.allergies.includes(allergy)}
                                            onChange={handleChange}
                                            name={allergy}
                                            value={allergy}
                                            sx={{ '&.Mui-checked': { color: 'black' } }}
                                        />
                                    }
                                    label={allergy}
                                />
                            ))}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="preferences"
                                label="מצרכים אהובים"
                                multiline
                                rows={4}
                                value={formData.preferences}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="additionalNotes"
                                label="הערות נוספות"
                                multiline
                                rows={4}
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                sx={{ input: { color: 'black' }, label: { color: 'black' } }}
                            />
                        </>
                    )}
                    <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}>
                        {step === 1 ? 'המשך לשלב 2' : 'שלח'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegisterForm;
