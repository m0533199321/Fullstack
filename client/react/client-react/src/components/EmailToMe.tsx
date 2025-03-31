import React, { useState } from 'react';
// import '../styles/EmailToMe.css';
import { sendEmail } from './Redux/AuthSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './Redux/Store';
import { Alert, Snackbar } from '@mui/material';

const EmailForm = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!subject || !body) {
            setError('.שדות נושא וגוף המייל הם חובה');
            return;
        }    
        setSnackMessage('בודק הרשאות שליחת מייל למערכת');
        setSnackSeverity('success');
        setSnackOpen(true);
        const result = await dispatch(sendEmail({ to: 'smartchef12345@gmail.com', subject: subject, body: body }));
        if (result.meta.requestStatus === 'fulfilled') {
            setSnackMessage('שליחת מייל למערכת בוצעה בהצלחה');
            setSnackSeverity('success');
            setSnackOpen(true);
        }
        else {
            setSnackMessage('שליחת מייל למערכת נכשלה');
            setSnackSeverity('error');
            setSnackOpen(true);
        }
        setError('');
        console.log('Subject:', subject);
        console.log('Body:', body);
        setSubject('');
        setBody('');
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
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
            <div className="emailToMe-form-container">
                <h1 className="emailToMe-form-title" style={{ marginBottom: '10%' }}>טופס שליחת מייל</h1>
                <form onSubmit={handleSubmit} className="emailToMe-form">
                    <div className="emailToMe-form-group">
                        <p style={{ fontSize: '20px', marginLeft: '14vw', marginTop: 0, marginBottom: '3%' }}>:נושא המייל</p>
                        <label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="emailToMe-input-field"
                                style={{ direction: 'rtl' }}
                            />
                        </label>
                    </div>
                    <div className="emailToMe-form-group">
                        <p style={{ fontSize: '20px', marginLeft: '14vw', marginTop: 0, marginBottom: '3%' }}>:גוף המייל</p>
                        <label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                                className="emailToMe-input-field"
                                style={{ direction: 'rtl' }}
                            />
                        </label>
                    </div>
                    {error && <p className="emailToMe-error-message">{error}</p>}
                    <button type="submit" className="emailToMe-submit-button">שלח מייל</button>
                </form>
            </div>
        </>
    );
};

export default EmailForm;
