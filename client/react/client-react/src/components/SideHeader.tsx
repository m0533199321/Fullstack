// import { useState, useEffect, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { type AppDispatch, useAppSelector } from "./Redux/Store"
// import { fetchUser, UpdateUserName, UpdateUserProfile } from "./Redux/AuthSlice"
// import { uploadProfilePictureService } from "./Services/ProfileService"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//     Home,
//     ListIcon as Favorite,
//     DownloadIcon as NewReleases,
//     Receipt,
//     PersonStandingIcon as Person,
//     LogOutIcon as Logout,
//     ChevronRight,
//     ChevronLeft,
//     Edit,
//     ChefHat,
//     Info,
//     Check,
//     AlertCircle,
//     Camera,
// } from "lucide-react"
// import "../styles/SideHeader.css"
// import ProfileUpdate from "./ProfilePicture"
// import ProfilePicture from "./ProfilePicture"

// const SideHeader = () => {
//     const user = useAppSelector((state) => state.auth.user)
//     const dispatch = useDispatch<AppDispatch>()
//     const navigate = useNavigate()
//     const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
//     const [isCollapsed, setIsCollapsed] = useState(false)
//     const [isProfileOpen, setIsProfileOpen] = useState(false)
//     const [editingName, setEditingName] = useState(false)
//     const [editingProfile, setEditingProfile] = useState(false)
//     const [fName, setFName] = useState(user?.fName || "")
//     const [lName, setLName] = useState(user?.lName || "")
//     const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
//     const profileRef = useRef<HTMLDivElement>(null)
//     const [snackOpen, setSnackOpen] = useState(false)
//     const [snackMessage, setSnackMessage] = useState("")
//     const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
//     const [currentPath, setCurrentPath] = useState(window.location.pathname);

//     // const [progress, setProgress] = useState(0)

//     const goTo = (path: string) => {
//         navigate(path)
//         setCurrentPath(path);
//     }

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
//                 setIsProfileOpen(false)
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside)
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside)
//         }
//     }, [])

//     useEffect(() => {
//         if (notification) {
//             const timer = setTimeout(() => {
//                 setNotification(null)
//             }, 3000)
//             return () => clearTimeout(timer)
//         }
//     }, [notification])

//     useEffect(() => {
//         document.body.classList.toggle("collapsed-header", isCollapsed);
//     }, [isCollapsed]);

//     const handleEditName = () => {
//         setFName(user?.fName || "")
//         setLName(user?.lName || "")
//         setEditingName(true)
//     }

//     const handleEditProfile = () => {
//         setEditingProfile(true)
//         setIsProfileOpen(false)
//     }

//     const handleLogout = () => {
//         localStorage.removeItem("token")
//         navigate("/login")
//         window.location.reload()
//     }

//     const handleSaveChanges = async () => {
//         if (user && fName && lName && fName != "" && lName != "") {
//             await dispatch(UpdateUserName({ id: user.id, fName, lName })).then((result) => {
//                 if (!result) {
//                     setNotification({
//                         message: "שגיאה בעדכון שם",
//                         type: "error",
//                     })
//                 } else {
//                     setNotification({
//                         message: "שם עודכן בהצלחה",
//                         type: "success",
//                     })
//                 }
//             })
//         }
//         setEditingName(false)
//     }

//     const handleSelectProfilePicture = (file: File | null) => {
//         if (file) {
//             setEditingProfile(true);
//             uploadProfilePictureService(file)
//                 .then(async (presignedUrl) => {
//                     if (presignedUrl) {
//                         await axios.put(presignedUrl, file, {
//                             headers: { "Content-Type": file.type },
//                             onUploadProgress: () => {
//                             },
//                         }).then(async () => {
//                             setEditingProfile(false);
//                             if (user) {
//                                 await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] }));
//                                 await dispatch(fetchUser() as any);
//                                 setSnackMessage("תמונת הפרופיל עודכנה בהצלחה");
//                                 setSnackSeverity("success");
//                                 setSnackOpen(true);
//                                 setTimeout(() => {
//                                     setSnackOpen(false);
//                                 }, 3000);
//                             }
//                         });
//                     } else {
//                         setEditingProfile(false);
//                         setSnackMessage("נכשל בהעלאת תמונת פרופיל");
//                         setSnackSeverity("error");
//                         setSnackOpen(true);
//                         setTimeout(() => {
//                             setSnackOpen(false);
//                         }, 3000);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error uploading profile picture:", error);
//                     setSnackMessage("שגיאה בהעלאת תמונת פרופיל");
//                     setSnackSeverity("error");
//                     setSnackOpen(true);
//                     setEditingProfile(false);
//                     setTimeout(() => {
//                         setSnackOpen(false);
//                     }, 3000);
//                 });
//         }
//         setEditingProfile(false);
//     };

