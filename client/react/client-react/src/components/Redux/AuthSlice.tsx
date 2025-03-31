
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import Swal from "sweetalert2";
import { AuthState, UserLogin, UserRegister } from "../../models/AuthType";
import api from "../api";

const API_URL = "https://localhost:7005/api";

const initialState: AuthState = {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
};

function getIdFromToken(token: string): string | null {
    if (!token) return null;

    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub;
}

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, thunkAPI) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return thunkAPI.rejectWithValue("No token found");
        }
        try {
            const id = getIdFromToken(token);
            console.log(id);
            const response = await api.get(`${API_URL}/User/Full/${id}`);
            console.log(response.data);

            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "register",
    async ({ user }: { user: UserRegister }, thunkAPI) => {
        try {
            console.log(user);

            const response = await axios.post(`${API_URL}/Auth/register`, user);
            localStorage.setItem("token", response.data.token);
            // Swal.fire("Success!", "Your account has been created!", "success");   
            if (response.status === 200 || response.status === 201) {
                console.log(response.status);
                console.log(user.email);
                // await sendEmail({to:user.email, subject:"Registration", body:"You have successfully registered"});    
            }
            return response.data;
        } catch (e: any) {
            // Swal.fire("Error!", "Registration failed. Please try again.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const sendEmail = createAsyncThunk(
    "emailRegister",
    async ({ to, subject, body }: { to: string, subject: string, body: string }, thunkAPI) => {
        try {
            console.log("send email");
            const response = await axios.post(`${API_URL}/Email/send`, { to, subject, body }, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response.data);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const sendEmailForgot = createAsyncThunk(
    "emailForgot",
    async ({ to, subject, body }: { to: string, subject: string, body: string }, thunkAPI) => {
        try {
            console.log("send email");
            const response = await axios.post(`${API_URL}/Email/send`, { to, subject, body }, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response.data.randomPassword);
            return response.data.randomPassword;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "login",
    async ({ user }: { user: UserLogin }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/Auth/login`, user);
            localStorage.setItem("token", response.data.token);
            // Swal.fire("Success!", "You have successfully logged in!", "success");
            return response.data;
        } catch (e: any) {
            // Swal.fire("Error!", "Login failed. Please check your credentials.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const forgotPasswordUser = createAsyncThunk(
    "forgotPassword",
    async ({ user }: { user: UserLogin }, thunkAPI) => {
        try {
            await axios.put(`${API_URL}/User/Password`, user);    
            const response = await axios.post(`${API_URL}/Auth/login`, user)

            localStorage.setItem("token", response.data.token);
            // Swal.fire("Success!", "You have successfully logged in!", "success");
            return response.data;
        } catch (e: any) {
            // Swal.fire("Error!", "Login failed. Please check your credentials.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const UpdateUserName = createAsyncThunk(
    "updateName",
    async ({ id, fName, lName }: { id: number, fName: string, lName: string }, thunkAPI) => {
        try {
            console.log(id, fName, lName);
            const response = await api.put(`${API_URL}/User/Name/${id}?fName=${fName}&lName=${lName}`);
            // const response = await api.put(`${API_URL}/User/Name`, { id, fName, lName });
            // Swal.fire("Success!", "You have successfully updated name!", "success");
            return response.data;
        } catch (e: any) {
            // Swal.fire("Error!", "Updated failed. Please try later.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const UpdateUserProfile = createAsyncThunk(
    "updateProfile",
    async ({ id, profile }: { id: number, profile: string }, thunkAPI) => {
        try {
            console.log(id, profile);
            const response = await api.put(`${API_URL}/User/Profile/${id}?profile=${profile}`);
            // Swal.fire("Success!", "You have successfully updated profile!", "success");
            return response.data;
        } catch (e: any) {
            // Swal.fire("Error!", "Updated failed. Please try later.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);


const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // state.token = action.payload.token;
                // state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(UpdateUserName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateUserName.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    state.user.fName = action.payload.fName;
                    state.user.lName = action.payload.lName;
                }
            })
            .addCase(UpdateUserName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default AuthSlice;
