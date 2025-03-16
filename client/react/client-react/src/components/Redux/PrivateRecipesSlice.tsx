// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { Recipe } from "../../models/RecipeType";
// import api from "../api";

// const API_URL = "https://localhost:7005/api/Recipe";

// interface RecipeState {
//     privateRecipes: Recipe[];
//     loading: boolean;
//     error: string | null;
// }

// const initialState: RecipeState = {
//     privateRecipes: [],
//     loading: false,
//     error: null,
// };

// export const fetchPrivateRecipes = createAsyncThunk("user/load",
//     async (id: number, thunkAPI) => {
//         console.log(id);
//         try {
//             const response = await api.get(`${API_URL}/Private/${id}`);
//             console.log("success");
//             return response.data;
//         } catch (e: any) {
//             return thunkAPI.rejectWithValue(e.response.data);
//         }
//     }
// );

// export const fetchPrivateToPublic = createAsyncThunk("toPublic/load",
//     async (
//         { userId, recipeId }: { userId: number, recipeId: number },
//         thunkAPI) => {
//         try {
//             const response = await api.post(`${API_URL}/AddToUser`, null, {
//                 params: {
//                     userId: userId,
//                     recipeId: recipeId
//                 }
//             });
//             console.log("success");
//             return response.data;
//         } catch (e: any) {
//             return thunkAPI.rejectWithValue(e.response.data);
//         }
//     }
// );

// const PrivateRecipesSlice = createSlice({
//     name: "private-recipes",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPrivateRecipes.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchPrivateRecipes.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.privateRecipes = action.payload;
//             })
//             .addCase(fetchPrivateRecipes.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             .addCase(fetchPrivateToPublic.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchPrivateToPublic.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // כאן תוכל להוסיף לוגיקה כדי לעדכן את המתכונים אם צריך
//             })
//             .addCase(fetchPrivateToPublic.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export default PrivateRecipesSlice;

