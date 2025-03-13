// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { Recipe, RecipeWithOutId } from '../../models/RecipeType';
// import Swal from "sweetalert2";

// const baseUrl = "https://localhost:5199"
// export const fetchRecipes = createAsyncThunk('recipes/fetch',
//     async (_, thunkAPI) => {
//         try {
//             const response = await axios.get(baseUrl);
//             return response.data;
//         } catch (e: any) {
//             alert(e.message);
//             return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );

// export const addRecipe = createAsyncThunk('recipes/add',
//     async (recipe: RecipeWithOutId, thunkAPI) => {
//         try {
//             const response = await axios.post('http://localhost:3000/api/recipes',
//                 recipe, { headers: { 'user-id': recipe.authorId } }
//             );
//             return response.data;
//         } catch (e: any) {
//             alert(e.message);
//             return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );

// export const editRecipe = createAsyncThunk('recipes/edit',
//     async (recipe: Recipe, thunkAPI) => {
//         try {
//             const response = await axios.put('http://localhost:3000/api/recipes',
//                 recipe, { headers: { 'user-id': recipe.authorId } }
//             );
//             return response.data;
//         } catch (e: any) {
//             alert(e.message);
//             return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );

// export const editLikes = createAsyncThunk('recipes/editLikes',
//     async (recipe: Recipe, thunkAPI) => {
//         try {
//             const response = await axios.put('http://localhost:3000/api/recipes',
//                 recipe, { headers: { 'user-id': recipe.authorId } }
//             );
//             return response.data;
//         } catch (e: any) {
//             alert(e.message);
//             return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );

// const showAlert = (title: string, text: string, icon: 'success' | 'error') => {
//     Swal.fire({
//         title,
//         text,
//         icon
//     });
// };

// const Recipes = createSlice({
//     name: 'recipes',
//     initialState: { list: [] as Recipe[], loading: true },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchRecipes.fulfilled, (state, action) => {
//                 state.list = action.payload;
//             })
//             .addCase(fetchRecipes.rejected, () => {
//                 showAlert("Data Fetch Failed!", "Unable to retrieve recipes. Please try again later.", "error");
//             })
//             .addCase(addRecipe.fulfilled, (state, action) => {
//                 showAlert("Recipe Added!", "Your recipe has been successfully added.", "success");
//                 state.list.push(action.payload.recipe);
//             })
//             .addCase(addRecipe.rejected, () => {
//                 showAlert("Error!", "There was a problem adding your recipe. Please try again.", "error");
//             })
//             .addCase(editRecipe.fulfilled, (state, action) => {
//                 showAlert("Success!", "Your recipe has been successfully updated!", "success");
//                 const updatedRecipe = action.payload.recipe;
//                 const index = state.list.findIndex(recipe => recipe.id === updatedRecipe.id);
//                 if (index !== -1) {
//                     state.list[index] = updatedRecipe;
//                 }
//             })
//             .addCase(editRecipe.rejected, () => {
//                 showAlert("Error!", "There was a problem updating your recipe. Please try again.", "error");
//             })
//             .addCase(editLikes.fulfilled, (state, action) => {
//                 const updatedRecipe = action.payload.recipe;
//                 const index = state.list.findIndex(recipe => recipe.id === updatedRecipe.id);
//                 if (index !== -1) {
//                     state.list[index] = updatedRecipe;
//                 }
//             })
//             .addCase(editLikes.rejected, () => {
//                 showAlert("Error!", "There was a problem updating your likes. Please try again.", "error");
//             });
//     }
// });

// export default Recipes;