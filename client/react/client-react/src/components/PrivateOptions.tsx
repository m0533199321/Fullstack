import type { Recipe } from "../models/RecipeType"
import { Delete, Download, Mail, Star, Eye } from "lucide-react"
import "../styles/PrivateOptions.css"

interface PrivateOptionsProps {
  recipe: Recipe
  handleDisplayRecipe: (recipe: Recipe) => void
  DownLoadRecipe: (recipe: Recipe) => void
  EmailRecipe: (recipe: Recipe) => Promise<void>
  handleDelete: (recipeId: number) => Promise<void>
  notExistInPublic?: boolean
  handleAddToFavorites: (recipeId: number) => Promise<void>
}

const PrivateOptions = ({
  recipe,
  handleDisplayRecipe,
  DownLoadRecipe,
  EmailRecipe,
  handleDelete,
  notExistInPublic,
  handleAddToFavorites,
}: PrivateOptionsProps) => {
  return (
    <>
      {notExistInPublic ? (<>
        <div className="private-options-container">
          <button className="private-option-5button" onClick={() => handleDisplayRecipe(recipe)}>
            <Eye size={18} />
            <span className="private-option-text">הצג מתכון</span>
          </button>

          <button
            className="private-option-5button"
            onClick={(event) => {
              event.stopPropagation()
              DownLoadRecipe(recipe)
            }}
          >
            <Download size={18} />
            <span className="private-option-text">הורד מתכון</span>
          </button>

          <button className="private-option-5button" onClick={() => EmailRecipe(recipe)}>
            <Mail size={18} />
            <span className="private-option-text">שלח למייל</span>
          </button>

          <button
            className="private-option-5button private-favorite-button"
            onClick={(event) => {
              event.stopPropagation()
              handleAddToFavorites(recipe.id)
            }}
          >
            <Star size={18} />
            <span className="private-option-text">הוסף למומלצים</span>
          </button>

          <button
            className="private-option-button private-delete-button"
            onClick={(event) => {
              event.stopPropagation()
              handleDelete(recipe.id)
            }}
          >
            <Delete size={18} />
            <span className="private-option-text">מחק מתכון</span>
          </button>

        </div>
      </>) : (<>
        <div className="private-options-container">
          <button className="private-option-button" onClick={() => handleDisplayRecipe(recipe)}>
            <Eye size={18} />
            <span className="private-option-text">הצג מתכון</span>
          </button>

          <button
            className="private-option-button"
            onClick={(event) => {
              event.stopPropagation()
              DownLoadRecipe(recipe)
            }}
          >
            <Download size={18} />
            <span className="private-option-text">הורד מתכון</span>
          </button>

          <button className="private-option-button" onClick={() => EmailRecipe(recipe)}>
            <Mail size={18} />
            <span className="private-option-text">שלח למייל</span>
          </button>

          <button
            className="private-option-button private-delete-button"
            onClick={(event) => {
              event.stopPropagation()
              handleDelete(recipe.id)
            }}
          >
            <Delete size={18} />
            <span className="private-option-text">מחק מתכון</span>
          </button>
        </div>
      </>)}

    </>
  )
}

export default PrivateOptions

// import { IconButton, Tooltip } from "@mui/material";
// import { Recipe } from "../models/RecipeType";
// import { Delete, Download, Email, Star, Visibility } from "@mui/icons-material";

// const PrivateOptions = ({ recipe, handleDisplayRecipe, DownLoadRecipe, EmailRecipe, handleDelete, notExistInPublic, handleAddToFavorites }:
//     {
//         recipe: Recipe, handleDisplayRecipe: (recipe: Recipe) => void, DownLoadRecipe: (recipe: Recipe) => void
//         EmailRecipe: (recipe: Recipe) => Promise<void>, handleDelete: (recipeId: number) => Promise<void>,
//         notExistInPublic?: boolean, handleAddToFavorites: (recipeId: number) => Promise<void>
//     }) => {
//     return (<>
//         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//             <Tooltip title="הצגת פרטי מתכון">
//                 <IconButton className="privateRecipe-icons" style={{ color: 'white' }}>
//                     <Visibility onClick={() => handleDisplayRecipe(recipe)} />
//                 </IconButton>
//             </Tooltip>
//         </div>
//         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//             <Tooltip title="הורדה">
//                 <IconButton style={{ color: 'white' }}>
//                     <Download onClick={(event) => { event.stopPropagation(); DownLoadRecipe(recipe) }} />
//                 </IconButton>
//             </Tooltip>
//         </div>
//         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//             <Tooltip title="שליחה למייל">
//                 <IconButton style={{ color: 'white' }}>
//                     <Email onClick={() => EmailRecipe(recipe)} />
//                 </IconButton>
//             </Tooltip>
//         </div>
//         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//             <Tooltip title="מחיקה מספר המתכונים שלי">
//                 <IconButton onClick={(event) => { event.stopPropagation(); handleDelete(recipe.id) }} style={{ color: 'white' }}>
//                     <Delete />
//                 </IconButton>
//             </Tooltip>
//         </div>
//         <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
//             { notExistInPublic && (
//                 <Tooltip title="הוספה למומלצים">
//                     <IconButton onClick={(event) => { event.stopPropagation(); handleAddToFavorites(recipe.id) }} style={{ color: 'white' }}>
//                         <Star />
//                     </IconButton>
//                 </Tooltip>
//             )}
//         </div>
//     </>)
// }

// export default PrivateOptions;