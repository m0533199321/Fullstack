// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import Swal from "sweetalert2";

// const API_URL = "https://localhost:7005/api/User"; 
// const initialState = {
//     uploadUrl: null,
//     loading: false,
//     error: null,
// };

// // Async Thunk לקבלת URL להעלאת קובץ
// export const fetchUploadUrl = createAsyncThunk(
//     "upload/fetchUploadUrl",
//     async ({ fileName, contentType }, thunkAPI) => {
//         try {
//             const response = await axios.get(`${API_URL}/upload-url`, {
//                 params: { fileName, contentType },
//             });
//             Swal.fire("Success!", "Upload URL retrieved successfully!", "success");
//             return response.data.url; // מחזיר את ה-URL שהתקבל
//         } catch (e) {
//             Swal.fire("Error!", "Failed to retrieve upload URL. Please try again.", "error");
//             return thunkAPI.rejectWithValue(e.message); // מחזיר שגיאה במקרה של בעיה
//         }
//     }
// );

// // יצירת Slice
// const uploadSlice = createSlice({
//     name: "upload",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUploadUrl.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchUploadUrl.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.uploadUrl = action.payload; // מעדכן את ה-URL שהתקבל
//             })
//             .addCase(fetchUploadUrl.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload; // מעדכן את השגיאה
//             });
//     },
// });

// // ייצוא ה-reducer
// export default uploadSlice;
