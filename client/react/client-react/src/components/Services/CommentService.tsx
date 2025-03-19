import Swal from "sweetalert2";
import api from "../api";
import { CommentType } from "../../models/CommentType";
const API_URL = "https://localhost:7005/api/Comment";

export const fetchComments = async (
    recipeId: number,
): Promise<CommentType[]> => {
    try {
        const response = await api.get(`${API_URL}/Full/${recipeId}`);
        console.log(response);
        return response.data;
    } catch (e: any) {
        Swal.fire("Error!", "Failed to add recipe to public. Please try again.", "error");
        throw new Error(e.message);
    }
};

export const fetchAddComment = async (
    recipeId: number,
    content: string
): Promise<any> => {
    try {
        const response = await api.post(`${API_URL}`, { recipeId, content });
        console.log(response);
        return response.data;
    } catch (e: any) {
        Swal.fire("Error!", "Failed to add recipe to public. Please try again.", "error");
        throw new Error(e.message);
    }
};