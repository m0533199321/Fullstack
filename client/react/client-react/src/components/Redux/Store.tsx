import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
    }
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store