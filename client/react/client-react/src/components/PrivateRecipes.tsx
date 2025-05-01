import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import '../styles/PrivateRecipes.css';
import { Button } from "@mui/material";
import { MoreVert, StarBorder } from "@mui/icons-material";
import { fetchDeletePrivateRecipe, fetchPrivateRecipes, fetchPrivateToPublic, fetchPublicRecipes } from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownAndEmail";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";
import PrivateOptions from "./PrivateOptions";
import { recipeEmailBody } from "./RecipeEmailBody";
import PrivateShows from "./PrivateShows";
import RecipeSearch from "./RecipeSearch";
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
import File2 from "./File";
import { Star } from "lucide-react"

const PrivateRecipes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showPrivate, setShowPrivate] = useState(false);
    const [showPublic, setShowPublic] = useState(false);
    const [searchRecipe, setSearchRecipe] = useState('');
    const [file, setFile] = useState(false);
    const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null);
    const [showVert, setShowVert] = useState<number | null>(null);

    const allPrivateRecipes = async () => {
        if (user?.id) {
            try {
                await fetchPrivateRecipes(user.id).then(async fetchedRecipes => {
                    setRecipes(fetchedRecipes);
                    await fetchPublicRecipes().then(fetchedPublicRecipes => {
                        setPublicRecipes(fetchedPublicRecipes);
                        setSuccess(true);
                        console.log(recipes);
                        console.log(publicRecipes);
                    })
                });

            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        }
    };

    useEffect(() => {
        allPrivateRecipes();
    }, [user]);

    const handleSortChange = (criterion: string) => {
        setSortBy(criterion);
        setAnchorEl(null);
    };

    const handleDelete = async (recipeId: number) => {
        if (user?.id) {
            await fetchDeletePrivateRecipe(recipeId);
            allPrivateRecipes();
        }
    };

    const handleAddToFavorites = async (recipeId: number) => {
        await fetchPrivateToPublic(recipeId);
        allPrivateRecipes();
    }

    const DownLoadRecipe = (recipe: Recipe) => {
        downloadRecipeFromUrl(recipe);
    }

    const EmailRecipe = async (recipe: Recipe) => {
        if (user) {
            const subject = "מתכון טעים במיוחד בשבילך";
            const body = recipeEmailBody(user.fName, recipe.path);
            await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
        }
    }

    const handleDisplayRecipe = (recipe: Recipe) => {
        setFile(true);
        setRecipeToDisplay(recipe);
    }

    const existInPublic = (recipeId: number) => {
        return publicRecipes.some((publicRecipe) => publicRecipe.id === recipeId);
    }

    const privateClick = () => {
        setShowPrivate(true);
        setShowPublic(false);
    }

    const publicClick = () => {
        setShowPublic(true);
        setShowPrivate(false);
    }

    const sortedRecipes = sortRecipes(recipes, sortBy);

    const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
        recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );

    return (
        <>
            {file ? (<>
                {recipeToDisplay && (
                    <File2 recipe={recipeToDisplay} fileUrl={recipeToDisplay.path} onClose={() => setFile(false)} details={null} />
                    // <FileViewer fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
                )}
            </>
            ) : (
                <>
                    <div style={{
                        position: "sticky", top: 0, zIndex: 1000, direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh', backgroundColor: '#121212'
                    }}>
                        <PrivateShows showPrivate={showPrivate} showPublic={showPublic} privateClick={privateClick} publicClick={publicClick} />
                        <RecipeSearch setSearchRecipe={setSearchRecipe} />
                        <div className="private-sort-container" style={{ textAlign: 'left' }}>
                            <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
                        </div>
                    </div>

                    <div className="privateRecipes-container">
                        {success && filteredRecipes.length > 0 && (
                            <>
                                <div className="privateRecipe-grid">
                                    {filteredRecipes.map((recipe: Recipe) => {
                                        const shouldShow = (showPrivate && !recipe.isPublic) || (showPublic && recipe.isPublic);
                                        return shouldShow ? (
                                            (<div key={recipe.id} className="privateRecipe-card">
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px', cursor: 'pointer', color: 'white' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                    <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
                                                </div>
                                                {recipe.picture && recipe.picture !== "" && <img src={recipe.picture} alt={recipe.title} className="privateRecipe-image" onClick={() => handleDisplayRecipe(recipe)} />}
                                                {(!recipe.picture || recipe.picture == "") && <img src="../../images/back/chef.png" alt={recipe.title} className="privateRecipe-image" onClick={() => handleDisplayRecipe(recipe)} />}
                                                {/* {(!recipe.picture || recipe.picture == "") && <h1 className="private-logo-text">SmartChef</h1>} */}
                                                {/* <div className="private-difficulty-rating" style={{ bottom: '8%' }}>
                                                    <div className="private-stars">
                                                        {Array.from({ length: 5 }).reverse().map((_, index) => (
                                                            index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
                                                        ))}
                                                    </div>
                                                </div> */}
                                                {(!recipe.picture || recipe.picture == "") && <div className="private-recipe-difficulty">
                                                    <div className="private-stars-container">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`private-star ${i < Number(recipe.degree) ? "active" : ""}`} size={24} />
                                                        ))}
                                                    </div>
                                                </div>}

                                                {( recipe.picture != "") && <div className="private-recipe-difficulty2">
                                                    <div className="private-stars-container">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`private-star ${i < Number(recipe.degree) ? "active" : ""}`} size={24} />
                                                        ))}
                                                    </div>
                                                </div>}

                                                {showVert === recipe.id && (
                                                    <div className="private-showVert" onClick={() => setShowVert(null)}>
                                                        <div className="private-inShowVert">
                                                            <PrivateOptions
                                                                recipe={recipe}
                                                                handleDisplayRecipe={handleDisplayRecipe}
                                                                DownLoadRecipe={DownLoadRecipe}
                                                                EmailRecipe={EmailRecipe}
                                                                handleDelete={handleDelete}
                                                                notExistInPublic={!existInPublic(recipe.id)}
                                                                handleAddToFavorites={handleAddToFavorites} />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>)) : null
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )
            }
        </>
    );
};