//     const handleCloseProfilePicture = () => {
//         setEditingProfile(false)
//     }

//     const handleSnackClose = () => {
//         setSnackOpen(false)
//     }

//     const menuItems = [
//         { icon: <Home size={24} />, label: "בית", path: "/" },
//         { icon: <Info size={24} />, label: "על המערכת", path: "/about" },
//         { icon: <Favorite size={24} />, label: "מומלצים", path: "/public-recipes" },
//         { icon: <NewReleases size={24} />, label: "מתכון חדש", path: "/request", authRequired: true },
//         { icon: <Receipt size={24} />, label: "המתכונים שלי", path: "/private-recipes", authRequired: true },
//     ];

//     return (
//         <>
//             {editingProfile && (
//                 <div className="profile-modal-overlay">
//                     <div className="profile-modal-content">
//                         <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} /></div></div>)}
//             {snackOpen && (
//                 <div className={`side-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
//                     <div className="side-snackbar-content">
//                         {snackSeverity === "success" ? (
//                             <Check className="side-snackbar-icon" size={20} />
//                         ) : (
//                             <AlertCircle className="side-snackbar-icon" size={20} />
//                         )}
//                         <span>{snackMessage}</span>
//                         <button className="side-snackbar-close" onClick={handleSnackClose}>
//                             ×
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div style={{ direction: "rtl" }}>
//                 {/* <AnimatePresence>
//                     {notification && (
//                         <motion.div
//                             className={`notification ${notification.type}`}
//                             initial={{ opacity: 0, y: -50 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -50 }}
//                         >
//                             {notification.message}
//                         </motion.div>
//                     )}
//                 </AnimatePresence> */}

//                 <motion.aside
//                     className={`side-header ${isCollapsed ? "collapsed" : ""}`}
//                     initial={{ x: -300 }}
//                     animate={{ x: 0 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 >
//                     <div className="header-content">
//                         <div className="logo-container">
//                             <div className="logo-wrapper">
//                                 <ChefHat className="logo-icon" size={isCollapsed ? 28 : 36} />
//                                 {!isCollapsed && <h1 className="logo-text">SmartChef</h1>}
//                             </div>
//                             <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
//                                 {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//                             </button>
//                         </div>

//                         <div className="menu-container">
//                             {menuItems.map((item, index) => {
//                                 if (item.authRequired && !isAuthenticated) {
//                                     return null;
//                                 }
//                                 return (
//                                     <motion.button
//                                         key={index}
//                                         // className="menu-item"
//                                         className={`menu-item ${currentPath === item.path ? 'active' : ''}`} 
//                                         onClick={() => goTo(item.path)}
//                                         whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 152, 0, 0.15)" }}
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         <div className="menu-icon">{item.icon}</div>
//                                         {!isCollapsed && <span className="menu-label">{item.label}</span>}
//                                     </motion.button>
//                                 )
//                             })}
//                         </div>

//                         {isAuthenticated && (
//                             <div className="profile-container" ref={profileRef}>
//                                 <motion.button
//                                     className="profile-button"
//                                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <div className="avatar-container">
//                                         {user?.profile && <img src={user?.profile} alt="פרופיל" className="avatar-image" />}
//                                         {!user?.profile && <ChefHat className="avatar-logo" size={30} />}
//                                         <div className="avatar-status" style={{ backgroundColor: isAuthenticated ? 'green' : 'gray' }}></div>
//                                     </div>

//                                     {!isCollapsed && (
//                                         <div className="profile-info">
//                                             <h3 className="profile-name">{user?.fName + " " + user?.lName}</h3>
//                                             <p className="profile-email">{user?.email}</p>
//                                         </div>
//                                     )}
//                                 </motion.button>

