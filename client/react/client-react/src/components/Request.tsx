// import { useEffect, useState } from "react";
// import { Send } from "@mui/icons-material";
// import "../styles/Request.css";
// import FileViewer from "./FileViewer";
// import RequestService from "./Services/RequestService";
// import { recipeImg } from "./Services/RecipeImgService";
// import { useAppSelector } from "./Redux/Store";
// import File2 from "./File";

// const Request = () => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [inputValue, setInputValue] = useState("");
//     const [fileUrl, setFileUrl] = useState<Blob | null>(null);
//     const [showFileViewer, setShowFileViewer] = useState(false);
//     const [difficulty, setDifficulty] = useState<number>(2);
//     const [details, setDetails] = useState<string[]>([]);
//     const [send, setSend] = useState(false);
//     const emptyInput = "";
//     const placeHolderTexts = [
//         "איזה מתכון טעים בא לכם היום?",
//         "מחפשים השראה קולינרית? בואו נגלה יחד!",
//         "בואו נמצא את המתכון המושלם בשבילכם!",
//         "חלומות מתוקים מתחילים כאן... חפשו מתכון!",
//         "מה בא לכם לבשל היום? נשמח לעזור!",
//         "מתכון חדש מחכה לכם! רק תכתבו מה בא לכם.",
//         "מחפשים מתכון? אנחנו כאן כדי לעזור לכם!",
//         "כל מתכון שתרצו, במרחק חיפוש אחד.",
//         "תפתיעו אותנו! איזה מתכון אתם מחפשים?",
//     ];
//     const [placeholder, setPlaceholder] = useState("");
//     const [placeholderIndex, setPlaceholderIndex] = useState(0);
//     const [charIndex, setCharIndex] = useState(0);
//     const [isDeleting, setIsDeleting] = useState(false);
//     let intervalId: NodeJS.Timeout | undefined;

//     useEffect(() => {
//         const rangeInput = document.querySelector('input[type="range"]') as HTMLInputElement;
//         if (rangeInput) {
//             rangeInput.style.setProperty('--value', `${(difficulty - 1) * (100 / 4)}%`);
//         }
//     }, []);

//     useEffect(() => {
//         if (!isDeleting && charIndex < placeHolderTexts[placeholderIndex].length) {
//             intervalId = setInterval(() => {
//                 setPlaceholder((prev) => prev + placeHolderTexts[placeholderIndex][charIndex]);
//                 setCharIndex((prev) => prev + 1);
//             }, 100);
//         } else if (isDeleting && charIndex > 0) {
//             intervalId = setInterval(() => {
//                 setPlaceholder((prev) => prev.slice(0, -1));
//                 setCharIndex((prev) => prev - 1);
//             }, 50);
//         } else {
//             if (intervalId) {
//                 clearInterval(intervalId);
//             }
//             if (isDeleting) {
//                 setIsDeleting(false);
//                 setPlaceholderIndex((prev) => (prev + 1) % placeHolderTexts.length);
//             } else {
//                 setTimeout(() => {
//                     setIsDeleting(true);
//                 }, 1000);
//             }
//         }

//         return () => {
//             if (intervalId) {
//                 clearInterval(intervalId);
//             }
//         };
//     }, [placeholderIndex, charIndex, isDeleting]);

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(event.target.value);
//     };

//     const handleSend = async () => {
//         if (user && inputValue != "") {
//             setSend(true);
//             const result = await RequestService(inputValue + " difficulty: " + difficulty);
//             if (result != null && result != undefined && result.length > 0) {
//                 setFileUrl(result[1]);
//                 setShowFileViewer(true);
//                 const name = result[0]
//                 setDetails([name]);
//             }
//         }
//         setInputValue("");
//     };

