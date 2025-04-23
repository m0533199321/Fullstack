import { useDispatch } from "react-redux";
import { AppDispatch } from "./Redux/Store";
import { connectWithGoogle, fetchUser, sendEmail } from "./Redux/AuthSlice";
import { User } from "../models/UserType";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayloadAction } from "@reduxjs/toolkit";

const Google = () => {

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    const handleGoogleSignIn = async (token: string) => {
        try {

            const result = await dispatch(connectWithGoogle({ token }));

            if (result.meta.requestStatus === 'fulfilled') {
                setSnackMessage('הרשמה בוצעה בהצלחה');
                setSnackSeverity('success');
                setSnackOpen(true);
                setTimeout(() => { navigate('/'); }, 1500);
                dispatch(fetchUser() as any);
            }

            else {
                setSnackMessage('הרשמה נכשלה');
                setSnackSeverity('error');
                setSnackOpen(true);
            }
        }
        catch (error) {
            console.error('Error during Google Sign-In:', error);
            setSnackMessage('הרשמה נכשלה');
            setSnackSeverity('error');
            setSnackOpen(true);
        }
    }

    return (<>
        <GoogleLogin
            locale='en'
            text="signin_with"
            onSuccess={(credentialResponse) => {
                console.log('Google Sign-In Success:', credentialResponse);
                const token = credentialResponse.credential;
                if (token) {
                    handleGoogleSignIn(token);
                } else {
                    console.error('Google Sign-In failed: Token is undefined');
                    // setErrorMessage('Google Sign-In failed. Please try again.');
                }
            }}
            onError={() => {
                console.error('Google Sign-In Failed');
                // setErrorMessage('Google Sign-In failed. Please try again.');
            }}
            useOneTap
            theme="outline"
            size="large"
        />
    </>)
}

export default Google