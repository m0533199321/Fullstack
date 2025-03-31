import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import { Star, StarBorder, Visibility, Download, Email, Sort, Bookmark, Search, MoreVert } from "@mui/icons-material";
import { fetchPublicRecipes, fetchPublicToPrivate, fetchPrivateRecipes } from "./Services/RecipeService";
import "../styles/PublicRecipes.css";
import { downloadRecipeFromUrl } from "./DownAndEmail";
import { useNavigate } from "react-router-dom";
import FileViewer from "./FileViewer";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";

const PublicRecipes = () => {
    const dispatch = useDispatch<AppDispatch>();
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
    const [showVert, setShowVert] = useState<number | null>(null);

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
            } else {
                console.log("mail not sent!");
            }
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
                                {/* <MenuItem onClick={() => handleSortChange('category')}>קטגוריה</MenuItem> */}
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
                                            (<div key={recipe.id} className="recipe-card">
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                    <h3 className="recipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
                                                </div>
                                                {/* <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                <h3 className="privateRecipe-title" style={{ fontSize: `${Math.max(0.8, 2.6 - recipe.title.length / 10)}em`, marginTop: 0 }}>{recipe.title}</h3>
                                                 */}
                                                <img src="../../images/back/smartSource2.png" alt={recipe.title} className="recipe-image" onClick={() => handleDisplayRecipeDetails(recipe.id)} />
                                                <div className="difficulty-rating" style={{ bottom: '8%' }}>
                                                    <div className="stars">
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
                                                        left: '5%',
                                                        top: '15%',
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
                                                                    <IconButton className="recipe-icons" style={{ color: 'white' }}>
                                                                        <Visibility onClick={() => handleDisplayRecipe(recipe)} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
                                                                <Tooltip title="הורדה">
                                                                    <IconButton style={{ color: 'white' }}>
                                                                        <Download onClick={() => DownLoadRecipe(recipe)} />
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
                                                                {!existInPrivate(recipe.id) && (
                                                                    <Tooltip title="הוספה לספר המתכונים שלי">
                                                                        <IconButton onClick={(event) => { event.stopPropagation(); handlePublicToPrivate(recipe.id) }} style={{ color: 'white' }}>
                                                                            <Bookmark />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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


