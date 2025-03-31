import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
    }
});

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof Store.getState>> = useSelector;
export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store