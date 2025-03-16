import { useEffect, useState } from "react";
import { Recipe } from "../models/RecipeType";
import { useAppSelector } from "./Redux/Store";
import '../styles/PrivateRecipes.css';
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Delete, Sort } from "@mui/icons-material";
import { fetchDeletePrivateRecipe, fetchPrivateRecipes } from "./Services/RecipeService";

const PrivateRecipes = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const allPrivateRecipes = async () => {
        if (user?.id) {
            try {
                const fetchedRecipes = await fetchPrivateRecipes(user.id);
                setSuccess(true);
                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        }
    };

    useEffect(() => {
        allPrivateRecipes();
    }, [user]);

    const sortRecipes = (recipes: Recipe[], criterion: string) => {
        switch (criterion) {
            case 'category':
                return [...recipes].sort((a, b) => a.category - b.category);
            case 'degree':
                return [...recipes].sort((a, b) => a.degree - b.degree);
            case 'name':
                return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            default:
                return recipes;
        }
    };

    const handleSortChange = (criterion: string) => {
        setSortBy(criterion);
        setAnchorEl(null);
    };

    const handleDelete = async (recipeId: number) => {
        if (user?.id) {
            await fetchDeletePrivateRecipe(recipeId);
            allPrivateRecipes();
        }
    };

    const sortedRecipes = sortRecipes(recipes, sortBy);

    return (
        <div className="private-recipes-container">
            <div className="sort-container">
                <Tooltip title="מיין לפי">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <Sort />
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => handleSortChange('category')}>קטגוריה</MenuItem>
                    <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                    <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                    <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                </Menu>
            </div>
            <div className="recipe-grid">
                {success && sortedRecipes.length > 0 && sortedRecipes.map((recipe) => (
                    <div key={recipe.id} className="recipe-card">
                        <h3 className="recipe-title">{recipe.title}</h3>
                        <p><strong>קטגוריה:</strong> {recipe.category}</p>
                        <p><strong>דרגת קושי:</strong> {recipe.degree}</p>
                        <p><strong>תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</p>
                        <div className="buttons-container">
                            <Tooltip title="מחק מתכון">
                                <IconButton onClick={() => handleDelete(recipe.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrivateRecipes;



// import { useEffect, useState } from "react";
// import { Recipe } from "../models/RecipeType";
// import { useAppSelector } from "./Redux/Store";
// import '../styles/PublicRecipes.css';
// import { Button, Menu, MenuItem } from "@mui/material";
// import { fetchDeletePrivateRecipe, fetchPrivateRecipes } from "./Services/RecipeService";

// const PrivateRecipes = () => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const allPrivateRecipes = async () => {
//         if (user?.id) {
//             try {
//                 const fetchedRecipes = await fetchPrivateRecipes(user.id);
//                 setSuccess(true);
//                 setRecipes(fetchedRecipes);
//             } catch (error) {
//                 console.error('Failed to fetch recipes:', error);
//             }
//         }
//     };

//     useEffect(() => {
//         allPrivateRecipes();
//     }, [user]);

//     // פונקציה למיון מתכונים
//     const sortRecipes = (recipes: Recipe[], criterion: string) => {
//         switch (criterion) {
//             case 'category':
//                 return [...recipes].sort((a, b) => a.category - b.category);
//             case 'degree':
//                 return [...recipes].sort((a, b) => a.degree - b.degree);
//             case 'name':
//                 return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
//             case 'date':
//                 return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//             default:
//                 return recipes;
//         }
//     };

//     const handleSortChange = (criterion: string) => {
//         setSortBy(criterion);
//         setAnchorEl(null); // סגור את התפריט
//     };

//     const handleDelete = async (recipeId: number) => {
//         if (user?.id) {
//             await fetchDeletePrivateRecipe(recipeId);
//             allPrivateRecipes();
//         }
//     };

//     const sortedRecipes = sortRecipes(recipes, sortBy);

//     return (
//         <>
//             {success && sortedRecipes.length > 0 && (
//                 <ul className="recipe-list">
//                     {sortedRecipes.map((recipe) => (
//                         <li key={recipe.id} className="recipe-item">
//                             <h3>{recipe.title}</h3>
//                             <p>{recipe.category}</p>
//                             <p>{recipe.degree}</p>
//                             <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
//                             <Button onClick={() => handleDelete(recipe.id)}>Delete from my recipes-book</Button>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
//                 <>
//                     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
//                     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//                         <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//                     </Menu>
//                 </>
//             )}
//         </>
//     );
// }

// export default PrivateRecipes;




// import { useDispatch } from "react-redux";
// import { AppDispatch, useAppSelector } from "./Redux/Store";
// import { Recipe } from "../models/RecipeType";
// import { useEffect, useState } from "react";
// import '../styles/PublicRecipes.css';
// import { Button, Menu, MenuItem } from "@mui/material";
// import { fetchPrivateRecipes } from "./Redux/PrivateRecipesSlice";

// const PrivateRecipes = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const user = useAppSelector((state) => state.auth.user);
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const allRecipes = async () => {
//         console.log(user?.id);
//         if (user?.id) {
//             const resultAction = await dispatch(fetchPrivateRecipes(user.id));
//             if (fetchPrivateRecipes.fulfilled.match(resultAction)) {
//                 setSuccess(true);
//                 setRecipes(resultAction.payload);
//             } else {
//                 console.error('Failed to fetch recipes:', resultAction.error);
//             }
//         }
//     }

//     useEffect(() => {
//         allRecipes();
//     }, [dispatch, user]);

//     // פונקציה למיון מתכונים
//     const sortRecipes = (recipes: Recipe[], criterion: string) => {
//         switch (criterion) {
//             case 'category':
//                 return [...recipes].sort((a, b) => a.category-b.category);
//             case 'degree':
//                 return [...recipes].sort((a, b) => a.degree - b.degree);
//             case 'name':
//                 return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
//             case 'date':
//                 return [...recipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//             default:
//                 return recipes;
//         }
//     };

//     const handleSortChange = (criterion: string) => {
//         setSortBy(criterion);
//         setAnchorEl(null); // סגור את התפריט
//     };

//     const sortedRecipes = sortRecipes(recipes, sortBy);

//     return (
//         <>
//             {success && sortedRecipes.length > 0 && (
//                 <ul className="recipe-list">
//                     {sortedRecipes.map((recipe) => (
//                         <li key={recipe.id} className="recipe-item">
//                             <h3>{recipe.title}</h3>
//                             <p>{recipe.category}</p>
//                             <p>{recipe.degree}</p>
//                             <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
//                 <>
//                     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
//                     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//                         <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                         <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//                     </Menu>
//                 </>
//             )}
//         </>
//     );
// }

// export default PrivateRecipes;
