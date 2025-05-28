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
  const [isUpdatingComment, setIsUpdatingComment] = useState<number | null>(null)
  const [isDeletingComment, setIsDeletingComment] = useState<number | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  

  // useEffect(() => {
  //   setLocalComments(comments)
  //   setSuccess(true)
  // }, [comments])

  // const allComments = async () => {
  //   try {
  //     setLocalComments(await fetchComments(recipeId))
  //     setSuccess(true)
  //   } catch (error) {
  //     setErrorMessage("שגיאה בטעינת התגובות")
  //     setErrorOpen(true)
  //     setTimeout(() => {
  //       setErrorOpen(false);
  //     }, 3000);
  //   }
  // }

  // const handleDeleteRequest = (comment: CommentType) => {
  //   setCommentToDelete(comment)
  //   setShowDeleteModal(true)
  // }

  // const handleDeleteConfirm = async () => {
  //   if (commentToDelete) {
  //     try {
  //       await fetchRemoveComment(commentToDelete.id)
  //       allComments()
  //       setShowDeleteModal(false)
  //       setCommentToDelete(null)
  //     } catch (error) {
  //       setErrorMessage("שגיאה במחיקת התגובה")
  //       setErrorOpen(true)
  //       setTimeout(() => {
  //         setErrorOpen(false);
  //       }, 3000);
  //       setShowDeleteModal(false)
  //       setCommentToDelete(null)
  //     }
  //   }
  // }

  // const handleDeleteCancel = () => {
  //   setShowDeleteModal(false)
  //   setCommentToDelete(null)
  // }

  // const handleEdit = (comment: CommentType) => {
  //   setEditingCommentId(comment.id)
  //   setContent(comment.content)
  //   setOriginalContent(comment.content)
  // }

  // const handleSaveEdit = async (comment: CommentType) => {
  //   try {
  //     await fetchEditComment(comment.id, comment.recipeId, comment.userId, content)
  //     setEditingCommentId(null)
  //     allComments()
  //   } catch (error) {
  //     setErrorMessage("שגיאה בעדכון התגובה")
  //     setErrorOpen(true)
  //     setTimeout(() => {
  //       setErrorOpen(false);
  //     }, 3000);
  //   }
  // }

  // const handleCancelEdit = () => {
  //   setEditingCommentId(null)
  //   setContent(originalContent)
  // }

  // הוסף useEffect לניהול modal-open class
  useEffect(() => {
    if (showDeleteModal) {
      document.body.classList.add("modal-open")
      // הסתר את האלמנטים של PublicRecipes
      const publicHeader = document.querySelector(".public-recipe-header")
      const backButtons = document.querySelectorAll('.back-button, [class*="back"]')

      if (publicHeader) {
        (publicHeader as HTMLElement).style.zIndex = "-1";
        (publicHeader as HTMLElement).style.pointerEvents = "none"
      }

      backButtons.forEach((button) => {
        (button as HTMLElement).style.visibility = "hidden";
        (button as HTMLElement).style.pointerEvents = "none"
      })
    } else {
      document.body.classList.remove("modal-open")
      // החזר את האלמנטים של PublicRecipes
      const publicHeader = document.querySelector(".public-recipe-header")
      const backButtons = document.querySelectorAll('.back-button, [class*="back"]')

      if (publicHeader) {
        (publicHeader as HTMLElement).style.zIndex = "";
        (publicHeader as HTMLElement).style.pointerEvents = ""
      }

      backButtons.forEach((button) => {
        (button as HTMLElement).style.visibility = "";
        (button as HTMLElement).style.pointerEvents = ""
      })
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open")
      const publicHeader = document.querySelector(".public-recipe-header")
      const backButtons = document.querySelectorAll('.back-button, [class*="back"]')

      if (publicHeader) {
      (publicHeader as HTMLElement).style.zIndex = "";
      (publicHeader as HTMLElement).style.pointerEvents = ""
      }

      backButtons.forEach((button) => {
        (button as HTMLElement).style.visibility = "";
        (button as HTMLElement).style.pointerEvents = ""
      })
    }
  }, [showDeleteModal])

  useEffect(() => {
    setLocalComments(comments)
    setSuccess(true)
  }, [comments])

  const allComments = async () => {
    setIsLoadingComments(true)
    try {
      setLocalComments(await fetchComments(recipeId))
      setSuccess(true)
    } catch (error) {
      setErrorMessage("שגיאה בטעינת התגובות")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false)
      }, 3000)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleDeleteRequest = (comment: CommentType) => {
    setCommentToDelete(comment)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      setIsDeletingComment(commentToDelete.id)
      try {
        await fetchRemoveComment(commentToDelete.id)
        await allComments()
        setShowDeleteModal(false)
        setCommentToDelete(null)
      } catch (error) {
        setErrorMessage("שגיאה במחיקת התגובה")
        setErrorOpen(true)
        setTimeout(() => {
          setErrorOpen(false)
        }, 3000)
        setShowDeleteModal(false)
        setCommentToDelete(null)
      } finally {
        setIsDeletingComment(null)
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
    setIsUpdatingComment(comment.id)
    try {
      await fetchEditComment(comment.id, comment.recipeId, comment.userId, content)
      setEditingCommentId(null)
      await allComments()
    } catch (error) {
      setErrorMessage("שגיאה בעדכון התגובה")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false)
      }, 3000)
    } finally {
      setIsUpdatingComment(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setContent(originalContent)
  }

  return (
    <>
      {errorOpen && errorMessage && <div className="comments-error-message">{errorMessage}</div>}

      {/* Loading overlay for comments refresh */}
      {isLoadingComments && (
        <div className="comments-loading-overlay">
          <div className="comments-loading-content">
            <div className="comments-loading-spinner"></div>
            <p className="comments-loading-text">מעדכן תגובות...</p>
          </div>
        </div>
      )}

      <div className="comments-container">
        {success && comments.length > 0 && <h1 className="comments-title">תגובות</h1>}

        {success && comments.length === 0 && <div className="no-comments">אין תגובות עדיין. היה הראשון להגיב!</div>}

        {success &&
          localComments.map((comment: CommentType) => (
            <div key={comment.id} className={`comment-container ${isUpdatingComment === comment.id ? "updating" : ""}`}>
              {/* Loading overlay for updating comment */}
              {isUpdatingComment === comment.id && (
                <div className="comment-update-overlay">
                  <div className="comment-update-spinner"></div>
                  <p className="comment-update-text">מעדכן תגובה...</p>
                </div>
              )}

              <div className="comment-header">
                <Avatar src={comment.user.profile} className="avatar" />
                <span className="user-name">{comment.user.fName + " " + comment.user.lName}</span>
              </div>

              {editingCommentId === comment.id ? (
                <div className="comment-edit-container">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdatingComment) {
                        handleSaveEdit(comment)
                      }
                    }}
                    className="comment-edit-input"
                    autoFocus
                    disabled={isUpdatingComment === comment.id}
                  />
                  {isUpdatingComment === comment.id && (
                    <div className="edit-input-loading">
                      <div className="edit-input-spinner"></div>
                    </div>
                  )}
                </div>
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
                          disabled={content === originalContent || isUpdatingComment === comment.id}
                        >
                          {isUpdatingComment === comment.id ? (
                            <>
                              <div className="button-spinner"></div>
                              שומר...
                            </>
                          ) : (
                            "שמירה"
                          )}
                        </Button>
                        <Button
                          className="comment-button"
                          onClick={handleCancelEdit}
                          disabled={isUpdatingComment === comment.id}
                        >
                          ביטול
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="comment-button"
                          onClick={() => handleDeleteRequest(comment)}
                          disabled={isUpdatingComment === comment.id}
                        >
                          מחיקה
                        </Button>
                        <Button
                          className="comment-button"
                          onClick={() => handleEdit(comment)}
                          disabled={isUpdatingComment === comment.id}
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
              <button
                className="delete-comment-modal-cancel"
                onClick={handleDeleteCancel}
                disabled={isDeletingComment !== null}
              >
                ביטול
              </button>
              <button
                className="delete-comment-modal-confirm"
                onClick={handleDeleteConfirm}
                disabled={isDeletingComment !== null}
              >
                {isDeletingComment ? (
                  <>
                    <div className="modal-button-spinner"></div>
                    מוחק...
                  </>
                ) : (
                  "מחק תגובה"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "50px" }}></div>
    </>
  )

  // return (
  //   <>
  //      {errorOpen && errorMessage && (
  //       <div className="comments-error-message">{errorMessage}</div>
  //     )}
  //     <div className="comments-container">
  //       {success && comments.length > 0 && <h1 className="comments-title">תגובות</h1>}

  //       {success && comments.length === 0 && <div className="no-comments">אין תגובות עדיין. היה הראשון להגיב!</div>}

  //       {success &&
  //         localComments.map((comment: CommentType) => (
  //           <div key={comment.id} className="comment-container">
  //             <div className="comment-header">
  //               <Avatar src={comment.user.profile} className="avatar" />
  //               <span className="user-name">{comment.user.fName + " " + comment.user.lName}</span>
  //             </div>

  //             {editingCommentId === comment.id ? (
  //               <input
  //                 type="text"
  //                 value={content}
  //                 onChange={(e) => setContent(e.target.value)}
  //                 onKeyDown={(e) => {
  //                   if (e.key === "Enter") {
  //                     handleSaveEdit(comment)
  //                   }
  //                 }}
  //                 className="comment-edit-input"
  //                 autoFocus
  //               />
  //             ) : (
  //               <p className="comment-content">{comment.content}</p>
  //             )}

  //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  //               <p className="comment-date">
  //                 <strong>תאריך:</strong> {new Date(comment.createdAt).toLocaleDateString()}
  //               </p>

  //               {user && user.id === comment.userId && (
  //                 <div className="comment-actions">
  //                   {editingCommentId === comment.id ? (
  //                     <>
  //                       <Button
  //                         className={`comment-button save ${content !== originalContent ? "active" : ""}`}
  //                         onClick={() => handleSaveEdit(comment)}
  //                         disabled={content === originalContent}
  //                       >
  //                         שמירה
  //                       </Button>
  //                       <Button className="comment-button" onClick={handleCancelEdit}>
  //                         ביטול
  //                       </Button>
  //                     </>
  //                   ) : (
  //                     <>
  //                       <Button className="comment-button" onClick={() => handleDeleteRequest(comment)}>
  //                         מחיקה
  //                       </Button>
  //                       <Button className="comment-button" onClick={() => handleEdit(comment)}>
  //                         עריכה
  //                       </Button>
  //                     </>
  //                   )}
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //     </div>

  //     {/* Delete Confirmation Modal */}
  //     {showDeleteModal && (
  //       <div className="delete-comment-modal-overlay" onClick={handleDeleteCancel}>
  //         <div className="delete-comment-modal-content" onClick={(e) => e.stopPropagation()}>
  //           <div className="delete-comment-modal-header">
  //             <h3 className="delete-comment-modal-title">אישור מחיקת תגובה</h3>
  //             <button className="delete-comment-modal-close" onClick={handleDeleteCancel}>
  //               ✕
  //             </button>
  //           </div>

  //           <div className="delete-comment-modal-body">
  //             <div className="delete-comment-modal-icon">
  //               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                 <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  //                 <line x1="10" y1="11" x2="10" y2="17" />
  //                 <line x1="14" y1="11" x2="14" y2="17" />
  //               </svg>
  //             </div>

  //             <p className="delete-comment-modal-message">האם אתה בטוח שברצונך למחוק את התגובה הזו?</p>

  //             {commentToDelete && (
  //               <div className="delete-comment-modal-preview">
  //                 <p className="delete-comment-modal-comment-text">"{commentToDelete.content}"</p>
  //                 <p className="delete-comment-modal-author">
  //                   מאת: {commentToDelete.user.fName} {commentToDelete.user.lName}
  //                 </p>
  //               </div>
  //             )}

  //             <p className="delete-comment-modal-warning">פעולה זו לא ניתנת לביטול</p>
  //           </div>

  //           <div className="delete-comment-modal-actions">
  //             <button className="delete-comment-modal-cancel" onClick={handleDeleteCancel}>
  //               ביטול
  //             </button>
  //             <button className="delete-comment-modal-confirm" onClick={handleDeleteConfirm}>
  //               מחק תגובה
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <div style={{ height: "50px" }}></div>
  //   </>
  // )
}

export default Comments