//                                 <AnimatePresence>
//                                     {isProfileOpen && !isCollapsed && (
//                                         <motion.div
//                                             className="profile-dropdown"
//                                             initial={{ opacity: 0, y: -20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -20 }}
//                                             transition={{ duration: 0.2 }}
//                                         >
//                                             {editingName ? (
//                                                 <div className="edit-name-container">
//                                                     <button className="back-button" onClick={() => setEditingName(false)}>
//                                                         <ChevronRight size={18} />
//                                                         <span>חזרה</span>
//                                                     </button>
//                                                     <div className="input-group">
//                                                         <label htmlFor="firstName">שם פרטי</label>
//                                                         <input
//                                                             id="firstName"
//                                                             type="text"
//                                                             value={fName}
//                                                             onChange={(e) => setFName(e.target.value)}
//                                                             className="text-input"
//                                                         />
//                                                     </div>
//                                                     <div className="input-group">
//                                                         <label htmlFor="lastName">שם משפחה</label>
//                                                         <input
//                                                             id="lastName"
//                                                             type="text"
//                                                             value={lName}
//                                                             onChange={(e) => setLName(e.target.value)}
//                                                             className="text-input"
//                                                         />
//                                                     </div>
//                                                     <button className="save-button" onClick={handleSaveChanges}>
//                                                         שמור שינויים
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <div className="profile-actions">
//                                                     <button className="profile-action-btn" onClick={handleEditName}>
//                                                         <Edit size={18} />
//                                                         <span>ערוך שם משתמש</span>
//                                                     </button>
//                                                     <button className="profile-action-btn" onClick={handleEditProfile}>
//                                                         <Camera size={18} />
//                                                         <span>ערוך תמונת פרופיל</span>
//                                                     </button>
//                                                     <button className="profile-action-btn logout" onClick={handleLogout}>
//                                                         <Logout size={18} />
//                                                         <span>התנתק</span>
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         )}
//                     </div>
//                 </motion.aside>

//                 {/* {editingProfile && <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />} */}
//             </div>
//         </>
//     )
// }

// export default SideHeader


// import { useState, useEffect, useRef } from "react"
// import { useNavigate, useLocation } from "react-router-dom" // ייבוא useLocation
// import { useDispatch } from "react-redux"
// import { type AppDispatch, useAppSelector } from "./Redux/Store"
// import { fetchUser, UpdateUserName, UpdateUserProfile } from "./Redux/AuthSlice"
// import { uploadProfilePictureService } from "./Services/ProfileService"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//     Home,
//     ListIcon as Favorite,
//     DownloadIcon as NewReleases,
//     Receipt,
//     LogOutIcon as Logout,
//     ChevronRight,
//     ChevronLeft,
//     Edit,
//     ChefHat,
//     Info,
//     Check,
//     AlertCircle,
//     Camera,
//     Settings,
// } from "lucide-react"
// import "../styles/SideHeader.css"
// import ProfilePicture from "./ProfilePicture" // הנחתי ש ProfileUpdate הוא אותו קומפוננטה כמו ProfilePicture
// import ProfileCompletionModal from "./ProfileCompletionModal"

// const SideHeader = () => {
//     const user = useAppSelector((state) => state.auth.user)
//     const dispatch = useDispatch<AppDispatch>()
//     const navigate = useNavigate()
//     const location = useLocation(); // שימוש ב-useLocation
//     const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
//     const [isCollapsed, setIsCollapsed] = useState(false)
//     const [isProfileOpen, setIsProfileOpen] = useState(false)
//     const [editingName, setEditingName] = useState(false)
//     const [editingProfile, setEditingProfile] = useState(false)
//     const [fName, setFName] = useState(user?.fName || "")
//     const [lName, setLName] = useState(user?.lName || "")
//     const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
//     const profileRef = useRef<HTMLDivElement>(null)
//     const [snackOpen, setSnackOpen] = useState(false)
//     const [snackMessage, setSnackMessage] = useState("")
//     const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
//     const [currentPath, setCurrentPath] = useState(location.pathname); // אתחל עם הנתיב הנוכחי
//     const [isUpdateMode, setIsUpdateMode] = useState(false)
//     const [showProfileModal, setShowProfileModal] = useState(false)
//     // const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean | null>(null)

