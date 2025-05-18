// import { useEffect, useState } from "react";
// import { CommentType } from "../models/CommentType";
// import { fetchComments, fetchEditComment, fetchRemoveComment } from "./Services/CommentService";
// import { Avatar, Button } from "@mui/material";
// import '../styles/Comments.css';
// import { useAppSelector } from "./Redux/Store";


// const Comments = ({ recipeId }: { recipeId: number }) => {
//     const [comments, setComments] = useState<CommentType[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [content, setContent] = useState('');
//     const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
//     const [originalContent, setOriginalContent] = useState('');
//     const user = useAppSelector((state) => state.auth.user);

//     const allComments = async () => {
//         try {
//             setComments(await fetchComments(recipeId));
//             setSuccess(true);
//         } catch (error) {
//             console.error('Failed to fetch comments:', error);
//         }
//     }

//     const handleRemove = (comment: CommentType) => async () => {
//         try {
//             await fetchRemoveComment(comment.id);
//             allComments();
//         } catch (error) {
//             console.error('Failed to remove comment:', error);
//         }
//     }

//     const handleEdit = (comment: CommentType) => {
//         setEditingCommentId(comment.id);
//         setContent(comment.content);
//         setOriginalContent(comment.content);
//     }

//     const handleSaveEdit = async (comment: CommentType) => {
//         try {
//             await fetchEditComment(comment.id, comment.recipeId, comment.userId, content);
//             setEditingCommentId(null);
//             allComments();
//         } catch (error) {
//             console.error('Failed to edit comment:', error);
//         }
//     }

//     const handleCancelEdit = () => {
//         setEditingCommentId(null);
//         setContent(originalContent);
//     }

//     useEffect(() => {
//         allComments();
//     }, [recipeId]);

//     return (
//         <>
//             {success && comments.length !== 0 && (
//                 <div className="comments-container">
//                     <h1 className="comments-title">תגובות:</h1>
//                 </div>
//             )}
//             {success && comments.map(comment => (
//                 <div key={comment.id} className="comment-container">
//                     <div className="comment-header">
//                         <Avatar src={comment.user.profile} className="avatar" />
//                         <span className="user-name">{comment.user.fName + " " + comment.user.lName}</span>
//                     </div>
//                     {editingCommentId === comment.id ? (
//                         <input
//                             type="text"
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter') {
//                                     handleSaveEdit(comment);
//                                 }
//                             }}
//                             style={{
//                                 color: 'white',
//                                 backgroundColor: 'transparent',
//                                 border: 'none',
//                                 borderBottom: '1px solid gray',
//                                 fontSize: '16px',
//                                 width: '100%',
//                                 height: '40px',
//                                 outline: 'none',
//                                 padding: '2px 0',
//                                 lineHeight: '1.2'
//                             }}
//                         />
//                     ) : (
//                         <p className="comment-content" style={{ color: 'white', textShadow: '0 0 5px blue' }}>{comment.content}</p>
//                     )}
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//                         <p className="comment-date"><strong>תאריך:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
//                         {user && user.id === comment.userId && (
//                             <div style={{ display: 'flex' }}>
//                                 {editingCommentId === comment.id && content !== originalContent && (
//                                     <Button style={{ color: 'orange', marginLeft: '10px', fontSize: '1.1em' }} onClick={() => handleSaveEdit(comment)}>שמירה</Button>
//                                 )}
//                                 {editingCommentId === comment.id && content === originalContent && (
//                                     <Button style={{ color: 'orange', marginLeft: '10px', fontSize: '1.1em' }} onClick={() => handleCancelEdit()}>ביטול</Button>
//                                 )}
//                                 <Button style={{ color: 'orange', marginLeft: '10px', fontSize: '1.1em' }} onClick={handleRemove(comment)}>מחיקת תגובה</Button>
//                                 <Button style={{ color: 'orange', marginLeft: '10px', fontSize: '1.1em' }} onClick={() => handleEdit(comment)}>עדכון תגובה</Button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ))}
//             <div style={{height:'10vh'}}></div>
//         </>
//     );
// };

