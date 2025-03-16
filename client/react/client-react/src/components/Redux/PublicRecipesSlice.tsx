import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { Recipe } from "../../models/RecipeType";

const API_URL = "https://localhost:7005/api/Recipe";

interface RecipeState {
    publicRecipes: Recipe[];
    loading: boolean;
    error: string | null;
}

const initialState: RecipeState = {
    publicRecipes: [],
    loading: false,
    error: null,
};

export const fetchPublicRecipes = createAsyncThunk(
    "publicRecipes/fetchRecipes",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/Public`);     
            return response.data;
        } catch (e: any) {
            Swal.fire("Error!", "Failed to fetch recipes. Please try again.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const PublicRecipesSlice = createSlice({
    name: "public-recipes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.publicRecipes = action.payload;
            })
            .addCase(fetchPublicRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default PublicRecipesSlice;

