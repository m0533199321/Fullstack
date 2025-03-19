import { Send, Star, StarBorder } from "@mui/icons-material";
import { Recipe } from "../models/RecipeType";
import '../styles/DisplayRecipe.css';
import Comments from "./Comments";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAddComment } from "./Services/CommentService";
import { useParams } from "react-router-dom";
import { fetchRecipeById } from "./Services/RecipeService";

const DisplayRecipe = () => {

    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [addComment, setAddComment] = useState(false);
    const [commentValue, setCommentValue] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetchRecipeById(Number(id));
                setRecipe(response);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!recipe) {
        return <div>No recipe found.</div>;
    }

    const category = (categoryId: number) => {
        switch (categoryId) {
            case 1: return "ארוחות בוקר";
            case 2: return "מנות פתיחה";
            case 3: return "מנות עיקריות";
            case 4: return "תוספות";
            case 5: return "מרקים";
            case 6: return "סלטים";
            case 7: return "מאפים ולחמים";
            case 8: return "קינוחים";
            case 9: return "משקאות";
            default: return "שונות";
        }
    };

    const handleAddCommentClick = async () => {
        if (commentValue === '') return;
        await fetchAddComment(recipe.id, commentValue);
        setCommentValue('');
        setAddComment(false);
        window.location.reload();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddCommentClick();
        }
    };

    return (
        <>
            <div style={{ height: '8vh' }}></div>
            <div className="displayRecipe-container">
                <img className="displayRecipe-image" src="../../images/back/recipes4.png" alt={recipe.title} />
                <div className="displayRecipe-details">
                    <h3 className="displayRecipe-title">{recipe.title}</h3>
                    <div style={{ color: 'black' }}><strong className="displayRecipe-defenitions">קטגוריה:</strong> {category(recipe.category)}</div>
                    <div style={{ marginBottom: '10px' }}></div>
                    <div className="stars">
                        <strong className="displayRecipe-defenitions">דרגת קושי:</strong>
                        {Array.from({ length: 5 }).map((_, index) => (
                            index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
                        ))}
                    </div>
                    <div style={{ marginBottom: '10px' }}></div>
                    <div style={{ color: 'black' }}><strong className="displayRecipe-defenitions">תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</div>
                    <Button className="add-comment-button" onClick={() => setAddComment(true)}>להוספת תגובה</Button>
                </div>
            </div>
            {addComment &&
                <div className="input-container">
                    <input
                        className="add-comment-input"
                        placeholder="כתוב/כתבי את התגובה שלך"
                        value={commentValue}
                        onChange={(e) => setCommentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Send className="send-icon" onClick={handleAddCommentClick} />
                </div>
            }
            {recipe && <Comments recipeId={recipe.id} />}
        </>
    );
}

export default DisplayRecipe;
