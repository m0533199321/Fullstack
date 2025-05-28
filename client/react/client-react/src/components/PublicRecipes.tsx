// import { useEffect, useState, useRef } from "react";
// import { Recipe } from "../models/RecipeType";
// import { AppDispatch, useAppSelector } from "./Redux/Store";
// import { MoreVert } from "@mui/icons-material";
// import {
//   fetchPublicRecipes,
//   fetchPublicToPrivate,
//   fetchPrivateRecipes,
// } from "./Services/RecipeService";
// import { downloadRecipeFromUrl } from "./DownLoad";
// import { sendEmail } from "./Redux/AuthSlice";
// import { useDispatch } from "react-redux";
// import PublicOptions from "./PublicOptions";
// import { recipeEmailBody } from "./RecipeEmailBody";
// import PublicShows from "./PublicShows";
// import RecipeSearch from "./RecipeSearch";
// import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
// import { AlertCircle, Star } from "lucide-react";
// import "../styles/PublicRecipes.css";
// import DisplayRecipe from "./DisplayRecipe";
// import { useNavigate } from "react-router-dom";
// import chef from "../../images/back/chef.png"

// const PublicRecipes = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useAppSelector((state) => state.auth.user);
//   const navigate = useNavigate();
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
//   const [success, setSuccess] = useState(false);
//   const [sortBy, setSortBy] = useState<string>("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [showPrivate, setShowPrivate] = useState(false);
//   const [showPublic, setShowPublic] = useState(true);
//   const [searchRecipe, setSearchRecipe] = useState("");
//   const [file,] = useState(false);
//   const [recipeToDisplay,] = useState<Recipe | null>(null);
//   const [showVert, setShowVert] = useState<number | null>(null);
//   const optionsPanelRef = useRef<HTMLDivElement>(null);
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
//   const [errorOpen, setErrorOpen] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string>("")

//   const allRecipes = async () => {
//     try {
//       const fetchedRecipes = await fetchPublicRecipes();
//       setRecipes(fetchedRecipes);
//       setSuccess(true);
//       if (user) {
//         const fetchedPrivateRecipes = await fetchPrivateRecipes(user.id);
//         setPrivateRecipes(fetchedPrivateRecipes);
//       }
//     } catch (error) {
//       setErrorMessage("שגיאה בטעינת המתכונים")
//       setErrorOpen(true)
//       setTimeout(() => {
//         setErrorOpen(false);
//       }, 3000);
//     }
//   };

//   useEffect(() => {
//     allRecipes();
//   }, [user]);

//   const handleSortChange = (criterion: string) => {
//     setSortBy(criterion);
//     setAnchorEl(null);
//   };

//   const handlePublicToPrivate = async (recipeId: number) => {
//     if (user?.id) {
//       try {
//         await fetchPublicToPrivate(user.id, recipeId);
//         allRecipes();
//       } catch (error) {
//         setErrorMessage("שגיאה בהעברת המתכון לפרטי")
//       setErrorOpen(true)
//       setTimeout(() => {
//         setErrorOpen(false);
//       }, 3000)
//       }
//     }
//   };

//   const DownLoadRecipe = (recipe: Recipe) => {
//     setShowVert(null);
//     downloadRecipeFromUrl(recipe);
//   };

//   const EmailRecipe = async (recipe: Recipe) => {
//     setShowVert(null);
//     if (user) {
//       const subject = "מתכון טעים במיוחד בשבילך";
//       const body = recipeEmailBody(user.fName, recipe.path);
//       await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
//     }
//   };

//   const handleDisplayRecipe = (recipe: Recipe) => {
//     setShowVert(null);
//     navigate(`/recipe/${recipe.id}`);
//   };

//   const existInPrivate = (recipeId: number) => {
//     return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
//   };

//   const privateClick = () => {
//     setShowPrivate(true);
//     setShowPublic(false);
//   };

//   const publicClick = () => {
//     setShowPublic(true);
//     setShowPrivate(false);
//   };

//   const sortedRecipes = sortRecipes(recipes, sortBy);

//   const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
//     recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
//   );

