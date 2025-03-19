import { useEffect, useState } from "react";
import { CommentType } from "../models/CommentType";
import { fetchComments } from "./Services/CommentService";
import { Avatar } from "@mui/material";
import '../styles/Comments.css'

const Comments = ({ recipeId }: { recipeId: number }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [success, setSuccess] = useState(false);

    const allComments = async () => {
        try {
            setComments(await fetchComments(recipeId));
            setSuccess(true);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        }
    }

    useEffect(() => {
        allComments();
    }, [recipeId]);

    return (
        <>
            {success && comments.length !== 0 &&
                <div className="comments-container">
                    <h1 className="comments-title">תגובות:</h1>
                </div>}
            {success && comments.map(comment => (
                <div key={comment.id} className="comment-container">
                    <div className="comment-header">
                        <Avatar src={comment.user.profile} className="avatar" />
                        <span className="user-name">{comment.user.fName + " " + comment.user.lName}</span>
                    </div>
                    <p className="comment-content"> {comment.content}</p>
                    <p className="comment-date"><strong>תאריך:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </>
    );
};

export default Comments;