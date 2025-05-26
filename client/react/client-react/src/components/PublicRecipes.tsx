import { useEffect, useState, useRef } from "react";
import { Recipe } from "../models/RecipeType";
import { AppDispatch, useAppSelector } from "./Redux/Store";
import { MoreVert } from "@mui/icons-material";
import {
  fetchPublicRecipes,
  fetchPublicToPrivate,
  fetchPrivateRecipes,
} from "./Services/RecipeService";
import { downloadRecipeFromUrl } from "./DownLoad";
import { sendEmail } from "./Redux/AuthSlice";
import { useDispatch } from "react-redux";
import PublicOptions from "./PublicOptions";
import { recipeEmailBody } from "./RecipeEmailBody";
import PublicShows from "./PublicShows";
import RecipeSearch from "./RecipeSearch";
import RecipeSortBy, { sortRecipes } from "./RecipeSortBy";
import { AlertCircle, Star } from "lucide-react";
import "../styles/PublicRecipes.css";
import DisplayRecipe from "./DisplayRecipe";
import { useNavigate } from "react-router-dom";
import chef from "../../images/back/chef.png"

const PublicRecipes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
  const [success, setSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [showPublic, setShowPublic] = useState(true);
  const [searchRecipe, setSearchRecipe] = useState("");
  const [file,] = useState(false);
  const [recipeToDisplay,] = useState<Recipe | null>(null);
  const [showVert, setShowVert] = useState<number | null>(null);
  const optionsPanelRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const allRecipes = async () => {
    try {
      const fetchedRecipes = await fetchPublicRecipes();
      setRecipes(fetchedRecipes);
      setSuccess(true);
      if (user) {
        const fetchedPrivateRecipes = await fetchPrivateRecipes(user.id);
        setPrivateRecipes(fetchedPrivateRecipes);
      }
    } catch (error) {
      setErrorMessage("שגיאה בטעינת המתכונים")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000);
    }
  };

  useEffect(() => {
    allRecipes();
  }, [user]);

  const handleSortChange = (criterion: string) => {
    setSortBy(criterion);
    setAnchorEl(null);
  };

  const handlePublicToPrivate = async (recipeId: number) => {
    if (user?.id) {
      try {
        await fetchPublicToPrivate(user.id, recipeId);
        allRecipes();
      } catch (error) {
        setErrorMessage("שגיאה בהעברת המתכון לפרטי")
      setErrorOpen(true)
      setTimeout(() => {
        setErrorOpen(false);
      }, 3000)
      }
    }
  };

  const DownLoadRecipe = (recipe: Recipe) => {
    setShowVert(null);
    downloadRecipeFromUrl(recipe);
  };

  const EmailRecipe = async (recipe: Recipe) => {
    setShowVert(null);
    if (user) {
      const subject = "מתכון טעים במיוחד בשבילך";
      const body = recipeEmailBody(user.fName, recipe.path);
      await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
    }
  };

  const handleDisplayRecipe = (recipe: Recipe) => {
    setShowVert(null);
    navigate(`/recipe/${recipe.id}`);
  };

  const existInPrivate = (recipeId: number) => {
    return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
  };

  const privateClick = () => {
    setShowPrivate(true);
    setShowPublic(false);
  };

  const publicClick = () => {
    setShowPublic(true);
    setShowPrivate(false);
  };

  const sortedRecipes = sortRecipes(recipes, sortBy);

  const filteredRecipes = sortedRecipes.filter((recipe: Recipe) =>
    recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  return (
    <>
      {file ? (
        <>
          {recipeToDisplay && (
            <DisplayRecipe />
          )}
        </>
      ) : (
        <>
          <div className="public-recipe-header">
            <div className="public-recipe-header-content">
              <div className="public-recipe-toggle-container">
                <PublicShows
                  showPrivate={showPrivate}
                  showPublic={showPublic}
                  privateClick={privateClick}
                  publicClick={publicClick}
                />
              </div>
              <div className="public-recipe-search-container">
                <RecipeSearch setSearchRecipe={setSearchRecipe} />
              </div>
              <div className="public-recipe-sort-container">
                <RecipeSortBy anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          {errorOpen && errorMessage && (
              <div className="public-error-message">
                <AlertCircle className="public-error-icon" size={18} />
                {errorMessage}
              </div>
            )}

          <div className="public-recipe-container">
            {success && filteredRecipes.length > 0 && (
              <div className="public-recipe-grid">
                {filteredRecipes.map((recipe: Recipe) => {
                  const shouldShow = (showPrivate && existInPrivate(recipe.id)) || (showPublic && !existInPrivate(recipe.id));
                  return shouldShow ? (
                    <div key={recipe.id} className="public-recipe-card">
                      <div className="public-recipe-card-inner">
                        <div className="public-recipe-image-container">
                          <div className="public-recipe-difficulty">
                            <div className="public-stars-container">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`public-star ${i < Number(recipe.degree) ? "active" : ""}`} />
                              ))}
                            </div>
                          </div>

                          {recipe.picture && recipe.picture !== "" ? (
                            <img
                              src={recipe.picture || "/placeholder.svg"}
                              alt={recipe.title}
                              className="public-recipe-image"
                              onClick={() => handleDisplayRecipe(recipe)}
                            />
                          ) : (
                            <img
                              src={chef}
                              alt={recipe.title}
                              className="public-recipe-image"
                              onClick={() => handleDisplayRecipe(recipe)}
                            />
                          )}
                        </div>

                        <div className="public-recipe-content">
                          <div className="public-recipe-actions">
                            {isAuthenticated &&<button
                              className="public-recipe-options-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowVert((prev) => (prev === recipe.id ? null : recipe.id));
                              }}
                              aria-label="אפשרויות מתכון"
                            >
                              <MoreVert />
                            </button>}
                            <h3 className="public-recipe-title">{recipe.title}</h3>
                          </div>

                          {showVert === recipe.id && (
                            <div
                              className="public-recipe-options-dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                ref={optionsPanelRef}
                                className="public-recipe-options-panel"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="public-recipe-options-header">
                                  <h4 className="public-recipe-options-title">אפשרויות</h4>
                                  <button
                                    className="public-recipe-options-close"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowVert(null);
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                                <PublicOptions
                                  recipe={recipe}
                                  handleDisplayRecipe={handleDisplayRecipe}
                                  DownLoadRecipe={DownLoadRecipe}
                                  EmailRecipe={EmailRecipe}
                                  notExistInPrivate={!existInPrivate(recipe.id)}
                                  handlePublicToPrivate={handlePublicToPrivate}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PublicRecipes;