//   return (
//     <>
//       {file ? (
//         <>
//           {recipeToDisplay && (
//             <DisplayRecipe />
//           )}
//         </>
//       ) : (
//         <>
//           <div className="public-recipe-header">
//             <div className="public-recipe-header-content">
//               <div className="public-recipe-toggle-container">
//                 <PublicShows
//                   showPrivate={showPrivate}
//                   showPublic={showPublic}
//                   privateClick={privateClick}
//                   publicClick={publicClick}
//                 />
//               </div>
//               <div className="public-recipe-search-container">
//                 <RecipeSearch setSearchRecipe={setSearchRecipe} />
//               </div>
//               <div className="public-recipe-sort-container">
//                 <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
//               </div>
//             </div>
//           </div>

//           {errorOpen && errorMessage && (
//               <div className="public-error-message">
//                 <AlertCircle className="public-error-icon" size={18} />
//                 {errorMessage}
//               </div>
//             )}

//           <div className="public-recipe-container">
//             {success && filteredRecipes.length > 0 && (
//               <div className="public-recipe-grid">
//                 {filteredRecipes.map((recipe: Recipe) => {
//                   const shouldShow = (showPrivate && existInPrivate(recipe.id)) || (showPublic && !existInPrivate(recipe.id));
//                   return shouldShow ? (
//                     <div key={recipe.id} className="public-recipe-card">
//                       <div className="public-recipe-card-inner">
//                         <div className="public-recipe-image-container">
//                           <div className="public-recipe-difficulty">
//                             <div className="public-stars-container">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star key={i} className={`public-star ${i < Number(recipe.degree) ? "active" : ""}`} />
//                               ))}
//                             </div>
//                           </div>

//                           {recipe.picture && recipe.picture !== "" ? (
//                             <img
//                               src={recipe.picture || "/placeholder.svg"}
//                               alt={recipe.title}
//                               className="public-recipe-image"
//                               onClick={() => handleDisplayRecipe(recipe)}
//                             />
//                           ) : (
//                             <img
//                               src={chef}
//                               alt={recipe.title}
//                               className="public-recipe-image"
//                               onClick={() => handleDisplayRecipe(recipe)}
//                             />
//                           )}
//                         </div>

//                         <div className="public-recipe-content">
//                           <div className="public-recipe-actions">
//                             {isAuthenticated &&<button
//                               className="public-recipe-options-button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setShowVert((prev) => (prev === recipe.id ? null : recipe.id));
//                               }}
//                               aria-label="אפשרויות מתכון"
//                             >
//                               <MoreVert />
//                             </button>}
//                             <h3 className="public-recipe-title">{recipe.title}</h3>
//                           </div>

//                           {showVert === recipe.id && (
//                             <div
//                               className="public-recipe-options-dropdown"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <div
//                                 ref={optionsPanelRef}
//                                 className="public-recipe-options-panel"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <div className="public-recipe-options-header">
//                                   <h4 className="public-recipe-options-title">אפשרויות</h4>
//                                   <button
//                                     className="public-recipe-options-close"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setShowVert(null);
//                                     }}
//                                   >
//                                     ✕
//                                   </button>
//                                 </div>
//                                 <PublicOptions
//                                   recipe={recipe}
//                                   handleDisplayRecipe={handleDisplayRecipe}
//                                   DownLoadRecipe={DownLoadRecipe}
//                                   EmailRecipe={EmailRecipe}
//                                   notExistInPrivate={!existInPrivate(recipe.id)}
//                                   handlePublicToPrivate={handlePublicToPrivate}
//                                 />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ) : null;
//                 })}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default PublicRecipes;


import { useEffect, useState, useRef } from "react"
import type { Recipe } from "../models/RecipeType"
import { type AppDispatch, useAppSelector } from "./Redux/Store"
import { MoreVert } from "@mui/icons-material"
import { fetchPublicRecipes, fetchPublicToPrivate, fetchPrivateRecipes } from "./Services/RecipeService"
import { downloadRecipeFromUrl } from "./DownLoad"
import { sendEmail } from "./Redux/AuthSlice"
import { useDispatch } from "react-redux"
import PublicOptions from "./PublicOptions"
import { recipeEmailBody } from "./RecipeEmailBody"
import PublicShows from "./PublicShows"
import RecipeSearch from "./RecipeSearch"
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy"
import { AlertCircle, Star } from "lucide-react"
import "../styles/PublicRecipes.css"
import DisplayRecipe from "./DisplayRecipe"
import { useNavigate } from "react-router-dom"
import chef from "../../images/back/chef.png"

