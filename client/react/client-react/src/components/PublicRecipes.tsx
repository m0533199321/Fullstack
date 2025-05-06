// import { useEffect, useState } from "react";
// import { Recipe } from "../models/RecipeType";
// import { AppDispatch, useAppSelector } from "./Redux/Store";
// import { Button } from "@mui/material";
// import { StarBorder, MoreVert } from "@mui/icons-material";
// import { fetchPublicRecipes, fetchPublicToPrivate, fetchPrivateRecipes } from "./Services/RecipeService";
// import "../styles/PublicRecipes.css";
// import { downloadRecipeFromUrl } from "./DownLoad";
// import { useNavigate } from "react-router-dom";
// import FileViewer from "./FileViewer";
// import { sendEmail } from "./Redux/AuthSlice";
// import { useDispatch } from "react-redux";
// import { recipeEmailBody } from "./RecipeEmailBody";
// import PublicShows from "./PublicShows";
// import RecipeSearch from "./RecipeSearch";
// import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
// import PublicOptions from "./PublicOptions";
// import File2 from "./File";
// import { Star } from "lucide-react"
// import BackArrow from "./BackArrow";

// const PublicRecipes = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//     const navigate = useNavigate();
//     const [showPrivate, setShowPrivate] = useState(false);
//     const [showPublic, setShowPublic] = useState(false);
//     const [searchRecipe, setSearchRecipe] = useState('');
//     const [file, setFile] = useState(false);
//     const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null);
//     const [showVert, setShowVert] = useState<number | null>(null);

//     const allRecipes = async () => {
//         try {
//             const fetchedRecipes = await fetchPublicRecipes();
//             setRecipes(fetchedRecipes);
//             setSuccess(true);
//             if (user) {
//                 const fetchedPrivateRecipes = await fetchPrivateRecipes(user.id);
//                 setPrivateRecipes(fetchedPrivateRecipes);
//             }
//         } catch (error) {
//             console.error('Failed to fetch recipes:', error);
//         }
//     };

//     useEffect(() => {
//         allRecipes();
//     }, [user]);

//     const handleSortChange = (criterion: string) => {
//         setSortBy(criterion);
//         setAnchorEl(null);
//     };

//     const handlePublicToPrivate = async (recipeId: number) => {
//         if (user?.id) {
//             try {
//                 await fetchPublicToPrivate(user.id, recipeId);
//                 console.log(`Recipe ${recipeId} added to user's recipes.`);
//                 setPrivateRecipes(await fetchPrivateRecipes(user.id));
//                 setRecipes(await fetchPublicRecipes());
//             } catch (error) {
//                 console.error('Failed to add recipe to public:', error);
//             }
//         }
//     }

//     const sortedRecipes = sortRecipes(recipes, sortBy);

//     const existInPrivate = (recipeId: number) => {
//         return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
//     }

//     const DownLoadRecipe = (recipe: Recipe) => {
//         downloadRecipeFromUrl(recipe);
//     }

//     const EmailRecipe = async (recipe: Recipe) => {
//         if (user) {
//             const subject = "מתכון טעים במיוחד בשבילך";
//             const body = recipeEmailBody(user.fName, recipe.path);
//             await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
//         }
//     }

//     const handleDisplayRecipe = (recipe: Recipe) => {
//         setFile(true);
//         setRecipeToDisplay(recipe);
//     }

//     const handleDisplayRecipeDetails = (recipeId: number) => {
//         navigate(`/recipe/${recipeId}`);
//     }

//     const privateClick = () => {
//         setShowPrivate(true);
//         setShowPublic(false);
//     }

//     const publicClick = () => {
//         setShowPublic(true);
//         setShowPrivate(false);
//     }

//     const filteredRecipes = sortedRecipes.filter(recipe =>
//         recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
//     );

