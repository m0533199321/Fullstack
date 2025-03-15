import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://localhost:7005/api/User"; // עדכן את ה-URL לפי הצורך

interface ProfileState {
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    loading: false,
    error: null,
};

export const uploadProfilePicture = createAsyncThunk(
    "profile/uploadPicture",
    async (file: File, thunkAPI) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Success!", "Profile picture uploaded successfully!", "success");
            return response.data; // החזר את הנתונים המתקבלים מהשרת
        } catch (e: any) {
            Swal.fire("Error!", "Failed to upload profile picture. Please try again.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadProfilePicture.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProfilePicture.fulfilled, (state, action) => {
                state.loading = false;
                // כאן תוכל לעדכן את ה-state עם הנתונים המתקבלים מהשרת אם צריך
            })
            .addCase(uploadProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ייצוא ה-Slice
export default profileSlice;
