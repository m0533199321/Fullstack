import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { useAppSelector } from "./Redux/Store";
import { fetchPublicRecipes } from "./Services/RecipeService";
import "../styles/LastRecipes.css";
import chef from "../../images/back/chef.png"

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
            <div className="last-recipes-container">
                {success && recipes.length > 0 && (
                    <div className="last-recipe-grid">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="last-recipe-card">
                                <h3 className="last-recipe-title" style={{ fontSize: `${Math.max(1.2, 2.6 - recipe.title.length / 10)}em`, marginTop: '2%' }}>{recipe.title}</h3>
                                <img src={chef} alt={recipe.title} className="last-recipe-image" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default LastRecipes;
