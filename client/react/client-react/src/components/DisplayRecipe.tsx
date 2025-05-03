// import { Send, Star, StarBorder } from "@mui/icons-material";
// import { Recipe } from "../models/RecipeType";
// import '../styles/DisplayRecipe.css';
// import Comments from "./Comments";
// import { Button } from "@mui/material";
// import { useEffect, useState } from "react";
// import { fetchAddComment } from "./Services/CommentService";
// import { useParams } from "react-router-dom";
// import { fetchRecipeById } from "./Services/RecipeService";
// import FileViewer from "./FileViewer";
// import { useAppSelector } from "./Redux/Store";
// import File2 from "./File";

// const DisplayRecipe = () => {

//     const { id } = useParams();
//     const [recipe, setRecipe] = useState<Recipe | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [addComment, setAddComment] = useState(false);
//     const [commentValue, setCommentValue] = useState('');
//     const [file, setFile] = useState(false);
//     const user = useAppSelector((state) => state.auth.user);


//     useEffect(() => {
//         const fetchRecipe = async () => {
//             try {
//                 const response = await fetchRecipeById(Number(id));
//                 setRecipe(response);
//             } catch (error) {
//                 console.error('Error fetching recipe:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecipe();
//     }, [id]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!recipe) {
//         return <div>No recipe found.</div>;
//     }

//     const handleAddCommentClick = async () => {
//         if (commentValue === '') return;
//         await fetchAddComment(recipe.id, commentValue);
//         setCommentValue('');
//         setAddComment(false);
//         window.location.reload();
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             handleAddCommentClick();
//         }
//     };

//     return (
//         <>
//             {!file ? (
//                 <>
//                     <div style={{ marginTop: '10vh', height: '8vh' }}></div>
//                     <div className="displayRecipe-container">
//                         {recipe.picture && <img className="displayRecipe-image" src={recipe.picture} alt={recipe.title} />}
//                         {!recipe.picture && <img className="displayRecipe-image" src={"../../images/back/chef.png"} alt={recipe.title} />}
//                         <div className="displayRecipe-details">
//                             <h3 className="displayRecipe-title">{recipe.title}</h3>
//                             <div style={{ marginBottom: '10px' }}></div>
//                             <div className="stars">
//                                 <strong className="displayRecipe-defenitions">דרגת קושי:</strong>
//                                 {Array.from({ length: 5 }).map((_, index) => (
//                                     index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
//                                 ))}
//                             </div>
//                             <div style={{ marginBottom: '10px' }}></div>
//                             <div style={{ color: 'black' }}><strong className="displayRecipe-defenitions">תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</div>
//                             {user ? (<>
//                                 <div className="displayRecipe-buttons" style={{ marginRight: '24vw', marginTop: '8vh' }}>
//                                     <Button className="add-comment-button" onClick={() => setAddComment(true)}>הוספת תגובה</Button>
//                                     <Button className="display-recipe-button" onClick={() => setFile(true)}>הצגת המתכון</Button></div></>) :
//                                 (<>
//                                     <div className="displayRecipe-buttons" style={{ marginRight: '28vw' }}>
//                                         <Button className="display-recipe-button" onClick={() => setFile(true)}>הצגת המתכון</Button>
//                                     </div></>)}
//                         </div>
//                     </div>
//                     {addComment &&
//                         <div className="input-container">
//                             <input
//                                 className="add-comment-input"
//                                 placeholder="כתוב/כתבי את התגובה שלך"
//                                 value={commentValue}
//                                 onChange={(e) => setCommentValue(e.target.value)}
//                                 onKeyDown={handleKeyDown}
//                             />
//                             <Send className="send-icon" onClick={handleAddCommentClick} />
//                         </div>
//                     }
//                     {recipe && <Comments recipeId={recipe.id} />}
//                 </>) :
//                 (<>
//                     <File2 recipe={recipe} fileUrl={recipe.path} onClose={() => null} details={null} />
//                     {/* <FileViewer fileUrl={recipe.path} onClose={() => null} details={null} /> */}
//                 </>)
//             }
//         </>
//     );
// }

// export default DisplayRecipe;

import { Send, Star } from "lucide-react";
import Comments from "./Comments";
import File2 from "./File";
import { Button } from "@mui/material";
import { fetchAddComment, fetchComments } from "./Services/CommentService";
import { fetchRecipeById } from "./Services/RecipeService";
import { useEffect, useState } from "react";
import { useAppSelector } from "./Redux/Store";
import { useParams } from "react-router-dom";
import { Recipe } from "../models/RecipeType";
import "../styles/DisplayRecipe.css";
import { CommentType } from "../models/CommentType";
import BackArrow from "./BackArrow";

const DisplayRecipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [addComment, setAddComment] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [comments, setComments] = useState<CommentType[]>([]);
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

    const fetchRecipeAndComments = async () => {
        setLoading(true);
        try {
            const recipeResponse = await fetchRecipeById(Number(id));
            setRecipe(recipeResponse);
            const commentsResponse = await fetchComments(Number(id));
            setComments(commentsResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipeAndComments();
    }, [id]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #ff8c00',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={{ color: '#666', fontSize: '18px' }}>טוען...</div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#666',
                fontSize: '20px',
                direction: 'rtl'
            }}>
                לא נמצא מתכון.
            </div>
        );
    }

    const handleAddCommentClick = async () => {
        if (commentValue === '') return;
        await fetchAddComment(recipe.id, commentValue);
        setCommentValue('');
        setAddComment(false);
        fetchRecipeAndComments();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddCommentClick();
        }
    };

    return (
        <>
        <BackArrow />
            {!file ? (
                <>
                    <div style={{ marginTop: '10vh', height: '8vh' }}></div>
                    <div className="displayRecipe-container">
                        {recipe.picture ?
                            <img className="displayRecipe-image" src={recipe.picture || "/placeholder.svg"} alt={recipe.title} /> :
                            <img className="displayRecipe-image" src={"../../images/back/chef.png"} alt={recipe.title} />
                        }
                        <div className="displayRecipe-details">
                            <h3 className="displayRecipe-title">{recipe.title}</h3>
                            <div className="stars">
                                <div className="display-stars-container">
                                    <strong className="displayRecipe-defenitions">דרגת קושי:</strong>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`display-star ${i < Number(recipe.degree) ? "active" : ""}`} size={24} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}></div>
                            <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                                <strong className="displayRecipe-defenitions">תאריך יצירה:</strong>
                                <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                            </div>

                            {user ? (
                                <div className="displayRecipe-buttons">
                                    <Button className="add-comment-button" onClick={() => setAddComment(true)}>
                                        הוספת תגובה
                                    </Button>
                                    <Button className="display-recipe-button" onClick={() => setFile(true)}>
                                        הצגת המתכון
                                    </Button>
                                </div>
                            ) : (
                                <div className="displayRecipe-buttons">
                                    <Button className="display-recipe-button" onClick={() => setFile(true)}>
                                        הצגת המתכון
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {addComment && (
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
                    )}

                    {recipe && <Comments recipeId={recipe.id} comments={comments} />}
                </>
            ) : (
                <File2 recipe={recipe} fileUrl={recipe.path} onClose={() => setFile(false)} details={null} />
            )}
        </>
    );
}

export default DisplayRecipe;