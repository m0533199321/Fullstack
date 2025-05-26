import { Avatar, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchComments, fetchEditComment, fetchRemoveComment } from "./Services/CommentService"
import type { CommentType } from "../models/CommentType"
import { useAppSelector } from "./Redux/Store"
import "../styles/Comments.css"

interface CommentsProps {
  recipeId: number
  comments: CommentType[]
}

const Comments = ({ recipeId, comments }: CommentsProps) => {
  const [success, setSuccess] = useState(false)
  const [content, setContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [originalContent, setOriginalContent] = useState("")
  const [localComments, setLocalComments] = useState<CommentType[]>(comments)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorOpen, setErrorOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<CommentType | null>(null)
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    setLocalComments(comments)
    setSuccess(true)
  }, [comments])

  const allComments = async () => {
    try {
      setLocalComments(await fetchComments(recipeId))
      setSuccess(true)
    } catch (error) {
      setErrorMessage("שגיאה בטעינת התגובות")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
    }
  }

  const handleDeleteRequest = (comment: CommentType) => {
    setCommentToDelete(comment)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      try {
        await fetchRemoveComment(commentToDelete.id)
        allComments()
        setShowDeleteModal(false)
        setCommentToDelete(null)
      } catch (error) {
        setErrorMessage("שגיאה במחיקת התגובה")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false);
        }, 3000);
        setShowDeleteModal(false)
        setCommentToDelete(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setCommentToDelete(null)
  }

  const handleEdit = (comment: CommentType) => {
    setEditingCommentId(comment.id)
    setContent(comment.content)
    setOriginalContent(comment.content)
  }

  const handleSaveEdit = async (comment: CommentType) => {
    try {
      await fetchEditComment(comment.id, comment.recipeId, comment.userId, content)
      setEditingCommentId(null)
      allComments()
    } catch (error) {
      setErrorMessage("שגיאה בעדכון התגובה")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setContent(originalContent)
  }

  return (
    <>
       {errorOpen && errorMessage && (
        <div className="comments-error-message">{errorMessage}</div>
      )}
      <div className="comments-container">
        {success && comments.length > 0 && <h1 className="comments-title">תגובות</h1>}

        {success && comments.length === 0 && <div className="no-comments">אין תגובות עדיין. היה הראשון להגיב!</div>}

        {success &&
          localComments.map((comment: CommentType) => (
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
                    if (e.key === "Enter") {
                      handleSaveEdit(comment)
                    }
                  }}
                  className="comment-edit-input"
                  autoFocus
                />
              ) : (
                <p className="comment-content">{comment.content}</p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <p className="comment-date">
                  <strong>תאריך:</strong> {new Date(comment.createdAt).toLocaleDateString()}
                </p>

                {user && user.id === comment.userId && (
                  <div className="comment-actions">
                    {editingCommentId === comment.id ? (
                      <>
                        <Button
                          className={`comment-button save ${content !== originalContent ? "active" : ""}`}
                          onClick={() => handleSaveEdit(comment)}
                          disabled={content === originalContent}
                        >
                          שמירה
                        </Button>
                        <Button className="comment-button" onClick={handleCancelEdit}>
                          ביטול
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="comment-button" onClick={() => handleDeleteRequest(comment)}>
                          מחיקה
                        </Button>
                        <Button className="comment-button" onClick={() => handleEdit(comment)}>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-comment-modal-overlay" onClick={handleDeleteCancel}>
          <div className="delete-comment-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-comment-modal-header">
              <h3 className="delete-comment-modal-title">אישור מחיקת תגובה</h3>
              <button className="delete-comment-modal-close" onClick={handleDeleteCancel}>
                ✕
              </button>
            </div>

            <div className="delete-comment-modal-body">
              <div className="delete-comment-modal-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>

              <p className="delete-comment-modal-message">האם אתה בטוח שברצונך למחוק את התגובה הזו?</p>

              {commentToDelete && (
                <div className="delete-comment-modal-preview">
                  <p className="delete-comment-modal-comment-text">"{commentToDelete.content}"</p>
                  <p className="delete-comment-modal-author">
                    מאת: {commentToDelete.user.fName} {commentToDelete.user.lName}
                  </p>
                </div>
              )}

              <p className="delete-comment-modal-warning">פעולה זו לא ניתנת לביטול</p>
            </div>

            <div className="delete-comment-modal-actions">
              <button className="delete-comment-modal-cancel" onClick={handleDeleteCancel}>
                ביטול
              </button>
              <button className="delete-comment-modal-confirm" onClick={handleDeleteConfirm}>
                מחק תגובה
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "50px" }}></div>
    </>
  )
}

export default Comments
