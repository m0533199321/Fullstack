import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import '../styles/PrivateRecipes.css';
import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import { Delete, Download, Email, MoreVert, Search, Sort, Star, StarBorder, Visibility } from "@mui/icons-material";
import { fetchDeletePrivateRecipe, fetchPrivateRecipes, fetchPrivateToPublic, fetchPublicRecipes } from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownAndEmail";
//import { useNavigate } from "react-router-dom";
import FileViewer from "./FileViewer";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";

const PrivateRecipes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const navigate = useNavigate();
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

    const sortRecipes = (recipes: Recipe[], criterion: string) => {
        console.log(recipes);

        switch (criterion) {
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
            const body = `
            <div style='text-align: right; font-family: Arial, sans-serif;'>
                <h1 style='font-size: 28px; color: #FFA500;'>,היי ${user.fName}</h1>
                <p style='font-size: 20px; color: #333;'>:הנה המתכון שביקשת</p>
                <p style='font-size: 18px; color: #333;'>
                    <a href="${recipe.path}" style='color: #FFA500; text-decoration: none;'>לחץ/י כאן כדי לראות את המתכון</a>
                </p>
                <p style='font-size: 20px; color: #333;'>!מקווה שתיהנה/י ממנו מאוד</p>
                <p style='font-size: 20px; color: #FFA500;'>,בתיאבון</p>
                <p style='font-size: 20px; color: #FFA500;'>smart-chef</p>
            </div>
            `;
            const result2 = await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
            if (result2.meta.requestStatus === 'fulfilled') {
                console.log("mail sent!");
            }
            else {
                console.log("mail not sent!");
            }
        }
    }

    const handleDisplayRecipe = (recipe: Recipe) => {
        //navigate(`/recipe/${recipeId}`);
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

    const filteredRecipes = sortedRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );

    return (
        <>
            {file ? (<>
                {recipeToDisplay && (
                    <>
                        <Button
                            sx={{
                                position: 'fixed',
                                top: '16vw',
                                marginLeft: '60vh',
                                color: '#FFA500',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                height: 'auto',
                            }} onClick={() => setFile(false)}>חזרה לרשימת המתכונים
                        </Button>
                    </>
                )}
                {recipeToDisplay && (
                    <FileViewer fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
                )}
            </>
            ) : (
                <>
                    <div style={{
                        position: "sticky", top: 0, zIndex: 1000, direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh', backgroundColor: 'black'
                    }}>
                        <h1 style={{ color: 'white', margin: '0', textAlign: 'right', marginLeft: '20px', fontSize: '3.6vw' }}>ספר המתכונים שלי</h1>
                        <div style={{
                            display: 'flex', alignItems: 'center', marginLeft: '20px'
                        }}>
                            <p style={{ width: '2vw' }}></p>
                            {showPrivate ? (<>
                                <button style={{
                                    color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    display: 'inlineBlock', paddingBottom: '5px'
                                }} onClick={privateClick}>פרטיים</button>
                                <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                    color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                                }} onClick={publicClick}>מומלצים</button>
                            </>) : (<>
                                {showPublic ? (<>
                                    <button style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    }} onClick={privateClick}>פרטיים</button>
                                    <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                    <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                        color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                        display: 'inlineBlock', paddingBottom: '5px'
                                    }} onClick={publicClick}>מומלצים</button>
                                </>) : (<>
                                    <button style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                                    }} onClick={privateClick}>פרטיים</button>
                                    <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                                    <button className={showPublic ? "private-title-with-underline" : ""} style={{
                                        color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                                    }} onClick={publicClick}>מומלצים</button>
                                </>)}

                            </>)}
                        </div>
                        <TextField
                            className="private-text-field"
                            variant="outlined"
                            placeholder=" חפש שם מתכון..."
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
                                    borderRadius: '7px',
                                    paddingRight: '10px'
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
                                        marginRight: '1.5vw',
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
                                <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                                <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                                <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                            </Menu>
                        </div>
                        {/* <div className="private-sort-container">
                            <Tooltip title="מיון לפי">
                                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                                    <Sort style={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                <MenuItem onClick={() => handleSortChange('category')}>קטגוריה</MenuItem>
                                <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                                <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                                <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                            </Menu>
                        </div> */}
                    </div>

                    <div className="privateRecipes-container">
                        {success && filteredRecipes.length > 0 && (
                            <>
                                <div className="privateRecipe-grid">
                                    {filteredRecipes.map((recipe) => {
                                        const shouldShow = (showPrivate && !recipe.isPublic) || (showPublic && recipe.isPublic);
                                        return shouldShow ? (
                                            (<div key={recipe.id} className="privateRecipe-card">

                                                {/* <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(0.8, 2.6 - recipe.title.length / 10)}em`, marginTop: '0vh' }}>{recipe.title}</h3> */}
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                    <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
                                                </div>
                                                <img src="../../images/back/smartSource2.png" alt={recipe.title} className="privateRecipe-image" onClick={() => handleDisplayRecipe(recipe)} />
                                                <div className="private-difficulty-rating" style={{ bottom: '8%' }}>
                                                    <div className="private-stars">
                                                        {Array.from({ length: 5 }).reverse().map((_, index) => (
                                                            index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
                                                        ))}
                                                    </div>
                                                </div>

                                                {showVert === recipe.id && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                        width: '15vw',
                                                        height: '80%',
                                                        top: '15%',
                                                        left: '5%',
                                                        zIndex: 100,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }} onClick={() => setShowVert(null)}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            flexWrap: 'wrap', // מאפשר לשורות להתקפל
                                                            justifyContent: 'space-around', // מפזר את האייקונים עם רווחים שווים
                                                            width: '100%', // קובע רוחב של 100% כך שהאייקונים יתפסו את כל השטח
                                                            alignItems: 'center'
                                                        }}>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                <Tooltip title="הצגת פרטי מתכון">
                                                                    <IconButton className="privateRecipe-icons" style={{ color: 'white' }}>
                                                                        <Visibility onClick={() => handleDisplayRecipe(recipe)} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                <Tooltip title="הורדה">
                                                                    <IconButton style={{ color: 'white' }}>
                                                                        <Download onClick={(event) => { event.stopPropagation(); DownLoadRecipe(recipe) }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                <Tooltip title="שליחה למייל">
                                                                    <IconButton style={{ color: 'white' }}>
                                                                        <Email onClick={() => EmailRecipe(recipe)} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                <Tooltip title="מחיקה מספר המתכונים שלי">
                                                                    <IconButton onClick={(event) => { event.stopPropagation(); handleDelete(recipe.id) }} style={{ color: 'white' }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                {!existInPublic(recipe.id) && (
                                                                    <Tooltip title="הוספה למומלצים">
                                                                        <IconButton onClick={(event) => { event.stopPropagation(); handleAddToFavorites(recipe.id) }} style={{ color: 'white' }}>
                                                                            <Star />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
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
            )}
        </>
    );
};

export default PrivateRecipes;


// {filteredRecipes.map((recipe) => (
//     (showPrivate && !recipe.isPublic) || (showPublic && recipe.isPublic) ?
//         (<div key={recipe.id} className="privateRecipe-card">
//             {/* <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
//             <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(0.8, 2.6 - recipe.title.length / 10)}em`, marginTop: '0vh' }}>{recipe.title}</h3> */}
//             <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                 <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
//                 <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
//             </div>
//             <img src="../../images/back/smartSource2.png" alt={recipe.title} className="privateRecipe-image" onClick={() => handleDisplayRecipe(recipe)} />
//             <div className="private-difficulty-rating" style={{ bottom: '8%' }}>
//                 <div className="private-stars">
//                     {Array.from({ length: 5 }).reverse().map((_, index) => (
//                         index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
//                     ))}
//                 </div>
//             </div>

//             {showVert === recipe.id && (
//                 <div style={{
//                     position: 'absolute',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     width: '15vw',
//                     height: '80%',
//                     top: '15%',
//                     left: '5%',
//                     zIndex: 100,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }} onClick={() => setShowVert(null)}>
//                     <div style={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         flexWrap: 'wrap', // מאפשר לשורות להתקפל
//                         justifyContent: 'space-around', // מפזר את האייקונים עם רווחים שווים
//                         width: '100%', // קובע רוחב של 100% כך שהאייקונים יתפסו את כל השטח
//                         alignItems: 'center'
//                     }}>
//                         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//                             <Tooltip title="הצגת פרטי מתכון">
//                                 <IconButton className="privateRecipe-icons" style={{ color: 'white' }}>
//                                     <Visibility onClick={() => handleDisplayRecipe(recipe)} />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//                             <Tooltip title="הורדה">
//                                 <IconButton style={{ color: 'white' }}>
//                                     <Download onClick={(event) => { event.stopPropagation(); DownLoadRecipe(recipe) }} />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//                             <Tooltip title="שליחה למייל">
//                                 <IconButton style={{ color: 'white' }}>
//                                     <Email onClick={() => EmailRecipe(recipe)} />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//                             <Tooltip title="מחיקה מספר המתכונים שלי">
//                                 <IconButton onClick={(event) => { event.stopPropagation(); handleDelete(recipe.id) }} style={{ color: 'white' }}>
//                                     <Delete />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//                             {!existInPublic(recipe.id) && (
//                                 <Tooltip title="הוספה למומלצים">
//                                     <IconButton onClick={(event) => { event.stopPropagation(); handleAddToFavorites(recipe.id) }} style={{ color: 'white' }}>
//                                         <Star />
//                                     </IconButton>
//                                 </Tooltip>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>) : (<>
//         </>)
// ))}



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
