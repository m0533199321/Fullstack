import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import '../styles/PrivateRecipes.css';
import { Button } from "@mui/material";
import { MoreVert, Star, StarBorder } from "@mui/icons-material";
import { fetchDeletePrivateRecipe, fetchPrivateRecipes, fetchPrivateToPublic, fetchPublicRecipes } from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownAndEmail";
import FileViewer from "./FileViewer";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";
import PrivateOptions from "./PrivateOptions";
import { recipeEmailBody } from "./RecipeEmailBody";
import PrivateShows from "./PrivateShows";
import RecipeSearch from "./RecipeSearch";
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
import File2 from "./File";
import { recipeImg } from "./Services/RecipeImgService";

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
                    <File2 recipe={recipeToDisplay} fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
                    // <FileViewer fileUrl={recipeToDisplay.path} onClose={() => null} details={null} />
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
                            <PrivateShows showPrivate={showPrivate} showPublic={showPublic} privateClick={privateClick} publicClick={publicClick} />
                        </div>
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