//     // const handleSend = async () => {
//     //     if (user && inputValue != "") {
//     //         setSend(true);
//     //         const result = await recipeImg(inputValue);
//     //         console.log(result);
//     //         // if (result != null && result != undefined && result.length > 0) {
//     //         //     setFileUrl(result[1]);
//     //         //     setShowFileViewer(true);
//     //         //     const name = result[0]
//     //         //     setDetails([name]);
//     //         // }
//     //     }
//     //     setInputValue("");
//     // };

//     const handleKeyPress = (event: React.KeyboardEvent) => {
//         if (event.key === "Enter") {
//             handleSend();
//         }
//     };

//     const handleClose = () => {
//         setShowFileViewer(false);
//         setFileUrl(null);
//         setSend(false);
//     };

//     const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = Number(event.target.value);
//         setDifficulty(value);
//         event.target.style.setProperty('--value', `${(value - 1) * (100 / 4)}%`);
//     };

//     return (
//         <>
//             {!showFileViewer ? (<>
//                 <div style={{ display: 'flex', alignItems: 'center', marginTop: '8vh', marginLeft: '28vw' }}>
//                     <h1 style={{ margin: '0', marginTop: '19%', color: 'rgb(255, 217, 0)' }}>חיפוש עם</h1>
//                     <img src="../../images/back/only-smartChef.png" alt="chef" style={{ width: '25vw', marginRight: '5px' }} />
//                 </div>

//                 {!send && <input
//                     type="text"
//                     className="input-with-icon"
//                     placeholder={placeholder}
//                     value={send ? emptyInput : inputValue}
//                     onChange={handleInputChange}
//                     onKeyPress={handleKeyPress}
//                     style={{ marginLeft: '19vw' }}
//                 />}
//                 {send &&
//                     <input
//                         type="text"
//                         className="input-with-icon"
//                         value={"אני מכין לך מתכון מושלם, בתאבון..."}
//                         onChange={() => { }}
//                         style={{ marginLeft: '19vw' }}
//                     />}
//                 {!send && <div style={{ width: '20%', marginLeft: '20vw' }}>
//                     <div className="difficulty-slider">
//                         <label>דרגת קושי: {difficulty}</label>
//                         <input
//                             type="range"
//                             min="1"
//                             max="5"
//                             value={difficulty}
//                             onChange={handleDifficultyChange}
//                             style={{ width: '100%', borderRadius: '10px' }}
//                         />
//                     </div>
//                     <span className="icon-container" onClick={handleSend}>
//                         <Send className="send" />
//                     </span>
//                 </div>}
//             </>) : (
//                 <>
//                     {showFileViewer && fileUrl && (
//                         <File2 recipe={null} fileUrl={fileUrl} onClose={handleClose} details={[...details, '' + difficulty]} />
//                         // <FileViewer fileUrl={fileUrl} onClose={handleClose} details={[...details, '' + difficulty]} />
//                     )}
//                 </>
//             )}
//         </>
//     )
// }
// export default Request;




import type React from "react"
import { useEffect, useState } from "react"
import { ChefHat, Send, Eye, Settings } from "lucide-react"
import RequestService from "./Services/RequestService"
import { useAppSelector } from "./Redux/Store"
import File from "./File"
import "../styles/Request.css"
import { getAllergies } from "./Services/AllergiesService"
import { getPreferences } from "./Services/PreferencesService"
import ProfileCompletionModal from "./ProfileCompletionModal"
import ConfirmationDialog from "./ConfirmationDialog"
import { AllergyType } from "./AllergiesForm"
import { PreferenceType } from "./PreferencesForm"

interface Message {
    text: string
    isUser: boolean
    isRecipeReady?: boolean
}

// ממשק לאלרגיה
interface Allergy {
    id: number
    userId: number
    allergyId: number
    name?: string
}

// ממשק להעדפה
interface Preference {
    id: number
    userId: number
    preferenceId: number
    name?: string
}

// ממשק לפרטים אישיים
interface UserProfileDetails {
    allergies: Allergy[]
    preferences: Preference[]
}

// פונקציה להמרת מזהה אלרגיה לשם באנגלית
function getAllergyNameById(allergyId: number): string {
    return AllergyType[allergyId] || `Unknown_${allergyId}`
}

