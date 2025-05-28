// import { useEffect, useState, useRef } from "react"
// import type { Recipe } from "../models/RecipeType"
// import { type AppDispatch, useAppSelector } from "./Redux/Store"
// import { MoreVert } from "@mui/icons-material"
// import {
//   fetchDeletePrivateRecipe,
//   fetchPrivateRecipes,
//   fetchPrivateToPublic,
//   fetchPublicRecipes,
// } from "./Services/RecipeService"
// import { downloadRecipeFromUrl } from "./DownLoad"
// import { sendEmail } from "./Redux/AuthSlice"
// import { useDispatch } from "react-redux"
// import PrivateOptions from "./PrivateOptions"
// import { recipeEmailBody } from "./RecipeEmailBody"
// import PrivateShows from "./PrivateShows"
// import RecipeSearch from "./RecipeSearch"
// import RecipeSortBy, { sortRecipes } from "./RecipeSortBy"
// import File2 from "./File"
// import { AlertCircle, Star } from "lucide-react"
// import "../styles/PrivateRecipes.css"
// import chef from "../../images/back/chef.png"

// const PrivateRecipes = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const user = useAppSelector((state) => state.auth.user)
//   const [recipes, setRecipes] = useState<Recipe[]>([])
//   const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([])
//   const [success, setSuccess] = useState(false)
//   const [sortBy, setSortBy] = useState<string>("")
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const [showPrivate, setShowPrivate] = useState(true)
//   const [showPublic, setShowPublic] = useState(false)
//   const [searchRecipe, setSearchRecipe] = useState("")
//   const [file, setFile] = useState(false)
//   const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null)
//   const [showVert, setShowVert] = useState<number | null>(null)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
//   const optionsPanelRef = useRef<HTMLDivElement>(null)
//   const [errorOpen, setErrorOpen] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string>("")

//   const allPrivateRecipes = async () => {
//     if (user?.id) {
//       try {
//         await fetchPrivateRecipes(user.id).then(async (fetchedRecipes) => {
//           setRecipes(fetchedRecipes)
//           await fetchPublicRecipes().then((fetchedPublicRecipes) => {
//             setPublicRecipes(fetchedPublicRecipes)
//             setSuccess(true)
//           })
//         })
//       } catch (error) {
//         setErrorMessage("שגיאה בטעינת המתכונים")
//         setErrorOpen(true)
//         setTimeout(() => {
//           setErrorOpen(false);
//         }, 3000);
//       }
//     }
//   }

//   useEffect(() => {
//     allPrivateRecipes()
//   }, [user])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (showVert !== null && optionsPanelRef.current && !optionsPanelRef.current.contains(event.target as Node)) {
//         setShowVert(null)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [showVert])

//   const handleSortChange = (criterion: string) => {
//     setSortBy(criterion)
//     setAnchorEl(null)
//   }

//   const handleDeleteRequest = (recipe: Recipe) => {
//     setRecipeToDelete(recipe)
//     setShowDeleteModal(true)
//     setShowVert(null)
//   }

//   const handleDeleteConfirm = async () => {
//     if (recipeToDelete && user?.id) {
//       await fetchDeletePrivateRecipe(recipeToDelete.id)
//       allPrivateRecipes()
//       setShowDeleteModal(false)
//       setRecipeToDelete(null)
//     }
//   }

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false)
//     setRecipeToDelete(null)
//   }

//   const handleAddToFavorites = async (recipeId: number) => {
//     await fetchPrivateToPublic(recipeId)
//     allPrivateRecipes()
//   }

//   const DownLoadRecipe = (recipe: Recipe) => {
//     setShowVert(null)
//     downloadRecipeFromUrl(recipe)
//   }

//   const EmailRecipe = async (recipe: Recipe) => {
//     setShowVert(null)
//     if (user) {
//       const subject = "מתכון טעים במיוחד בשבילך"
//       const body = recipeEmailBody(user.fName, recipe.path)
//       await dispatch(sendEmail({ to: user.email, subject: subject, body: body }))
//     }
//   }

//   const handleDisplayRecipe = (recipe: Recipe) => {
//     setShowVert(null)
//     setFile(true)
//     setRecipeToDisplay(recipe)
//   }

//   const existInPublic = (recipeId: number) => {
//     return publicRecipes.some((publicRecipe) => publicRecipe.id === recipeId)
//   }

//   const privateClick = () => {
//     setShowPrivate(true)
//     setShowPublic(false)
//   }

//   const publicClick = () => {
//     setShowPublic(true)
//     setShowPrivate(false)
//   }

