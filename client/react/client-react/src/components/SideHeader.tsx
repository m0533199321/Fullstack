import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
  AlertCircle,
  Camera,
  Settings,
} from "lucide-react"
import "../styles/SideHeader.css"
import ProfilePicture from "./ProfilePicture"
import ProfileCompletionModal from "./ProfileCompletionModal"

const SideHeader = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [fName, setFName] = useState(user?.fName || "")
  const [lName, setLName] = useState(user?.lName || "")
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorOpen, setErrorOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const goTo = (path: string) => {
    navigate(path)
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
    localStorage.removeItem("sessionStart")
    navigate("/login")
    window.location.reload()
  }

  const handleSaveChanges = async () => {
    if (user && fName && lName && fName !== "" && lName !== "") {
      await dispatch(UpdateUserName({ id: user.id, fName, lName })).then((result) => {
        if ((result.payload as any)?.success === false) {
          setNotification({
            message: (result.payload as any)?.message || "שגיאה בעדכון שם",
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
    if (file && (file as any)._isDefaultProfile) {
      const defaultProfileUrl = (file as any)._defaultUrl

      if (user) {
        setEditingProfile(true);
        dispatch(UpdateUserProfile({ id: user.id, profile: defaultProfileUrl }))
          .then(() => {
            return dispatch(fetchUser() as any)
          })
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            setErrorMessage("שגיאה בעדכון תמונת פרופיל")
            setErrorOpen(true)
            setTimeout(() => {
              setErrorOpen(false)
            }, 3000)
          })
      }
      setIsLoading(false);
      setEditingProfile(false)
      return
    }

    if (file) {
      setEditingProfile(true)
      setIsLoading(true);
      uploadProfilePictureService(file)
        .then(async (presignedUrl) => {
          if (presignedUrl) {
            await axios
              .put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: () => {
                },
              })
              .then(async () => {
                setEditingProfile(false)
                if (user) {
                  await dispatch(UpdateUserProfile({ id: user.id, profile: presignedUrl.split("?")[0] }))
                  await dispatch(fetchUser() as any)
                  setIsLoading(false);
                }
              })
          } else {
            setIsLoading(false);
            setEditingProfile(false)
            setErrorMessage("נכשל בהעלאת תמונת פרופיל")
            setErrorOpen(true)
            setTimeout(() => {
              setErrorOpen(false)
            }, 3000)
          }
        })
        .catch(() => {
          setIsLoading(false);
          setErrorMessage("שגיאה בהעלאת תמונת פרופיל")
          setErrorOpen(true)
          setEditingProfile(false)
          setTimeout(() => {
            setErrorOpen(false)
          }, 3000)
        })
    } else {
      setEditingProfile(false)
    }
  }

  const handleCloseProfilePicture = () => {
    setEditingProfile(false)
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
                  {isLoading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                    </div>
                  )}
                  {!isLoading && (
                    <div className="avatar-container">
                      {user?.profile && (
                        <img src={user?.profile || "/placeholder.svg"} alt="פרופיל" className="avatar-image" />
                      )}
                      {!user?.profile && <ChefHat className="avatar-logo" size={30} />}
                      <div
                        className="avatar-status"
                        style={{ backgroundColor: isAuthenticated ? "green" : "gray" }}
                      ></div>
                    </div>)}

                  {!isCollapsed && (
                    <div className="profile-info">
                      <h3 className="profile-name">{user?.fName + " " + user?.lName}</h3>
                      <p className="profile-email">{user?.email}</p>
                    </div>
                  )}
                </motion.button>
                {errorOpen && errorMessage && (
                  <div className="side-error-message">
                    <AlertCircle className="side-error-icon" size={18} />
                    {errorMessage}
                  </div>
                )}
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