export default PrivateRecipes;

// import { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
// import { AppDispatch, useAppSelector } from "./Redux/Store"
// import "../styles/PrivateRecipes.css"
// import {
//   fetchDeletePrivateRecipe,
//   fetchPrivateRecipes,
//   fetchPrivateToPublic,
//   fetchPublicRecipes,
// } from "./Services/RecipeService"
// import { downloadRecipeFromUrl } from "./DownAndEmail"
// import { sendEmail } from "./Redux/AuthSlice"
// import { recipeEmailBody } from "./RecipeEmailBody"
// import File2 from "./File"
// import { Recipe } from "../models/RecipeType"

// const PrivateRecipes = () => {
// const dispatch = useDispatch<AppDispatch>();
//   const user = useAppSelector((state) => state.auth.user)
//   const [recipes, setRecipes] = useState<Recipe[]>([])
//   const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([])
//   const [success, setSuccess] = useState(false)
//   const [sortBy, setSortBy] = useState("")
//   const [activeTab, setActiveTab] = useState("private")
//   const [searchRecipe, setSearchRecipe] = useState("")
//   const [file, setFile] = useState(false)
//   const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null)
//   const [showOptions, setShowOptions] = useState<number | null>(null)

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
//         console.error("Failed to fetch recipes:", error)
//       }
//     }
//   }

//   useEffect(() => {
//     allPrivateRecipes()
//   }, [user])

//   const handleSortChange = (e: any) => {
//     setSortBy(e.target.value)
//   }

//   const handleDelete = async (recipeId: number) => {
//     if (user?.id) {
//       await fetchDeletePrivateRecipe(recipeId)
//       allPrivateRecipes()
//     }
//   }

//   const handleAddToFavorites = async (recipeId: number) => {
//     await fetchPrivateToPublic(recipeId)
//     allPrivateRecipes()
//   }

//   const downloadRecipe = (recipe: Recipe) => {
//     downloadRecipeFromUrl(recipe)
//   }

//   const emailRecipe = async (recipe: Recipe) => {
//     if (user) {
//       const subject = "מתכון טעים במיוחד בשבילך"
//       const body = recipeEmailBody(user.fName, recipe.path)
//       await dispatch(sendEmail({ to: user.email, subject: subject, body: body }))
//     }
//   }

//   const handleDisplayRecipe = (recipe: Recipe) => {
//     setFile(true)
//     setRecipeToDisplay(recipe)
//   }

//   const existInPublic = (recipeId: number) => {
//     return publicRecipes.some((publicRecipe) => publicRecipe.id === recipeId)
//   }

//   const sortRecipes = (recipes: Recipe[], criterion: string) => {
//     const recipesCopy = [...recipes]

//     switch (criterion) {
//       case "title":
//         return recipesCopy.sort((a, b) => a.title.localeCompare(b.title))
//       case "difficulty":
//         return recipesCopy.sort((a, b) => a.degree - b.degree)
//       default:
//         return recipesCopy
//     }
//   }