//     // useEffect שמגיב לשינויים ב-location.pathname
//     useEffect(() => {
//         setCurrentPath(location.pathname);
//     }, [location.pathname]);


//     const goTo = (path: string) => {
//         navigate(path)
//         // הוסר setCurrentPath(path); - ה-useEffect יעשה את זה
//     }

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
//                 setIsProfileOpen(false)
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside)
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside)
//         }
//     }, [])

//     useEffect(() => {
//         if (notification) {
//             const timer = setTimeout(() => {
//                 setNotification(null)
//             }, 3000)
//             return () => clearTimeout(timer)
//         }
//     }, [notification])

//     useEffect(() => {
//         document.body.classList.toggle("collapsed-header", isCollapsed);
//     }, [isCollapsed]);

//     const handleEditName = () => {
//         setFName(user?.fName || "")
//         setLName(user?.lName || "")
//         setEditingName(true)
//     }

//     const handleEditProfile = () => {
//         setEditingProfile(true)
//         setIsProfileOpen(false)
//     }

//     const handleLogout = () => {
//         localStorage.removeItem("token")
//         navigate("/login")
//         window.location.reload()
//     }

//     const handleSaveChanges = async () => {
//         if (user && fName && lName && fName !== "" && lName !== "") { // תיקון קטן בתנאי
//             await dispatch(UpdateUserName({ id: user.id, fName, lName })).then((result) => {
//                 // הנחה שהתוצאה של dispatch מחזירה משהו שמסמל הצלחה/כישלון
//                 if ((result.payload as any)?.success === false) { // התאם את התנאי בהתאם למה ש-UpdateUserName מחזירה בפועל
//                     setNotification({
//                         message: (result.payload as any)?.message || "שגיאה בעדכון שם", // השתמש בהודעת שגיאה מהתוצאה אם קיימת
//                         type: "error",
//                     });
//                 } else {
//                     setNotification({
//                         message: "שם עודכן בהצלחה",
//                         type: "success",
//                     });
//                 }
//             })
//         }
//         setEditingName(false)
//     }

//     const handleSelectProfilePicture = (file: File | null) => {
//         if (file) {
//             setEditingProfile(true);
//             uploadProfilePictureService(file)
//                 .then(async (presignedUrl) => {
//                     if (presignedUrl) {
//                         await axios.put(presignedUrl, file, {
//                             headers: { "Content-Type": file.type },
//                             onUploadProgress: () => {
//                                 // כאן היית אמור לעדכן progress אם היה צורך
//                             },
//                         }).then(async () => {
//                             setEditingProfile(false);
//                             if (user) {
//                                 // עדכן את הפרופיל ב-Redux עם ה-URL הנקי
//                                 await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] }));
//                                 // טען מחדש את המשתמש כדי לקבל את הנתונים המעודכנים כולל תמונת הפרופיל
//                                 await dispatch(fetchUser() as any);
//                                 setSnackMessage("תמונת הפרופיל עודכנה בהצלחה");
//                                 setSnackSeverity("success");
//                                 setSnackOpen(true);
//                                 setTimeout(() => {
//                                     setSnackOpen(false);
//                                 }, 3000);
//                             }
//                         });
//                     } else {
//                         setEditingProfile(false);
//                         setSnackMessage("נכשל בהעלאת תמונת פרופיל");
//                         setSnackSeverity("error");
//                         setSnackOpen(true);
//                         setTimeout(() => {
//                             setSnackOpen(false);
//                         }, 3000);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error uploading profile picture:", error);
//                     setSnackMessage("שגיאה בהעלאת תמונת פרופיל");
//                     setSnackSeverity("error");
//                     setSnackOpen(true);
//                     setEditingProfile(false);
//                     setTimeout(() => {
//                         setSnackOpen(false);
//                     }, 3000);
//                 });
//         } else { // טיפול במקרה ש file הוא null (למשל, המשתמש ביטל בחירה)
//             setEditingProfile(false);
//         }
//     };


//     const handleCloseProfilePicture = () => {
//         setEditingProfile(false)
//     }

