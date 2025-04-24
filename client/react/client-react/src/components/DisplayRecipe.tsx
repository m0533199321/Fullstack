import { Send, Star, StarBorder } from "@mui/icons-material";
import { Recipe } from "../models/RecipeType";
import '../styles/DisplayRecipe.css';
import Comments from "./Comments";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAddComment } from "./Services/CommentService";
import { useParams } from "react-router-dom";
import { fetchRecipeById } from "./Services/RecipeService";
import FileViewer from "./FileViewer";
import { useAppSelector } from "./Redux/Store";

const DisplayRecipe = () => {

    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [addComment, setAddComment] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [file, setFile] = useState(false);
    const user = useAppSelector((state) => state.auth.user);


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
            {!file ? (
                <>
                    <div style={{ marginTop:'10vh', height: '8vh' }}></div>
                    <div className="displayRecipe-container">
                        <img className="displayRecipe-image" src="../../images/back/smartSource2.png" alt={recipe.title} />
                        <div className="displayRecipe-details">
                            <h3 className="displayRecipe-title">{recipe.title}</h3>
                            <div style={{ marginBottom: '10px' }}></div>
                            <div className="stars">
                                <strong className="displayRecipe-defenitions">דרגת קושי:</strong>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
                                ))}
                            </div>
                            <div style={{ marginBottom: '10px' }}></div>
                            <div style={{ color: 'black' }}><strong className="displayRecipe-defenitions">תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</div>
                            {user ? (<>
                                <div className="displayRecipe-buttons" style={{ marginRight: '24vw', marginTop: '8vh' }}>
                                    <Button className="add-comment-button" onClick={() => setAddComment(true)}>הוספת תגובה</Button>
                                    <Button className="display-recipe-button" onClick={() => setFile(true)}>הצגת המתכון</Button></div></>) :
                                (<>
                                    <div className="displayRecipe-buttons"  style={{ marginRight: '28vw'}}>
                                        <Button className="display-recipe-button" onClick={() => setFile(true)}>הצגת המתכון</Button>
                                    </div></>)}
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
                </>) :
                (<>
                    <FileViewer fileUrl={recipe.path} onClose={() => null} details={null} />
                </>)
            }
        </>
    );
}

export default DisplayRecipe;