// export default Comments;

import { Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchComments, fetchEditComment, fetchRemoveComment } from "./Services/CommentService";
import { CommentType } from "../models/CommentType";
import { useAppSelector } from "./Redux/Store";
import "../styles/Comments.css";

interface CommentsProps {
    recipeId: number;
    comments: CommentType[];
}

const Comments = ({ recipeId, comments }: CommentsProps) => {
    // const [comments, setComments] = useState<CommentType[]>([]);
    const [success, setSuccess] = useState(false);
    const [content, setContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [originalContent, setOriginalContent] = useState('');
    const [localComments, setLocalComments] = useState<CommentType[]>(comments);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    // const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        setLocalComments(comments);
        setSuccess(true);
    }, [comments]);

    const allComments = async () => {
        try {
            setLocalComments(await fetchComments(recipeId));
            setSuccess(true);
        } catch (error) {
            setSnackMessage("שגיאה ב טעינת התגובות")
            // setSnackSeverity("error")
            setSnackOpen(true)
        }
    }

    const handleRemove = (comment: CommentType) => async () => {
        try {
            await fetchRemoveComment(comment.id);
            allComments();
        } catch (error) {
            setSnackMessage("שגיאה ב מחיקת התגובה")
            // setSnackSeverity("error")
            setSnackOpen(true)        }
    }

    const handleEdit = (comment: CommentType) => {
        setEditingCommentId(comment.id);
        setContent(comment.content);
        setOriginalContent(comment.content);
    }

    const handleSaveEdit = async (comment: CommentType) => {
        try {
            await fetchEditComment(comment.id, comment.recipeId, comment.userId, content);
            setEditingCommentId(null);
            allComments();
        } catch (error) {
            setSnackMessage("שגיאה בעדכון התגובה")
            // setSnackSeverity("error")
            setSnackOpen(true)        }
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setContent(originalContent);
    }

    // useEffect(() => {
    //     allComments();
    // }, [recipeId]);

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    return (
        <>
            {snackOpen && (
                <>
                    <div className="comments-snackbar">
                        <span className="comments-snackbar-content">
                            {snackMessage}
                            <button onClick={handleSnackClose} className="comments-snackbar-close">×</button>
                        </span>
                    </div>
                </>
            )}
            <div className="comments-container">
                {success && comments.length > 0 && (
                    <h1 className="comments-title">תגובות</h1>
                )}

                {success && comments.length === 0 && (
                    <div className="no-comments">אין תגובות עדיין. היה הראשון להגיב!</div>
                )}

                {success && localComments.map((comment: CommentType) => (
                    <div key={comment.id} className="comment-container">
                        <div className="comment-header">
                            <Avatar src={comment.user.profile} className="avatar" />
                            <span className="user-name">{comment.user.fName + " " + comment.user.lName}</span>
                        </div>

                        {editingCommentId === comment.id ? (
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveEdit(comment);
                                    }
                                }}
                                className="comment-edit-input"
                                autoFocus
                            />
                        ) : (
                            <p className="comment-content">{comment.content}</p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <p className="comment-date">
                                <strong>תאריך:</strong> {new Date(comment.createdAt).toLocaleDateString()}
                            </p>

                            {user && user.id === comment.userId && (
                                <div className="comment-actions">
                                    {editingCommentId === comment.id ? (
                                        <>
                                            <Button
                                                className={`comment-button save ${content !== originalContent ? 'active' : ''}`}
                                                onClick={() => handleSaveEdit(comment)}
                                                disabled={content === originalContent}
                                            >
                                                שמירה
                                            </Button>
                                            <Button
                                                className="comment-button"
                                                onClick={handleCancelEdit}
                                            >
                                                ביטול
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className="comment-button"
                                                onClick={handleRemove(comment)}
                                            >
                                                מחיקה
                                            </Button>
                                            <Button
                                                className="comment-button"
                                                onClick={() => handleEdit(comment)}
                                            >
                                                עריכה
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ height: '50px' }}></div>
        </>
    );
};

export default Comments;
