import { AppBar, Toolbar, Button, Typography, Avatar, Popover, Box, IconButton, TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser, UpdateUserName, UpdateUserProfile } from "./Redux/AuthSlice";
import ProfilePicture from "./ProfilePicture";
import { uploadProfilePictureService } from "./Services/ProfileService";
import { Favorite, NewReleases, Receipt } from "@mui/icons-material";
import axios from "axios";

const Header = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editingName, setEditingName] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [fName, setFName] = useState(user?.fName || '');
    const [lName, setLName] = useState(user?.lName || '');
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

    const goTo = (path: string) => {
        navigate(path);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        console.log(editingProfile);
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    const handleEditName = () => {
        setFName(user?.fName || '');
        setLName(user?.lName || '');
        setEditingName(true);
    };

    const handleEditProfile = () => {
        setEditingProfile(true);
        handleClosePopover();
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    }

    const handleSaveChanges = async () => {
        if (user && fName && lName && fName != "" && lName != "") {
            await dispatch(UpdateUserName({ id: user.id, fName, lName })).then(result => {
                if (!result) {
                    setSnackMessage('שגיאה בעדכון שם ');
                    setSnackSeverity('error');
                    setSnackOpen(true);
                }
            })
        }
        handleClosePopover();
    };

    const handleSelectProfilePicture = async (file: File | null) => {
        if (file) {
            await uploadProfilePictureService(file).then(async presignedUrl => {
                if (user && presignedUrl) {
                    await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });
                    await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] })).then(result => {
                        if (result) {
                            dispatch(fetchUser() as any);
                        }
                        else {
                            setSnackMessage('שגיאה בעדכון פרופיל');
                            setSnackSeverity('error');
                            setSnackOpen(true);
                        }
                    })

                } else {
                    console.error("Failed to upload profile picture.");
                }
            });
        }
        setEditingProfile(false);
    };

    const handleCloseProfilePicture = () => {
        setEditingProfile(false);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
            <AppBar position="fixed" sx={{ backgroundColor: "black", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", marginBottom: '20%', }}>
                <Toolbar>
                    {/* <img src="../../images/back/smartChef.png" alt="smart-chef" onClick={() => goTo("/email-to-me")} style={{ width: '10vw', marginRight: '50vw', cursor: 'pointer' }} /> */}
                    {!isAuthenticated &&
                        <>
                            <IconButton color="inherit" onClick={() => goTo("/")} sx={{ ml: 2 }}>
                                <HomeIcon style={{ color: 'orange' }} />
                            </IconButton>
                            <Button sx={{ ml: 2, color: "#FFA500" }} onClick={() => goTo("/public-recipes")} startIcon={<Favorite />}>
                                המומלצים שלנו
                            </Button>
                            <Button sx={{ ml: 2, color: "#FFA500" }} onClick={() => goTo("/request")} startIcon={<NewReleases />}>
                                מתכון חדש
                            </Button>
                            <Button sx={{ ml: 2, color: "#FFA500" }} onClick={() => goTo("/private-recipes")} startIcon={<Receipt />}>
                                ספר המתכונים שלי
                            </Button>
                            <Avatar
                                src={user?.profile}
                                onClick={handleProfileClick}
                                sx={{ cursor: 'pointer', ml: 2 }}
                            />
                        </>
                    }
                </Toolbar>
            </AppBar>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', width: '250px', maxHeight: '400px', overflowY: 'auto' }}> {/* רוחב קבוע */}
                    {editingName ? (
                        <>
                            <IconButton onClick={() => setEditingName(false)} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <TextField
                                label="שם פרטי"
                                variant="outlined"
                                value={fName}
                                onChange={(e) => setFName(e.target.value)}
                                sx={{ mb: 2, width: '100%', backgroundColor: 'white' }}
                                InputProps={{ style: { color: 'black' } }}
                            />
                            <TextField
                                label="שם משפחה"
                                variant="outlined"
                                value={lName}
                                onChange={(e) => setLName(e.target.value)}
                                sx={{ mb: 2, width: '100%', backgroundColor: 'white' }}
                                InputProps={{ style: { color: 'black' } }}
                            />
                            <Button onClick={handleSaveChanges} color="primary" fullWidth>
                                שמור שינויים
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">{user?.fName + " " + user?.lName}</Typography>
                            <Typography variant="body1">{user?.email}</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button onClick={handleEditName} color="primary" fullWidth>
                                    ערוך שם משתמש
                                </Button>
                                <Button onClick={handleEditProfile} color="secondary" fullWidth sx={{ mt: 1 }}>
                                    ערוך פרופיל
                                </Button>
                                <Button onClick={handleLogout} sx={{ mt: 1, color: 'red' }} fullWidth>
                                    יציאה
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>
            {editingProfile && <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />}


            {/* <footer style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', padding: '10px' }}>
                <div>
                    <IconButton color="inherit" onClick={() => window.open('https://github.com/your-repo', '_blank')}>
                        <GitHubIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => window.location.href = 'mailto:your-email@example.com'}>
                        <EmailIcon />
                    </IconButton>
                </div>
                <Typography variant="body2">
                    © 2025 Mali Hildessaimer. כל הזכויות שמורות.
                </Typography>
            </footer> */}
        </>
    );
};

export default Header;
