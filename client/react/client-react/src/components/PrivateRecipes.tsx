import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { useAppSelector } from "./Redux/Store";
import '../styles/PrivateRecipes.css';
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Delete, Download, Email, Sort, Star, StarBorder, Visibility } from "@mui/icons-material";
import { fetchDeletePrivateRecipe, fetchPrivateRecipes, fetchPrivateToPublic, fetchPublicRecipes } from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownAndEmail";
import { useNavigate } from "react-router-dom";

const PrivateRecipes = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [showPrivate, setShowPrivate] = useState(false);
    const [showPublic, setShowPublic] = useState(false);

    const allPrivateRecipes = async () => {
        if (user?.id) {
            try {
                const fetchedRecipes = await fetchPrivateRecipes(user.id);
                setPublicRecipes(await fetchPublicRecipes());
                setSuccess(true);
                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        }
    };

    useEffect(() => {
        allPrivateRecipes();
    }, [user]);

    const sortRecipes = (recipes: Recipe[], criterion: string) => {
        switch (criterion) {
            case 'category':
                return [...recipes].sort((a, b) => a.category - b.category);
            case 'degree':
                return [...recipes].sort((a, b) => a.degree - b.degree);
            case 'name':
                return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            default:
                return recipes;
        }
    };

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

    const handleDisplayRecipe = (recipeId: number) => {
        navigate(`/recipe/${recipeId}`);
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

    return (
        <>
            <div style={{
                position: "sticky", top: '0', zIndex: 1000, backgroundColor: '#212121', direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh'
            }}>
                <h1 style={{ color: 'white', margin: '0', textAlign: 'right', marginLeft: '20px' }}>ספר המתכונים שלי</h1>
                <div style={{
                    display: 'flex', alignItems: 'center', marginLeft: '20px'
                }}>
                    {showPrivate ? (<>
                        <button style={{
                            color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                            borderBottom: '1px solid orange', display: 'inlineBlock', paddingBottom: '5px'
                        }} onClick={privateClick}>פרטי</button>
                        <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                        <button className={showPublic ? "private-title-with-underline" : ""} style={{
                            color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                        }} onClick={publicClick}>ציבורי</button>
                    </>) : (<>
                        {showPublic ? (<>
                            <button style={{
                                color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                            }} onClick={privateClick}>פרטי</button>
                            <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                            <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                borderBottom: '1px solid orange', display: 'inlineBlock', paddingBottom: '5px'
                            }} onClick={publicClick}>ציבורי</button>
                        </>) : (<>
                            <button style={{
                                color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                            }} onClick={privateClick}>פרטי</button>
                            <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                            <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                            }} onClick={publicClick}>ציבורי</button>
                        </>)}
                    </>)}
                </div>
            </div>

            <div className="privateRecipes-container">
                {success && sortedRecipes.length > 0 && (
                    <>
                        <div className="private-sort-container">
                            <Tooltip title="מיון לפי">
                                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                                    <Sort />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                <MenuItem onClick={() => handleSortChange('category')}>קטגוריה</MenuItem>
                                <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                                <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                                <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                            </Menu>
                        </div>
                        <div className="privateRecipe-grid">
                            {sortedRecipes.map((recipe) => (
                                (showPrivate && !recipe.isPublic) || (showPublic && recipe.isPublic) ?
                                    (<div key={recipe.id} className="privateRecipe-card" onClick={() => handleDisplayRecipe(recipe.id)}>
                                        {recipe.title.length < 16 &&
                                            <h3 className="privateRecipe-title" style={{ fontSize: '2em' }}>{recipe.title}</h3>}
                                        {recipe.title.length >= 16 &&
                                            <h3 className="privateRecipe-title" style={{ fontSize: '1.3em' }}>{recipe.title}</h3>}
                                        <img src="../../images/back/recipes4.png" alt={recipe.title} className="privateRecipe-image" />
                                        {recipe.title.length < 16 &&
                                            <div className="private-difficulty-rating" style={{ bottom: '15%' }}>
                                                <div className="private-stars">
                                                    {Array.from({ length: 5 }).reverse().map((_, index) => (
                                                        index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
                                                    ))}
                                                </div>
                                            </div>
                                        }
                                        {recipe.title.length >= 16 &&
                                            <div className="private-difficulty-rating" style={{ bottom: '22%' }}>
                                                <div className="private-stars">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        index < recipe.degree ? <Star key={index} className="private-filled-star" /> : <StarBorder key={index} className="private-empty-star" />
                                                    ))}
                                                </div>
                                            </div>
                                        }
                                        {/* <p><strong>קטגוריה:</strong> {recipe.category}</p>
                                <p><strong>דרגת קושי:</strong> {recipe.degree}</p>
                                <p><strong>תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</p> */}
                                        {/* <div className="difficulty-rating">
                                    <div className="stars">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
                                        ))}
                                    </div>
                                </div> */}
                                        <div className="private-buttons-container" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <Tooltip title="הצגת פרטי מתכון">
                                                <IconButton className="privateRecipe-icons" style={{ color: 'black' }}>
                                                    <Visibility onClick={() => handleDisplayRecipe(recipe.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="הורדה">
                                                <IconButton style={{ color: 'black' }}>
                                                    <Download onClick={() => DownLoadRecipe(recipe)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="שליחה למייל">
                                                <IconButton style={{ color: 'black' }}>
                                                    <Email />
                                                </IconButton>
                                            </Tooltip>
                                            {!existInPublic(recipe.id) &&
                                                <Tooltip title="הוספה למומלצים">
                                                    <IconButton onClick={(event) => { event.stopPropagation(); handleAddToFavorites(recipe.id) }} style={{ color: 'black' }}>
                                                        <Star />
                                                    </IconButton>
                                                </Tooltip>}
                                            <Tooltip title="מחיקה מספר המתכונים שלי">
                                                <IconButton onClick={(event) => { event.stopPropagation(); handleDelete(recipe.id) }} style={{ color: 'black' }}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>) : (<>
                                    </>)
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );


};

export default PrivateRecipes;



// import { useEffect, useState } from "react";
// import { Recipe } from "../models/RecipeType";
// import { useAppSelector } from "./Redux/Store";
// import '../styles/PublicRecipes.css';
// import { Button, Menu, MenuItem } from "@mui/material";
// import { fetchDeletePrivateRecipe, fetchPrivateRecipes } from "./Services/RecipeService";

// const PrivateRecipes = () => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const allPrivateRecipes = async () => {
//         if (user?.id) {
//             try {
//                 const fetchedRecipes = await fetchPrivateRecipes(user.id);
//                 setSuccess(true);
//                 setRecipes(fetchedRecipes);
//             } catch (error) {
//                 console.error('Failed to fetch recipes:', error);
//             }
//         }
//     };

//     useEffect(() => {
//         allPrivateRecipes();
//     }, [user]);

//     // פונקציה למיון מתכונים
//     const sortRecipes = (recipes: Recipe[], criterion: string) => {
//         switch (criterion) {
//             case 'category':
//                 return [...recipes].sort((a, b) => a.category - b.category);
//             case 'degree':
//                 return [...recipes].sort((a, b) => a.degree - b.degree);
//             case 'name':
//                 return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
//             case 'date':
//                 return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//             default:
//                 return recipes;
//         }
//     };

//     const handleSortChange = (criterion: string) => {
//         setSortBy(criterion);
//         setAnchorEl(null); // סגור את התפריט
//     };

//     const handleDelete = async (recipeId: number) => {
//         if (user?.id) {
//             await fetchDeletePrivateRecipe(recipeId);
//             allPrivateRecipes();
//         }
//     };

//     const sortedRecipes = sortRecipes(recipes, sortBy);

//     return (
//         <>
//             {success && sortedRecipes.length > 0 && (
//                 <ul className="recipe-list">
//                     {sortedRecipes.map((recipe) => (
//                         <li key={recipe.id} className="recipe-item">
//                             <h3>{recipe.title}</h3>
//                             <p>{recipe.category}</p>
//                             <p>{recipe.degree}</p>
//                             <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
//                             <Button onClick={() => handleDelete(recipe.id)}>Delete from my recipes-book</Button>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
//                 <>
//                     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
//                     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//                         <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//                     </Menu>
//                 </>
//             )}
//         </>
//     );
// }

// export default PrivateRecipes;




// import { useDispatch } from "react-redux";
// import { AppDispatch, useAppSelector } from "./Redux/Store";
// import { Recipe } from "../models/RecipeType";
// import { useEffect, useState } from "react";
// import '../styles/PublicRecipes.css';
// import { Button, Menu, MenuItem } from "@mui/material";
// import { fetchPrivateRecipes } from "./Redux/PrivateRecipesSlice";

// const PrivateRecipes = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const allRecipes = async () => {
//         console.log(user?.id);
//         if (user?.id) {
//             const resultAction = await dispatch(fetchPrivateRecipes(user.id));
//             if (fetchPrivateRecipes.fulfilled.match(resultAction)) {
//                 setSuccess(true);
//                 setRecipes(resultAction.payload);
//             } else {
//                 console.error('Failed to fetch recipes:', resultAction.error);
//             }
//         }
//     }

//     useEffect(() => {
//         allRecipes();
//     }, [dispatch, user]);

//     // פונקציה למיון מתכונים
//     const sortRecipes = (recipes: Recipe[], criterion: string) => {
//         switch (criterion) {
//             case 'category':
//                 return [...recipes].sort((a, b) => a.category-b.category);
//             case 'degree':
//                 return [...recipes].sort((a, b) => a.degree - b.degree);
//             case 'name':
//                 return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
//             case 'date':
//                 return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//             default:
//                 return recipes;
//         }
//     };

//     const handleSortChange = (criterion: string) => {
//         setSortBy(criterion);
//         setAnchorEl(null); // סגור את התפריט
//     };

//     const sortedRecipes = sortRecipes(recipes, sortBy);

//     return (
//         <>
//             {success && sortedRecipes.length > 0 && (
//                 <ul className="recipe-list">
//                     {sortedRecipes.map((recipe) => (
//                         <li key={recipe.id} className="recipe-item">
//                             <h3>{recipe.title}</h3>
//                             <p>{recipe.category}</p>
//                             <p>{recipe.degree}</p>
//                             <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
//                 <>
//                     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
//                     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//                         <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//                     </Menu>
//                 </>
//             )}
//         </>
//     );
// }

// export default PrivateRecipes;
