import { Bookmark, Download, Email, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Recipe } from "../models/RecipeType";

const PublicOptions = ({ recipe, handleDisplayRecipe, DownLoadRecipe, EmailRecipe, notExistInPrivate, handlePublicToPrivate }:
    {
        recipe: Recipe, handleDisplayRecipe: (recipe: Recipe) => void, DownLoadRecipe: (recipe: Recipe) => void
        EmailRecipe: (recipe: Recipe) => Promise<void>,
        notExistInPrivate?: boolean, handlePublicToPrivate: (recipeId: number) => Promise<void>
    }) => {
    return (<>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="הצגת פרטי מתכון">
                <IconButton className="recipe-icons" style={{ color: 'white' }}>
                    <Visibility onClick={() => handleDisplayRecipe(recipe)} />
                </IconButton>
            </Tooltip>
        </div>
        <div style={{ width: '50%', textAlign: 'center', marginBottom: '10px' }}>
            <Tooltip title="הורדה">
                <IconButton style={{ color: 'white' }}>
                    <Download onClick={() => DownLoadRecipe(recipe)} />
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
            {notExistInPrivate && (
                <Tooltip title="הוספה לספר המתכונים שלי">
                    <IconButton onClick={(event) => { event.stopPropagation(); handlePublicToPrivate(recipe.id) }} style={{ color: 'white' }}>
                        <Bookmark />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    </>
    )
}

export default PublicOptions;