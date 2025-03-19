import { AppBar, Toolbar, Button, Typography, Avatar, Popover, Box, IconButton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateUserName, UpdateUserProfile } from "./Redux/AuthSlice";
import ProfilePicture from "./ProfilePicture";
import { uploadProfilePictureService } from "./Services/ProfileService";

const Header = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editingName, setEditingName] = useState(false);
    const [editingProfile, setEditingProflie] = useState(false);
    const [fName, setFName] = useState(user?.fName || '');
    const [lName, setLName] = useState(user?.lName || '');

    const goTo = (path: string) => {
        navigate(path);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setEditingName(false);
        setEditingProflie(false);
    };

    const handleEditName = () => {
        setFName(user?.fName || '');
        setLName(user?.lName || '');
        setEditingName(true);
    };

    const handleEditProfile = () => {
        setEditingProflie(true);
    }

    const handleSaveChanges = () => {
        if (user && fName && lName && fName != "" && lName != "") {
            dispatch(UpdateUserName({ id: user.id, fName, lName }));
        }
        handleClosePopover();
    };

    const handleSelectProfilePicture = (file: File | null) => {
        if (file) {
            uploadProfilePictureService(file).then(path => {
                if (user && path) {
                    dispatch(UpdateUserProfile({ id: user.id , profile: path }));
                    window.location.reload();
                } else {
                    console.error("Failed to upload profile picture.");
                }
            });
        }
        setEditingProflie(false);
    };

    const handleCloseProfilePicture = () => {
        setEditingProflie(false);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#FFA500" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Recipe App
                    </Typography>
                    <IconButton color="inherit" onClick={() => goTo("/")} sx={{ ml: 2 }}>
                        <HomeIcon />
                    </IconButton>
                    {!isAuthenticated ? (
                        <>
                            <Button color="inherit" onClick={() => goTo("/login")} startIcon={<LoginIcon />} sx={{ ml: 2 }}>
                                Sign In
                            </Button>
                            <Button color="inherit" onClick={() => goTo("/register")} startIcon={<PersonAddIcon />} sx={{ ml: 2 }}>
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => goTo("/api")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                API
                            </Button>
                            <Button color="inherit" onClick={() => goTo("/categories")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                המומלצים שלנו
                            </Button>
                            <Button color="inherit" onClick={() => goTo("/request")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                חיפוש מתכון
                            </Button>
                            <Button color="inherit" onClick={() => goTo("/private-recipes")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                ספר המתכונים שלי
                            </Button>
                            <Avatar
                                src={user?.profile}
                                onClick={handleProfileClick}
                                sx={{ cursor: 'pointer', ml: 2 }}
                            />
                        </>
                    )}
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
                            </Box>
                        </>
                    )}
                </Box>
                {editingProfile && <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />}
            </Popover>
        </>
    );
};

export default Header;
