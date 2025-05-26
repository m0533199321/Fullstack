import api from "../api";
import { CommentType } from "../../models/CommentType";
const API_URL = "https://smartchef-api.onrender.com/api/Comment";

export const fetchComments = async (
    recipeId: number,
): Promise<CommentType[]> => {
    try {
        const response = await api.get(`${API_URL}/Full/${recipeId}`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to fetch comments. Please try again.");
    }
};

export const fetchAddComment = async (
    recipeId: number,
    content: string
): Promise<any> => {
    try {
        const response = await api.post(`${API_URL}`, { recipeId, content });
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to add your comment. Please try again.");
    }
};

export const fetchEditComment = async (
    commentId: number,
    recipeId: number,
    userId:number,
    content: string
): Promise<any> => {
    try {
        const response = await api.put(`${API_URL}/${commentId}`, { recipeId,userId, content });
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to edit your comment. Please try again.");
    }
};

export const fetchRemoveComment = async (
    commentId: number
): Promise<any> => {
    try {

        const response = await api.delete(`${API_URL}/${commentId}`);
        return response.data;
    } catch (e: any) {
        throw new Error("Failed to remove your comment. Please try again.");
    }
};

// import api from "../api";
// import { CommentType } from "../../models/CommentType";

// const API_URL = "https://localhost:7005/api/Comment";

// export const fetchComments = async (
//     recipeId: number,
//     setSnackOpen: (open: boolean) => void,
//     setSnackMessage: (message: string) => void,
//     setSnackSeverity: (severity: "success" | "error") => void
// ): Promise<CommentType[]> => {
//     try {
//         const response = await api.get(`${API_URL}/Full/${recipeId}`);
//         console.log(response);
//         return response.data;
//     } catch (e: any) {
//         setSnackMessage("נכשל בהבאת התגובות. אנא נסה שוב.");
//         setSnackSeverity("error");
//         setSnackOpen(true);
//         throw new Error(e.message);
//     }
// };

// export const fetchAddComment = async (
//     recipeId: number,
//     content: string,
//     setSnackOpen: (open: boolean) => void,
//     setSnackMessage: (message: string) => void,
//     setSnackSeverity: (severity: "success" | "error") => void
// ): Promise<any> => {
//     try {
//         const response = await api.post(`${API_URL}`, { recipeId, content });
//         console.log(response);
//         setSnackMessage("התגובה נוספה בהצלחה.");
//         setSnackSeverity("success");
//         setSnackOpen(true);
//         return response.data;
//     } catch (e: any) {
//         setSnackMessage("נכשל בהוספת התגובה. אנא נסה שוב.");
//         setSnackSeverity("error");
//         setSnackOpen(true);
//         throw new Error(e.message);
//     }
// };

// export const fetchEditComment = async (
//     commentId: number,
//     recipeId: number,
//     userId: number,
//     content: string,
//     setSnackOpen: (open: boolean) => void,
//     setSnackMessage: (message: string) => void,
//     setSnackSeverity: (severity: "success" | "error") => void
// ): Promise<any> => {
//     try {
//         const response = await api.put(`${API_URL}/${commentId}`, { recipeId, userId, content });
//         console.log(response);
//         setSnackMessage("התגובה עודכנה בהצלחה.");
//         setSnackSeverity("success");
//         setSnackOpen(true);
//         return response.data;
//     } catch (e: any) {
//         setSnackMessage("נכשל בעדכון התגובה. אנא נסה שוב.");
//         setSnackSeverity("error");
//         setSnackOpen(true);
//         throw new Error(e.message);
//     }
// };

// export const fetchRemoveComment = async (
//     commentId: number,
//     setSnackOpen: (open: boolean) => void,
//     setSnackMessage: (message: string) => void,
//     setSnackSeverity: (severity: "success" | "error") => void
// ): Promise<any> => {
//     try {
//         const response = await api.delete(`${API_URL}/${commentId}`);
//         console.log(response);
//         setSnackMessage("התגובה נמחקה בהצלחה.");
//         setSnackSeverity("success");
//         setSnackOpen(true);
//         return response.data;
//     } catch (e: any) {
//         setSnackMessage("נכשל במחיקת התגובה. אנא נסה שוב.");
//         setSnackSeverity("error");
//         setSnackOpen(true);
//         throw new Error(e.message);
//     }
// };
