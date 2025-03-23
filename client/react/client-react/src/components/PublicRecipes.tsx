import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { useAppSelector } from "./Redux/Store";
import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import { Star, StarBorder, Visibility, Download, Email, Sort, Bookmark, Search } from "@mui/icons-material";
import { fetchPublicRecipes, fetchPublicToPrivate, fetchPrivateRecipes } from "./Services/RecipeService";
import "../styles/PublicRecipes.css";
import { downloadRecipeFromUrl, emailRecipeWithUrl } from "./DownAndEmail";
import { useNavigate } from "react-router-dom";
import FileViewer from "./FileViewer";

const PublicRecipes = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [showPrivate, setShowPrivate] = useState(false);
    const [showPublic, setShowPublic] = useState(false);
    const [searchRecipe, setSearchRecipe] = useState('');
    const [file, setFile] = useState(false);
    const [recipeToDisplay, setRecipeToDisplay] = useState<Recipe | null>(null);

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
            console.error('Failed to fetch recipes:', error);
        }
    };

    useEffect(() => {
        allRecipes();
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
                return [...recipes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            default:
                return recipes;
        }
    };

    const handleSortChange = (criterion: string) => {
        setSortBy(criterion);
        setAnchorEl(null);
    };

    const handlePublicToPrivate = async (recipeId: number) => {
        if (user?.id) {
            try {
                await fetchPublicToPrivate(user.id, recipeId);
                console.log(`Recipe ${recipeId} added to user's recipes.`);
                setPrivateRecipes(await fetchPrivateRecipes(user.id));
                setRecipes(await fetchPublicRecipes());
                // const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
                // if (selectedRecipe) {
                //     setPrivateRecipes(prev => [...prev, selectedRecipe]);
                // }
            } catch (error) {
                console.error('Failed to add recipe to public:', error);
            }
        }
    }

    const sortedRecipes = sortRecipes(recipes, sortBy);

    const existInPrivate = (recipeId: number) => {
        return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
    }

    const DownLoadRecipe = (recipe: Recipe) => {
        downloadRecipeFromUrl(recipe);
    }

    const EmailRecipe = (recipe: Recipe) => {
        if (user) {
            emailRecipeWithUrl(recipe.path, user.email);
        }
    }

    const handleDisplayRecipe = (recipe: Recipe) => {
        //navigate(`/recipe/${recipeId}`);
        setFile(true);
        setRecipeToDisplay(recipe);
    }

    const handleDisplayRecipeDetails = (recipeId: number) => {
        navigate(`/recipe/${recipeId}`);
    }

    const privateClick = () => {
        setShowPrivate(true);
        setShowPublic(false);
    }

    const publicClick = () => {
        setShowPublic(true);
        setShowPrivate(false);
    }

    const filteredRecipes = sortedRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );

    return (
        <>
            {file ? (
                recipeToDisplay && <FileViewer fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
            ) : (
                <>
                    <div style={{
                        position: "sticky", top: '0', zIndex: 1000, backgroundColor: 'black', direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh'
                    }}>
                        <h1 style={{ color: 'white', margin: '0', textAlign: 'right', marginLeft: '20px' }}>מומלצים</h1>
                        <div style={{
                            display: 'flex', alignItems: 'center', marginLeft: '20px'
                        }}>
                            <p style={{ width: '2vw' }}></p>
                            {showPrivate ? (<>
                                <button style={{
                                    color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    display: 'inlineBlock', paddingBottom: '5px'
                                }} onClick={privateClick}>בספר</button>
                                <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                    color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                                }} onClick={publicClick}>לא בספר</button>
                            </>) : (<>
                                {showPublic ? (<>
                                    <button style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    }} onClick={privateClick}>בספר</button>
                                    <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                    <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                        color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                        display: 'inlineBlock', paddingBottom: '5px'
                                    }} onClick={publicClick}>לא בספר</button>
                                </>) : (<>
                                    <button style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    }} onClick={privateClick}>בספר</button>
                                    <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                    <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                                    }} onClick={publicClick}>לא בספר</button>
                                </>)}
                            </>)}
                        </div>
                        <TextField
                            className="private-text-field"
                            variant="outlined"
                            placeholder="    חפש מתכון..."
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search style={{ color: '#FFA500' }} />
                                        <p style={{ marginLeft: '0.75vw' }}></p>
                                    </InputAdornment>
                                ),
                                style: {
                                    padding: '0',
                                    color: 'orange',
                                    maxWidth: '12vw',
                                    maxHeight: '5.25vh',
                                    borderRadius: '7px'
                                }
                            }}
                            onChange={(e) => setSearchRecipe(e.target.value)}
                        />
                        <div className="private-sort-container" style={{ textAlign: 'left' }}>
                            <Tooltip title="מיון לפי">
                                <Button
                                    variant="outlined"
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'rgb(251, 222, 0)',
                                        borderColor: 'orange',
                                        maxHeight: '5.25vh',
                                        marginLeft: '3vw',
                                        marginRight: '2vw',
                                        width: '9vw',
                                        borderRadius: '7px'
                                    }}
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                >
                                    מיון לפי
                                    <p style={{ marginLeft: '1.5vw' }}></p>
                                    <Sort style={{ marginLeft: '8px', color: 'orange' }} />
                                </Button>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{
                                    style: {
                                        backgroundColor: 'black',
                                        color: 'orange',
                                        border: '1px solid orange',
                                        width: '8vw',
                                        maxWidth: '12vw'
                                    },
                                }}
                            >
                                <MenuItem onClick={() => handleSortChange('category')}>קטגוריה</MenuItem>
                                <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                                <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                                <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                            </Menu>
                        </div>
                    </div>

                    <div className="public-recipes-container">
                        {success && filteredRecipes.length > 0 && (
                            <>
                                <div className="recipe-grid">
                                    {filteredRecipes.map((recipe) => (
                                        (showPrivate && existInPrivate(recipe.id)) || (showPublic && !(existInPrivate(recipe.id))) ?
                                            (<div key={recipe.id} className="recipe-card" onClick={() => handleDisplayRecipeDetails(recipe.id)}>
                                                <p>{recipe.id}</p>
                                                {recipe.title.length < 16 &&
                                                    <h3 className="recipe-title" style={{ fontSize: '2em' }}>{recipe.title}</h3>}
                                                {recipe.title.length >= 16 &&
                                                    <h3 className="recipe-title" style={{ fontSize: '1.3em' }}>{recipe.title}</h3>}
                                                <img src="../../images/back/recipes4.png" alt={recipe.title} className="recipe-image" />
                                                {recipe.title.length < 16 &&
                                                    <div className="difficulty-rating" style={{ bottom: '15%' }}>
                                                        <div className="stars">
                                                            {Array.from({ length: 5 }).reverse().map((_, index) => (
                                                                index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
                                                            ))}
                                                        </div>
                                                        {/* <p style={{fontSize:'14px'}}>דרגת קושי</p> */}
                                                    </div>}
                                                {recipe.title.length >= 16 &&
                                                    <div className="difficulty-rating" style={{ bottom: '22%' }}>
                                                        <div className="stars">
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
                                                            ))}
                                                        </div>
                                                        {/* <p style={{fontSize:'14px'}}>דרגת קושי</p> */}
                                                    </div>}
                                                <div className="buttons-container" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                    <Tooltip title="הצגת פרטי מתכון">
                                                        <IconButton className="recipe-icons" style={{ color: 'black' }}>
                                                            <Visibility onClick={() => handleDisplayRecipe(recipe)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="הורדה">
                                                        <IconButton style={{ color: 'black' }}>
                                                            <Download onClick={() => DownLoadRecipe(recipe)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="שליחה למייל">
                                                        <IconButton style={{ color: 'black' }}>
                                                            <Email onClick={() => EmailRecipe(recipe)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {!existInPrivate(recipe.id) &&
                                                        <Tooltip title="הוספה לספר המתכונים שלי">
                                                            <IconButton onClick={(event) => { event.stopPropagation(); handlePublicToPrivate(recipe.id) }} style={{ color: 'black' }}>
                                                                <Bookmark />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </div>
                                            </div>) : (<></>)
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default PublicRecipes;





// import { useEffect, useState } from "react";
// import { Recipe } from "../models/RecipeType";
// import { useAppSelector } from "./Redux/Store";
// import '../styles/PublicRecipes.css';
// import { Button, Menu, MenuItem } from "@mui/material";
// import { fetchPublicRecipes, fetchPrivateToPublic, fetchPrivateRecipes } from "./Services/RecipeService";

// const PublicRecipes = () => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>(''); // מצב למיון
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // מצב לתפריט

//     const allRecipes = async () => {
//         try {
//             const fetchedRecipes = await fetchPublicRecipes();
//             setSuccess(true);
//             setRecipes(fetchedRecipes);
//         } catch (error) {
//             console.error('Failed to fetch recipes:', error);
//         }
//         if (user?.id) {
//             setPrivateRecipes(await fetchPrivateRecipes(user.id));
//         }
//     };

//     useEffect(() => {
//         allRecipes();
//     }, []);

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

//     const handlePrivateToPublic = async (recipeId: number) => {
//         if (user?.id) {
//             try {
//                 await fetchPrivateToPublic(user.id, recipeId);
//                 console.log(`Recipe ${recipeId} added to user's recipes.`);
//                 const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
//                 if (selectedRecipe) {
//                     setPrivateRecipes(prev => [...prev, selectedRecipe]);
//                 }
//             } catch (error) {
//                 console.error('Failed to add recipe to public:', error);
//             }
//         }
//     }

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
//                             {
//                                 !privateRecipes.some((privateRecipe) => privateRecipe.id === recipe.id) &&
//                                 <Button onClick={() => handlePrivateToPublic(recipe.id)}>To My Recipes</Button>
//                             }
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

// export default PublicRecipes;



// // import { useDispatch } from "react-redux";
// // import { AppDispatch, useAppSelector } from "./Redux/Store";
// // import { fetchPublicRecipes } from "./Redux/PublicRecipesSlice";
// // import { Recipe } from "../models/RecipeType";
// // import { useEffect, useState } from "react";
// // import '../styles/PublicRecipes.css';
// // import { Button, Menu, MenuItem } from "@mui/material";
// // import { fetchPrivateToPublic } from "./Redux/PrivateRecipesSlice";

// // const PublicRecipes = () => {
// //     const dispatch = useDispatch<AppDispatch>();
// //     const user = useAppSelector((state) => state.auth.user);
// //     const [recipes, setRecipes] = useState<Recipe[]>([]);
// //     const [success, setSuccess] = useState(false);
// //     const [sortBy, setSortBy] = useState<string>(''); // מצב למיון
// //     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // מצב לתפריט

// //     const allRecipes = async () => {
// //         const resultAction = await dispatch(fetchPublicRecipes());
// //         if (fetchPublicRecipes.fulfilled.match(resultAction)) {
// //             setSuccess(true);
// //             setRecipes(resultAction.payload);
// //         } else {
// //             console.error('Failed to fetch recipes:', resultAction.error);
// //         }
// //     };

// //     useEffect(() => {
// //         allRecipes();
// //     }, []);

// //     // פונקציה למיון מתכונים
// //     const sortRecipes = (recipes: Recipe[], criterion: string) => {
// //         switch (criterion) {
// //             case 'category':
// //                 return [...recipes].sort((a, b) => a.category - b.category);
// //             case 'degree':
// //                 return [...recipes].sort((a, b) => a.degree - b.degree);
// //             case 'name':
// //                 return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
// //             case 'date':
// //                 return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
// //             default:
// //                 return recipes;
// //         }
// //     };

// //     const handleSortChange = (criterion: string) => {
// //         setSortBy(criterion);
// //         setAnchorEl(null); // סגור את התפריט
// //     };

// //     const handlePrivateToPublic = (recipeId: number) => {
// //         if (user?.id) {
// //             console.log(user.id);
// //             console.log(recipeId);
// //             dispatch(fetchPrivateToPublic({ userId: user.id, recipeId }));
// //         }
// //     }

// //     const sortedRecipes = sortRecipes(recipes, sortBy);

// //     return (
// //         <>
// //             {success && sortedRecipes.length > 0 && (
// //                 <ul className="recipe-list">
// //                     {sortedRecipes.map((recipe) => (
// //                         <li key={recipe.id} className="recipe-item">
// //                             <h3>{recipe.title}</h3>
// //                             <p>{recipe.category}</p>
// //                             <p>{recipe.degree}</p>
// //                             <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
// //                             <Button onClick={() => handlePrivateToPublic(recipe.id)}>To My Recipes</Button>
// //                         </li>
// //                     ))}
// //                 </ul>
// //             )}
// //             {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
// //                 <>
// //                     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
// //                     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
// //                         <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
// //                         <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
// //                         <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
// //                         <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
// //                     </Menu>
// //                 </>
// //             )}
// //         </>
// //     );
// // }

// // export default PublicRecipes;