// import type { Recipe } from "../models/RecipeType"
// import { Delete, Download, Mail, Star, Eye } from "lucide-react"
// import "../styles/PrivateOptions.css"

// interface PrivateOptionsProps {
//   recipe: Recipe
//   handleDisplayRecipe: (recipe: Recipe) => void
//   DownLoadRecipe: (recipe: Recipe) => void
//   EmailRecipe: (recipe: Recipe) => Promise<void>
//   handleDelete: (recipe: Recipe) => void
//   notExistInPublic?: boolean
//   handleAddToFavorites: (recipeId: number) => Promise<void>
// }

// const PrivateOptions = ({
//   recipe,
//   handleDisplayRecipe,
//   DownLoadRecipe,
//   EmailRecipe,
//   handleDelete,
//   notExistInPublic,
//   handleAddToFavorites,
// }: PrivateOptionsProps) => {
//   return (
//     <>
//       {notExistInPublic ? (
//         <>
//           <div className="private-options-container">
//             <button className="private-option-5button" onClick={() => handleDisplayRecipe(recipe)}>
//               <Eye size={18} />
//               <span className="private-option-text">הצגת המתכון</span>
//             </button>

//             <button
//               className="private-option-5button"
//               onClick={(event) => {
//                 event.stopPropagation()
//                 DownLoadRecipe(recipe)
//               }}
//             >
//               <Download size={18} />
//               <span className="private-option-text">הורדת המתכון</span>
//             </button>

//             <button className="private-option-5button" onClick={() => EmailRecipe(recipe)}>
//               <Mail size={18} />
//               <span className="private-option-text">שליחה למייל</span>
//             </button>

//             <button
//               className="private-option-5button private-favorite-button"
//               onClick={(event) => {
//                 event.stopPropagation()
//                 handleAddToFavorites(recipe.id)
//               }}
//             >
//               <Star size={18} />
//               <span className="private-option-text">הוספה למומלצים</span>
//             </button>

//             <button
//               className="private-option-button private-delete-button"
//               onClick={(event) => {
//                 event.stopPropagation()
//                 handleDelete(recipe)
//               }}
//             >
//               <Delete size={18} />
//               <span className="private-option-text">הסרה מהספר שלי</span>
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="private-options-container">
//             <button className="private-option-button" onClick={() => handleDisplayRecipe(recipe)}>
//               <Eye size={18} />
//               <span className="private-option-text">הצגת המתכון</span>
//             </button>

//             <button
//               className="private-option-button"
//               onClick={(event) => {
//                 event.stopPropagation()
//                 DownLoadRecipe(recipe)
//               }}
//             >
//               <Download size={18} />
//               <span className="private-option-text">הורדת המתכון</span>
//             </button>

//             <button className="private-option-button" onClick={() => EmailRecipe(recipe)}>
//               <Mail size={18} />
//               <span className="private-option-text">שליחה למייל</span>
//             </button>

//             <button
//               className="private-option-button private-delete-button"
//               onClick={(event) => {
//                 event.stopPropagation()
//                 handleDelete(recipe)
//               }}
//             >
//               <Delete size={18} />
//               <span className="private-option-text">מחיקה מהספר שלי</span>
//             </button>
//           </div>
//         </>
//       )}
//     </>
//   )
// }

// export default PrivateOptions

"use client"

import type { Recipe } from "../models/RecipeType"
import { Delete, Download, Mail, Star, Eye } from "lucide-react"
import "../styles/PrivateOptions.css"

interface PrivateOptionsProps {
  recipe: Recipe
  handleDisplayRecipe: (recipe: Recipe) => void
  DownLoadRecipe: (recipe: Recipe) => void
  EmailRecipe: (recipe: Recipe) => Promise<void>
  handleDelete: (recipe: Recipe) => void
  notExistInPublic?: boolean
  handleAddToFavorites: (recipeId: number) => Promise<void>
  isAddingToFavorites?: boolean
}

const PrivateOptions = ({
  recipe,
  handleDisplayRecipe,
  DownLoadRecipe,
  EmailRecipe,
  handleDelete,
  notExistInPublic,
  handleAddToFavorites,
  isAddingToFavorites = false,
}: PrivateOptionsProps) => {
  return (
    <>
      {notExistInPublic ? (
        <>
          <div className="private-options-container">
            <button
              className="private-option-5button"
              onClick={() => handleDisplayRecipe(recipe)}
              disabled={isAddingToFavorites}
            >
              <Eye size={18} />
              <span className="private-option-text">הצגת המתכון</span>
            </button>

            <button
              className="private-option-5button"
              onClick={(event) => {
                event.stopPropagation()
                DownLoadRecipe(recipe)
              }}
              disabled={isAddingToFavorites}
            >
              <Download size={18} />
              <span className="private-option-text">הורדת המתכון</span>
            </button>

            <button
              className="private-option-5button"
              onClick={() => EmailRecipe(recipe)}
              disabled={isAddingToFavorites}
            >
              <Mail size={18} />
              <span className="private-option-text">שליחה למייל</span>
            </button>

            <button
              className={`private-option-5button private-favorite-button ${isAddingToFavorites ? "loading" : ""}`}
              onClick={(event) => {
                event.stopPropagation()
                handleAddToFavorites(recipe.id)
              }}
              disabled={isAddingToFavorites}
            >
              {isAddingToFavorites ? (
                <>
                  <div className="favorites-button-spinner"></div>
                </>
              ) : (
                <>
                  <Star size={18} />
                  <span className="private-option-text">הוספה למומלצים</span>
                </>
              )}
            </button>

            <button
              className="private-option-button private-delete-button"
              onClick={(event) => {
                event.stopPropagation()
                handleDelete(recipe)
              }}
              disabled={isAddingToFavorites}
            >
              <Delete size={18} />
              <span className="private-option-text">הסרה מהספר שלי</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="private-options-container">
            <button
              className="private-option-button"
              onClick={() => handleDisplayRecipe(recipe)}
              disabled={isAddingToFavorites}
            >
              <Eye size={18} />
              <span className="private-option-text">הצגת המתכון</span>
            </button>

            <button
              className="private-option-button"
              onClick={(event) => {
                event.stopPropagation()
                DownLoadRecipe(recipe)
              }}
              disabled={isAddingToFavorites}
            >
              <Download size={18} />
              <span className="private-option-text">הורדת המתכון</span>
            </button>

            <button
              className="private-option-button"
              onClick={() => EmailRecipe(recipe)}
              disabled={isAddingToFavorites}
            >
              <Mail size={18} />
              <span className="private-option-text">שליחה למייל</span>
            </button>

            <button
              className="private-option-button private-delete-button"
              onClick={(event) => {
                event.stopPropagation()
                handleDelete(recipe)
              }}
              disabled={isAddingToFavorites}
            >
              <Delete size={18} />
              <span className="private-option-text">מחיקה מהספר שלי</span>
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default PrivateOptions