// פונקציה להמרת מזהה העדפה לשם באנגלית
function getPreferenceNameById(preferenceId: number): string {
    return PreferenceType[preferenceId] || `Unknown_${preferenceId}`
}

// פונקציה להמרת שמות האלרגיות לעברית
// function getAllergyLabel(allergyName: string): string {
//     const hebrewLabels: Record<string, string> = {
//         None: "ללא אלרגיות",
//         Gluten: "גלוטן",
//         Dairy: "חלב ומוצריו",
//         Eggs: "ביצים",
//         Peanuts: "בוטנים",
//         Soy: "סויה",
//         Sesame: "שומשום",
//         Fish: "דגים",
//         Shellfish: "פירות ים",
//         Mustard: "חרדל",
//         Corn: "תירס",
//     }

//     return hebrewLabels[allergyName] || allergyName
// }

// פונקציה להמרת שמות ההעדפות לעברית
// function getPreferenceLabel(preferenceName: string): string {
//     const hebrewLabels: Record<string, string> = {
//         None: "ללא העדפות",
//         Spicy: "חריף",
//         Sweet: "מתוק",
//         Salty: "מלוח",
//         Sour: "חמוץ",
//         Umami: "אומאמי",
//         Tangy: "פיקנטי",
//         Herby: "עשבוני",
//         Smoky: "מעושן",
//         ToastedCrunchy: "קלוי",
//         Aromatic: "ארומטי",
//     }

//     return hebrewLabels[preferenceName] || preferenceName
// }