//   const sortedRecipes = sortRecipes(recipes, sortBy)

//   const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
//     recipe.title.toLowerCase().includes(searchRecipe.toLowerCase()),
//   )

//   return (
//     <>
//       {file ? (
//         <>
//           {recipeToDisplay && (
//             <File2
//               recipe={recipeToDisplay}
//               fileUrl={recipeToDisplay.path}
//               onClose={() => setFile(false)}
//               details={null}
//             />
//           )}
//         </>
//       ) : (
//         <>
//           <div className="private-recipe-header">
//             <div className="private-recipe-header-content">
//               <div className="private-recipe-toggle-container">
//                 <PrivateShows
//                   showPrivate={showPrivate}
//                   showPublic={showPublic}
//                   privateClick={privateClick}
//                   publicClick={publicClick}
//                 />
//               </div>
//               <div className="private-recipe-search-container">
//                 <RecipeSearch setSearchRecipe={setSearchRecipe} />
//               </div>
//               <div className="private-recipe-sort-container">
//                 <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
//               </div>
//             </div>
//           </div>

//           {errorOpen && errorMessage && (
//               <div className="private-error-message">
//                 <AlertCircle className="private-error-icon" size={18} />
//                 {errorMessage}
//               </div>
//             )}

//           <div className="private-recipe-container">
//             {success && filteredRecipes.length > 0 && (
//               <div className="private-recipe-grid">
//                 {filteredRecipes.map((recipe: Recipe) => {
//                   const shouldShow = (showPrivate && !recipe.isPublic) || (showPublic && recipe.isPublic)
//                   return shouldShow ? (
//                     <div key={recipe.id} className="private-recipe-card">
//                       <div className="private-recipe-card-inner">
//                         <div className="private-recipe-image-container">
//                           <div className="private-recipe-difficulty">
//                             <div className="private-stars-container">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star key={i} className={`private-star ${i < Number(recipe.degree) ? "active" : ""}`} />
//                               ))}
//                             </div>
//                           </div>

//                           {recipe.picture && recipe.picture !== "" ? (
//                             <img
//                               src={recipe.picture || "/placeholder.svg"}
//                               alt={recipe.title}
//                               className="private-recipe-image"
//                               onClick={() => handleDisplayRecipe(recipe)}
//                             />
//                           ) : (
//                             <img
//                               src={chef || "/placeholder.svg"}
//                               alt={recipe.title}
//                               className="private-recipe-image"
//                               onClick={() => handleDisplayRecipe(recipe)}
//                             />
//                           )}
//                         </div>

//                         <div className="private-recipe-content">
//                           <div className="private-recipe-actions">
//                             <button
//                               className="private-recipe-options-button"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 setShowVert((prev) => (prev === recipe.id ? null : recipe.id))
//                               }}
//                               aria-label="אפשרויות מתכון"
//                             >
//                               <MoreVert />
//                             </button>
//                             <h3 className="private-recipe-title">{recipe.title}</h3>
//                           </div>

//                           {showVert === recipe.id && (
//                             <div className="private-recipe-options-dropdown" onClick={(e) => e.stopPropagation()}>
//                               <div
//                                 ref={optionsPanelRef}
//                                 className="private-recipe-options-panel"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <div className="private-recipe-options-header">
//                                   <h4 className="private-recipe-options-title">אפשרויות</h4>
//                                   <button
//                                     className="private-recipe-options-close"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setShowVert(null)
//                                     }}
//                                   >
//                                     ✕
//                                   </button>
//                                 </div>
//                                 <PrivateOptions
//                                   recipe={recipe}
//                                   handleDisplayRecipe={handleDisplayRecipe}
//                                   DownLoadRecipe={DownLoadRecipe}
//                                   EmailRecipe={EmailRecipe}
//                                   handleDelete={handleDeleteRequest}
//                                   notExistInPublic={!existInPublic(recipe.id)}
//                                   handleAddToFavorites={handleAddToFavorites}
//                                 />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ) : null
//                 })}
//               </div>
//             )}
//           </div>

//           {showDeleteModal && (
//             <div className="delete-modal-overlay" onClick={handleDeleteCancel}>
//               <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
//                 <div className="delete-modal-header">
//                   <h3 className="delete-modal-title">אישור מחיקה</h3>
//                   <button className="delete-modal-close" onClick={handleDeleteCancel}>
//                     ✕
//                   </button>
//                 </div>

//                 <div className="delete-modal-body">
//                   <div className="delete-modal-icon">
//                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//                       <line x1="10" y1="11" x2="10" y2="17" />
//                       <line x1="14" y1="11" x2="14" y2="17" />
//                     </svg>
//                   </div>

