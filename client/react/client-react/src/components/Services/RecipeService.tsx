import api from "../api";
import { Recipe } from "../../models/RecipeType";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://localhost:7005/api/Recipe";

export const fetchPrivateRecipes = async (id: number): Promise<Recipe[]> => {
        try {
            const response = await api.get(`${API_URL}/Private/${id}`);
            return response.data;
        } catch (e: any) {
            Swal.fire("Error!", "Failed to fetch private recipes. Please try again.", "error");
            throw new Error(e.message);
        }
};

export const fetchPublicRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await axios.get(`${API_URL}/Public`);
        return response.data;
    } catch (e: any) {
        Swal.fire("Error!", "Failed to fetch public recipes. Please try again.", "error");
        throw new Error(e.message);
    }
};

export const fetchPublicToPrivate = async (
    userId: number,
    recipeId: number
): Promise<any> => {
    try {
        const response = await api.post(`${API_URL}/AddToUser`, null, {
            params: {
                userId: userId,
                recipeId: recipeId,
            },
        });
        return response.data;
    } catch (e: any) {
        Swal.fire("Error!", "Failed to add recipe to public. Please try again.", "error");
        throw new Error(e.message);
    }
};

export const fetchDeletePrivateRecipe = async (
    recipeId: number
): Promise<any> => {
    try {
        const response = await api.delete(`${API_URL}/Recipe/${recipeId}`);
        return response.data;
    } catch (e: any) {
        Swal.fire("Error!", "Failed to delete private recipes. Please try again.", "error");
        throw new Error(e.message);
    }
};