//     return (
//         <>
//             {file ? (<>
//                 {recipeToDisplay && (
//                     <File2 recipe={recipeToDisplay} fileUrl={recipeToDisplay.path} onClose={() => setFile(false)} details={null} />
//                     // <FileViewer fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
//                 )}
//             </>
//             ) : (
//                 <>
//                     <div style={{
//                         position: "sticky", top: '0', zIndex: 1000, backgroundColor: 'black', direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh'
//                     }}>
//                         <h1 style={{ color: 'white', margin: '0', textAlign: 'right', marginLeft: '20px' }}>מומלצים</h1>

//                         <div style={{
//                             display: 'flex', alignItems: 'center', marginLeft: '20px'
//                         }}>
//                             <p style={{ width: '2vw' }}></p>
//                             <PublicShows showPrivate={showPrivate} showPublic={showPublic} privateClick={privateClick} publicClick={publicClick} />
//                         </div>
//                         <RecipeSearch setSearchRecipe={setSearchRecipe} />
//                         <div className="private-sort-container" style={{ textAlign: 'left' }}>
//                             <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
//                         </div>
//                     </div>

//                     <div className="public-recipes-container">
//                         {success && filteredRecipes.length > 0 && (
//                             <>
//                                 <div className="recipe-grid">
//                                     {filteredRecipes.map((recipe: Recipe) => {
//                                         const shouldShow = (showPrivate && existInPrivate(recipe.id)) || (showPublic && !(existInPrivate(recipe.id)));
//                                         return shouldShow ? (
//                                             <div key={recipe.id} className="recipe-card">

//                                                 <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                                                     <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px', cursor: 'pointer', color: 'white' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
//                                                     <h3 className="recipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
//                                                 </div>
//                                                 {recipe.picture && recipe.picture !== "" && <img src={recipe.picture} alt={recipe.title} className="recipe-image" onClick={() => handleDisplayRecipeDetails(recipe.id)} />}
//                                                 {(!recipe.picture || recipe.picture == "") && <img src="../../images/back/chef.png" alt={recipe.title} className="recipe-image" onClick={() => handleDisplayRecipeDetails(recipe.id)} />}                                                <div className="difficulty-rating" style={{ bottom: '8%' }}>
//                                                     {/* <div className="difficulty-rating" style={{ bottom: '8%' }}>
//                                                         <div className="stars">
//                                                             {Array.from({ length: 5 }).reverse().map((_, index) => (
//                                                                 index < (5 - recipe.degree) ? <StarBorder key={index} className="public-empty-star" /> : <Star key={index} className="public-filled-star" />
//                                                             ))}
//                                                         </div>
//                                                     </div> */}
//                                                     {(!recipe.picture || recipe.picture == "") && <div className="public-recipe-difficulty">
//                                                         <div className="public-stars-container">
//                                                             {[...Array(5)].map((_, i) => (
//                                                                 <Star key={i} className={`public-star ${i < Number(recipe.degree) ? "active" : ""}`} size={24} />
//                                                             ))}
//                                                         </div>
//                                                     </div>}

//                                                     { recipe.picture != "" && <div className="public-recipe-difficulty2">
//                                                         <div className="public-stars-container">
//                                                             {[...Array(5)].map((_, i) => (
//                                                                 <Star key={i} className={`public-star ${i < Number(recipe.degree) ? "active" : ""}`} size={24} />
//                                                             ))}
//                                                         </div>
//                                                     </div>}
//                                                 </div>
//                                                 {showVert === recipe.id && (
//                                                     <div className="public-showVert" onClick={() => setShowVert(null)}>
//                                                         <div className="public-inShowVert">
//                                                             <PublicOptions
//                                                                 recipe={recipe}
//                                                                 handleDisplayRecipe={handleDisplayRecipe}
//                                                                 DownLoadRecipe={DownLoadRecipe}
//                                                                 EmailRecipe={EmailRecipe}
//                                                                 notExistInPrivate={!existInPrivate(recipe.id)}
//                                                                 handlePublicToPrivate={handlePublicToPrivate} />
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                             </div>
//                                         ) : null;
//                                     })}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </>
//             )
//             }
//         </>
//     );
// }

