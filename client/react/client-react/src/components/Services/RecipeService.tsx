import api from "../api";
import { Recipe, RecipePostModel } from "../../models/RecipeType";
import axios from "axios";

const API_URL = "https://smartchef-api.onrender.com/api/Recipe";

export const fetchPrivateRecipes = async (id: number): Promise<Recipe[]> => {
    try {
        const response = await api.get(`${API_URL}/Private/${id}`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to fetch private recipes. Please try again.");
    }
};

export const fetchPublicRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await axios.get(`${API_URL}/Public`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to fetch public recipes. Please try again.");
    }
};

// export const fetchCategoryRecipes = async (
//     category: string
// ): Promise<Recipe[]> => {
//     try {
//         const response = await axios.get(`${API_URL}/Category/${category}`);
//         return response.data;
//     } catch (e: any) {
//         throw new Error(e.message);
//     }
// };

export const fetchRecipeById = async (
    recipeId: number
): Promise<Recipe> => {
    try {
        const response = await api.get(`${API_URL}/${recipeId}`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to fetch recipe. Please try again.");
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
        throw new Error("Failed to add recipe to private. Please try again.");
    }
};

export const fetchPrivateToPublic = async (
    recipeId: number
): Promise<any> => {
    try {
        const response = await api.put(`${API_URL}/PrivateToPublic/${recipeId}`)
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to update recipe to public. Please try again.");
    }
};

export const fetchDeletePrivateRecipe = async (
    recipeId: number
): Promise<any> => {
    try {
        const response = await api.delete(`${API_URL}/Recipe/${recipeId}`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to delete private recipes. Please try again.");
    }
};

export const fetchAddToMyBook = async (
    userId: number,
    recipe: RecipePostModel
): Promise<any> => {
    console.log(recipe);
    try {
        const response2 = await api.post(`${API_URL}/AddNewToUser`, recipe, {
            params: {
                userId,
            },
        });
        console.log(response2);
        // return response.data;
    } catch (e: any) {
        throw new Error("Failed to add recipe to public. Please try again.");
    }
};

export const fetchUpdateRecipeImg = async (
    recipeId: number,
    title: string
): Promise<any> => {
    try {
        const response2 = await api.put(`${API_URL}/UpdateImg/${recipeId}`, {
            RecipeId: recipeId,
            Url: title
        });
        console.log(response2);
    } catch (e: any) {
        throw new Error("Failed to edit recipe image. Please try again.");
    }
};


export const recipeDetailsService = async (
    request: string
) => {
    try {
        const response = await fetch('http://localhost:5000/api/categorize_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request: request }),
        });

        if (response.ok) {
            console.log(response); 
            const result = await response.json();
            if (result) {
                console.log(result);
                const data = JSON.parse(result.result);
                console.log(data);
                return data;
            } else {
                return null;
            }
        } else {
            const errorText = await response.text();
            console.error('Error:', errorText);
            return null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};
