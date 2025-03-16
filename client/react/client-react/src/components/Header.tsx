import { AppBar, Toolbar, Button, Typography, Avatar, Popover, Box, IconButton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // ייבוא אייקון חץ
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateUserName } from "./Redux/AuthSlice";

const Header = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editing, setEditing] = useState(false);
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
        setEditing(false);
    };

    const handleEditClick = () => {
        setFName(user?.fName || '');
        setLName(user?.lName || '');
        setEditing(true);
    };

    const handleSaveChanges = () => {
        if (user && fName && lName && fName!="" && lName!="") {
            dispatch(UpdateUserName({ id: user.id, fName, lName }));
        }
        handleClosePopover();
    };

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
                            <Button color="inherit" onClick={() => goTo("/public-recipes")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                Public Recipes
                            </Button>
                            <Button color="inherit" onClick={() => goTo("/private-recipes")} startIcon={<RestaurantIcon />} sx={{ ml: 2 }}>
                                Private Recipes
                            </Button>
                            <Avatar
                                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
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
                    {editing ? (
                        <>
                            <IconButton onClick={() => setEditing(false)} sx={{ color: 'white' }}>
                                <ArrowBackIcon /> {/* חץ לחזרה */}
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
                                <Button onClick={handleEditClick} color="primary" fullWidth>
                                    ערוך שם משתמש
                                </Button>
                                <Button onClick={handleClosePopover} color="secondary" fullWidth sx={{ mt: 1 }}>
                                    ערוך פרופיל
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default Header;
