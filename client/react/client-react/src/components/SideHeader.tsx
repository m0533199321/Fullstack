import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { type AppDispatch, useAppSelector } from "./Redux/Store"
import { fetchUser, UpdateUserName, UpdateUserProfile } from "./Redux/AuthSlice"
import { uploadProfilePictureService } from "./Services/ProfileService"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
    Home,
    ListIcon as Favorite,
    DownloadIcon as NewReleases,
    Receipt,
    PersonStandingIcon as Person,
    LogOutIcon as Logout,
    ChevronRight,
    ChevronLeft,
    Edit,
    ChefHat,
    Info,
    Check,
    AlertCircle,
} from "lucide-react"
import "../styles/SideHeader.css"
import ProfileUpdate from "./ProfilePicture"
import ProfilePicture from "./ProfilePicture"

const SideHeader = () => {
    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [editingProfile, setEditingProfile] = useState(false)
    const [fName, setFName] = useState(user?.fName || "")
    const [lName, setLName] = useState(user?.lName || "")
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // const [progress, setProgress] = useState(0)

    const goTo = (path: string) => {
        navigate(path)
        setCurrentPath(path);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    useEffect(() => {
        document.body.classList.toggle("collapsed-header", isCollapsed);
    }, [isCollapsed]);

    const handleEditName = () => {
        setFName(user?.fName || "")
        setLName(user?.lName || "")
        setEditingName(true)
    }

    const handleEditProfile = () => {
        setEditingProfile(true)
        setIsProfileOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
        window.location.reload()
    }

    const handleSaveChanges = async () => {
        if (user && fName && lName && fName != "" && lName != "") {
            await dispatch(UpdateUserName({ id: user.id, fName, lName })).then((result) => {
                if (!result) {
                    setNotification({
                        message: "שגיאה בעדכון שם",
                        type: "error",
                    })
                } else {
                    setNotification({
                        message: "שם עודכן בהצלחה",
                        type: "success",
                    })
                }
            })
        }
        setEditingName(false)
    }

    const handleSelectProfilePicture = (file: File | null) => {
        if (file) {
            setEditingProfile(true);
            uploadProfilePictureService(file)
                .then(async (presignedUrl) => {
                    if (presignedUrl) {
                        await axios.put(presignedUrl, file, {
                            headers: { "Content-Type": file.type },
                            onUploadProgress: () => {
                            },
                        }).then(async () => {
                            setEditingProfile(false);
                            if (user) {
                                await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] }));
                                await dispatch(fetchUser() as any);
                                setSnackMessage("תמונת הפרופיל עודכנה בהצלחה");
                                setSnackSeverity("success");
                                setSnackOpen(true);
                                setTimeout(() => {
                                    setSnackOpen(false);
                                }, 3000);
                            }
                        });
                    } else {
                        setEditingProfile(false);
                        setSnackMessage("נכשל בהעלאת תמונת פרופיל");
                        setSnackSeverity("error");
                        setSnackOpen(true);
                        setTimeout(() => {
                            setSnackOpen(false);
                        }, 3000);
                    }
                })
                .catch((error) => {
                    console.error("Error uploading profile picture:", error);
                    setSnackMessage("שגיאה בהעלאת תמונת פרופיל");
                    setSnackSeverity("error");
                    setSnackOpen(true);
                    setEditingProfile(false);
                    setTimeout(() => {
                        setSnackOpen(false);
                    }, 3000);
                });
        }
        setEditingProfile(false);
    };

    const handleCloseProfilePicture = () => {
        setEditingProfile(false)
    }

    const handleSnackClose = () => {
        setSnackOpen(false)
    }

    const menuItems = [
        { icon: <Home size={24} />, label: "דף הבית", path: "/" },
        { icon: <Info size={24} />, label: "אודות המערכת", path: "/about" },
        { icon: <Favorite size={24} />, label: "המומלצים שלנו", path: "/public-recipes" },
        { icon: <NewReleases size={24} />, label: "מתכון חדש", path: "/request", authRequired: true },
        { icon: <Receipt size={24} />, label: "ספר המתכונים שלי", path: "/private-recipes", authRequired: true },
    ]

    return (
        <>
            {editingProfile && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal-content">
                        <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} /></div></div>)}
            {snackOpen && (
                <div className={`side-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
                    <div className="side-snackbar-content">
                        {snackSeverity === "success" ? (
                            <Check className="side-snackbar-icon" size={20} />
                        ) : (
                            <AlertCircle className="side-snackbar-icon" size={20} />
                        )}
                        <span>{snackMessage}</span>
                        <button className="side-snackbar-close" onClick={handleSnackClose}>
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div style={{ direction: "rtl" }}>
                {/* <AnimatePresence>
                    {notification && (
                        <motion.div
                            className={`notification ${notification.type}`}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence> */}

                <motion.aside
                    className={`side-header ${isCollapsed ? "collapsed" : ""}`}
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="header-content">
                        <div className="logo-container">
                            <div className="logo-wrapper">
                                <ChefHat className="logo-icon" size={isCollapsed ? 28 : 36} />
                                {!isCollapsed && <h1 className="logo-text">SmartChef</h1>}
                            </div>
                            <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            </button>
                        </div>

                        <div className="menu-container">
                            {menuItems.map((item, index) => {
                                if (item.authRequired && !isAuthenticated) {
                                    return null;
                                }
                                return (
                                    <motion.button
                                        key={index}
                                        // className="menu-item"
                                        className={`menu-item ${currentPath === item.path ? 'active' : ''}`} 
                                        onClick={() => goTo(item.path)}
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 152, 0, 0.15)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="menu-icon">{item.icon}</div>
                                        {!isCollapsed && <span className="menu-label">{item.label}</span>}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {isAuthenticated && (
                            <div className="profile-container" ref={profileRef}>
                                <motion.button
                                    className="profile-button"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="avatar-container">
                                        {user?.profile && <img src={user?.profile} alt="פרופיל" className="avatar-image" />}
                                        {!user?.profile && <ChefHat className="avatar-logo" size={30} />}
                                        <div className="avatar-status" style={{ backgroundColor: isAuthenticated ? 'green' : 'gray' }}></div>
                                    </div>

                                    {!isCollapsed && (
                                        <div className="profile-info">
                                            <h3 className="profile-name">{user?.fName + " " + user?.lName}</h3>
                                            <p className="profile-email">{user?.email}</p>
                                        </div>
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && !isCollapsed && (
                                        <motion.div
                                            className="profile-dropdown"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {editingName ? (
                                                <div className="edit-name-container">
                                                    <button className="back-button" onClick={() => setEditingName(false)}>
                                                        <ChevronRight size={18} />
                                                        <span>חזרה</span>
                                                    </button>
                                                    <div className="input-group">
                                                        <label htmlFor="firstName">שם פרטי</label>
                                                        <input
                                                            id="firstName"
                                                            type="text"
                                                            value={fName}
                                                            onChange={(e) => setFName(e.target.value)}
                                                            className="text-input"
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <label htmlFor="lastName">שם משפחה</label>
                                                        <input
                                                            id="lastName"
                                                            type="text"
                                                            value={lName}
                                                            onChange={(e) => setLName(e.target.value)}
                                                            className="text-input"
                                                        />
                                                    </div>
                                                    <button className="save-button" onClick={handleSaveChanges}>
                                                        שמור שינויים
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="profile-actions">
                                                    <button className="profile-action-btn" onClick={handleEditName}>
                                                        <Edit size={18} />
                                                        <span>ערוך שם משתמש</span>
                                                    </button>
                                                    <button className="profile-action-btn" onClick={handleEditProfile}>
                                                        <Person size={18} />
                                                        <span>ערוך תמונת פרופיל</span>
                                                    </button>
                                                    <button className="profile-action-btn logout" onClick={handleLogout}>
                                                        <Logout size={18} />
                                                        <span>התנתק</span>
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.aside>

                {/* {editingProfile && <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />} */}
            </div>
        </>
    )
}

export default SideHeader