// export default PublicRecipes;

import { useEffect, useState, useRef } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import { MoreVert } from "@mui/icons-material";
import {
  fetchPublicRecipes,
  fetchPublicToPrivate,
  fetchPrivateRecipes,
} from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownLoad";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";
import PublicOptions from "./PublicOptions";
import { recipeEmailBody } from "./RecipeEmailBody";
import PublicShows from "./PublicShows";
import RecipeSearch from "./RecipeSearch";
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
import File2 from "./File";
import { Star } from "lucide-react";
import "../styles/PublicRecipes.css";

const PublicRecipes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.auth.user);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
  const [success, setSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [showPublic, setShowPublic] = useState(true); // Set default to true
  const [searchRecipe, setSearchRecipe] = useState("");
  const [file, setFile] = useState(false);
  const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null);
  const [showVert, setShowVert] = useState<number | null>(null);
  const optionsPanelRef = useRef<HTMLDivElement>(null);

  const allRecipes = async () => {
    try {
      const fetchedRecipes = await fetchPublicRecipes();
      setRecipes(fetchedRecipes);
      setSuccess(true);
      if (user) {
        const fetchedPrivateRecipes = await fetchPrivateRecipes(user.id);
        setPrivateRecipes(fetchedPrivateRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  useEffect(() => {
    allRecipes();
  }, [user]);

  const handleSortChange = (criterion: string) => {
    setSortBy(criterion);
    setAnchorEl(null);
  };

  const handlePublicToPrivate = async (recipeId: number) => {
    if (user?.id) {
      try {
        await fetchPublicToPrivate(user.id, recipeId);
        allRecipes(); // Refresh the recipes after moving to private
      } catch (error) {
        console.error("Failed to add recipe to public:", error);
      }
    }
  };

  const DownLoadRecipe = (recipe: Recipe) => {
    downloadRecipeFromUrl(recipe);
  };

  const EmailRecipe = async (recipe: Recipe) => {
    if (user) {
      const subject = "מתכון טעים במיוחד בשבילך";
      const body = recipeEmailBody(user.fName, recipe.path);
      await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
    }
  };

  const handleDisplayRecipe = (recipe: Recipe) => {
    setFile(true);
    setRecipeToDisplay(recipe);
  };

  const existInPrivate = (recipeId: number) => {
    return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
  };

  const privateClick = () => {
    setShowPrivate(true);
    setShowPublic(false);
    console.log('privateClick', showPrivate, showPublic);
  };

  const publicClick = () => {
    setShowPublic(true);
    setShowPrivate(false);
  };

  const sortedRecipes = sortRecipes(recipes, sortBy);

  const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
    recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
  );

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

          <div className="public-recipe-container">
            {success && filteredRecipes.length > 0 && (
              <div className="public-recipe-grid">
                {filteredRecipes.map((recipe: Recipe) => {
                  const shouldShow = (showPrivate && existInPrivate(recipe.id)) || (showPublic && !existInPrivate(recipe.id));
                  return shouldShow ? (
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
                              src="../../images/back/chef.png"
                              alt={recipe.title}
                              className="public-recipe-image"
                              onClick={() => handleDisplayRecipe(recipe)}
                            />
                          )}
                        </div>

                        <div className="public-recipe-content">
                          <div className="public-recipe-actions">
                            <button
                              className="public-recipe-options-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowVert((prev) => (prev === recipe.id ? null : recipe.id));
                              }}
                              aria-label="אפשרויות מתכון"
                            >
                              <MoreVert />
                            </button>
                            <h3 className="public-recipe-title">{recipe.title}</h3>
                          </div>

                          {showVert === recipe.id && (
                            <div
                              className="public-recipe-options-dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                                      e.stopPropagation();
                                      setShowVert(null);
                                    }}
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
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PublicRecipes;


