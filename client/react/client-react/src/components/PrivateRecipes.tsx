import { useDispatch } from "react-redux";
import { AppDispatch } from "./Redux/Store";
import { Recipe } from "../models/RecipeType";
import { useEffect, useState } from "react";
import '../styles/PublicRecipes.css';
import { Button, Menu, MenuItem } from "@mui/material";
import { fetchPrivateRecipes } from "./Redux/PrivateRecipesSlice";

const PrivateRecipes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [success, setSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<string>(''); // מצב למיון
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // מצב לתפריט

    const allRecipes = async () => {
        const id = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (token) {
            const resultAction = await dispatch(fetchPrivateRecipes({ id: Number(id), token: token }));
            if (fetchPrivateRecipes.fulfilled.match(resultAction)) {
                setSuccess(true);
                setRecipes(resultAction.payload);
            } else {
                console.error('Failed to fetch recipes:', resultAction.error);
            }
        };
    }

    useEffect(() => {
        allRecipes();
    }, []);

    // פונקציה למיון מתכונים
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
        setAnchorEl(null); // סגור את התפריט
    };

    const sortedRecipes = sortRecipes(recipes, sortBy);

    return (
        <>
            {success && sortedRecipes.length > 0 && (
                <ul className="recipe-list">
                    {sortedRecipes.map((recipe) => (
                        <li key={recipe.id} className="recipe-item">
                            <h3>{recipe.title}</h3>
                            <p>{recipe.category}</p>
                            <p>{recipe.degree}</p>
                            <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
            {success && sortedRecipes.length > 0 && ( // הצגת הכפתור רק אם המתכונים נטענו בהצלחה
                <>
                    <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Sort By</Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={() => handleSortChange('category')}>קטגוריות</MenuItem>
                        <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                        <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                        <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
                    </Menu>
                </>
            )}
        </>
    );
}

export default PrivateRecipes;