//     const handleSnackClose = () => {
//         setSnackOpen(false)
//     }

//     const handleProfileComplete = () => {
//         setShowProfileModal(false)
//     }

//     const handleOpenProfileUpdate = () => {
//         setIsUpdateMode(true)
//         setShowProfileModal(true)
//     }

//     const menuItems = [
//         { icon: <Home size={24} />, label: "בית", path: "/" },
//         { icon: <Info size={24} />, label: "על המערכת", path: "/about" },
//         { icon: <Favorite size={24} />, label: "מומלצים", path: "/public-recipes" },
//         { icon: <NewReleases size={24} />, label: "מתכון חדש", path: "/request", authRequired: true },
//         { icon: <Receipt size={24} />, label: "המתכונים שלי", path: "/private-recipes", authRequired: true },
//     ];

//     return (
//         <>
//             {editingProfile && (
//                 <div className="profile-modal-overlay">
//                     <div className="profile-modal-content">
//                         <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />
//                     </div>
//                 </div>
//             )}
//             {snackOpen && (
//                 <div className={`side-snackbar ${snackSeverity} ${snackOpen ? "show" : ""}`}>
//                     <div className="side-snackbar-content">
//                         {snackSeverity === "success" ? (
//                             <Check className="side-snackbar-icon" size={20} />
//                         ) : (
//                             <AlertCircle className="side-snackbar-icon" size={20} />
//                         )}
//                         <span>{snackMessage}</span>
//                         <button className="side-snackbar-close" onClick={handleSnackClose}>
//                             ×
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {user && (
//                 <ProfileCompletionModal
//                     userId={user.id}
//                     isOpen={showProfileModal}
//                     onClose={() => setShowProfileModal(false)}
//                     onComplete={handleProfileComplete}
//                     isUpdateMode={isUpdateMode}
//                 />
//             )}

//             <div style={{ direction: "rtl" }}>
//                 {/* <AnimatePresence>
//                     {notification && (
//                         <motion.div
//                             className={`notification ${notification.type}`}
//                             initial={{ opacity: 0, y: -50 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -50 }}
//                         >
//                             {notification.message}
//                         </motion.div>
//                     )}
//                 </AnimatePresence> */}

//                 <motion.aside
//                     className={`side-header ${isCollapsed ? "collapsed" : ""}`}
//                     initial={{ x: -300 }}
//                     animate={{ x: 0 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 >
//                     <div className="header-content">
//                         <div className="logo-container">
//                             <div className="logo-wrapper">
//                                 <ChefHat className="logo-icon" size={isCollapsed ? 28 : 36} />
//                                 {!isCollapsed && <h1 className="logo-text">SmartChef</h1>}
//                             </div>
//                             <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
//                                 {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//                             </button>
//                         </div>

//                         <div className="menu-container">
//                             {menuItems.map((item, index) => {
//                                 if (item.authRequired && !isAuthenticated) {
//                                     return null;
//                                 }
//                                 return (
//                                     <motion.button
//                                         key={index}
//                                         className={`menu-item ${currentPath === item.path ? 'active' : ''}`}
//                                         onClick={() => goTo(item.path)}
//                                         whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 152, 0, 0.15)" }}
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         <div className="menu-icon">{item.icon}</div>
//                                         {!isCollapsed && <span className="menu-label">{item.label}</span>}
//                                     </motion.button>
//                                 )
//                             })}
//                         </div>

//                         {isAuthenticated && (
//                             <div className="profile-container" ref={profileRef}>
//                                 <motion.button
//                                     className="profile-button"
//                                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <div className="avatar-container">
//                                         {user?.profile && <img src={user?.profile} alt="פרופיל" className="avatar-image" />}
//                                         {!user?.profile && <ChefHat className="avatar-logo" size={30} />}
//                                         <div className="avatar-status" style={{ backgroundColor: isAuthenticated ? 'green' : 'gray' }}></div>
//                                     </div>

//                                     {!isCollapsed && (
//                                         <div className="profile-info">
//                                             <h3 className="profile-name">{user?.fName + " " + user?.lName}</h3>
//                                             <p className="profile-email">{user?.email}</p>
//                                         </div>
//                                     )}
//                                 </motion.button>

//                                 <AnimatePresence>
//                                     {isProfileOpen && !isCollapsed && (
//                                         <motion.div
//                                             className="profile-dropdown"
//                                             initial={{ opacity: 0, y: -20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -20 }}
//                                             transition={{ duration: 0.2 }}
//                                         >
//                                             {editingName ? (
//                                                 <div className="edit-name-container">
//                                                     <button className="back-button" onClick={() => setEditingName(false)}>
//                                                         <ChevronRight size={18} />
//                                                         <span>חזרה</span>
//                                                     </button>
//                                                     <div className="input-group">
//                                                         <label htmlFor="firstName">שם פרטי</label>
//                                                         <input
//                                                             id="firstName"
//                                                             type="text"
//                                                             value={fName}
//                                                             onChange={(e) => setFName(e.target.value)}
//                                                             className="text-input"
//                                                         />
//                                                     </div>
//                                                     <div className="input-group">
//                                                         <label htmlFor="lastName">שם משפחה</label>
//                                                         <input
//                                                             id="lastName"
//                                                             type="text"
//                                                             value={lName}
//                                                             onChange={(e) => setLName(e.target.value)}
//                                                             className="text-input"
//                                                         />
//                                                     </div>
//                                                     <button className="save-button" onClick={handleSaveChanges}>
//                                                         שמור שינויים
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <div className="profile-actions">
//                                                     <button className="profile-action-btn" onClick={handleEditName}>
//                                                         <Edit size={18} />
//                                                         <span>עריכת שם משתמש</span>
//                                                     </button>
//                                                     <button className="profile-action-btn" onClick={handleEditProfile}>
//                                                         <Camera size={18} />
//                                                         <span>עריכת תמונת פרופיל</span>
//                                                     </button>
//                                                     <button className="profile-action-btn" onClick={handleOpenProfileUpdate}>
//                                                         <Settings size={18} />
//                                                         <span>עריכת פרטים</span>
//                                                     </button>
//                                                     <button className="profile-action-btn logout" onClick={handleLogout}>
//                                                         <Logout size={18} />
//                                                         <span>התנתקות</span>
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         )}
//                     </div>
//                 </motion.aside>
//             </div>
//         </>
//     )
// }

