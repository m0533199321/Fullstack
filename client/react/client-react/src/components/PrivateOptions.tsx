import { IconButton, Tooltip } from "@mui/material";
import { Recipe } from "../models/RecipeType";
import { Delete, Download, Email, Star, Visibility } from "@mui/icons-material";

const PrivateOptions = ({ recipe, handleDisplayRecipe, DownLoadRecipe, EmailRecipe, handleDelete, notExistInPublic, handleAddToFavorites }:
    {
        recipe: Recipe, handleDisplayRecipe: (recipe: Recipe) => void, DownLoadRecipe: (recipe: Recipe) => void
        EmailRecipe: (recipe: Recipe) => Promise<void>, handleDelete: (recipeId: number) => Promise<void>,
        notExistInPublic?: boolean, handleAddToFavorites: (recipeId: number) => Promise<void>
    }) => {
    return (<>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="הצגת פרטי מתכון">
                <IconButton className="privateRecipe-icons" style={{ color: 'white' }}>
                    <Visibility onClick={() => handleDisplayRecipe(recipe)} />
                </IconButton>
            </Tooltip>
        </div>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="הורדה">
                <IconButton style={{ color: 'white' }}>
                    <Download onClick={(event) => { event.stopPropagation(); DownLoadRecipe(recipe) }} />
                </IconButton>
            </Tooltip>
        </div>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="שליחה למייל">
                <IconButton style={{ color: 'white' }}>
                    <Email onClick={() => EmailRecipe(recipe)} />
                </IconButton>
            </Tooltip>
        </div>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="מחיקה מספר המתכונים שלי">
                <IconButton onClick={(event) => { event.stopPropagation(); handleDelete(recipe.id) }} style={{ color: 'white' }}>
                    <Delete />
                </IconButton>
            </Tooltip>
        </div>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            { notExistInPublic && (
                <Tooltip title="הוספה למומלצים">
                    <IconButton onClick={(event) => { event.stopPropagation(); handleAddToFavorites(recipe.id) }} style={{ color: 'white' }}>
                        <Star />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    </>)
}

export default PrivateOptions;