import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { Recipe } from "../../models/RecipeType";

const API_URL = "https://localhost:7005/api/Recipe";

interface RecipeState {
    privateRecipes: Recipe[];
    loading: boolean;
    error: string | null;
}

const initialState: RecipeState = {
    privateRecipes: [],
    loading: false,
    error: null,
};

export const fetchPrivateRecipes = createAsyncThunk(
    "privateRecipes/fetchRecipes",
    async (
        { id , token}: { id: number ,token: string},
        thunkAPI
    ) => {
        try {
            const response = await axios.get(`${API_URL}/Private/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (e: any) {
            Swal.fire("Error!", "Failed to fetch recipes. Please try again.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const PrivateRecipesSlice = createSlice({
    name: "private-recipes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrivateRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrivateRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.privateRecipes = action.payload;
            })
            .addCase(fetchPrivateRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default PrivateRecipesSlice;

