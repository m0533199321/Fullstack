import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { useAppSelector } from "./Redux/Store";
import { fetchPublicRecipes } from "./Services/RecipeService";
import "../styles/LastRecipes.css";

const LastRecipes = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);

    const allRecipes = async () => {
        try {
            const fetchedRecipes = await fetchPublicRecipes(); 
            const sortedRecipes = fetchedRecipes.sort((a, b) => new Date(b.createdAt).toLocaleDateString().localeCompare(new Date(a.createdAt).toLocaleDateString()));
            const latestRecipes = sortedRecipes.slice(0, 10);
            setRecipes(latestRecipes);
            setSuccess(true);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        }
    };

    useEffect(() => {
        allRecipes();
    }, [user]);

    return (
        <>
            <h1 style={{ color: 'orange', marginLeft: '32%', marginTop: '10vh' }}>:חדשים במערכת</h1>
            <div className="last-recipes-container">
                {success && recipes.length > 0 && (
                    <div className="last-recipe-grid">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="last-recipe-card">
                                <h3 className="last-recipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: '2%' }}>{recipe.title}</h3>
                                <img src="../../images/back/smartSource2.png" alt={recipe.title} className="last-recipe-image" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default LastRecipes;