//                   <p className="delete-modal-message">האם אתה בטוח שברצונך למחוק את המתכון</p>

//                   {recipeToDelete && <p className="delete-modal-recipe-name">"{recipeToDelete.title}"?</p>}

//                   <p className="delete-modal-warning">פעולה זו לא ניתנת לביטול</p>
//                 </div>

//                 <div className="delete-modal-actions">
//                   <button className="delete-modal-cancel" onClick={handleDeleteCancel}>
//                     ביטול
//                   </button>
//                   <button className="delete-modal-confirm" onClick={handleDeleteConfirm}>
//                     מחק מתכון
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   )
// }

// export default PrivateRecipes

import { useEffect, useState, useRef } from "react"
import type { Recipe } from "../models/RecipeType"
import { type AppDispatch, useAppSelector } from "./Redux/Store"
import { MoreVert } from "@mui/icons-material"
import {
  fetchDeletePrivateRecipe,
  fetchPrivateRecipes,
  fetchPrivateToPublic,
  fetchPublicRecipes,
} from "./Services/RecipeService"
import { downloadRecipeFromUrl } from "./DownLoad"
import { sendEmail } from "./Redux/AuthSlice"
import { useDispatch } from "react-redux"
import PrivateOptions from "./PrivateOptions"
import { recipeEmailBody } from "./RecipeEmailBody"
import PrivateShows from "./PrivateShows"
import RecipeSearch from "./RecipeSearch"
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy"
import File2 from "./File"
import { AlertCircle, Star } from "lucide-react"
import "../styles/PrivateRecipes.css"
import chef from "../../images/back/chef.png"

