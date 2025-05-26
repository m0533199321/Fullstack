import { Download, Mail, Eye, Book } from "lucide-react"
import { Recipe } from "../models/RecipeType";
import "../styles/PublicOptions.css";

interface PublicOptionsProps {
    recipe: Recipe;
    handleDisplayRecipe: (recipe: Recipe) => void;
    DownLoadRecipe: (recipe: Recipe) => void;
    EmailRecipe: (recipe: Recipe) => Promise<void>;
    notExistInPrivate?: boolean;
    handlePublicToPrivate: (recipeId: number) => Promise<void>;
}

const PublicOptions = ({
    recipe,
    handleDisplayRecipe,
    DownLoadRecipe,
    EmailRecipe,
    notExistInPrivate,
    handlePublicToPrivate,
}: PublicOptionsProps) => {
    return (
        <>
            {notExistInPrivate ? (<>
                <div className="public-options-container">
                    <button className="public-option-4button" onClick={() => handleDisplayRecipe(recipe)}>
                        <Eye size={18} />
                        <span className="public-option-text">הצג מתכון</span>
                    </button>

                    <button
                        className="public-option-4button"
                        onClick={(event) => {
                            event.stopPropagation();
                            DownLoadRecipe(recipe);
                        }}
                    >
                        <Download size={18} />
                        <span className="public-option-text">הורד מתכון</span>
                    </button>

                    <button className="public-option-4button" onClick={() => EmailRecipe(recipe)}>
                        <Mail size={18} />
                        <span className="public-option-text">שלח למייל</span>
                    </button>

                    <button
                        className="public-option-4button public-favorite-button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handlePublicToPrivate(recipe.id);
                        }}
                    >
                        <Book size={18} />
                        <span className="public-option-text">הוסף לספר המתכונים שלי</span>
                    </button>
                </div>
            </>) : (<>
                <div className="public-options-container">
                    <button className="public-option-button" onClick={() => handleDisplayRecipe(recipe)}>
                        <Eye size={18} />
                        <span className="public-option-text">הצג מתכון</span>
                    </button>

                    <button
                        className="public-option-button"
                        onClick={(event) => {
                            event.stopPropagation();
                            DownLoadRecipe(recipe);
                        }}
                    >
                        <Download size={18} />
                        <span className="public-option-text">הורד מתכון</span>
                    </button>

                    <button className="public-option-button" onClick={() => EmailRecipe(recipe)}>
                        <Mail size={18} />
                        <span className="public-option-text">שלח למייל</span>
                    </button>
                </div>
            </>)}

        </>
    );
};

export default PublicOptions;