const PublicRecipes = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([])
  const [success, setSuccess] = useState(false)
  const [sortBy, setSortBy] = useState<string>("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showPrivate, setShowPrivate] = useState(false)
  const [showPublic, setShowPublic] = useState(true)
  const [searchRecipe, setSearchRecipe] = useState("")
  const [file] = useState(false)
  const [recipeToDisplay] = useState<Recipe | null>(null)
  const [showVert, setShowVert] = useState<number | null>(null)
  const optionsPanelRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  // הוסף מצב טעינה להעברה לפרטי
  const [isAddingToPrivate, setIsAddingToPrivate] = useState<number | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const allRecipes = async () => {
    try {
      const fetchedRecipes = await fetchPublicRecipes()
      setRecipes(fetchedRecipes)
      setSuccess(true)
      setIsInitialLoading(false)
      if (user) {
        const fetchedPrivateRecipes = await fetchPrivateRecipes(user.id)
        setPrivateRecipes(fetchedPrivateRecipes)
      }
    } catch (error) {
      setErrorMessage("שגיאה בטעינת המתכונים")
      setErrorOpen(true)
      setIsInitialLoading(false)
      setTimeout(() => {
        setErrorOpen(false)
      }, 3000)
    }
  }

  useEffect(() => {
    allRecipes()
  }, [user])

  const handleSortChange = (criterion: string) => {
    setSortBy(criterion)
    setAnchorEl(null)
  }

  const handlePublicToPrivate = async (recipeId: number) => {
    if (user?.id) {
      setIsAddingToPrivate(recipeId)
      try {
        await fetchPublicToPrivate(user.id, recipeId)
        await allRecipes()
        setShowVert(null)
      } catch (error) {
        setErrorMessage("שגיאה בהעברת המתכון לפרטי")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false)
        }, 3000)
      } finally {
        setIsAddingToPrivate(null)
      }
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
    navigate(`/recipe/${recipe.id}`)
  }

  const existInPrivate = (recipeId: number) => {
    return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId)
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
  const recipesInPrivate = filteredRecipes.filter((recipe) => existInPrivate(recipe.id))
  const recipesNotInPrivate = filteredRecipes.filter((recipe) => !existInPrivate(recipe.id))
  const currentCategoryRecipes = showPrivate ? recipesInPrivate : recipesNotInPrivate

  if (isInitialLoading) {
    return (
      <div className="public-loading-screen">
        <div className="public-loading-content">
          <div className="public-loading-chef">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="10" y1="9" x2="10" y2="9" />
              <line x1="14" y1="9" x2="14" y2="9" />
            </svg>
          </div>
          <h2 className="public-loading-title">טוען מתכונים מומלצים..</h2>
          <div className="public-loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {file ? (
        <>{recipeToDisplay && <DisplayRecipe />}</>
      ) : (
        <>
          <div className="public-recipe-header">
            <div className="public-recipe-header-content">
              <div className="public-recipe-toggle-container">
                <PublicShows
                  showPrivate={showPrivate}
                  showPublic={showPublic}
                  privateClick={privateClick}
                  publicClick={publicClick}
                />
              </div>
              <div className="public-recipe-search-container">
                <RecipeSearch setSearchRecipe={setSearchRecipe} />
              </div>
              <div className="public-recipe-sort-container">
                <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          {errorOpen && errorMessage && (
            <div className="public-error-message">
              <AlertCircle className="public-error-icon" size={18} />
              {errorMessage}
            </div>
          )}

          <div className="public-recipe-container">
            {success && currentCategoryRecipes.length > 0 && (
              <div className="public-recipe-grid">
                {currentCategoryRecipes.map((recipe: Recipe) => (
                  <div key={recipe.id} className="public-recipe-card">
                    <div className="public-recipe-card-inner">
                      <div className="public-recipe-image-container">
                        <div className="public-recipe-difficulty">
                          <div className="public-stars-container">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`public-star ${i < Number(recipe.degree) ? "active" : ""}`} />
                            ))}
                          </div>
                        </div>

                        {recipe.picture && recipe.picture !== "" ? (
                          <img
                            src={recipe.picture || "/placeholder.svg"}
                            alt={recipe.title}
                            className="public-recipe-image"
                            onClick={() => handleDisplayRecipe(recipe)}
                          />
                        ) : (
                          <img
                            src={chef || "/placeholder.svg"}
                            alt={recipe.title}
                            className="public-recipe-image"
                            onClick={() => handleDisplayRecipe(recipe)}
                          />
                        )}
                      </div>

                      <div className="public-recipe-content">
                        <div className="public-recipe-actions">
                          {isAuthenticated && (
                            <button
                              className="public-recipe-options-button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowVert((prev) => (prev === recipe.id ? null : recipe.id))
                              }}
                              aria-label="אפשרויות מתכון"
                              disabled={isAddingToPrivate === recipe.id}
                            >
                              <MoreVert />
                            </button>
                          )}
                          <h3 className="public-recipe-title">{recipe.title}</h3>
                        </div>

                        {showVert === recipe.id && (
                          <div className="public-recipe-options-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div
                              ref={optionsPanelRef}
                              className="public-recipe-options-panel"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="public-recipe-options-header">
                                <h4 className="public-recipe-options-title">אפשרויות</h4>
                                <button
                                  className="public-recipe-options-close"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowVert(null)
                                  }}
                                  disabled={isAddingToPrivate === recipe.id}
                                >
                                  ✕
                                </button>
                              </div>
                              <PublicOptions
                                recipe={recipe}
                                handleDisplayRecipe={handleDisplayRecipe}
                                DownLoadRecipe={DownLoadRecipe}
                                EmailRecipe={EmailRecipe}
                                notExistInPrivate={!existInPrivate(recipe.id)}
                                handlePublicToPrivate={handlePublicToPrivate}
                                isAddingToPrivate={isAddingToPrivate === recipe.id}
                              />
                            </div>
                          </div>
                        )}

                        {isAddingToPrivate === recipe.id && (
                          <div className="recipe-private-loading-overlay">
                            <div className="recipe-private-loading-content">
                              <div className="recipe-private-spinner"></div>
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
              <div className="public-empty-state">
                <div className="public-empty-state-content">
                  <div className="public-empty-state-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {showPrivate ? (
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      ) : (
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" />
                      )}
                      <path d="M12 5L8 21l4-7 4 7-4-16" />
                    </svg>
                  </div>
                  <h3 className="public-empty-state-title">
                    {showPrivate ? "אין מתכונים בספר שלך" : "לא נמצאו מתכונים"}
                  </h3>
                  <p className="public-empty-state-description">
                    {searchRecipe
                      ? showPrivate
                        ? `לא נמצאו מתכונים בספר שלך המכילים "${searchRecipe}"`
                        : `לא נמצאו מתכונים המכילים "${searchRecipe}"`
                      : showPrivate
                        ? recipesInPrivate.length === 0 && recipesNotInPrivate.length > 0
                          ? "יש מתכונים זמינים אבל עדיין לא הוספת אותם לספר שלך"
                          : "עדיין לא הוספת מתכונים לספר שלך. גלה מתכונים מעולים והוסף אותם!"
                        : recipesNotInPrivate.length === 0 && recipesInPrivate.length > 0
                          ? "כל המתכונים כבר בספר שלך! מעולה!"
                          : "לא נמצאו מתכונים במאגר. נסה לחפש משהו אחר או חזור מאוחר יותר."}
                  </p>
                  {!searchRecipe && (
                    <button
                      className="public-empty-state-button"
                      onClick={() => {
                        if (showPrivate && recipesNotInPrivate.length > 0) {
                          setShowPrivate(false)
                          setShowPublic(true)
                        } else if (!showPrivate && recipesInPrivate.length > 0) {
                          setShowPrivate(true)
                          setShowPublic(false)
                        } else {
                          window.location.reload()
                        }
                      }}
                    >
                      {showPrivate && recipesNotInPrivate.length > 0
                        ? "עבור למתכונים המומלצים"
                        : !showPrivate && recipesInPrivate.length > 0
                          ? "עבור למתכונים שבספר"
                          : "רענן את הדף"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default PublicRecipes