const Request = () => {
    const user = useAppSelector((state) => state.auth.user)
    const [inputValue, setInputValue] = useState("")
    const [fileUrl, setFileUrl] = useState<Blob | null>(null)
    const [showFileViewer, setShowFileViewer] = useState(false)
    const [difficulty, setDifficulty] = useState<number>(2)
    const [details, setDetails] = useState<string[]>([])
    const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false)
    const [recipeReadyMessage, setRecipeReadyMessage] = useState<Message | null>(null)

    // פרופיל והשלמת פרטים
    const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean | null>(null)
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isUpdateMode, setIsUpdateMode] = useState(false) // מצב עדכון חדש

    // הוספת מצב לפרטים האישיים של המשתמש
    const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails>({
        allergies: [],
        preferences: [],
    })

    const placeHolderTexts = [
        "איזה מתכון טעים בא לכם היום?",
        "מחפשים השראה קולינרית? בואו נגלה יחד!",
        "בואו נמצא את המתכון המושלם בשבילכם!",
        "חלומות מתוקים מתחילים כאן... חפשו מתכון!",
        "מה בא לכם לבשל היום? נשמח לעזור!",
        "מתכון חדש מחכה לכם! רק תכתבו מה בא לכם.",
        "מחפשים מתכון? אנחנו כאן כדי לעזור לכם!",
        "כל מתכון שתרצו, במרחק חיפוש אחד.",
        "תפתיעו אותנו! איזה מתכון אתם מחפשים?",
    ]

    const [placeholder, setPlaceholder] = useState("")
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    let intervalId: NodeJS.Timeout | undefined

    // פונקציה לטעינת הפרטים האישיים של המשתמש
    const loadUserProfileDetails = async (userId: number) => {
        try {
            // טעינת אלרגיות
            const userAllergies = await getAllergies(userId)

            // טעינת העדפות
            const userPreferences = await getPreferences(userId)

            // עדכון המצב עם הפרטים האישיים
            setUserProfileDetails({
                allergies: userAllergies,
                preferences: userPreferences,
            })

            // בדיקה האם הפרופיל הושלם
            const isComplete = userAllergies.length > 0 && userPreferences.length > 0
            setHasCompletedProfile(isComplete)

            return { userAllergies, userPreferences, isComplete }
        } catch (error) {
            console.error("שגיאה בטעינת פרטים אישיים:", error)
            return { userAllergies: [], userPreferences: [], isComplete: false }
        }
    }

    // בדיקה האם המשתמש השלים את הפרטים האישיים שלו
    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (!user) {
                setHasCompletedProfile(false)
                return
            }

            try {
                // טעינת הפרטים האישיים
                const { isComplete } = await loadUserProfileDetails(user.id)

                // אם זה הטעינה הראשונה והמשתמש לא השלים את הפרופיל, הצג את חלונית האישור
                if (isFirstLoad && !isComplete) {
                    setShowConfirmationDialog(true)
                    setIsFirstLoad(false)
                }
            } catch (error) {
                console.error("שגיאה בבדיקת שלמות הפרופיל:", error)
                setHasCompletedProfile(false)
            }
        }

        checkProfileCompletion()
    }, [user, isFirstLoad])

    useEffect(() => {
        const rangeInput = document.querySelector('input[type="range"]') as HTMLInputElement
        if (rangeInput) {
            rangeInput.style.setProperty("--value", `${(difficulty - 1) * (100 / 4)}%`)
        }
    }, [difficulty])

    useEffect(() => {
        if (!isDeleting && charIndex < placeHolderTexts[placeholderIndex].length) {
            intervalId = setInterval(() => {
                setPlaceholder((prev) => prev + placeHolderTexts[placeholderIndex][charIndex])
                setCharIndex((prev) => prev + 1)
            }, 100)
        } else if (isDeleting && charIndex > 0) {
            intervalId = setInterval(() => {
                setPlaceholder((prev) => prev.slice(0, -1))
                setCharIndex((prev) => prev - 1)
            }, 50)
        } else {
            if (intervalId) {
                clearInterval(intervalId)
            }
            if (isDeleting) {
                setIsDeleting(false)
                setPlaceholderIndex((prev) => (prev + 1) % placeHolderTexts.length)
            } else {
                setTimeout(() => {
                    setIsDeleting(true)
                }, 1000)
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [placeholderIndex, charIndex, isDeleting])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        setRecipeReadyMessage(null)
    }

    const handleSend = async () => {
        if (user && inputValue.trim() !== "") {
            setInputValue("")
            setIsGeneratingRecipe(true)
            setRecipeReadyMessage(null)

            // המרת מזהי האלרגיות לשמות באנגלית
            const allergyNames = userProfileDetails.allergies.map((allergy) => {
                const allergyName = getAllergyNameById(allergy.allergyId)
                return allergyName
            })

            // המרת מזהי ההעדפות לשמות באנגלית
            const preferenceNames = userProfileDetails.preferences.map((preference) => {
                const preferenceName = getPreferenceNameById(preference.preferenceId)
                return preferenceName
            })

            // שליחת הבקשה עם שמות האלרגיות וההעדפות
            console.log(inputValue);
            console.log(difficulty);
            console.log(allergyNames);
            console.log(preferenceNames);
            
            const result = await RequestService(
                "request: " + inputValue +
                "difficulty: " + difficulty +
                "allergies: " + allergyNames +
                "preferences: " + preferenceNames)

            setIsGeneratingRecipe(false)
            if (result != null && result != undefined && result.length > 0) {
                setFileUrl(result[1])
                const name = result[0]
                setDetails([name])
                const systemMessage: Message = {
                    text: "המתכון שלך מוכן! לחץ על האייקון כדי לראות.",
                    isUser: false,
                    isRecipeReady: true,
                }
                setRecipeReadyMessage(systemMessage)
            } else {
                const errorMessage: Message = { text: "אופס! קרתה שגיאה בהכנת המתכון.", isUser: false }
                setRecipeReadyMessage(errorMessage)
            }
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            handleSend()
        }
    }

    const handleShowRecipe = () => {
        if (fileUrl) {
            setShowFileViewer(true)
            setRecipeReadyMessage(null)
        }
    }

    const handleClose = () => {
        setShowFileViewer(false)
        setFileUrl(null)
    }

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setDifficulty(value)
        event.target.style.setProperty("--value", `${(value - 1) * (100 / 4)}%`)
    }

    // טיפול בתשובה חיובית לחלונית האישור - פתיחת טופס השלמת פרטים
    const handleConfirmProfileCompletion = () => {
        setShowConfirmationDialog(false)
        setIsUpdateMode(false) // מצב השלמה ראשונית
        setShowProfileModal(true)
    }

    // טיפול בתשובה שלילית לחלונית האישור - סגירת החלונית בלבד
    const handleDeclineProfileCompletion = () => {
        setShowConfirmationDialog(false)
    }

    // טיפול בהשלמת הפרופיל
    const handleProfileComplete = () => {
        // טעינה מחדש של הפרטים האישיים לאחר השלמה/עדכון
        if (user) {
            loadUserProfileDetails(user.id)
        }
        setHasCompletedProfile(true)
        setShowProfileModal(false)
    }

    // פתיחת טופס עדכון פרטים
    const handleOpenProfileUpdate = () => {
        setIsUpdateMode(true) // הגדרת מצב עדכון
        setShowProfileModal(true)
    }

    return (
        <>
            {/* חלונית אישור להשלמת פרטים */}
            <ConfirmationDialog
                isOpen={showConfirmationDialog}
                onClose={handleDeclineProfileCompletion}
                onConfirm={handleConfirmProfileCompletion}
                title="השלמת פרטים אישיים"
                description="כדי שנוכל להתאים לך מתכונים בצורה מיטבית, האם תרצה להשלים את פרטי האלרגיות וההעדפות שלך?"
                confirmText="כן, השלם פרטים"
                cancelText="לא, תודה"
            />

            {/* מודל השלמת פרטים */}
            {user && (
                <ProfileCompletionModal
                    userId={user.id}
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    onComplete={handleProfileComplete}
                    isUpdateMode={isUpdateMode} // העברת מצב העדכון לקומפוננטה
                />
            )}

            {/* תצוגת מתכון */}
            {showFileViewer && fileUrl && (
                <File recipe={null} fileUrl={fileUrl} onClose={handleClose} details={[...details, "" + difficulty]} />
            )}

            {/* ממשק חיפוש מתכונים */}
            {!showFileViewer && (
                <div className="chat-container">
                    <div className="chat-border">
                        <div className="chat-header">
                            <div className="chat-title">
                                <ChefHat className="chat-logo-icon" size={80} />
                                <h1 className="chat-logo-text">SmartChef</h1>
                            </div>
                            {/* כפתור עדכון פרטים - מוצג רק אם המשתמש כבר השלים פרטים */}
                            {hasCompletedProfile && (
                                <button className="update-profile-button" onClick={handleOpenProfileUpdate} title="עדכון פרטים אישיים">
                                    <Settings size={30} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="chat-messages">
                        <div className="message system-message">
                            <div className="message-content">
                                <p>ברוכים הבאים! אני כאן לעזור לכם למצוא את המתכון המושלם. מה תרצו להכין היום?</p>
                            </div>
                        </div>
                        {recipeReadyMessage && (
                            <div className={`message system-message`}>
                                <div className="message-content">
                                    <p>{recipeReadyMessage.text}</p>
                                    {recipeReadyMessage.isRecipeReady && (
                                        <Eye className="recipe-icon" size={24} onClick={handleShowRecipe} />
                                    )}
                                </div>
                            </div>
                        )}
                        {isGeneratingRecipe && (
                            <div className="message system-message">
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <p>אני מכין לך מתכון מושלם, בתאבון...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-container">
                        <div className="difficulty-slider-container">
                            <label className="difficulty-label">דרגת קושי: {difficulty}</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={difficulty}
                                onChange={handleDifficultyChange}
                                className="difficulty-slider"
                            />
                        </div>

                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={isGeneratingRecipe}
                            />
                            <button className="send-button" onClick={handleSend} disabled={!inputValue.trim() || isGeneratingRecipe}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Request