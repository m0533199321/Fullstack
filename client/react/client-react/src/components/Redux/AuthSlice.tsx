import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthState, UserLogin, UserRegister } from "../../models/AuthType";


const API_URL = "https://localhost:7005/api/Auth";

const initialState: AuthState = {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    "register",
    async (
        { user }: { user: UserRegister },
        thunkAPI
    ) => {
        const user2 =
        {
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            password:user.password,
            profile: "https",
            information: user.information
        };
        try {
            const response = await axios.post(`${API_URL}/register`, user2)
            // const userLogin: UserLogin = { email: user.email, password: user.password };
            // loginUser({ user: userLogin });
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("userId", JSON.stringify(response.data.user.id));
            Swal.fire("Success!", "Your account has been created!", "success");
            return response.data;
        } catch (e: any) {
            Swal.fire("Error!", "Registration failed. Please try again.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "login",
    async (
        { user }: { user: UserLogin },
        thunkAPI
    ) => {
        try {
            const response = await axios.post(`${API_URL}/login`, user);
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("userId", JSON.stringify(response.data.user.id));
            Swal.fire("Success!", "You have successfully logged in!", "success");
            return response.data;
        } catch (e: any) {
            Swal.fire("Error!", "Login failed. Please check your credentials.", "error");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

// export const logout = createAsyncThunk("auth/logout", async () => {
//     localStorage.removeItem("token");
//     Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
// });


const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
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
                state.token = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        // .addCase(logout.fulfilled, (state) => {
        //     state.token = null;
        // });
    },
});

export default AuthSlice;

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { AuthState, User } from '../../models/AuthType';

// const baseUrl = "https://localhost:7005/api/Auth/"


// export const loginUser = createAsyncThunk('login',
//      async (user: User) => {
//     const response = await axios.post(baseUrl + 'login', user);
//     return response.data;
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         loading: false,
//         error: null,
//     } as AuthState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Something went wrong';
//             });
//     },
// });


// export const { reducer } = authSlice;
// export default authSlice;