// export default SideHeader


import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom" // ייבוא useLocation
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
  LogOutIcon as Logout,
  ChevronRight,
  ChevronLeft,
  Edit,
  ChefHat,
  Info,
  Check,
  AlertCircle,
  Camera,
  Settings,
} from "lucide-react"
import "../styles/SideHeader.css"
import ProfilePicture from "./ProfilePicture" // הנחתי ש ProfileUpdate הוא אותו קומפוננטה כמו ProfilePicture
import ProfileCompletionModal from "./ProfileCompletionModal"

const SideHeader = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation() // שימוש ב-useLocation
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
  const [currentPath, setCurrentPath] = useState(location.pathname) // אתחל עם הנתיב הנוכחי
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  // const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean | null>(null)

  // useEffect שמגיב לשינויים ב-location.pathname
  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const goTo = (path: string) => {
    navigate(path)
    // הוסר setCurrentPath(path); - ה-useEffect יעשה את זה
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
    document.body.classList.toggle("collapsed-header", isCollapsed)
  }, [isCollapsed])

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
    if (user && fName && lName && fName !== "" && lName !== "") {
      // תיקון קטן בתנאי
      await dispatch(UpdateUserName({ id: user.id, fName, lName })).then((result) => {
        // הנחה שהתוצאה של dispatch מחזירה משהו שמסמל הצלחה/כישלון
        if ((result.payload as any)?.success === false) {
          // התאם את התנאי בהתאם למה ש-UpdateUserName מחזירה בפועל
          setNotification({
            message: (result.payload as any)?.message || "שגיאה בעדכון שם", // השתמש בהודעת שגיאה מהתוצאה אם קיימת
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
    // Check if this is our special default profile object
    if (file && (file as any)._isDefaultProfile) {
      const defaultProfileUrl = (file as any)._defaultUrl
      console.log("Using default profile URL:", defaultProfileUrl)

      if (user) {
        // Update the profile directly with the AWS URL without uploading
        dispatch(UpdateUserProfile({ id: user.id, profile: defaultProfileUrl }))
          .then(() => {
            // Force refresh user data to get the updated profile
            return dispatch(fetchUser() as any)
          })
          .then(() => {
            setSnackMessage("תמונת הפרופיל עודכנה בהצלחה")
            setSnackSeverity("success")
            setSnackOpen(true)
            setTimeout(() => {
              setSnackOpen(false)
            }, 3000)
          })
          .catch((error) => {
            console.error("Error updating profile with default image:", error)
            setSnackMessage("שגיאה בעדכון תמונת פרופיל")
            setSnackSeverity("error")
            setSnackOpen(true)
            setTimeout(() => {
              setSnackOpen(false)
            }, 3000)
          })
      }
      setEditingProfile(false)
      return
    }

    if (file) {
      setEditingProfile(true)
      uploadProfilePictureService(file)
        .then(async (presignedUrl) => {
          if (presignedUrl) {
            await axios
              .put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: () => {
                  // Progress handling if needed
                },
              })
              .then(async () => {
                setEditingProfile(false)
                if (user) {
                  await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] }))
                  await dispatch(fetchUser() as any)
                  setSnackMessage("תמונת הפרופיל עודכנה בהצלחה")
                  setSnackSeverity("success")
                  setSnackOpen(true)
                  setTimeout(() => {
                    setSnackOpen(false)
                  }, 3000)
                }
              })
          } else {
            setEditingProfile(false)
            setSnackMessage("נכשל בהעלאת תמונת פרופיל")
            setSnackSeverity("error")
            setSnackOpen(true)
            setTimeout(() => {
              setSnackOpen(false)
            }, 3000)
          }
        })
        .catch((error) => {
          console.error("Error uploading profile picture:", error)
          setSnackMessage("שגיאה בהעלאת תמונת פרופיל")
          setSnackSeverity("error")
          setSnackOpen(true)
          setEditingProfile(false)
          setTimeout(() => {
            setSnackOpen(false)
          }, 3000)
        })
    } else {
      setEditingProfile(false)
    }
  }

  const handleCloseProfilePicture = () => {
    setEditingProfile(false)
  }

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false)
  }

  const handleOpenProfileUpdate = () => {
    setIsUpdateMode(true)
    setShowProfileModal(true)
  }

  const menuItems = [
    { icon: <Home size={24} />, label: "בית", path: "/" },
    { icon: <Info size={24} />, label: "על המערכת", path: "/about" },
    { icon: <Favorite size={24} />, label: "מומלצים", path: "/public-recipes" },
    { icon: <NewReleases size={24} />, label: "מתכון חדש", path: "/request", authRequired: true },
    { icon: <Receipt size={24} />, label: "המתכונים שלי", path: "/private-recipes", authRequired: true },
  ]

  return (
    <>
      {editingProfile && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content">
            <ProfilePicture onSelect={handleSelectProfilePicture} onClose={handleCloseProfilePicture} />
          </div>
        </div>
      )}
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

      {user && (
        <ProfileCompletionModal
          userId={user.id}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
          isUpdateMode={isUpdateMode}
        />
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
                  return null
                }
                return (
                  <motion.button
                    key={index}
                    className={`menu-item ${currentPath === item.path ? "active" : ""}`}
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
                    {user?.profile && (
                      <img src={user?.profile || "/placeholder.svg"} alt="פרופיל" className="avatar-image" />
                    )}
                    {!user?.profile && <ChefHat className="avatar-logo" size={30} />}
                    <div
                      className="avatar-status"
                      style={{ backgroundColor: isAuthenticated ? "green" : "gray" }}
                    ></div>
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
                            <span>עריכת שם משתמש</span>
                          </button>
                          <button className="profile-action-btn" onClick={handleEditProfile}>
                            <Camera size={18} />
                            <span>עריכת תמונת פרופיל</span>
                          </button>
                          <button className="profile-action-btn" onClick={handleOpenProfileUpdate}>
                            <Settings size={18} />
                            <span>עריכת פרטים</span>
                          </button>
                          <button className="profile-action-btn logout" onClick={handleLogout}>
                            <Logout size={18} />
                            <span>התנתקות</span>
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
      </div>
    </>
  )
}

export default SideHeader