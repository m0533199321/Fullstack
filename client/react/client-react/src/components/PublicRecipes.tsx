import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import { Button } from "@mui/material";
import { Star, StarBorder, MoreVert } from "@mui/icons-material";
import { fetchPublicRecipes, fetchPublicToPrivate, fetchPrivateRecipes } from "./Services/RecipeService";
import "../styles/PublicRecipes.css";
import { downloadRecipeFromUrl } from "./DownAndEmail";
import { useNavigate } from "react-router-dom";
import FileViewer from "./FileViewer";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";
import { recipeEmailBody } from "./RecipeEmailBody";
import PublicShows from "./PublicShows";
import RecipeSearch from "./RecipeSearch";
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
import PublicOptions from "./PublicOptions";
import File2 from "./File";

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
            const body = recipeEmailBody(user.fName, recipe.path);
            await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
        }
    }

    const handleDisplayRecipe = (recipe: Recipe) => {
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
                        <Button sx={{
                            position: 'fixed',
                            top: '16vw',
                            marginLeft: '60vh',
                            color: '#FFA500',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            height: 'auto',
                        }}
                            onClick={() => setFile(false)}>חזרה לרשימת המתכונים
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
                        position: "sticky", top: '0', zIndex: 1000, backgroundColor: 'black', direction: 'rtl', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', paddingTop: '12vh', paddingRight: '5vh'
                    }}>
                        <h1 style={{ color: 'white', margin: '0', textAlign: 'right', marginLeft: '20px' }}>מומלצים</h1>

                        <div style={{
                            display: 'flex', alignItems: 'center', marginLeft: '20px'
                        }}>
                            <p style={{ width: '2vw' }}></p>
                            <PublicShows showPrivate={showPrivate} showPublic={showPublic} privateClick={privateClick} publicClick={publicClick} />
                        </div>
                        <RecipeSearch setSearchRecipe={setSearchRecipe} />
                        <div className="private-sort-container" style={{ textAlign: 'left' }}>
                            <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
                        </div>
                    </div>

                    <div className="public-recipes-container">
                        {success && filteredRecipes.length > 0 && (
                            <>
                                <div className="recipe-grid">
                                    {filteredRecipes.map((recipe: Recipe) => {
                                        const shouldShow = (showPrivate && existInPrivate(recipe.id)) || (showPublic && !(existInPrivate(recipe.id)));
                                        return shouldShow ? (
                                            <div key={recipe.id} className="recipe-card">

                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <MoreVert style={{ marginTop: '3%', marginBottom: 0, fontSize: '30px' }} onClick={() => setShowVert(prev => prev === recipe.id ? null : recipe.id)} />
                                                    <h3 className="recipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: 0, margin: 'auto' }}>{recipe.title}</h3>
                                                </div>
                                                <img src="../../images/back/smartSource2.png" alt={recipe.title} className="recipe-image" onClick={() => handleDisplayRecipeDetails(recipe.id)} />
                                                <div className="difficulty-rating" style={{ bottom: '8%' }}>
                                                    <div className="stars">
                                                        {Array.from({ length: 5 }).reverse().map((_, index) => (
                                                            index < (5 - recipe.degree) ? <StarBorder key={index} className="private-empty-star" /> : <Star key={index} className="private-filled-star" />
                                                        ))}
                                                    </div>
                                                </div>
                                                {showVert === recipe.id && (
                                                    <div className="public-showVert" onClick={() => setShowVert(null)}>
                                                        <div className="public-inShowVert">
                                                            <PublicOptions
                                                                recipe={recipe}
                                                                handleDisplayRecipe={handleDisplayRecipe}
                                                                DownLoadRecipe={DownLoadRecipe}
                                                                EmailRecipe={EmailRecipe}
                                                                notExistInPrivate={!existInPrivate(recipe.id)}
                                                                handlePublicToPrivate={handlePublicToPrivate} />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        ) : null;
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
}

export default PublicRecipes;