const PrivateRecipes = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useAppSelector((state) => state.auth.user)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [publicRecipesList, setPublicRecipesList] = useState<Recipe[]>([])
  const [success, setSuccess] = useState(false)
  const [sortBy, setSortBy] = useState<string>("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showPrivate, setShowPrivate] = useState(true)
  const [showPublic, setShowPublic] = useState(false)
  const [searchRecipe, setSearchRecipe] = useState("")
  const [file, setFile] = useState(false)
  const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null)
  const [showVert, setShowVert] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const optionsPanelRef = useRef<HTMLDivElement>(null)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // הוסף מצב טעינה להוספה למומלצים
  const [isAddingToFavorites, setIsAddingToFavorites] = useState<number | null>(null)
  const [isDeletingRecipe, setIsDeletingRecipe] = useState(false)

  const allPrivateRecipes = async () => {
    if (user?.id) {
      try {
        await fetchPrivateRecipes(user.id).then(async (fetchedRecipes) => {
          setRecipes(fetchedRecipes)
          await fetchPublicRecipes().then((fetchedPublicRecipes) => {
            setPublicRecipesList(fetchedPublicRecipes)
            setSuccess(true)
            setIsInitialLoading(false)
          })
        })
      } catch (error) {
        setErrorMessage("שגיאה בטעינת המתכונים")
        setErrorOpen(true)
        setIsInitialLoading(false)
        setTimeout(() => {
          setErrorOpen(false)
        }, 3000)
      }
    }
  }

  useEffect(() => {
    allPrivateRecipes()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVert !== null && optionsPanelRef.current && !optionsPanelRef.current.contains(event.target as Node)) {
        setShowVert(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showVert])

  const handleSortChange = (criterion: string) => {
    setSortBy(criterion)
    setAnchorEl(null)
  }

  const handleDeleteRequest = (recipe: Recipe) => {
    setRecipeToDelete(recipe)
    setShowDeleteModal(true)
    setShowVert(null)
  }

  const handleDeleteConfirm = async () => {
    if (recipeToDelete && user?.id) {
      setIsDeletingRecipe(true)
      try {
        await fetchDeletePrivateRecipe(recipeToDelete.id)
        await allPrivateRecipes()
        setShowDeleteModal(false)
        setRecipeToDelete(null)
      } catch (error) {
        setErrorMessage("שגיאה במחיקת המתכון")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false)
        }, 3000)
      } finally {
        setIsDeletingRecipe(false)
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setRecipeToDelete(null)
  }

  const handleAddToFavorites = async (recipeId: number) => {
    setIsAddingToFavorites(recipeId)
    try {
      await fetchPrivateToPublic(recipeId)
      await allPrivateRecipes()
      setShowVert(null) // סגור את התפריט אחרי הצלחה
    } catch (error) {
      setErrorMessage("שגיאה בהעברת המתכון למומלצים")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false)
      }, 3000)
    } finally {
      setIsAddingToFavorites(null)
    }
  }

  const DownLoadRecipe = (recipe: Recipe) => {
    setShowVert(null)
    downloadRecipeFromUrl(recipe)
  }

  const EmailRecipe = async (recipe: Recipe) => {
    setShowVert(null)
    if (user) {
      const subject = "מתכון טעים במיוחד בשבילך"
      const body = recipeEmailBody(user.fName, recipe.path)
      await dispatch(sendEmail({ to: user.email, subject: subject, body: body }))
    }
  }

  const handleDisplayRecipe = (recipe: Recipe) => {
    setShowVert(null)
    setFile(true)
    setRecipeToDisplay(recipe)
  }

  const existInPublic = (recipeId: number) => {
    return publicRecipesList.some((publicRecipe) => publicRecipe.id === recipeId)
  }

  const privateClick = () => {
    setShowPrivate(true)
    setShowPublic(false)
  }

  const publicClick = () => {
    setShowPublic(true)
    setShowPrivate(false)
  }

  const sortedRecipes = sortRecipes(recipes, sortBy)

  const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
    recipe.title.toLowerCase().includes(searchRecipe.toLowerCase()),
  )

  // חישוב מתכונים לפי קטגוריה
  const privateRecipes = filteredRecipes.filter((recipe) => !recipe.isPublic)
  const publicRecipes = filteredRecipes.filter((recipe) => recipe.isPublic)
  const currentCategoryRecipes = showPrivate ? privateRecipes : publicRecipes

  if (isInitialLoading) {
    return (
      <div className="private-loading-screen">
        <div className="private-loading-content">
          <div className="private-loading-chef">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="10" y1="9" x2="10" y2="9" />
              <line x1="14" y1="9" x2="14" y2="9" />
            </svg>
          </div>
          <h2 className="private-loading-title">טוען מתכונים פרטיים...</h2>
          <div className="private-loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {file ? (
        <>
          {recipeToDisplay && (
            <File2
              recipe={recipeToDisplay}
              fileUrl={recipeToDisplay.path}
              onClose={() => setFile(false)}
              details={null}
            />
          )}
        </>
      ) : (
        <>
          <div className="private-recipe-header">
            <div className="private-recipe-header-content">
              <div className="private-recipe-toggle-container">
                <PrivateShows
                  showPrivate={showPrivate}
                  showPublic={showPublic}
                  privateClick={privateClick}
                  publicClick={publicClick}
                />
              </div>
              <div className="private-recipe-search-container">
                <RecipeSearch setSearchRecipe={setSearchRecipe} />
              </div>
              <div className="private-recipe-sort-container">
                <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          {errorOpen && errorMessage && (
            <div className="private-error-message">
              <AlertCircle className="private-error-icon" size={18} />
              {errorMessage}
            </div>
          )}

          <div className="private-recipe-container">
            {success && currentCategoryRecipes.length > 0 && (
              <div className="private-recipe-grid">
                {currentCategoryRecipes.map((recipe: Recipe) => (
                  <div key={recipe.id} className="private-recipe-card">
                    <div className="private-recipe-card-inner">
                      <div className="private-recipe-image-container">
                        <div className="private-recipe-difficulty">
                          <div className="private-stars-container">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`private-star ${i < Number(recipe.degree) ? "active" : ""}`} />
                            ))}
                          </div>
                        </div>

                        {recipe.picture && recipe.picture !== "" ? (
                          <img
                            src={recipe.picture || "/placeholder.svg"}
                            alt={recipe.title}
                            className="private-recipe-image"
                            onClick={() => handleDisplayRecipe(recipe)}
                          />
                        ) : (
                          <img
                            src={chef || "/placeholder.svg"}
                            alt={recipe.title}
                            className="private-recipe-image"
                            onClick={() => handleDisplayRecipe(recipe)}
                          />
                        )}
                      </div>

                      <div className="private-recipe-content">
                        <div className="private-recipe-actions">
                          <button
                            className="private-recipe-options-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowVert((prev) => (prev === recipe.id ? null : recipe.id))
                            }}
                            aria-label="אפשרויות מתכון"
                            disabled={isAddingToFavorites === recipe.id}
                          >
                            <MoreVert />
                          </button>
                          <h3 className="private-recipe-title">{recipe.title}</h3>
                        </div>

                        {showVert === recipe.id && (
                          <div className="private-recipe-options-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div
                              ref={optionsPanelRef}
                              className="private-recipe-options-panel"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="private-recipe-options-header">
                                <h4 className="private-recipe-options-title">אפשרויות</h4>
                                <button
                                  className="private-recipe-options-close"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowVert(null)
                                  }}
                                  disabled={isAddingToFavorites === recipe.id}
                                >
                                  ✕
                                </button>
                              </div>
                              <PrivateOptions
                                recipe={recipe}
                                handleDisplayRecipe={handleDisplayRecipe}
                                DownLoadRecipe={DownLoadRecipe}
                                EmailRecipe={EmailRecipe}
                                handleDelete={handleDeleteRequest}
                                notExistInPublic={!existInPublic(recipe.id)}
                                handleAddToFavorites={handleAddToFavorites}
                                isAddingToFavorites={isAddingToFavorites === recipe.id}
                              />
                            </div>
                          </div>
                        )}

                        {isAddingToFavorites === recipe.id && (
                          <div className="recipe-favorites-loading-overlay">
                            <div className="recipe-favorites-loading-content">
                              <div className="recipe-favorites-spinner"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state messages - חכם יותר */}
            {success && currentCategoryRecipes.length === 0 && (
              <div className="private-empty-state">
                <div className="private-empty-state-content">
                  <div className="private-empty-state-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {showPrivate ? (
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      ) : (
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" />
                      )}
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M12 11h4" />
                      <path d="M12 16h4" />
                      <path d="M8 11h.01" />
                      <path d="M8 16h.01" />
                    </svg>
                  </div>
                  <h3 className="private-empty-state-title">
                    {showPrivate ? "אין מתכונים אישיים" : "אין מתכונים מומלצים"}
                  </h3>
                  <p className="private-empty-state-description">
                    {searchRecipe
                      ? showPrivate
                        ? `לא נמצאו מתכונים אישיים המכילים "${searchRecipe}"`
                        : `לא נמצאו מתכונים מומלצים המכילים "${searchRecipe}"`
                      : showPrivate
                        ? privateRecipes.length === 0 && publicRecipesList.length > 0
                          ? "יש לך מתכונים מומלצים אבל אין מתכונים אישיים עדיין"
                          : "עדיין לא הוספת מתכונים אישיים. התחל ליצור את אוסף המתכונים שלך!"
                        : publicRecipesList.length === 0 && privateRecipes.length > 0
                          ? "יש לך מתכונים אישיים אבל עדיין לא הוספת מתכונים מומלצים"
                          : "עדיין לא הוספת מתכונים מומלצים. גלה מתכונים חדשים והוסף אותם לאוסף שלך!"}
                  </p>
                  {!searchRecipe && (
                    <button
                      className="private-empty-state-button"
                      onClick={() => {
                        if (showPrivate && publicRecipesList.length > 0) {
                          setShowPrivate(false)
                          setShowPublic(true)
                        } else if (!showPrivate && privateRecipes.length > 0) {
                          setShowPrivate(true)
                          setShowPublic(false)
                        } else {
                          window.location.href = "/public-recipes"
                        }
                      }}
                    >
                      {showPrivate && publicRecipesList.length > 0
                        ? "עבור למתכונים מומלצים"
                        : !showPrivate && privateRecipes.length > 0
                          ? "עבור למתכונים אישיים"
                          : "גלה מתכונים חדשים"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {showDeleteModal && (
            <div className="delete-modal-overlay" onClick={handleDeleteCancel}>
              <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="delete-modal-header">
                  <h3 className="delete-modal-title">אישור מחיקה</h3>
                  <button className="delete-modal-close" onClick={handleDeleteCancel} disabled={isDeletingRecipe}>
                    ✕
                  </button>
                </div>

                <div className="delete-modal-body">
                  <div className="delete-modal-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </div>

                  <p className="delete-modal-message">האם אתה בטוח שברצונך למחוק את המתכון</p>

                  {recipeToDelete && <p className="delete-modal-recipe-name">"{recipeToDelete.title}"?</p>}

                  <p className="delete-modal-warning">פעולה זו לא ניתנת לביטול</p>
                </div>

                <div className="delete-modal-actions">
                  <button className="delete-modal-cancel" onClick={handleDeleteCancel} disabled={isDeletingRecipe}>
                    ביטול
                  </button>
                  <button className="delete-modal-confirm" onClick={handleDeleteConfirm} disabled={isDeletingRecipe}>
                    {isDeletingRecipe ? (
                      <>
                        <div className="modal-delete-spinner"></div>
                        מוחק...
                      </>
                    ) : (
                      "מחק מתכון"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default PrivateRecipes
