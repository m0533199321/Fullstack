// import { useEffect, useState } from "react";
// import { Recipe } from "../models/RecipeType";
// import { useAppSelector } from "./Redux/Store";
// import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
// import { Star, StarBorder, Visibility, Download, Email, Sort, Bookmark } from "@mui/icons-material";
// import { fetchPublicToPrivate, fetchPrivateRecipes, fetchCategoryRecipes } from "./Services/RecipeService";
// import "../styles/PublicRecipes.css";

// const OneCategory = () => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [categoryRecipes, setCategoryRecipes] = useState<Recipe[]>([]);
//     // const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [privateRecipes, setPrivateRecipes] = useState<Recipe[]>([]);
//     const [success, setSuccess] = useState(false);
//     const [emptyCategory, setEmptyCategory] = useState(false);
//     const [sortBy, setSortBy] = useState<string>('');
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const allRecipes = async () => {
//         // const { category } = useParams<{ category: string }>();
//         const url = window.location.href;
//         const category = url.split("/").pop();
//         console.log(category);  
//         if (category != undefined) {
//             try {
//                 const fetchedRecipes = await fetchCategoryRecipes(category);
//                 setSuccess(true);
//                 setCategoryRecipes(fetchedRecipes);
//                 if(fetchedRecipes.length == 0){
//                    setEmptyCategory(true);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch recipes:', error);
//             }
//             if (user?.id) {
//                 setPrivateRecipes(await fetchPrivateRecipes(user.id));
//             }
//         }
//     };

//     useEffect(() => {
//         allRecipes();
//     }, []);

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
//         setAnchorEl(null);
//     };

//     const handlePublicToPrivate = async (recipeId: number) => {
//         if (user?.id) {
//             try {
//                 await fetchPublicToPrivate(user.id, recipeId);
//                 console.log(`Recipe ${recipeId} added to user's recipes.`);
//                 setPrivateRecipes(await fetchPrivateRecipes(user.id));
//                 // setRecipes(await fetchPublicRecipes());
//             } catch (error) {
//                 console.error('Failed to add recipe to public:', error);
//             }
//         }
//     }

//     const sortedRecipes = sortRecipes(categoryRecipes, sortBy);

//     const existInPrivate = (recipeId: number) => {
//         return privateRecipes.some((privateRecipe) => privateRecipe.id === recipeId);
//     }

//     return (
//         <>
//         {emptyCategory && <h1 style={{marginLeft: '40%'}}>!אין מתכונים בקטגוריה זו</h1>}
//         <div className="public-recipes-container">
//             {success && sortedRecipes.length > 0 && (
//                 <>
//                     <div className="sort-container">
//                         <Tooltip title="מיין לפי">
//                             <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//                                 <Sort />
//                             </IconButton>
//                         </Tooltip>
//                         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//                             <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                             <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                             <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//                         </Menu>
//                     </div>
//                     <div className="recipe-grid">
//                         {sortedRecipes.map((recipe) => (
//                             <div key={recipe.id} className="recipe-card">
//                                 <h3 className="recipe-title">{recipe.title}</h3>
//                                 <p><strong>קטגוריה:</strong> {recipe.category}</p>
//                                 <p><strong>:דרגת קושי</strong></p>
//                                 <div className="stars">
//                                     {Array.from({ length: 4 }).map((_, index) => (
//                                         index < recipe.degree ? <Star key={index} className="filled-star" /> : <StarBorder key={index} className="empty-star" />
//                                     ))}
//                                 </div>
//                                 <p><strong>תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</p>
//                                 <div className="buttons-container">
//                                     <Tooltip title="הצג פרטים">
//                                         <IconButton>
//                                             <Visibility />
//                                         </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="הורד מתכון">
//                                         <IconButton>
//                                             <Download />
//                                         </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="שלח למייל">
//                                         <IconButton>
//                                             <Email />
//                                         </IconButton>
//                                     </Tooltip>
//                                     {!existInPrivate(recipe.id) &&
//                                         <Tooltip title="הוסף לספר המתכונים שלי">
//                                             <IconButton onClick={() => handlePublicToPrivate(recipe.id)}>
//                                                 <Bookmark />
//                                             </IconButton>
//                                         </Tooltip>
//                                     }
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//         </>
//     );
// }

// export default OneCategory;

