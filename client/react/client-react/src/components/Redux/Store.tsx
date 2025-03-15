import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ProfileSlice from "./ProfileSlice";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
        profile: ProfileSlice.reducer
    }
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store