//   const sortedRecipes = sortRecipes(recipes, sortBy)

//   const filteredRecipes = sortedRecipes.filter((recipe) =>
//     recipe.title.toLowerCase().includes(searchRecipe.toLowerCase()),
//   )

//   const displayedRecipes = filteredRecipes.filter(
//     (recipe) => (activeTab === "private" && !recipe.isPublic) || (activeTab === "public" && recipe.isPublic),
//   )

//   const toggleOptions = (recipeId: number) => {
//     setShowOptions(showOptions === recipeId ? null : recipeId)
//   }

//   return (
//     <div className="recipes-container" dir="rtl">
//       {file ? (
//         <div className="recipe-viewer">
//           <button className="back-button" onClick={() => setFile(false)}>
//             <span className="back-icon">←</span>
//             חזרה לרשימת המתכונים
//           </button>

//           {recipeToDisplay && (
//             <File2 recipe={recipeToDisplay} fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="recipes-header">
//             <h1 className="recipes-title">
//               <span className="title-white">ספר</span> המתכונים שלי
//             </h1>

//             <div className="recipes-controls">
//               <div className="search-container">
//                 <input
//                   type="text"
//                   placeholder="חיפוש מתכונים..."
//                   value={searchRecipe}
//                   onChange={(e) => setSearchRecipe(e.target.value)}
//                   className="search-input"
//                 />
//                 <span className="search-icon">🔍</span>
//               </div>

//               <select className="sort-select" value={sortBy} onChange={handleSortChange}>
//                 <option value="">מיון לפי</option>
//                 <option value="title">שם</option>
//                 <option value="difficulty">רמת קושי</option>
//               </select>
//             </div>
//           </div>

//           <div className="recipes-tabs">
//             <button
//               className={`tab-button ${activeTab === "private" ? "active" : ""}`}
//               onClick={() => setActiveTab("private")}
//             >
//               מתכונים פרטיים
//             </button>
//             <button
//               className={`tab-button ${activeTab === "public" ? "active" : ""}`}
//               onClick={() => setActiveTab("public")}
//             >
//               מתכונים ציבוריים
//             </button>
//           </div>

//           <div className="recipes-grid">
//             {success && displayedRecipes.length > 0 ? (
//               displayedRecipes.map((recipe) => (
//                 <div key={recipe.id} className="recipe-card">
//                   <div className="recipe-header">
//                     <h3 className="recipe-title">{recipe.title}</h3>
//                     <button className="options-button" onClick={() => toggleOptions(recipe.id)}>
//                       ⋮
//                     </button>
//                   </div>

//                   <div className="recipe-image-container" onClick={() => handleDisplayRecipe(recipe)}>
//                     <img src="../../images/back/smartSource2.png" alt={recipe.title} className="recipe-image" />
//                     <div className="recipe-image-overlay"></div>
//                   </div>

//                   <div className="recipe-rating">
//                     {Array.from({ length: 5 }).map((_, index) => (
//                       <span key={index} className={`star ${index < 5 - recipe.degree ? "empty-star" : "filled-star"}`}>
//                         ★
//                       </span>
//                     ))}
//                   </div>

//                   {showOptions === recipe.id && (
//                     <div className="recipe-options">
//                       <button className="option-button view-button" onClick={() => handleDisplayRecipe(recipe)}>
//                         צפה במתכון
//                       </button>
//                       <button className="option-button download-button" onClick={() => downloadRecipe(recipe)}>
//                         הורד מתכון
//                       </button>
//                       <button className="option-button email-button" onClick={() => emailRecipe(recipe)}>
//                         שלח במייל
//                       </button>
//                       {!existInPublic(recipe.id) && (
//                         <button
//                           className="option-button favorite-button"
//                           onClick={() => handleAddToFavorites(recipe.id)}
//                         >
//                           הוסף למועדפים
//                         </button>
//                       )}
//                       <button className="option-button delete-button" onClick={() => handleDelete(recipe.id)}>
//                         מחק מתכון
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="no-recipes">
//                 <div className="no-recipes-icon">👨‍🍳</div>
//                 <h3 className="no-recipes-title">{success ? "לא נמצאו מתכונים" : "טוען מתכונים..."}</h3>
//                 <p className="no-recipes-message">
//                   {success
//                     ? `לא נמצאו מתכונים ${
//                         activeTab === "private" ? "פרטיים" : "ציבוריים"
//                       }. נסה לשנות את החיפוש או הסינון.`
//                     : "אנא המתן בזמן שאנו טוענים את המתכונים שלך..."}
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default PrivateRecipes